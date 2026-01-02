import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

// Book APIs
export const bookAPI = {
  getAllBooks: () => api.get('/books'),
  addBook: (data) => api.post('/books', data),
  issueBook: (bookId) => api.post('/books/issue', { bookId }),
  returnBook: (bookId) => api.post('/books/return', { bookId }),
  getIssuedBooks: () => api.get('/books/issued')
};

export default api;