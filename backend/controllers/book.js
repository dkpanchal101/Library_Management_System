const Book = require('../models/Book');
const Transaction = require('../models/Transaction');

const addBook = async (req, res) => {
  try {
    const { title, author, ISBN, totalCopies } = req.body;

    // Check if book with ISBN already exists
    const bookExists = await Book.findOne({ ISBN });
    if (bookExists) {
      return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }

    // Create book with availableCopies = totalCopies
    const book = await Book.create({
      title,
      author,
      ISBN,
      totalCopies,
      availableCopies: totalCopies
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const issueBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if book is available
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available' });
    }

    // Check if user already has this book issued
    const existingTransaction = await Transaction.findOne({
      user: userId,
      book: bookId,
      returnedAt: null
    });

    if (existingTransaction) {
      return res.status(400).json({ message: 'You have already issued this book' });
    }

    // Create transaction and update book
    const transaction = await Transaction.create({
      user: userId,
      book: bookId
    });

    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({
      message: 'Book issued successfully',
      transaction,
      book
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const returnBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Find active transaction
    const transaction = await Transaction.findOne({
      user: userId,
      book: bookId,
      returnedAt: null
    });

    if (!transaction) {
      return res.status(400).json({ message: 'You have not issued this book' });
    }

    // Update transaction and book
    transaction.returnedAt = Date.now();
    await transaction.save();

    book.availableCopies += 1;
    await book.save();

    res.json({
      message: 'Book returned successfully',
      transaction,
      book
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIssuedBooks = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({
      user: userId,
      returnedAt: null
    }).populate('book');

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addBook, getAllBooks, issueBook, returnBook, getIssuedBooks };