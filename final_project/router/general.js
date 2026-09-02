const axios = require('axios');

const BASE_URL = "http://localhost:5000";

// Get all books using Promise callbacks
function getAllBooks() {
  return axios
    .get(`${BASE_URL}/`)
    .then((response) => {
      console.log("All Books:", response.data);
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
      `${BASE_URL}/isbn/${isbn}`
    );

    console.log(`Book with ISBN ${isbn}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching book with ISBN ${isbn}:`,
      error.message
    );
  }
}


// Get book details based on author using Promise callbacks
function getBooksByAuthor(author) {
  return axios
    .get(
      `${BASE_URL}/author/${encodeURIComponent(author)}`
    )
    .then((response) => {
      console.log(`Books by ${author}:`, response.data);
      return response.data;
    })
    .catch((error) => {
      console.error(
        `Error fetching books by ${author}:`,
        error.message
      );
    });
}


// Get book details based on title using async/await
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(
      `${BASE_URL}/title/${encodeURIComponent(title)}`
    );

    console.log(`Books with title ${title}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching books with title ${title}:`,
      error.message
    );
  }
}


module.exports = {
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle
};
