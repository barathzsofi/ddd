'use strict'

const Lucid = use('Lucid')

class Category extends Lucid {
    books () {
        return this.belongsToMany('App/Model/Book')
    }
}

module.exports = Category
