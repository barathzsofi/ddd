'use strict'

const Schema = use('Schema')

class BookCategoryTableSchema extends Schema {

  up () {
    this.create('book_category', (table) => {
      table.increments()
      table.integer('category_id').notNullable().unsigned().references('id').inTable('categories')
      table.integer('book_id').notNullable().unsigned().references('id').inTable('books')
      table.timestamps()
    })
  }

  down () {
    this.drop('book_category')
  }

}

module.exports = BookCategoryTableSchema
