# Project - Books Management
 ### Key points
Create a group database groupXDatabase. You can clean the db you previously used and resue that.
This time each group should have a single git branch. Coordinate amongst yourselves by ensuring every next person pulls the code last pushed by a team mate. You branch will be checked as part of the demo. Branch name should follow the naming convention project/booksManagementGroupX
Follow the naming conventions exactly as instructed.
## Models
### User Model
{ 
  title: {string, mandatory, enum[Mr, Mrs, Miss]},
  name: {string, mandatory},
  phone: {string, mandatory, unique},
  email: {string, mandatory, valid email, unique}, 
  password: {string, mandatory, minLen 8, maxLen 15},
  address: {
    street: {string},
    city: {string},
    pincode: {string}
  },
  createdAt: {timestamp},
  updatedAt: {timestamp}
}
### Books Model
{ 
  title: {string, mandatory, unique},
  excerpt: {string, mandatory}, 
  userId: {ObjectId, mandatory, refs to user model},
  ISBN: {string, mandatory, unique},
  category: {string, mandatory},
  subcategory: {string, mandatory},
  reviews: {number, default: 0, comment: Holds number of reviews of this book},
  deletedAt: {Date, when the document is deleted}, 
  isDeleted: {boolean, default: false},
  releasedAt: {Date, mandatory, format("YYYY-MM-DD")},
  createdAt: {timestamp},
  updatedAt: {timestamp},
}
### Review Model (Books review)
{
  bookId: {ObjectId, mandatory, refs to book model},
  reviewedBy: {string, mandatory, default 'Guest', value: reviewer's name},
  reviewedAt: {Date, mandatory},
  rating: {number, min 1, max 5, mandatory},
  review: {string, optional}
  isDeleted: {boolean, default: false},
}
## User APIs
# POST /register
Create a user - atleast 5 users
Create a user document from request body.
Return HTTP status 201 on a succesful user creation. Also return the user document. The response should be a JSON object like this
Return HTTP status 400 if no params or invalid params received in request body. The response should be a JSON object like this
# POST /login
Allow an user to login with their email and password.
On a successful login attempt return a JWT token contatining the userId, exp, iat. The response should be a JSON object like this
If the credentials are incorrect return a suitable error message with a valid HTTP status code. The response should be a JSON object like this
## Books API
# POST /books
Create a book document from request body. Get userId in request body only.
Make sure the userId is a valid userId by checking the user exist in the users collection.
Return HTTP status 201 on a succesful book creation. Also return the book document. The response should be a JSON object like this
Create atleast 10 books for each user
Return HTTP status 400 for an invalid request with a response body like this
# GET /books
Returns all books in the collection that aren't deleted. Return only book _id, title, excerpt, userId, category, releasedAt, reviews field. Response example here
Return the HTTP status 200 if any documents are found. The response structure should be like this
If no documents are found then return an HTTP status 404 with a response like this
Filter books list by applying filters. Query param can have any combination of below filters.
By userId
By category
By subcategory example of a query url: books?filtername=filtervalue&f2=fv2
Return all books sorted by book name in Alphabatical order
# GET /books/:bookId
Returns a book with complete details including reviews. Reviews array would be in the form of Array. Response example here
Return the HTTP status 200 if any documents are found. The response structure should be like this
If the book has no reviews then the response body should include book detail as shown here and an empty array for reviewsData.
If no documents are found then return an HTTP status 404 with a response like this
# PUT /books/:bookId
Update a book by changing its
title
excerpt
release date
ISBN
Make sure the unique constraints are not violated when making the update
Check if the bookId exists (must have isDeleted false and is present in collection). If it doesn't, return an HTTP status 404 with a response body like this
Return an HTTP status 200 if updated successfully with a body like this
Also make sure in the response you return the updated book document.
# DELETE /books/:bookId
Check if the bookId exists and is not deleted. If it does, mark it deleted and return an HTTP status 200 with a response body with status and message.
If the book document doesn't exist then return an HTTP status of 404 with a body like this
## Review APIs
# POST /books/:bookId/review
Add a review for the book in reviews collection.
Check if the bookId exists and is not deleted before adding the review. Send an error response with appropirate status code like this if the book does not exist
Get review details like review, rating, reviewer's name in request body.
Update the related book document by increasing its review count
Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like this
# PUT /books/:bookId/review/:reviewId
Update the review - review, rating, reviewer's name.
Check if the bookId exists and is not deleted before updating the review. Check if the review exist before updating the review. Send an error response with appropirate status code like this if the book does not exist
Get review details like review, rating, reviewer's name in request body.
Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like this
# DELETE /books/:bookId/review/:reviewId
Check if the review exist with the reviewId. Check if the book exist with the bookId. Send an error response with appropirate status code like this if the book or book review does not exist
Delete the related reivew.
Update the books document - decrease review count by one
# Authentication
Make sure all the book routes are protected.
# Authorisation
Make sure that only the owner of the books is able to create, edit or delete the book.
In case of unauthorized access return an appropirate error message.
Testing
To test these apis create a new collection in Postman named Project 4 Books Management
Each api should have a new request in this collection
Each request in the collection should be rightly named. Eg Create user, Create book, Get books etc
Each member of each team should have their tests in running state.


