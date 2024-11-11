import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Blog from "App/Models/Blog";
import Program from "App/Models/Program";
import User from "App/Models/User";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import ContactMessage from "App/Models/ContactMessage";
import Post from "App/Models/Post";
import Order from "App/Models/Order";
import Comment from "App/Models/Comment";
const stripe = require("stripe")(
  "sk_test_51QJew1Jw0FC7QJ5cOZI5zWeKU3slsRme4nlDEAbicEIy7hCLEILNS6OY0DYFG6vheV7YmTFKIZy5SkJvsJLnKAPv00vLEY1Jd0"
);
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

  public async checkPurchase({ params, response }: HttpContextContract) {
    const { userId, productId } = params;
    const order = await Order.query()
      .where("user_id", userId)
      .andWhere("product_id", productId)
      .first();

    if (order != null && order) {
      return true;
    } else {
      return false;
    }
  }

  public async login({ request, response }) {
    const { email, password } = request.only(["email", "password"]);
    const user: any = await User.query()
      .select("id", "password", "name", "profile_picture", "email", "user_type")
      .where("email", email)
      .first();
    if (user.password != password) {
      return response.status(400).json({ message: "Invalid credentials" });
    }
    const data = await user?.serialize();
    if (data?.password) delete data?.password;

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

  public async getBlogs({}: HttpContextContract) {
    const blogs = await Blog.query().select("*");
    return blogs;
  }

  public async getSingleBlog({ request }: HttpContextContract) {
    const { id } = request.params();
    const blog = await Blog.query().where("id", id).first();
    const blogData = blog?.serialize();
    const user: any = await User.query()
      .select("name", "profile_picture", "email")
      .where("id", blogData?.user_id)
      .first();

    const data = { ...blogData, ...user.serialize() };
    // console.log(data);
    return data;
  }

  public async edit({}: HttpContextContract) {}

  public async updateUser({ request, response }: HttpContextContract) {
    const payload = request.all();
    await User.query().where("id", payload.id).update(payload);
    return response.status(200).json({ message: "User updated successfully" });
  }

  public async sendUsMessage({ request, response }: HttpContextContract) {
    const payload = request.only(["name", "email", "message", "image"]);
    await ContactMessage.create(payload);
    return response.status(200).json({ message: "Message sent successfully" });
  }

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
      this.createPriceNproduct(payload, program);
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

  public async getMemberships({ request, response }: HttpContextContract) {
    const { id } = request.params();
    console.log(id);
    const memberships = await Order.query()
      .where("user_id", id)
      .select("product_id");
    if (memberships.length === 0) {
      return 0;
    }
    const productIds: number[] = memberships.map((order) => order.product_id); // Assuming product_id is a number
    const products = await Program.query()
      .whereIn("id", productIds)
      .select("id", "title");
    if (products.length === 0) {
      return 0;
    }
    return response.status(200).send(products);
  }

  public async deletePricing({ request, response }: HttpContextContract) {
    const { product_id } = request.all();

    await Program.query().where("id", product_id).delete();
    await Order.query().where("product_id", product_id).delete();

    return response
      .status(200)
      .json({ message: "Pricing deleted successfully" });
  }

  public async communityPost({ request, response }: HttpContextContract) {
    const payload = request.all();
    await Post.create(payload);
    return response.status(200).json({ message: "Post created successfully" });
  }
  public async createPriceNproduct(payload, program) {
    const singleProgram = await Program.findOrFail(program.id);
    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: payload.monthlyPrice * 100 || payload.oneTimePrice * 100,
      product_data: {
        name: payload.title,
      },
    });
    singleProgram.stripepriceid = price.id;
    singleProgram.save();
  }
  public async payment(ctx: HttpContextContract) {
    try {
      const payload = ctx.request.all();
      // console.log(payload)
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: payload.product.stripepriceid,
            quantity: 1,
          },
        ],
        mode: "payment", // or 'payment' for one-time payments
        success_url: "http://localhost:3000/dashboard",
        cancel_url: "http://localhost:3000/pricing",
      });
      if (session) {
        await Order.create({
          user_id: payload.user_id,
          product_id: payload.product.id,
        });
      }
      return ctx.response.json({ url: session.url }); // Redirect to this URL on the frontend
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return ctx.response.status(500).send("Could not create checkout session");
    }
  }
  public async getComment(ctx: HttpContextContract) {
    const blog_id = ctx.params.id;
    const comments = await Comment.query()
      .where("blog_id", blog_id)
      .whereNull("parent_id") // Top-level comments
      .preload("replies", (repliesQuery) => {
        repliesQuery.preload("replies"); // Load nested replies
      })
      .orderBy("created_at", "asc"); // Order by creation time
    return comments;
  }
  public async createComment(ctx: HttpContextContract) {
    const payload = ctx.request.all();
    await Comment.create(payload);
  }
}
