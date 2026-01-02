const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Book.deleteMany(); // Clear existing books

    const dummyBooks = [
      { title: "The Great Gatsby", author: "F. Scott Fitzgerald", ISBN: "9780743273565", totalCopies: 5, availableCopies: 5 },
      { title: "Clean Code", author: "Robert C. Martin", ISBN: "9780132350884", totalCopies: 3, availableCopies: 3 },
      { title: "Atomic Habits", author: "James Clear", ISBN: "9780735211292", totalCopies: 10, availableCopies: 10 }
    ];

    await Book.insertMany(dummyBooks);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();