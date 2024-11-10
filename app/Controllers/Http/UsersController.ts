import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Blog from "App/Models/Blog";
import Program from "App/Models/Program";
import User from "App/Models/User";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import ContactMessage from "App/Models/ContactMessage";
import Order from "App/Models/Order";
const stripe = require('stripe')('sk_test_51QJew1Jw0FC7QJ5cOZI5zWeKU3slsRme4nlDEAbicEIy7hCLEILNS6OY0DYFG6vheV7YmTFKIZy5SkJvsJLnKAPv00vLEY1Jd0');
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

    const data = { ...blogData, ...(user.serialize()) };
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
      this.createPriceNproduct(payload, program)
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
  public async createPriceNproduct(payload, program) {
    // {
    //   title: 'a',
    //   description: 'bbbb',
    //   subscriptionType: 'monthly',
    //   monthlyPrice: '100',
    //   oneTimePrice: null,
    //   isLifetimeAccess: false,
    //   instructorId: 1
    // }
    const singleProgram = await Program.findOrFail(program.id);

    const price = await stripe.prices.create({
      currency: 'usd',
      unit_amount: payload.monthlyPrice*100 || payload.oneTimePrice *100,
      product_data: {
        name: payload.title,
      },
    });
    singleProgram.stripepriceid = price.id;
    singleProgram.save();
  }
  public async payment(ctx: HttpContextContract) {
    try {
      const payload = ctx.request.all()  // Pass the Stripe price ID
      console.log(payload)
      // Create a checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: payload.product.stripepriceid,
            quantity: 1,
          },
        ],
        mode: 'payment', // or 'payment' for one-time payments
        success_url: 'http://localhost:3000/dashboard',
        cancel_url: 'https://yourdomain.com/cancel',
      })
      Order.create({user_id:payload.user_id,product_id:payload.product.id})
      return ctx.response.json({ url: session.url }) // Redirect to this URL on the frontend
    } catch (error) {
      console.error('Error creating checkout session:', error)
      return ctx.response.status(500).send('Could not create checkout session')
    }
  }

}
