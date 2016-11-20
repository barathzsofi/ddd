'use strict'

const Database = use('Database');
const Book = use('App/Model/Book')
const Category = use('App/Model/Category')
const Validator = use('Validator')

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

class CategoryController {
    * index (request, response) {

        const user = yield request.auth.getUser()
        var navs = navigation(user)

        var url = request.originalUrl();
        var books = null;
        const catId = request.param('id')
        if(catId){            
            var category = yield Category.find(catId)
            books = yield category.books().distinct('book_id').where('numOfCopies','>',0).fetch()
        } else {
            books = yield Book.query().where('numOfCopies','>',0).orderBy('id','desc').fetch()
        }
        const categories = yield Category.all()
        const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);


        var url = request.originalUrl();
        if(url.indexOf("?") > -1){
            const search = request.input('search');
            const books = yield Book.query().whereRaw('title like ? or writer like ?',['%'+search+'%','%'+search+'%']).fetch()
            //const books = yield Database.table('books').whereRaw('title like ? or writer like ?',['%'+search+'%','%'+search+'%'])
            yield response.sendView('explore', {
                books: books.toJSON(),
                categories: categories.toJSON(),
                newBooks: newBooks,
                navs: navs
            })
        }else{
            yield response.sendView('explore', {
                books: books.toJSON(),
                categories: categories.toJSON(),
                newBooks: newBooks,
                navs: navs
            })  
        }
    }



    * categoryList (request, response) {

        
        const user = yield request.auth.getUser()
        var navs = navigation(user)
        if (user && user.username == 'admin') {


            const categories = yield Category.all()
            const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);
            
            yield response.sendView('categoryList', {
                categories: categories.toJSON(),
                newBooks: newBooks,
                navs: navs,
            })  
        } else {
            response.unauthorized('Access denied.')
        }
    }


    * createCategory (request, response) {
        
        const user = yield request.auth.getUser()
        var navs = navigation(user)
        if (user && user.username == 'admin') {


            const categories = yield Category.all()
            const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);
            
            yield response.sendView('createCategory', {
                categories: categories.toJSON(),
                newBooks: newBooks,
                navs: navs,
            })  
        } else {
            response.unauthorized('Access denied.')
        }
    }


    * doCreateCategory (request, response) {
        const user = yield request.auth.getUser()
        if(user && user.username == 'admin'){
            
            const categoryData = request.all();
            const validation = yield Validator.validateAll(categoryData, {
                name: 'required|unique:categories'
            });
            if (validation.fails()) {
                yield request
                .withAll()
                .andWith({ errors: validation.messages() })
                .flash()
    
                response.redirect('back')
                return
            }

            var category = new Category()
            category.name = categoryData.name

            yield category.save()
            response.redirect('/categoryList');


        } else {
            response.unauthorized('Access denied.')
        }

    }



    * deleteCategory (request, response) {

            const user = yield request.auth.getUser()
            if (user && user.username == 'admin') {
                const categoryId = request.param('id')        
                const category = yield Category.find(categoryId) 

                if(category){
                    yield category.delete();
                    yield Database.table('book_category').where('category_id',categoryId).delete()
                    yield response.route('/categoryList');
                } else {
                    yield response.forbidden();
                }

            } else {
                response.unauthorized('Access denied.')
            }
        
    }


    * editCategory (request, response) {

        const categoryId = request.param('id')        
        const category = yield Category.find(categoryId)
        const user = yield request.auth.getUser()
        var navs = navigation(user)
        if (user && user.username == 'admin') {
            const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);
            yield response.sendView('editCategory', {
                category: category,
                newBooks: newBooks,
                navs: navs
            })  
        } else {
            response.unauthorized('Access denied.')
        }
    }



    * doEditCategory (request, response) {

        const user = yield request.auth.getUser()
        if (user && user.username == 'admin') {
        
            const categoryData = request.all();
            const validation = yield Validator.validateAll(categoryData, {
                name: 'required',
            });
            if (validation.fails()) {
                yield request
                .withAll()
                .andWith({ errors: validation.messages() })
                .flash()
    
                response.redirect('back')
                return
            }

            const categoryId = request.param('id')

            yield Database.table('categories').where('id',categoryId)
                .update('name',categoryData.name)
        
            response.redirect('/categoryList');

        } else {
            response.unauthorized('Access denied.')
        }

    }





}

module.exports = CategoryController
