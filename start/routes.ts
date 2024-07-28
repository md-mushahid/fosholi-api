import Route from '@ioc:Adonis/Core/Route'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext';

import 'App/Controllers/Http/Admin/user'

Route.get('/', async ({ view }) => {
  return 'hello world'
})
