'use strict'

const Lucid = use('Lucid')

class User extends Lucid {

  apiTokens () {
    return this.hasMany('App/Model/Token')
  }

  orders () {
    return this.hasMany('App/Model/Order')
  }

  comments () {
        return this.hasMany('App/Model/Comment')  
    }

 /* static get rules () {
        return {
            username: 'required|unique:users',
            firstname: 'required',
            lastname: 'required',
            email: 'required|email|unique:users',
            password: 'required',
        }        
    }*/

}

module.exports = User
