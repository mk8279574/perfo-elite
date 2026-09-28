# PerfoElite

A full-stack MERN perfume e-commerce app with authentication, product browsing, cart, wishlist, order placement, image uploads and an admin dashboard.

## Live Demo

- **App:** https://perfo-elite-eight.vercel.app
- **API:** https://perfo-elite-e5xc.onrender.com
- **Sample endpoint:** https://perfo-elite-e5xc.onrender.com/api/products

> The backend runs on Render's free plan, which sleeps after inactivity. The first request after a while can take 30-50 seconds to wake up. This is normal.

## Features

- Register, login and logout with JWT stored in httpOnly cookies
- Browse products with category filter, sorting and search
- Product detail page with stock and size
- Add to cart, update quantity, remove items
- Wishlist (add/remove with one click)
- Place orders from the cart and view order history
- Admin dashboard: create, edit and delete products, and update order status
- Product image uploads through Cloudinary

## Tech Stack

**Frontend:** React 19, Vite, React Router, Axios, Bootstrap

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Multer, Cloudinary

**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Project Structure

```
perfo-elite/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── api/            # Axios instance
│       ├── components/
│       ├── context/        # Auth context
│       └── pages/          # Home, Products, ProductDetail, Cart,
│                           # Wishlist, Checkout, Orders, Login,
│                           # Register, AdminDashboard
└── server/                 # Express API
    ├── config/             # Database and Cloudinary setup
    ├── controllers/        # Route logic
    ├── middleware/         # Auth, admin check, file upload
    ├── models/             # User, Product, Cart, Order
    ├── Routes/             # API routes
    └── server.js           # Entry point
```

## Run Locally

### 1. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment Variables in Production

**Render (backend):** `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NODE_ENV=production`, `CLIENT_URL` (your Vercel URL)

**Vercel (frontend):** `VITE_API_URL` (your Render URL followed by `/api`)

## API Endpoints

### Auth
- `POST /api/auth/register` - create an account
- `POST /api/auth/login` - log in
- `POST /api/auth/logout` - log out
- `GET /api/auth/me` - current user (protected)

### Products
- `GET /api/products` - list products (`?category=`, `?sort=`, `?search=`)
- `GET /api/products/:id` - single product
- `POST /api/products` - create (admin)
- `PUT /api/products/:id` - update (admin)
- `DELETE /api/products/:id` - delete (admin)

### Cart
- `GET /api/cart` - get cart (protected)
- `POST /api/cart/add` - add item (protected)
- `PUT /api/cart/update` - update quantity (protected)
- `DELETE /api/cart/remove/:productId` - remove item (protected)

### Wishlist
- `GET /api/wishlist` - get wishlist (protected)
- `POST /api/wishlist/toggle/:productId` - add or remove a product (protected)

### Orders
- `POST /api/orders` - place an order from the cart (protected)
- `GET /api/orders/my` - your order history (protected)
- `GET /api/orders` - all orders (admin)
- `PUT /api/orders/:id/status` - update order status (admin)

## Author

Manoj
