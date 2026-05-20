# ☕ Kopi Kade - Coffee Shop E-Commerce Platform

A modern full-stack e-commerce application for an online coffee shop built with **React**, **Spring Boot**, and **MySQL**. Featuring user authentication, product browsing, shopping cart, order management, customer reviews, and an admin dashboard.

## 🎯 Features

### For Customers
- 🔐 **User Authentication** - Secure login/signup with JWT tokens
- ☕ **Product Catalog** - Browse coffee and treats with filters and search
- 🛒 **Shopping Cart** - Add/remove items and manage quantities
- ❤️ **Wishlist** - Save favorite items for later
- ⭐ **Reviews & Ratings** - Read and write product reviews
- 📦 **Order Tracking** - Track order status and history
- 💳 **Coupon System** - Apply discount codes at checkout
- 👤 **User Profile** - Manage account and view order history

### For Admins
- 📊 **Admin Dashboard** - Manage products, categories, orders, and users
- 📋 **Product Management** - Add, edit, delete products with inventory
- 🎁 **Coupon Management** - Create and manage promotional codes
- ✅ **Order Management** - Approve and track orders
- 💬 **Review Moderation** - Approve/reject customer reviews

## 🛠️ Tech Stack

### Backend
- **Spring Boot 3.4.3** - REST API framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database ORM
- **MySQL** - Database
- **JWT (JJWT)** - Token-based authentication
- **Lombok** - Code generation
- **Validation** - Input validation

### Frontend
- **React 19.2** - UI library
- **Vite** - Build tool (lightning-fast)
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations

### Database
- **MySQL 8.0+** - Relational database

## 📋 Prerequisites

Before running this project, make sure you have:

- **Java 21** - [Download JDK 21](https://www.oracle.com/java/technologies/downloads/#java21)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **MySQL 8.0+** - [Download MySQL](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download Git](https://git-scm.com/)

## 🚀 Quick Start

### Step 1: Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/coffee-app.git
cd coffee-app
```

### Step 2: Setup Database
```sql
CREATE DATABASE kopikade CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 3: Run Backend
```bash
cd backend

# On Windows (PowerShell/CMD)
mvnw.cmd spring-boot:run

# On macOS/Linux
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`

### Step 4: Run Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📂 Project Structure

```
coffee-app/
├── backend/                          # Spring Boot REST API
│   ├── src/
│   │   ├── main/java/lk/kopikade/backend/
│   │   │   ├── controller/          # REST endpoints
│   │   │   ├── service/             # Business logic
│   │   │   ├── repository/          # Database queries
│   │   │   ├── model/               # JPA entities
│   │   │   ├── dto/                 # Data transfer objects
│   │   │   └── security/            # JWT & security config
│   │   └── resources/
│   │       └── application.properties # Database & JWT config
│   └── pom.xml
│
├── frontend/                         # React + Vite app
│   ├── src/
│   │   ├── pages/                   # Page components
│   │   ├── components/              # Reusable components
│   │   ├── store/                   # Zustand stores (auth, cart)
│   │   ├── api/                     # Axios config
│   │   └── assets/                  # Images, fonts
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🔧 Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/kopikade
spring.datasource.username=root
spring.datasource.password=

# JWT Secret (change in production!)
kopikade.jwt.secret=YOUR_SECRET_KEY_HERE
kopikade.jwt.expiration=86400000

# Server Port
server.port=8080
```

### Frontend API Configuration
Edit `frontend/src/api/axios.js` to change API base URL:

```javascript
const baseURL = process.env.VITE_API_BASE_URL || 'http://localhost:8080';
```

## 📖 API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/categories` - Get all categories
- `GET /api/reviews/product/{id}` - Get product reviews
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login user

### Protected Endpoints (Authentication Required)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart` - Update cart
- `DELETE /api/cart/{id}` - Remove from cart
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `POST /api/reviews/{id}` - Submit review
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/{id}` - Add to wishlist

### Admin Endpoints
- `GET /api/admin/products` - Manage products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product
- `GET /api/admin/orders` - Manage orders
- `PUT /api/admin/orders/{id}/status` - Update order status
- `GET /api/admin/reviews` - Manage reviews

## 🚀 Deployment

### Deploy Frontend to Vercel
1. Push code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_BASE_URL=your-backend-url`
5. Deploy!

### Deploy Backend to Render
1. Push code to GitHub
2. Go to [Render](https://render.com) and create new Web Service
3. Connect GitHub repository
4. Set root directory to `backend`
5. Add environment variables for database and JWT
6. Deploy!

### Database Hosting
- Use [PlanetScale](https://planetscale.com/) for MySQL (free tier available)
- Or [AWS RDS](https://aws.amazon.com/rds/) (12-month free tier)

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
mvnw test
```

### Run Frontend Tests
```bash
cd frontend
npm run test
```

## 📝 Build for Production

### Build Backend
```bash
cd backend
mvnw clean package
```

### Build Frontend
```bash
cd frontend
npm run build
```

Production-ready files will be in `frontend/dist/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💡 Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Loyalty rewards program
- [ ] Delivery tracking with map
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

## 📞 Support

For issues or questions, please open an [issue](https://github.com/YOUR_USERNAME/coffee-app/issues) on GitHub.

## 👨‍💻 Author

Created with ☕ by [Your Name]

---

**Happy Brewing! ☕**
