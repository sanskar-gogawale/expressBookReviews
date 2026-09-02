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
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
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
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.json(response.data);
  } catch (error) {
    return res.json(books);
  }
});


// Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  return new Promise((resolve) => {
    resolve(books[isbn]);
  }).then((book) => {
    if (book) {
      return res.json(book);
    }
    return res.status(404).json({ message: "Book not found" });
  });
});


// Get books by author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();

  try {
    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;

    const result = Object.keys(allBooks)
      .filter(key => allBooks[key].author.toLowerCase() === author)
      .map(key => allBooks[key]);

    return res.json(result);
  } catch (error) {
    const result = Object.keys(books)
      .filter(key => books[key].author.toLowerCase() === author)
      .map(key => books[key]);

    return res.json(result);
  }
});


// Get books by title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();

  try {
    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;

    const result = Object.keys(allBooks)
      .filter(key => allBooks[key].title.toLowerCase() === title)
      .map(key => allBooks[key]);

    return res.json(result);
  } catch (error) {
    const result = Object.keys(books)
      .filter(key => books[key].title.toLowerCase() === title)
      .map(key => books[key]);

    return res.json(result);
  }
});


// Get book review
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
