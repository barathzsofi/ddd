'use strict'

const Schema = use('Schema')

class BookOrderTableSchema extends Schema {

  up () {
    this.create('book_order', (table) => {
      table.increments()
      table.integer('book_id').notNullable().references('id').inTable('books')
      table.integer('order_id').notNullable().references('id').inTable('orders')
      table.timestamps()
    })
  }

  down () {
    this.drop('book_order')
  }

}

module.exports = BookOrderTableSchema
