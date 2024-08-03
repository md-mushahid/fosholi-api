import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // User ID
      table.string('name', 255).notNullable() // User Name
      table.string('email', 255).notNullable().unique() // User Email
      table.string('password', 180).notNullable() // User Password
      table.string('user_type', 255).notNullable() // User Type
      table.timestamps(true) // created_at and updated_at
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
