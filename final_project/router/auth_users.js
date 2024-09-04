const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	// Filter the users array for any user with the same username
	let usersWithSameName = users.filter((user) => {
		return user.username === username;
	});
	// Return true if any user with the same username is found, otherwise false
	if (usersWithSameName.length > 0) {
		return false;
	} else {
		return true;
	}
};

const authenticatedUser = (username, password) => {
	// Filter the users array for any user with the same username and password
	let validUsers = users.filter((user) => {
		return user.username === username && user.password === password;
	});
	// Return true if any valid user is found, otherwise false
	if (validUsers.length > 0) {
		return true;
	} else {
		return false;
	}
};

//only registered users can login
regd_users.post('/login', (req, res) => {
	const { username, password } = req.body;

	// Check if username or password is missing
	if (!username || !password) {
		return res.status(404).json({ message: 'Error logging in' });
	}

	// Authenticate user
	if (authenticatedUser(username, password)) {
		// Generate JWT access token
		let accessToken = jwt.sign(
			{
				data: password,
			},
			'access',
			{ expiresIn: 60 * 60 }
		);

		// Store access token and username in session
		req.session.authorization = {
			accessToken,
			username,
		};
		return res.status(200).send({ message: 'User successfully logged in' });
	} else {
		return res.status(208).json({ message: 'Invalid Login. Check username and password' });
	}
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
	const isbn = req.params.isbn;
	const review = req.query.review;

	if (!books[isbn]) {
		return res.status(404).json({ message: 'No book exists with this ISBN. Please check the ISBN.' });
	}

	books[isbn].reviews[req.session.authorization.username] = review;
	res.status(201).json({ message: `The review for book with ISBN ${isbn} has been added/updated.` });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
	const isbn = req.params.isbn;
	if (!books[isbn]) {
		return res.status(404).json({ message: 'No book exists with this ISBN. Please check the ISBN.' });
	}

	const userName = req.session.authorization.username;

	books[isbn].reviews[userName] = undefined;
	res
		.status(200)
		.json({ message: `Reviews for book with ISBN: ${isbn} by the user ${userName} has been deleted.` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
