Library Management System (MERN)

A full-stack Library Management System built as part of a technical task. The system allows users to register, login, and manage books, including issuing and returning books with real-time stock updates.
🚀 Features

    User Authentication: Secure Register and Login using JWT (JSON Web Tokens).

    Book Management: Add new books and view all available books.

    Issue/Return System:

        Users can issue a book (decreases availableCopies).

        Users can return a book (increases availableCopies).

        Prevents issuing books that are out of stock.

        Prevents users from issuing the same book twice simultaneously.

🛠️ Tech Stack

    Frontend: React.js

    Backend: Node.js, Express.js

    Database: MongoDB (Mongoose)

    Authentication: JWT

📋 Prerequisites

    Node.js installed

    MongoDB connection string

⚙️ Installation & Setup

    Clone the repository:
    Bash

git clone https://github.com/dkpanchal101/Library_Management_System.git
cd Library_Management_System

Backend Setup:
Bash

cd server
npm install
# Create a .env file and add your MONGO_URI and JWT_SECRET
node server.js

Frontend Setup:
Bash

    cd ../client
    npm install
    npm run dev

🧪 API Testing

A Postman Collection is included in the root directory for easy testing:

    Library Management System APIs.postman_collection.json

Endpoints included:

    POST /api/auth/register - User Registration

    POST /api/auth/login - User Login (Returns Token)

    POST /api/books - Add Book (Protected)

    GET /api/books - Get All Books

    POST /api/books/issue - Issue a Book (Protected)

    POST /api/books/return - Return a Book (Protected)
