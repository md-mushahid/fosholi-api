import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Blog from "App/Models/Blog";
import Program from "App/Models/Program";
import User from "App/Models/User";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Order from "App/Models/Order";
require("dotenv").config();
const shurjopay = require("shurjopay")();

export default class UsersController {
  public async signup({ request }: HttpContextContract) {
    try {
      const { name, email, password } = request.body();
      const user_type = "teacher";
      const verificationToken = "1234";
      const user = await User.create({
        name: name,
        email: email,
        userType: user_type,
        password: password,
        verificationToken: verificationToken,
      });
      return user;
    } catch (error) {
      console.error("Error during user signup:", error);
      return {
        message: "User signup failed. Please try again.",
        error: error.message,
      };
    }
  }

  public async login({ request, response }) {
    const { email, password } = request.only(["email", "password"]);
    const user = await User.findByOrFail("email", email);
    if (user.password != password) {
      return response.status(400).json({ message: "Invalid credentials" });
    }
    const data = await user?.serialize();
    return data;
  }

  public async createBlog({ request, response }: HttpContextContract) {
    const { title, content, user_id, blogImage } = request.all();
    await Blog.create({
      title: title,
      content: content,
      userId: user_id,
      blogImage: blogImage,
    });
    return response.status(200).json({ message: "Blog created successfully" });
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({ request, response }: HttpContextContract) {
    const { id, name, email, profilePicture, password } = request.all();
    await User.query().where("id", id).update({
      id: id,
      name: name,
      email: email,
      profilePicture: profilePicture,
      password: password,
    });
    return response.status(200).json({ message: "User updated successfully" });
  }

  public async destroy({}: HttpContextContract) {}

  public async getAllProgramme({}: HttpContextContract) {
    const programs = await Program.all();
    return programs;
  }

  public async createProgram({ request, response }: HttpContextContract) {
    const payload = request.all();
    console.log(payload);

    // You can add validation logic here if needed
    try {
      const program = await Program.create(payload);
      return response
        .status(201)
        .json({ message: "Program created successfully", program });
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: "Failed to create program", error });
    }
  }

  public async payment(ctx: HttpContextContract) {
    // Configure Shurjopay with environment variables
    shurjopay.config(
      process.env.SP_ENDPOINT,
      process.env.SP_USERNAME,
      process.env.SP_PASSWORD,
      process.env.SP_PREFIX,
      process.env.SP_RETURN_URL
    );

    // Wrap makePayment in a Promise to use async/await
    try {
      const response_data = await new Promise((resolve, reject) => {
        shurjopay.makePayment(
          {
            amount: 1000,
            order_id: "123",
            customer_name: "Shanto",
            customer_address: "Mohakhali",
            client_ip: "102.324.0.5",
            customer_phone: "01517162394",
            customer_city: "Dhaka",
            customer_post_code: "1229",
            currency: "BDT",
            customer_email: "ahsan@gmail.com",
          },
          (response_data) => {
            // Resolve the Promise with response_data
            resolve(response_data);
          },
          (error) => {
            // Reject the Promise with error
            reject(error);
          }
        );
      });
      // Redirect to the checkout URL if available
      if (response_data && response_data.checkout_url) {
        return response_data.checkout_url;
      } else {
        console.log("Payment response data is missing 'checkout_url'");
        return ctx.response.status(500).send("Checkout URL not available.");
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      return ctx.response.status(500).send("Payment failed.");
    }
  }
  public async createOrder(payload) {
    console.log("🚀 ~ UsersController ~ createOrder ~ payload:", payload)
    return Order.create(payload);
  }
  public async paymentFinalize(ctx: HttpContextContract) {
    const { order_id } = ctx.request.all();
    shurjopay.config(
      process.env.SP_ENDPOINT,
      process.env.SP_USERNAME,
      process.env.SP_PASSWORD,
      process.env.SP_PREFIX,
      process.env.SP_RETURN_URL
    );
    try {
      const response_data = await new Promise((resolve, reject) => {
        shurjopay.verifyPayment(
          order_id,
          (response_data) => {
            resolve(response_data);
          },
          (error) => {
            // TODO Handle error response
          }
        );
      });
      this.createOrder({
        orderId: response_data[0].order_id,
        customerName: response_data[0].name,
        email: response_data[0].email,
        phoneNo: response_data[0].phone_no,
        amount: response_data[0].amount,
        currency: response_data[0].currency,
        receivedAmount: response_data[0].amount,
        bankStatus: response_data[0].status,
        invoiceNo: response_data[0].order_id,
        bankTrxId: null,
        status: "paid",
      });
    } catch (error) {
      console.error("Error during payment process:", error);
      return ctx.response.status(500).send("Payment failed.");
    }
  }
}
