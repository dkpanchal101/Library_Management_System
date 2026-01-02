const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  ISBN: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true
  },
  totalCopies: {
    type: Number,
    required: [true, 'Total copies is required'],
    min: [1, 'Total copies must be at least 1']
  },
  availableCopies: {
    type: Number,
    required: true,
    min: [0, 'Available copies cannot be negative'],
    validate: {
      validator: function(value) {
        return value <= this.totalCopies;
      },
      message: 'Available copies cannot exceed total copies'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);