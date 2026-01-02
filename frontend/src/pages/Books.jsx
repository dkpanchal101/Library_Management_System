import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../services/api';
import './Books.css';

const Books = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchBooks();
    fetchIssuedBooks();
  }, [navigate]);

  const fetchBooks = async () => {
    try {
      const response = await bookAPI.getAllBooks();
      setBooks(response.data);
    } catch (error) {
      showMessage('error', 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const fetchIssuedBooks = async () => {
    try {
      const response = await bookAPI.getIssuedBooks();
      setIssuedBooks(response.data);
    } catch (error) {
      console.error('Failed to load issued books');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleIssue = async (bookId) => {
    try {
      await bookAPI.issueBook(bookId);
      showMessage('success', 'Book issued successfully!');
      fetchBooks();
      fetchIssuedBooks();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to issue book');
    }
  };

  const handleReturn = async (bookId) => {
    try {
      await bookAPI.returnBook(bookId);
      showMessage('success', 'Book returned successfully!');
      fetchBooks();
      fetchIssuedBooks();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to return book');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isBookIssued = (bookId) => {
    return issuedBooks.some(transaction => transaction.book._id === bookId);
  };

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div className="books-container">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <h1>📚 Library Management System</h1>
        </div>
        <div className="header-right">
          <span className="user-name">👤 {user?.name}</span>
          <button onClick={handleLogout} className="btn btn-logout">
            Logout
          </button>
        </div>
      </div>

      {/* Alert Message */}
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Issued Books Section */}
      {issuedBooks.length > 0 && (
        <div className="section">
          <h2>Your Issued Books ({issuedBooks.length})</h2>
          <div className="books-grid">
            {issuedBooks.map((transaction) => (
              <div key={transaction._id} className="book-card issued">
                <h3>{transaction.book.title}</h3>
                <p className="author">by {transaction.book.author}</p>
                <p className="isbn">ISBN: {transaction.book.ISBN}</p>
                <p className="issued-date">
                  Issued: {new Date(transaction.issuedAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleReturn(transaction.book._id)}
                  className="btn btn-return"
                >
                  Return Book
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Books Section */}
      <div className="section">
        <h2>All Available Books ({books.length})</h2>
        <div className="books-grid">
          {books.map((book) => (
            <div key={book._id} className="book-card">
              <h3>{book.title}</h3>
              <p className="author">by {book.author}</p>
              <p className="isbn">ISBN: {book.ISBN}</p>
              <div className="availability">
                <span className={book.availableCopies > 0 ? 'available' : 'unavailable'}>
                  Available: {book.availableCopies} / {book.totalCopies}
                </span>
              </div>
              
              {isBookIssued(book._id) ? (
                <button
                  onClick={() => handleReturn(book._id)}
                  className="btn btn-return"
                >
                  Return Book
                </button>
              ) : (
                <button
                  onClick={() => handleIssue(book._id)}
                  disabled={book.availableCopies === 0}
                  className="btn btn-issue"
                >
                  {book.availableCopies === 0 ? 'Not Available' : 'Issue Book'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Books;
