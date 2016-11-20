'use strict'

const Lucid = use('Lucid')

class Comment extends Lucid {
    
    user () {
        return this.belongsTo('App/Model/User')
    }

    order () {
        return this.belongsTo('App/Model/Order')
    }

}

module.exports = Comment
