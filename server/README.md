

# PerfoElite — Backend API

REST API for PerfoElite, a full-stack MERN perfume e-commerce platform featuring authentication, product management, wishlist, cart, order processing, image uploads, and admin controls.
## Tech Stack

- Node.js + Express
- MongoDB with Mongoose
- JWT authentication (httpOnly cookies)
- Cloudinary (image uploads via Multer)

## Project Structure
server/
├── config/ # Database and Cloudinary configuration
├── controllers/ # Business logic for each route
├── middleware/ # Auth protection, admin checks, file upload handling
├── models/ # Mongoose schemas (User, Product, Cart, Order)
├── Routes/ # API route definitions
├── .env # Environment variables (not committed)
└── server.js # App entry point

## Setup

1. Clone the repository and navigate to the `server` folder:
cd server
npm install


2. Create a `.env` file in `server/` with the following variables:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret    

3. Run the development server:
npm run dev

The API will be available at `http://localhost:5000`.

## API Endpoints

### Auth
- `POST /api/auth/register` — create a new account
- `POST /api/auth/login` — log in
- `POST /api/auth/logout` — log out
- `GET /api/auth/me` — get current logged-in user (protected)

### Products
- `GET /api/products` — list all products (supports `?category=`, `?sort=`, `?search=`)
- `GET /api/products/:id` — get a single product
- `POST /api/products` — create a product (admin only)
- `PUT /api/products/:id` — update a product (admin only)
- `DELETE /api/products/:id` — delete a product (admin only)

### Cart
- `GET /api/cart` — get current user's cart (protected)
- `POST /api/cart/add` — add item to cart (protected)
- `PUT /api/cart/update` — update item quantity (protected)
- `DELETE /api/cart/remove/:productId` — remove item from cart (protected)

### Wishlist
- `GET /api/wishlist` — get current user's wishlist (protected)
- `POST /api/wishlist/toggle/:productId` — add/remove a product from wishlist (protected)

### Orders
- `POST /api/orders` — place an order from current cart (protected)
- `GET /api/orders/my` — get logged-in user's order history (protected)
- `GET /api/orders` — get all orders (admin only)
- `PUT /api/orders/:id/status` — update an order's status (admin only)

## Deployment

### Live API

https://perfo-elite-e5xc.onrender.com

### Test Endpoint

https://perfo-elite-e5xc.onrender.com/api/products

The backend is deployed on Render and connected to:

- MongoDB Atlas
- Cloudinary
- JWT Authentication (httpOnly cookies)

You can verify the deployment by visiting the products endpoint, which returns live product data from the production database.
