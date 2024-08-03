import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

Route.get("/", async ({ view }) => {
  return "hello world";
});

Route.group(() => {
  Route.get('signup', 'UsersController.signup');
})
  .prefix('admin')
