'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.get('/', 'BookController.index')
Route.get('/book', 'CategoryController.index').as('book_list');
Route.get('/book/:id', 'BookController.book').as('book_page');
Route.get('/bookList', 'BookController.bookList');
Route.get('/book/:id/editBook', 'BookController.editBook').as('book_edit');
Route.post('/book/:id/editBook', 'BookController.doEditBook').as('do_book_edit');
Route.get('/book/:id/deleteBook', 'BookController.deleteBook').as('book_delete');
Route.get('/createBook', 'BookController.createBook').as('book_create');
Route.post('/createBook', 'BookController.doCreateBook').as('bo_book_create');

Route.get('/book/category/:id', 'CategoryController.index').as('book_category')
Route.get('/categoryList', 'CategoryController.categoryList')
Route.get('/createCategory', 'CategoryController.createCategory').as('category_create');
Route.post('/createCategory', 'CategoryController.doCreateCategory').as('bo_category_create');
Route.get('/categoryList/delete/:id', 'CategoryController.deleteCategory').as('category_delete')
Route.get('/categoryList/edit/:id', 'CategoryController.editCategory').as('category_edit');
Route.post('/categoryList/edit/:id', 'CategoryController.doEditCategory').as('do_category_edit');

Route.get('/logOut', 'UserController.logout');
Route.get('/logIn', 'UserController.login').as('user_login');
Route.post('/logIn', 'UserController.doLogin').as('do_user_login');
Route.get('/profile', 'UserController.profile');
Route.get('/profile/edit', 'UserController.editProfile').as('profile_edit');
Route.post('/profile/edit', 'UserController.doEditProfile').as('do_profile_edit');
Route.get('/signUp', 'UserController.create').as('user_create');
Route.post('/signUp', 'UserController.doCreate').as('do_user_create');
Route.get('/userList', 'UserController.userList');

Route.get('/orderList', 'OrderController.list')
Route.get('/putInBasket/:id', 'OrderController.putInBasket').as('basket_put')
Route.get('/basket', 'OrderController.basket')
Route.get('/order', 'OrderController.order')
Route.get('/orderDetails/:id', 'OrderController.orderDetails').as('order_details')
Route.post('/doComment', 'OrderController.doComment').as('do_comment_create')
Route.get('/emptyBasket', 'OrderController.emptyBasket')
Route.get('/deleteFromBasket/:id', 'OrderController.deleteFromBasket').as('basket_delete')
Route.get('/newRequest', 'OrderController.newRequest').as('request_create')
Route.post('/newRequest', 'OrderController.doNewRequest').as('do_request_create')
Route.get('/editOrder/:id', 'OrderController.editOrder').as('order_edit')
Route.post('/editOrder/:id', 'OrderController.doEditOrder').as('do_order_edit')
Route.get('/editOrder/:id/delete', 'OrderController.deleteOrder').as('order_delete')

Route.group('ajax', function () {
  Route.delete('/book/:id/deleteBook', 'BookController.ajaxDelete').middleware('auth'),
  Route.delete('/categoryList/delete/:id', 'CategoryController.ajaxDelete').middleware('auth'),
  Route.delete('/editOrder/:id/delete', 'OrderController.ajaxDelete').middleware('auth'),
  Route.delete('/deleteFromBasket/:id', 'OrderController.ajaxDeleteFromBasket').middleware('auth')
  Route.delete('/emptyBasket', 'OrderController.ajaxEmptyBasket').middleware('auth')
  Route.post('/logIn', 'UserController.ajaxLogin')
  Route.post('/book/:id/editBook', 'BookController.ajaxEditBook')
  Route.post('/createBook', 'BookController.ajaxCreateBook')
  Route.get('/search', 'CategoryController.ajaxSearch')
}).prefix('/ajax')