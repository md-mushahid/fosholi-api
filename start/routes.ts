import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

Route.get("/", async ({ view }) => {
  return "hello world";
});

Route.group(() => {
  Route.post('signup', 'UsersController.signup');
  Route.post('login', 'UsersController.login');
})
  .prefix('admin') //

Route.post('update-user', 'UsersController.update');
Route.post('create-blog', 'UsersController.createBlog');
Route.post('create-program', 'UsersController.createProgram');
Route.get('allProgramme', 'UsersController.getAllProgramme');