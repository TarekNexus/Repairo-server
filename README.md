# PharmaPlus 💊
**"Your Trusted Online Medicine Shop"**

---

## Project Overview
PharmaPlus is a full-stack e-commerce web application designed for purchasing over-the-counter (OTC) medicines. Customers can browse medicines, add them to their cart, and place orders. Sellers manage their medicine inventory and fulfill orders, while admins oversee the platform and manage all users and listings.

---

## Roles & Permissions

| Role     | Description                     | Key Permissions                                           |
|---------|---------------------------------|----------------------------------------------------------|
| Customer | Users who purchase medicines    | Browse, add to cart, place orders, track status, leave reviews |
| Seller   | Medicine vendors / pharmacies   | Manage inventory, view orders, update order status      |
| Admin    | Platform moderators             | Manage all inventory, users, oversee orders            |



---

## Tech Stack

- **Backend:** Node.js, Express.js, PostgresSQL,Prisma,NeonDB,Better Auth

---

tarek

## Pages & Routes

### Public Routes
| Route         | Page             | Description                  |
|---------------|-----------------|------------------------------|
| `/`           | Home            | Hero section, categories, featured medicines |
| `/shop`       | Shop            | Browse all medicines with filters |
| `/shop/:id`   | Medicine Details| View detailed info, add to cart |
| `/login`      | Login           | Login form                  |
| `/register`   | Register        | Registration form           |

### Customer Routes (Private)
| Route         | Page             | Description                  |
|---------------|-----------------|------------------------------|
| `/cart`       | Cart             | View cart items             |
| `/checkout`   | Checkout         | Shipping address            |
| `/orders`     | My Orders        | Order history               |
| `/orders/:id` | Order Details    | View items, status          |
| `/profile`    | Profile          | Edit user info              |

### Seller Routes (Private)
| Route                 | Page       | Description                 |
|-----------------------|-----------|-----------------------------|
| `/seller/dashboard`   | Dashboard | Orders overview, stats      |
| `/seller/medicines`   | Inventory | Manage medicines            |
| `/seller/orders`      | Orders    | Update order status         |

### Admin Routes (Private)
| Route                  | Page       | Description                |
|------------------------|-----------|----------------------------|
| `/admin`               | Dashboard | Platform statistics         |
| `/admin/users`         | Users     | Manage users               |
| `/admin/orders`        | Orders    | View all orders            |
| `/admin/categories`    | Categories| Manage categories          |

---

## Database Tables
- **Users:** Store user information and authentication details
- **Categories:** Medicine categories
- **Medicines:** Product inventory (linked to seller)
- **Orders:** Customer orders with items and status
- **Reviews:** Customer reviews for medicines



---

## API Endpoints

### Authentication
| Method | Endpoint             | Description           |
|--------|---------------------|---------------------|
| POST   | `/api/auth/register` | Register new user   |
| POST   | `/api/auth/login`    | Login user          |
| GET    | `/api/auth/me`       | Get current user    |

### Medicines (Public)
| Method | Endpoint             | Description                  |
|--------|---------------------|------------------------------|
| GET    | `/api/medicines`    | Get all medicines with filters |
| GET    | `/api/medicines/:id`| Get medicine details         |
| GET    | `/api/categories`   | Get all categories           |

### Orders
| Method | Endpoint             | Description                  |
|--------|---------------------|------------------------------|
| POST   | `/api/orders`        | Create new order             |
| GET    | `/api/orders`        | Get user's orders            |
| GET    | `/api/orders/:id`    | Get order details            |

### Seller Management
| Method | Endpoint                     | Description             |
|--------|------------------------------|------------------------|
| POST   | `/api/seller/medicines`      | Add medicine           |
| PUT    | `/api/seller/medicines/:id`  | Update medicine        |
| DELETE | `/api/seller/medicines/:id`  | Remove medicine        |
| GET    | `/api/seller/orders`          | Get seller's orders    |
| PATCH  | `/api/seller/orders/:id`      | Update order status    |

### Admin
| Method | Endpoint                     | Description             |
|--------|------------------------------|------------------------|
| GET    | `/api/admin/users`           | Get all users           |
| PATCH  | `/api/admin/users/:id`       | Update user status      |

---

## Installation & Setup

```bash
# Clone the repository
git clone <https://github.com/TarekNexus/PharmaPlus-Servert>
cd PharmaPlus-Server

# Install dependencies
npm install

#create a .env 
them follow .example.env
# Run the development server
npm run dev
