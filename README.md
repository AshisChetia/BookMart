# 📚 BookMart

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![React](https://img.shields.io/badge/react-%5E18.2.0-blue)
![Express](https://img.shields.io/badge/express-%5E4.18.2-lightgrey)
![MongoDB](https://img.shields.io/badge/mongodb-%5E6.0.0-green)

> **BookMart** is a comprehensive full-stack e-commerce platform dedicated to buying and selling books. Built with the MERN stack, it offers a distinct and secure experience for both Buyers and Sellers.

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

### 👤 For Users (Buyers)
- **Browse & Search**: Explore a vast collection of books with advanced filtering (Category, Price, Author).
- **Secure Authentication**: User-friendly Signup and Login.
- **Shopping Cart**: Add multiple items to the cart and proceed to checkout.
- **Wishlist**: Save favorite books for later.
- **Order Management**: View past orders and order status.

### 🏢 For Sellers
- **Dashboard**: A dedicated dashboard to view analytics and manage inventory.
- **Book Management**: Add, update, and remove book listings effortlessly.
- **Image Upload**: Seamless image uploads for book covers using Cloudinary.
- **Sales Tracking**: Monitor sales and earnings.

---

## 🛠 Tech Stack

| Area | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), Tailwind CSS, React Router DOM, Axios, React Hot Toast |
| **Backend** | Node.js, Express.js, JWT Authentication, Multer |
| **Database** | MongoDB, Mongoose |
| **Storage** | Cloudinary (Image Storage) |
| **Tools** | ESLint, Postman (Testing), Git |

---

## 📂 Folder Structure

```markdown
BookMart/
├── Backend/                # Backend Server & Logic
│   ├── config/             # Database Connection & Config
│   ├── controllers/        # Request Handlers (Auth, Books, Orders)
│   ├── middleware/         # Custom Middleware (Auth, Uploads)
│   ├── models/             # Mongoose Schemas (User, Book, Order)
│   ├── routes/             # API Route Definitions
│   ├── utils/              # Helper Functions (Cloudinary, ErrorHandler)
│   └── server.js           # Server Entry Point
│
├── Frontend/               # Frontend Client Application
│   ├── src/
│   │   ├── assets/         # Images, Fonts, Generic Styles
│   │   ├── components/     # Reusable UI Components (Navbar, Cards)
│   │   ├── context/        # Global State (Auth, Cart Context)
│   │   ├── pages/          # Application Pages
│   │   │   ├── auth/       # Login & Signup Pages
│   │   │   ├── buyer/      # Exploration, Cart, Checkout
│   │   │   └── seller/     # Dashboard, Inventory Management
│   │   ├── services/       # API Service Calls & Interceptors
│   │   ├── App.jsx         # Main App Component & Routing
│   │   └── main.jsx        # Application Entry Point
│   ├── index.html          # HTML Template
│   └── tailwind.config.js  # Tailwind CSS Configuration
│
└── README.md               # Project Documentation
```

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/AshisChetia/BookMart.git
    cd BookMart
    ```

2.  **Backend Setup**
    ```bash
    cd Backend
    npm install
    # Start the server
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd ../Frontend
    npm install
    # Start the client
    npm run dev
    ```

---

## 🔐 Environment Variables

Create a `.env` file in the **Backend** and **Frontend** directories with the following variables:

### **Backend (`Backend/.env`)**

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Server Port | `3000` |
| `MONGO_URI` | MongoDB Connection String | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT | `your_super_secret_key` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your_api_secret` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### **Frontend (`Frontend/.env`)**

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Check Backend API Base URL | `http://localhost:3000/api` |

---

## 📡 API Reference

Here are a few key endpoints:

- **Auth**:
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login user
- **Books**:
  - `GET /api/books` - Get all books
  - `POST /api/books` - Add a new book (Seller only)
  - `GET /api/books/:id` - Get book details

---

## 🤝 Contributing

Contributions are always welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add some NewFeature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
