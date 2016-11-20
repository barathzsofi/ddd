'use strict'

const Lucid = use('Lucid')

class Order extends Lucid {
    books () {
        return this.belongsToMany('App/Model/Book')
    }
    
    user () {
        return this.belongsTo('App/Model/User')
    }

    comments () {
        return this.hasMany('App/Model/Comment')  
    }

}

module.exports = Order
