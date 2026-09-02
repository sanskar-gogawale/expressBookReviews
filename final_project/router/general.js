const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// =====================================================
// TASK 7 - REGISTER
// =====================================================

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


// =====================================================
// TASK 2 - GET ALL BOOKS
// =====================================================

public_users.get('/', function (req, res) {
  return Promise.resolve(books)
    .then((result) => {
      res.json(result);
    })
    .catch(() => {
      res.status(500).json({
        message: "Unable to retrieve books"
      });
    });
});


// =====================================================
// TASK 3 - GET BOOK BY ISBN
// =====================================================

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
    .catch(() => {
      res.status(500).json({
        message: "Unable to retrieve book"
      });
    });
});


// =====================================================
// TASK 4 - GET BOOKS BY AUTHOR
// =====================================================

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();

  return Promise.resolve(
    Object.keys(books)
      .filter((isbn) =>
        books[isbn].author.toLowerCase() === author
      )
      .map((isbn) => books[isbn])
  )
    .then((result) => {
      res.json(result);
    })
    .catch(() => {
      res.status(500).json({
        message: "Unable to retrieve books"
      });
    });
});


// =====================================================
// TASK 5 - GET BOOKS BY TITLE
// =====================================================

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  return Promise.resolve(
    Object.keys(books)
      .filter((isbn) =>
        books[isbn].title.toLowerCase() === title
      )
      .map((isbn) => books[isbn])
  )
    .then((result) => {
      res.json(result);
    })
    .catch(() => {
      res.status(500).json({
        message: "Unable to retrieve books"
      });
    });
});


// =====================================================
// TASK 6 - GET BOOK REVIEW
// =====================================================

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});


// =====================================================
// TASK 11 - AXIOS IMPLEMENTATIONS
// =====================================================

// Get all books using Promise callbacks
function getAllBooks() {
  return axios
    .get('http://localhost:5000/')
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching all books:", error.message);
    });
}


// Get book details based on ISBN using async/await
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(
      'http://localhost:5000/isbn/' + encodeURIComponent(isbn)
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching book by ISBN:",
      error.message
    );
  }
}


// Get books by author using Promise callbacks
function getBooksByAuthor(author) {
  return axios
    .get(
      'http://localhost:5000/author/' +
      encodeURIComponent(author)
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(
        "Error fetching books by author:",
        error.message
      );
    });
}


// Get books by title using async/await
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(
      'http://localhost:5000/title/' +
      encodeURIComponent(title)
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching books by title:",
      error.message
    );
  }
}


// =====================================================
// EXPORTS
// =====================================================

module.exports.general = public_users;

module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
