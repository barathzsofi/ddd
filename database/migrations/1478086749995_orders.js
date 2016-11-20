'use strict'

const Schema = use('Schema')

class OrdersTableSchema extends Schema {

  up () {
    this.create('orders', (table) => {
      table.increments()
      table.integer('price').notNullable()
      table.string('status').notNullable()
      table.string('user_id').notNullable().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('orders')
  }

}

module.exports = OrdersTableSchema
