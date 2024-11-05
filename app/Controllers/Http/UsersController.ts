import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Blog from 'App/Models/Blog';
import Program from 'App/Models/Program';
import User from 'App/Models/User';
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  public async signup({ request }: HttpContextContract) {
    try {
      const { name, email, password } = request.body();
      const user_type = 'teacher';
      const verificationToken = '1234';
      const user = await User.create({
        name: name,
        email: email,
        userType: user_type,
        password: password,
        verificationToken: verificationToken,
      });
      return user;
    } catch (error) {
      console.error('Error during user signup:', error);
      return {
        message: 'User signup failed. Please try again.',
        error: error.message,
      };
    }
  }

  public async login({ request, response }) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.findByOrFail('email', email)
    if (user.password != password) {
      return response.status(400).json({ message: 'Invalid credentials' })
    }
    const data = await user?.serialize();
    return data;
  }

  public async createBlog({ request, response }: HttpContextContract) {
    const { title, content, user_id, blogImage } = request.all();
    await Blog.create({ title: title, content: content, userId: user_id, blogImage: blogImage });
    return response.status(200).json({ message: 'Blog created successfully' });
  }

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ request, response }: HttpContextContract) {
    const { id, name, email, profilePicture, password } = request.all();
    await User.query().where('id', id).update({ id: id, name: name, email: email, profilePicture: profilePicture, password: password });
    return response.status(200).json({ message: 'User updated successfully' });
  }

  public async destroy({ }: HttpContextContract) { }

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
      return response.status(201).json({ message: 'Program created successfully', program });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'Failed to create program', error });
    }
  }
}