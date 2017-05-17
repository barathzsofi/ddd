'use strict'
//githubtest
//adadadasdasd
//aaadads
const Lucid = use('Lucid')

class Book extends Lucid {
    categories () {
        return this.belongsToMany('App/Model/Category')
    }

    order () {
        return this.belongsToMany('App/Model/Order')
    }

}

module.exports = Book
