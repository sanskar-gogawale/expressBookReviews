const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ======================================================
// TASK 7 - REGISTER A NEW USER
// ======================================================

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "Username already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(201).json({
    message: "User successfully registered"
  });
});


// ======================================================
// INTERNAL DATA ROUTES
// These return the book data directly.
// The public routes below use Axios to access them.
// ======================================================

// Internal route - all books
public_users.get('/_data/books', (req, res) => {
  res.json(books);
});


// Internal route - ISBN
public_users.get('/_data/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  res.json(books[isbn]);
});


// Internal route - author
public_users.get('/_data/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();

  const result = Object.keys(books)
    .filter((isbn) => {
      return books[isbn].author.toLowerCase() === author;
    })
    .map((isbn) => books[isbn]);

  res.json(result);
});


// Internal route - title
public_users.get('/_data/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();

  const result = Object.keys(books)
    .filter((isbn) => {
      return books[isbn].title.toLowerCase() === title;
    })
    .map((isbn) => books[isbn]);

  res.json(result);
});


// ======================================================
// TASK 10 - GET ALL BOOKS USING AXIOS + ASYNC/AWAIT
// ======================================================

public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(
      'http://localhost:5000/_data/books'
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve books"
    });
  }
});


// ======================================================
// TASK 11 - GET BOOK BY ISBN USING AXIOS + PROMISES
// ======================================================

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  axios
    .get('http://localhost:5000/_data/isbn/' + isbn)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      res.status(404).json({
        message: "Book not found"
      });
    });
});


// ======================================================
// TASK 12 - GET BOOKS BY AUTHOR USING AXIOS + ASYNC/AWAIT
// ======================================================

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get(
      'http://localhost:5000/_data/author/' +
      encodeURIComponent(author)
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve books"
    });
  }
});


// ======================================================
// TASK 13 - GET BOOKS BY TITLE USING AXIOS + ASYNC/AWAIT
// ======================================================

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get(
      'http://localhost:5000/_data/title/' +
      encodeURIComponent(title)
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve books"
    });
  }
});


// ======================================================
// TASK 6 - GET BOOK REVIEW
// ======================================================

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});


module.exports.general = public_users;
