'use strict'

const Database = use('Database');
const Book = use('App/Model/Book')
const Category = use('App/Model/Category')
const Order = use('App/Model/Order')
const Comment = use('App/Model/Comment')
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

class OrderController {

    * list (request, response) {
        
        const user = yield request.auth.getUser()
        var navs = navigation(user)
        if (user) {

            var orders
            if(user.username == 'admin'){
                orders = yield Database.table('orders').where('status','!=','basket').orderBy('updated_at','desc')
            } else {
                 orders = yield Database.table('orders').where('user_id',user.id).where('status','!=','basket').orderBy('id','desc')
            }

            const categories = yield Category.all()
            const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);
            
            yield response.sendView('orderList', {
                orders: orders,
                newBooks: newBooks,
                navs: navs,
                user: user
            })  
        } else {
            response.unauthorized('Access denied.')
        }
    }



    * editOrder (request, response) {

        const orderId = request.param('id')        
        const order = yield Order.find(orderId)
        const user = yield request.auth.getUser()
        var navs = navigation(user)
        if (user && user.username == 'admin' && order.status.toUpperCase() != 'LEZÁRT') {
            const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);
            yield response.sendView('editOrder', {
                orderId: orderId,
                newBooks: newBooks,
                navs: navs
            })  
        } else {
            response.unauthorized('Access denied.')
        }
    }




    * doEditOrder (request, response) {

        const user = yield request.auth.getUser()
        if (user.username == 'admin') {
        
            const orderData = request.all();
            const validation = yield Validator.validateAll(orderData, {
                status: 'required',
            });
            if (validation.fails()) {
                yield request
                .withAll()
                .andWith({ errors: validation.messages() })
                .flash()
    
                response.redirect('back')
                return
            }

            const orderId = request.param('id')
            const booksId = yield Database.table('book_order').where('order_id',orderId)
            var bIds = []

            for(var i = 0; i< booksId.length; ++i){
                bIds.push(booksId[i].book_id)
            }

            const books = yield Database.table('books').sum('price as p').whereIn('id',bIds)
            var price = books[0].p


            yield Database.table('orders').where('id',orderId)
                .update('status',orderData.status)
                .update('price',price)
        
            response.redirect('/orderList');

        } else {
            response.unauthorized('You must login to view your profile')
        }

    }




    * putInBasket (request, response) {

        const user = yield request.auth.getUser()
        if (user) {
            const count = yield Database.table('orders').select('id').where('status','basket').where('user_id',user.id)
            if(count < 1){
                var order = new Order();
                order.user_id = user.id
                order.status = 'basket'
                order.price = 0
                yield order.save()
            }

            const bask = yield Database.table('orders').first().where('status','basket').where('user_id',user.id)
            const basket = yield Order.find(bask.id)

            const bookId = request.param('id')

            const b = yield Database.table('books').first().where('id',bookId)
            const book = new Book(b)

            yield basket.books().save(book)
            yield user.orders().save(basket)
            response.redirect('/basket');

        } else {
            response.unauthorized('You must login to view your profile')
        }
        
    }



    * basket (request, response) {

        const user = yield request.auth.getUser()
        var navs = navigation(user)
        if (user) {

            const count = yield Database.table('orders').select('id').where('status','basket').where('user_id',user.id)
            if(count < 1){
                var order = new Order();
                order.user_id = user.id
                order.status = 'basket'
                order.price = 0
                yield order.save()
            }

            const basket = yield Database.table('orders').select('id').where('status','basket').where('user_id',user.id)
            const bookIds = yield Database.table('book_order').select('book_id').where('order_id',basket[0].id)
            var bids = []
            for(var i = 0; i < bookIds.length; ++i){
                bids.push(bookIds[i].book_id)
            }
            console.log(bids)

            const books = yield Database.table('books').whereIn('id',bids)
            const categories = yield Category.all()
            const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);
            
            yield response.sendView('basket', {
                books: books,
                newBooks: newBooks,
                navs: navs
            }) 

        } else {
            response.unauthorized('You must login to view your profile')
        }
        
    }


    * order (request, response) {
        const user = yield request.auth.getUser()
        if (user) {

            const pr = yield Database.table('orders')
                .where('status','basket')
                .where('user_id',user.id)

            const booksId = yield Database.table('book_order').where('order_id',pr[0].id)
            var bIds = []

            for(var i = 0; i< booksId.length; ++i){
                bIds.push(booksId[i].book_id)
            }

            const books = yield Database.table('books').sum('price as p').whereIn('id',bIds)
            var price = books[0].p
            const bask = yield Database.table('orders')
                .where('status','basket')
                .where('user_id',user.id)
                .update('status','Új')
                .update('price',price)
            yield Database.table('books').whereIn('id',bIds).decrement('numOfCopies',1)

            response.redirect('/profile');
        }
    }




    * emptyBasket (request, response) {

        const user = yield request.auth.getUser()
        if (user) {
            const bask = yield Database.table('orders').first().where('status','basket').where('user_id',user.id)
            const basket = yield Order.find(bask.id)

            yield basket.books().detach()
            response.redirect('/basket');

        } else {
            response.unauthorized('You must login to view your profile')
        }
        
    }

    * deleteFromBasket (request, response) {

        const user = yield request.auth.getUser()
        if (user) {
            const bask = yield Database.table('orders').first().where('status','basket').where('user_id',user.id)
            const bookId = request.param('id')

            yield Database.table('book_order').first().where('book_id',bookId).where('order_id',bask.id).delete()
            response.redirect('/basket');

        } else {
            response.unauthorized('You must login to view your profile')
        }
        
    }

    * orderDetails (request, response) {

        const user = yield request.auth.getUser()
        var navs = navigation(user)
        if (user) {

            const orderId = request.param('id')

            const bookIds = yield Database.table('book_order').select('book_id').where('order_id',orderId)
            const order = yield Order.find(orderId)
            const orderData = yield Database.table('orders').select('user_id').first().where('id',orderId)
            const userData = yield Database.table('users').first().where('id',orderData.user_id)
            var bids = []
            for(var i = 0; i < bookIds.length; ++i){
                bids.push(bookIds[i].book_id)
            }

            const books = yield Database.table('books').whereIn('id',bids)
            const categories = yield Category.all()
            const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);
            const comments = yield Database.table('comments').where('order_id',orderId).orderBy('id','desc');
            
            yield response.sendView('orderDetails', {
                userData: userData,
                order: order.toJSON(),
                orderId: orderId,
                books: books,
                newBooks: newBooks,
                navs: navs,
                comments: comments
            }) 

        } else {
            response.unauthorized('You must login to view your profile')
        }
        
    }



    * newRequest (request, response) {
        const user = yield request.auth.getUser()
        var navs = navigation(user)
        if (user) {
        const newBooks = yield Database.table('books').where('numOfCopies','>',0).orderBy('id','desc').limit(3);

            yield response.sendView('newRequest', {
                newBooks: newBooks,
                navs: navs
            }) 
        } else {
            response.unauthorized('You must login to view your profile')
        }
    }


      * doNewRequest (request, response) {
            
            const user = yield request.auth.getUser()
            if (user) {
                const bookData = request.all();
                const validation = yield Validator.validateAll(bookData, {
                    writer: 'required',
                    title: 'required',
                    price: 'required',
                    language: 'required',
                });
                if (validation.fails()) {
                    yield request
                    .withAll()
                    .andWith({ errors: validation.messages() })
                    .flash()
        
                    response.redirect('back')
                    return
                }


                var order = new Order();
                order.user_id = user.id
                order.status = 'request'
                order.price = bookData.price
                yield order.save()

                const book = new Book()
                book.writer = bookData.writer,
                book.title = bookData.title,
                book.price = bookData.price,
                book.language = bookData.language,
                book.publisher = bookData.publisher,
                book.releaseDate = bookData.releaseDate,
                book.remark = bookData.remark,
                book.numOfCopies = 0
                book.isbn = order.id
                book.cover = '/book-013.jpg'

                yield order.books().save(book)
                yield user.orders().save(order)
        
    
                response.redirect('/orderList');
            } else {
                response.unauthorized('You must login to view your profile')
            }
        }



        * doComment (request, response) {
            
            const user = yield request.auth.getUser()
            if (user) {
                const commentData = request.all();
                const validation = yield Validator.validateAll(commentData, {
                    comment: 'required'
                });
                if (validation.fails()) {
                    yield request
                    .withAll()
                    .andWith({ errors: validation.messages() })
                    .flash()
        
                    response.redirect('back')
                    return
                }

                var url = request.originalUrl();
                var arr = url.split("?");
                var arr2 = arr[1].split("=");
                var orderId = arr2[1];


                var comment = new Comment()
                comment.user_id = user.id
                comment.order_id = orderId
                comment.comment = commentData.comment

                yield comment.save()

    
                response.redirect('/orderDetails/'+orderId);
            } else {
                response.unauthorized('You must login to view your profile')
            }
        }


        * deleteOrder (request, response) {

            const user = yield request.auth.getUser()
            if (user.username == 'admin') {


                const orderId = request.param('id')        
                const order = yield Order.find(orderId) 

                if(order){
                    yield order.delete();
                    yield Database.table('book_order').where('order_id',orderId).delete()
                    yield response.route('/orderList');
                } else {
                    yield response.forbidden();
                }

            } else {
                response.unauthorized('You must login to view your profile')
            }
        
        }



}

module.exports = OrderController
