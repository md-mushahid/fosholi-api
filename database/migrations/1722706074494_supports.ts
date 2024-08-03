import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SupportSchema extends BaseSchema {
  protected tableName = 'support'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('email', 255).notNullable()
      table.text('problem').notNullable()
      table.string('response_status', 255).defaultTo('pending')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
