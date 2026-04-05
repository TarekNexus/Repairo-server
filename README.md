# Repairoe – Home Service Booking Platform (Backend)


## Project Overview
Repairo is a full-stack home service booking platform where customers can find and book local service providers such as electricians, plumbers, AC mechanics, cleaners, and WiFi technicians.  

- Customers can browse services, book providers, pay online via  **Stripe**, and track their bookings.  
- Providers can manage their services and bookings through their dashboard.  
- Admins can oversee the platform.

---

## Roles & Permissions

| Role              | Description                     | Key Permissions                          |
|------------------|---------------------------------|------------------------------------------|
| Customer          | Users booking services          | Browse, book, pay, track, review         |
| Service Provider  | Providers offering services     | Manage services, view bookings, update status |
| Admin             | Platform overseer               | Manage users, services, categories, bookings |

---

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS, TypeScript  
- **Backend:** Node.js, Express.js ,TypeScript  
- **Database:** PostgreSQL, Prisma ORM  
- **Authentication:** JWT / BetterAuth  
- **Payment:** SSLCommerz, Stripe  
- **Deployment:** Vercel / Render / Railway  

---

## Features

### Public Features
- Browse all services  
- Search and filter by category, price, location  
- View service details  

### Customer Features
- Register/Login  
- Book services  
- Online payment  
- Track booking status  
- Booking history  
- Manage profile  

### Provider Features
- Register/Login  
- Add/Edit/Remove services  
- Manage stock/availability  
- View incoming bookings  
- Update booking status  

### Admin Features
- Manage all users  
- Ban/unban providers  
- Manage service categories  
- View all bookings  

---

## Pages & Routes

### Public
- `/` - Home  
- `/services` - Browse services  
- `/login` - Login  
- `/register` - Register  

### Customer
- `/checkout` - Booking & payment  
- `/profile` - Manage profile  

### Provider
- `/provider/dashboard`  
- `/provider/services`  
- `/provider/bookings`  

### Admin
- `/admin`  
- `/admin/users`  
- `/admin/categories`  
- `/admin/bookings`  

---

## Database Tables

- **users:** `id, name, email, password, role, createdAt`  
- **serviceCategories:** `id, name, description`  
- **services:** `id, title, description, categoryId, price, image, providerId, availability, createdAt`  
- **bookings:** `id, customerId, serviceId, providerId, date, address, phone, paymentStatus, bookingStatus`  
- **reviews:** `id, serviceId, customerId, rating, comment, createdAt`  
- **payments:** `id, bookingId, amount, paymentMethod, status, transactionId`  

---

## API Endpoints

### Authentication
- `POST /api/auth/register`  
- `POST /api/auth/login`  
- `GET /api/auth/me`  

### Services
- `GET /api/services`  
- `GET /api/services/:id`  
- `GET /api/categories`  

### Bookings
- `POST /api/bookings`  
- `GET /api/bookings` (user-specific)  
- `GET /api/bookings/:id`  

### Provider Management
- `POST /api/provider/services`  
- `PUT /api/provider/services/:id`  
- `DELETE /api/provider/services/:id`  
- `GET /api/provider/bookings`  
- `PATCH /api/provider/bookings/:id`  

### Admin
- `GET /api/admin/users`  
- `PATCH /api/admin/users/:id`  
- `GET /api/admin/services`  
- `PATCH /api/admin/services/:id`  
- `GET /api/admin/bookings`  

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/TarekNexus/Repairo-server
cd Repairo-server
create .env and follow example.env