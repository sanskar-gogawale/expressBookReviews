const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register a new user
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


// Get all books
public_users.get('/', function (req, res) {
  return Promise.resolve(books)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Unable to retrieve books"
      });
    });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  return Promise.resolve(books[isbn])
    .then((book) => {
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({
          message: "Book not found"
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Unable to retrieve book"
      });
    });
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();

  return Promise.resolve(
    Object.keys(books)
      .filter((isbn) => books[isbn].author.toLowerCase() === author)
      .map((isbn) => books[isbn])
  )
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Unable to retrieve books"
      });
    });
});


// Get books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  return Promise.resolve(
    Object.keys(books)
      .filter((isbn) => books[isbn].title.toLowerCase() === title)
      .map((isbn) => books[isbn])
  )
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Unable to retrieve books"
      });
    });
});


// Get book reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});


// ======================================================
// AXIOS IMPLEMENTATIONS FOR TASKS 10-13
// ======================================================

// Task 10 - Axios async/await implementation
async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  } catch (error) {
    return books;
  }
}


// Task 11 - Axios Promise implementation for ISBN
function getBookByISBN(isbn) {
  return axios.get('http://localhost:5000/isbn/' + isbn)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return books[isbn];
    });
}


// Task 12 - Axios async/await implementation for Author
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(
      'http://localhost:5000/author/' + encodeURIComponent(author)
    );
    return response.data;
  } catch (error) {
    return [];
  }
}


// Task 13 - Axios async/await implementation for Title
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(
      'http://localhost:5000/title/' + encodeURIComponent(title)
    );
    return response.data;
  } catch (error) {
    return [];
  }
}


module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
