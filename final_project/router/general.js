const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
	const { username, password } = req.body;

	// Check if both username and password are provided
	if (username && password) {
		// Check if the user does not already exist
		if (isValid(username)) {
			// Add the new user to the users array
			users.push({ username: username, password: password });
			return res.status(201).json({ message: 'User successfully registered. Now you can login' });
		} else {
			return res.status(400).json({ message: 'User already exists!' });
		}
	}
	// Return error if username or password is missing
	return res.status(400).json({ message: 'Unable to register user.' });
});

//Get the book list available in the shop
public_users.get('/', function (req, res) {
	res.status(200).json({ books });
});

// Task 10 - using Promises
// public_users.get('/', function (req, res) {
// 	let response = new Promise((resolve, reject) => {
// 		setTimeout(function () {
// 			resolve(books);
// 		}, 2000);
// 	});

// 	response.then((books) => {
// 		res.status(200).json({ books });
// 	});
// });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
	const isbn = req.params.isbn;
	if (!books[isbn]) {
		return res.status(404).json({ message: 'No book exists with this ISBN. Please check the ISBN.' });
	}
	res.status(200).json(books[isbn]);
});

// Task 11 - using Async/Await
// public_users.get('/isbn/:isbn', async function (req, res) {
// 	const isbn = req.params.isbn;
// 	if (!books[isbn]) {
// 		return res.status(404).json({ message: 'No book exists with this ISBN. Please check the ISBN.' });
// 	}

// 	let response = new Promise((resolve, reject) => {
// 		setTimeout(function () {
// 			resolve(books[isbn]);
// 		}, 2000);
// 	});

// 	const book = await response;
// 	res.status(200).json({ book });
// });

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
	const author = req.params.author;
	const booksByAuthor = [];

	for (const book in books) {
		if (books[book].author.toString() === author.toString()) {
			{
				booksByAuthor.push({ isbn: book, title: books[book].title, reviews: books[book].reviews });
			}
		}
	}

	if (booksByAuthor.length === 0) {
		return res.status(200).json({ message: 'No books by this author.' });
	}

	res.status(200).json(booksByAuthor);
});

// Task 12
// public_users.get('/author/:author', function (req, res) {
// 	const author = req.params.author;
// 	const booksByAuthor = [];

// 	for (const book in books) {
// 		if (books[book].author.toString() === author.toString()) {
// 			{
// 				booksByAuthor.push({ isbn: book, title: books[book].title, reviews: books[book].reviews });
// 			}
// 		}
// 	}

// 	const response = new Promise((resolve, reject) => {
// 		setTimeout(() => {
// 			if (booksByAuthor.length === 0) {
// 				reject({ message: 'No books by this author.' });
// 			} else {
// 				resolve(booksByAuthor);
// 			}
// 		}, 2000);
// 	})
// 		.then((books) => res.status(200).json(books))
// 		.catch((error) => res.status(404).json(error));
// });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
	const title = req.params.title;
	const booksByTitle = [];

	for (const book in books) {
		if (books[book].title.toString() === title.toString()) {
			{
				booksByTitle.push({ isbn: book, author: books[book].author, reviews: books[book].reviews });
			}
		}
	}

	if (booksByTitle.length === 0) {
		return res.status(200).json({ message: 'No book with this title.' });
	}

	res.status(200).json(booksByTitle);
});

// Task 13
// public_users.get('/title/:title', function (req, res) {
// 	const title = req.params.title;
// 	const booksByTitle = [];

// 	for (const book in books) {
// 		if (books[book].title.toString() === title.toString()) {
// 			{
// 				booksByTitle.push({ isbn: book, author: books[book].author, reviews: books[book].reviews });
// 			}
// 		}
// 	}

// 	const response = new Promise((resolve, reject) => {
// 		setTimeout(() => {
// 			if (booksByTitle.length === 0) {
// 				reject({ message: 'No book with this title.' });
// 			} else {
// 				resolve(booksByTitle);
// 			}
// 		}, 2000);
// 	})
// 		.then((books) => res.status(200).json(books))
// 		.catch((error) => res.status(404).json(error));
// });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
	const isbn = req.params.isbn;
	if (!books[isbn]) {
		return res.status(404).json({ message: 'No book exists with this ISBN. Please check the ISBN.' });
	}
	res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
