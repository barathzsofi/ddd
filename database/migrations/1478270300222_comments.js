'use strict'

const Schema = use('Schema')

class CommentsTableSchema extends Schema {

  up () {
    this.create('comments', (table) => {
      table.increments()
      table.string('user_id').notNullable().references('id').inTable('users')
      table.string('order_id').notNullable().references('id').inTable('orders')
      table.string('comment', 254).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('comments')
  }

}

module.exports = CommentsTableSchema
