import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Blog from "App/Models/Blog";
import Program from "App/Models/Program";
import User from "App/Models/User";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import ContactMessage from "App/Models/ContactMessage";
import Post from "App/Models/Post";
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
    const { title, content, user_id, image } = request.all();
    await Blog.create({
      title: title,
      content: content,
      userId: user_id,
      blogImage: image,
    });
    return response.status(200).json({ message: "Blog created successfully" });
  }

  public async getBlogs({ }: HttpContextContract) {
    const blogs = await Blog.query().select('*');
    return blogs;
  }

  public async getSingleBlog({ request }: HttpContextContract) {
    const { id } = request.params();
    const blog = await Blog.query().where('id', id).first();
    const blogData = blog?.serialize();
    const user: any = await User.query().select('name', 'profile_picture', 'email').where('id', blogData?.user_id).first();

    const data = {...blogData, ...(user.serialize())};
    console.log(data);
    return data;
  }

  public async edit({ }: HttpContextContract) { }

  public async updateUser({ request, response }: HttpContextContract) {
    const payload = request.all();
    await User.query().where("id", payload.id).update(payload);
    return response.status(200).json({ message: "User updated successfully" });
  }

  public async sendUsMessage({ request, response }: HttpContextContract) {
    const payload = request.only(['name', 'email', 'message', 'image']);
    await ContactMessage.create(payload)
    return response.status(200).json({ message: 'Message sent successfully' })
  }

  public async getAllProgramme({ }: HttpContextContract) {
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

  public async communityPost({ request, response }: HttpContextContract) {
    const payload = request.all();
    console.log(payload);
    return;
    await Post.create(payload);
    return response.status(200).json({ message: 'Post created successfully' });
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
      const response_data: any = await new Promise((resolve, reject) => {
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
            email: "pWQ5I@example.com",
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
        console.log("🚀 ~ UsersController ~ response_data:", response_data.checkout_url)
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
        console.log("🚀 ~ UsersController ~ constresponse_data=awaitnewPromise ~ response_data:", response_data)
      });
    } catch (error) {
      console.error("Error during payment process:", error);
      return ctx.response.status(500).send("Payment failed.");
    }
  }
}
