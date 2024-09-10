import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

export default class UsersController {
  public async signup({ request }: HttpContextContract) {
    const { fullName, email, password } = request.body();
    const user_type = 'instructor'
    const user = await User.create({
      name: fullName,
      email: email,
      userType: user_type,
      password: password,
    });
    return user;
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