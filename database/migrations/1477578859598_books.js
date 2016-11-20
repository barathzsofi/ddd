'use strict'

const Schema = use('Schema')

class BooksTableSchema extends Schema {

  up () {
    this.create('books', (table) => {
      table.increments()
      table.string('writer').notNullable()
      table.string('title').notNullable()
      table.integer('price').notNullable()
      table.string('binding')
      table.string('isbn').notNullable().unique()
      table.integer('releaseDate')
      table.string('publisher')
      table.string('originalTitle')
      table.string('description')
      table.string('pageNum')
      table.string('language').notNullable()
      table.string('cover').notNullable()
      table.string('remark',254)
      table.integer('numOfCopies').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('books')
  }

}

module.exports = BooksTableSchema
