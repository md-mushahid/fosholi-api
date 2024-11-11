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

Route.post('update-user', 'UsersController.updateUser');
Route.post('create-blog', 'UsersController.createBlog');
Route.post('create-program', 'UsersController.createProgram');
Route.get('allProgramme', 'UsersController.getAllProgramme');
Route.post("payment", "UsersController.payment");
Route.get("payment-finalize", "UsersController.paymentFinalize");
Route.get('get-blogs', 'UsersController.getBlogs');
Route.get('getSingleBlog/:id', 'UsersController.getSingleBlog')
Route.post('send-us-message', 'UsersController.sendUsMessage');
Route.post('create-post', 'UsersController.communityPost');
Route.post('delete-pricing', 'UsersController.deletePricing');
Route.get('get-memberships/:id', 'UsersController.getMemberships');

