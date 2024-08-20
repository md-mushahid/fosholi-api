import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async signup({ }: HttpContextContract) {
    return 'I am from controller'
  }

  public async signup({request, response}: HttpContextContract) {
    console.log(request.body());
    return true;
  }

  public async store({ }: HttpContextContract) { }

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
