# AuraMarket - Premium E-Commerce Application Scaffolding

This repository contains a full-stack, state-of-the-art e-commerce boilerplate. It is built with high performance and modular MVC architecture, featuring a custom Tailwind CSS frontend theme and a Node.js + Express + MongoDB Atlas backend.

---

## Tech Stack
*   **Frontend**: React (Vite), React Router, Axios, Redux Toolkit, Tailwind CSS, Lucide Icons.
*   **Backend**: Node.js, Express.js (REST API), Helmet (Security headers), CORS, Express Rate Limit.
*   **Database**: MongoDB with Mongoose (with text indexes for product searching).
*   **Auth (Planned)**: JWT authentication and bcrypt for passwords.
*   **Payments (Planned)**: Stripe checkout integration.

---

## Folder Structure
```
e-commerce/
├── client/                     # Frontend React (Vite) Application
│   ├── public/
│   ├── src/
│   │   ├── components/         # Shared UI elements
│   │   ├── pages/              # ProductList, Account details placeholders
│   │   ├── store/              # Redux slices (cart, products)
│   │   ├── App.jsx             # Main Router layout
│   │   ├── index.css           # Tailwind + Custom styling rules
│   │   └── main.jsx            # Redux & Router attachment
│   ├── index.html              # Shell HTML
│   ├── package.json            # Client dependencies
│   ├── tailwind.config.js      # Custom theme setup
│   └── vite.config.js          # Development API proxy config
├── server/                     # Backend Express Application
│   ├── config/                 # DB connections
│   ├── controllers/            # Request handlers (MVC)
│   ├── middleware/             # Rate-limits & central error interceptors
│   ├── models/                 # Mongoose schemas (Product)
│   ├── routes/                 # Express route maps
│   ├── .env.example            # Environment variables configuration
│   ├── package.json            # Server dependencies
│   └── server.js               # Entry point
└── README.md                   # Installation & usage guide
```

---

## Getting Started

### Prerequisites
*   Node.js (>= 18.0.0)
*   npm or yarn
*   A local MongoDB database OR a MongoDB Atlas cloud connection URI

---

### Step 1: Backend Setup
1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install the required dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    *   Duplicate `.env.example` and rename to `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Open `.env` and fill in your connection details (especially `MONGO_URI` and `PORT`).
4.  Launch the backend development server:
    ```bash
    npm run dev
    ```
    The server will connect to MongoDB and start listening on port `5000` (or the port specified in your `.env`).

---

### Step 2: Frontend Setup
1.  Navigate to the `client` directory:
    ```bash
    cd ../client
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development server:
    ```bash
    npm run dev
    ```
    Vite will start the client on `http://localhost:3000`. The Vite server is preloaded with a development proxy that automatically forwards any requests matching `/api/*` directly to the Express server on port `5000`.

---

## Sample Data Seeding
To test the product listing, filters, search, and pagination, you need items in your database. 
You can seed 8 high-fidelity sample products in two ways:
1.  **Frontend Seeding (Recommended)**: Launch both the client and server, navigate to `http://localhost:3000`, and click the **"Seed Demo Catalog"** button in the hero banner or empty catalog state.
2.  **API Seeding**: Send a `POST` request to `http://localhost:5000/api/products/seed` using a tool like Postman or Curl:
    ```bash
    curl -X POST http://localhost:5000/api/products/seed
    ```
