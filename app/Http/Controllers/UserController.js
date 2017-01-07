'use strict'

const Database = use('Database')
const User = use('App/Model/User')
const Category = use('App/Model/Category')
const Validator = use('Validator')
const Hash = use('Hash')

function navigation(user) {
        var navs = []
        if (user) {
            if(user.username == 'admin'){
                navs.push({link: "bookList",
                        sub: "Könyvek"})
                navs.push({link: "userList",
                        sub: "Felhasználók"})
                navs.push({link: "categoryList",
                        sub: "Műfajok"})
            }
            navs.push({link: "orderList",
                        sub: "Megrendelések"})
            navs.push({link: "basket",
                        sub: "Kosaram"})
            navs.push({link: "profile", 
                        sub: "Profil"})
            navs.push({link: "logOut",
                        sub: "Kijelentkezés"})
        } else {
            navs.push({link: "logIn", 
                        sub: "Bejelentkezés"})
            navs.push({link: "signUp",
                        sub: "Regisztráció"})
        }

    return navs;
}

class UserController {
    

    * login (request, response) {
        const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);

        const user = yield request.auth.getUser()
        var navs = navigation(user)   
         yield response.sendView('logIn', {
            newBooks: newBooks,
            navs: navs
        }) 
    }



    * doLogin (request, response) {
        
        const email = request.input('email')
        const password = request.input('password')
//        const login = yield request.auth.attempt(email, password)
        try {
            yield request.auth.validate(email, password)
        } catch (e) {
            response.unauthorized('Access denied.')
        }

        yield request.auth.attempt(email, password)
        response.redirect('/profile');

    }


    * ajaxLogin(request, response) {

        const email = request.input('email')
        const password = request.input('password')
        try {
            const login = yield request.auth.attempt(email, password) 
            if (login) {
                response.send({ success: true })
                return
            }
        } catch (e) {
            response.send({ success: false })
        }
        
    }


    * logout (request, response) {
        yield request.auth.logout()
        response.redirect('/');
    }

    * profile (request, response) {

        const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);
        const user = yield request.auth.getUser()
        var navs = navigation(user)
        if (user) {            
            yield response.sendView('profile', {
                user: user.toJSON(),
                newBooks: newBooks,
                navs: navs
            }) 
        } else {
            response.unauthorized('Access denied.')
        }
    }





    * create (request, response) {

        const user = yield request.auth.getUser()
        var navs = navigation(user)
        const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);

         yield response.sendView('signUp', {
            newBooks: newBooks,
            navs: navs
        }) 
    }


    * doCreate (request, response) {
        
        const userData = request.all();
        const validation = yield Validator.validateAll(userData, {
            username: 'required|unique:users',
            firstname: 'required',
            lastname: 'required',
            email: 'required|email|unique:users',
            password: 'required|min:3',
            password_again: 'required|same:password'
        });
        if (validation.fails()) {
            yield request
            .withOut('password','password_again')
            .andWith({ errors: validation.messages() })
            .flash()
 
            response.redirect('back')
            return
        }


        const user = new User()
        user.username = userData.username
        user.firstname = userData.firstname
        user.lastname = userData.lastname
        user.email = userData.email
        user.password  = yield Hash.make(userData.password)      
 
        yield user.save()
        yield request.auth.login(user)
 
 
        response.redirect('/');

    }

    * editProfile (request, response) {
        

        const user = yield request.auth.getUser()
        if(user){
            var navs = navigation(user)
            const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);

            yield response.sendView('editProfile', {
                newBooks: newBooks,
                user: user,
                navs: navs
            })
        } else {
            response.unauthorized('Access denied.')
        } 
    }


    * doEditProfile (request, response) {

        const user = yield request.auth.getUser()
        if (user) {
        
            const userData = request.all();
            const validation = yield Validator.validateAll(userData, {
                username: 'unique:users',
                email: 'email|unique:users',
            });
            if (validation.fails()) {
                yield request
                .withAll()
                .andWith({ errors: validation.messages() })
                .flash()
    
                response.redirect('back')
                return
            }
            
            var newUser = new User()
            if(userData.username){
                    user.username = userData.username
            }
            if(userData.email){
                    user.email = userData.email
            }
            user.firstname = userData.firstname
            user.lastname = userData.lastname

            yield user.update()
            yield request.auth.login(user)
    
            response.redirect('/profile');

        } else {
            response.unauthorized('Access denied.')
        }

    }



    * userList (request, response) {
        
        const user = yield request.auth.getUser()
        var navs = navigation(user)
        if (user && user.username == 'admin') {

            var users =yield User.all()
            const categories = yield Category.all()
            const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);
            
            yield response.sendView('userList', {
                users: users.toJSON(),
                newBooks: newBooks,
                navs: navs
            })  
        } else {
            response.unauthorized('Access denied.')
        }
    }






}

module.exports = UserController
