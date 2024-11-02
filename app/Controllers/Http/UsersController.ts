import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

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

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}