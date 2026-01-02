const express = require('express');
const {
  addBook,
  getAllBooks,
  issueBook,
  returnBook,
  getIssuedBooks
} = require('../controllers/book');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', addBook);
router.get('/', getAllBooks);
router.post('/issue', protect, issueBook);
router.post('/return', protect, returnBook);
router.get('/issued', protect, getIssuedBooks);

module.exports = router;