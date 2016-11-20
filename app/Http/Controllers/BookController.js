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

class BookController {

    * index (request, response) {

        const user = yield request.auth.getUser()
        var navs = navigation(user)
        const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);

        
        const popularIds = yield Database.table('book_order')
                                        .select('book_id')
                                        .groupBy('book_id')
                                        .count('book_id as count')
                                        .orderBy('count','desc').limit(5)
        var populars = []
        for(var i = 0; i<popularIds.length; ++i){
            var book = yield Database.table('books').first().where('id',popularIds[i].book_id)
            populars.push(book)
        }
        yield response.sendView('welcome', {
            populars: populars,
            newBooks: newBooks,
            navs: navs
        }) 
    }


    * book (request, response) {
        
        const user = yield request.auth.getUser()
        var navs = navigation(user)
        const bookId = request.param('id')
        const book = yield Book.find(bookId)
        const categories = yield Category.all() 
        const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);
        const bookCategories = yield book.categories().fetch()
         yield response.sendView('book', {
            book: book.toJSON(),
            bookCategories: bookCategories.toJSON(),
            user: user,
            categories: categories.toJSON(),
            newBooks: newBooks,
            navs: navs
        }) 
    }





    * bookList (request, response) {
        
        const user = yield request.auth.getUser()
        var navs = navigation(user)

        if (user && user.username == 'admin') {
            const books = yield Database.table('books').select('*')
            const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);
            
            yield response.sendView('bookList', {
                books: books,
                newBooks: newBooks,
                navs: navs,
            })  
        } else {
            //response.unauthorized('You must login to view your profile')
            response.unauthorized('Access denied.')
        }
    }


    * editBook (request, response) {
        const bookId = request.param('id')
        
        const user = yield request.auth.getUser()
        var navs = navigation(user)
        if (user && user.username == 'admin') {
            const book = yield Book.find(bookId)
            const bookCategories = yield book.categories().fetch()
            const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);
            const categories = yield Category.all()
            yield response.sendView('editBook', {
                book: book.toJSON(),
                bookCategories: bookCategories.toJSON(),
                categories: categories.toJSON(),
                newBooks: newBooks,
                navs: navs
            })  
        } else {
            response.unauthorized('Access denied.')
        }
    }



    * createBook (request, response) {

        const user = yield request.auth.getUser()
        var navs = navigation(user)
        if (user && user.username == 'admin') {
            const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);
            const categories = yield Category.all()
            
            yield response.sendView('createBook', {
                newBooks: newBooks,
                categories: categories.toJSON(),
                navs: navs
            })  
        } else {
            response.unauthorized('Access denied.')
        }
    }

    


    * doEditBook (request, response) {
        const user = yield request.auth.getUser()
        if (user && user.username == 'admin') {
        
            const bookData = request.all();
            const validation = yield Validator.validateAll(bookData, {
                writer: 'required',
                title: 'required',
                price: 'required',
                isbn: 'required',
                language: 'required',
                cover: 'required',
                numOfCopies: 'required',
            });
            if (validation.fails()) {
                yield request
                .withAll()
                .andWith({ errors: validation.messages() })
                .flash()
    
                response.redirect('back')
                return
            }

            const bookId = request.param('id')

            yield Database.table('books').where('id',bookId)
                .update('writer',bookData.writer)
                .update('title',bookData.title)
                .update('price',bookData.price)
                .update('binding',bookData.binding)
                .update('releaseDate',bookData.releaseDate)
                .update('publisher',bookData.publisher)
                .update('originalTitle',bookData.originalTitle)
                .update('description',bookData.description)
                .update('pageNum',bookData.pageNum)
                .update('language',bookData.language)
                .update('cover',bookData.cover)
                .update('numOfCopies',bookData.numOfCopies)
                .update('isbn',bookData.isbn)
                .update('remark',bookData.remark)
            
            if(bookData.category != '-'){
                const book = yield Book.find(bookId)
                const cat = yield Database.table('categories').first().where('name',bookData.category)
                const tmp = yield book.categories().where('category_id',cat.id).fetch()
                if(tmp.toJSON().length < 1){
                    const category = new Category(cat)
                    yield book.categories().save(category)
                }
            }
            if(bookData.categoryDelete != '-'){
                const cat = yield Database.table('categories').first().where('name',bookData.categoryDelete)
                const torlendo = yield Database.table('book_category').first().where('book_id',bookId).where('category_id',cat.id).delete()
            }
            response.redirect('/book/'+bookId);

        } else {
            response.unauthorized('Access denied.')
        }

    }




    * doCreateBook (request, response) {
        const user = yield request.auth.getUser()
        if(user && user.username == 'admin'){
            
            const bookData = request.all();
            const validation = yield Validator.validateAll(bookData, {
                writer: 'required',
                title: 'required',
                price: 'required',
                isbn: 'required|unique:books',
                language: 'required',
                cover: 'required',
                numOfCopies: 'required',
            });
            if (validation.fails()) {
                yield request
                .withAll()
                .andWith({ errors: validation.messages() })
                .flash()
    
                response.redirect('back')
                return
            }

            var book = new Book()
            book.writer = bookData.writer
            book.title = bookData.title
            book.price = bookData.price
            book.binding = bookData.binding
            book.isbn = bookData.isbn
            book.releaseDate = bookData.releaseDate
            book.publisher = bookData.publisher
            book.originalTitle = bookData.originalTitle
            book.description = bookData.description
            book.pageNum = bookData.pageNum
            book.language = bookData.language
            book.cover = bookData.cover
            book.numOfCopies = bookData.numOfCopies

            yield book.save()

            if(bookData.category != '-'){
                //const book = yield Book.find(bookId)
                const cat = yield Database.table('categories').first().where('name',bookData.category)
                const category = new Category(cat)
                yield book.categories().save(category)
            }
            
            response.redirect('/bookList');


        } else {
            response.unauthorized('Access denied.')
        }

    }



    * deleteBook (request, response) {
        const bookId = request.param('id')
        const book = yield Book.find(bookId)
        const user = yield request.auth.getUser()
        if(user && book && user.username == 'admin'){
            yield book.delete();
            yield Database.table('book_category').where('book_id',bookId).delete()
            yield response.route('/book');
        } else {
            response.unauthorized('Access denied.')
        }
  }

}

module.exports = BookController





