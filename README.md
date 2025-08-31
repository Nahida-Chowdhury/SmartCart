# SmartCart - E-Commerce Platform

SmartCart is a modern, full-stack e-commerce solution built with React.js and Laravel, designed specifically for small to medium-sized businesses looking to establish an online presence.

## 🌟 Features

### Core Features
- **User Authentication** - Secure registration and login system
- **Product Catalog** - Browse products by categories and brands
- **Shopping Cart** - Persistent cart with AJAX updates
- **Checkout Process** - Secure Stripe payment integration
- **Order Management** - Track order status and history
- **Admin Dashboard** - Complete CRUD operations for products, categories, and orders
- **Responsive Design** - Mobile-first approach for all devices

### Advanced Features
- **Stripe Payment Integration** - Secure payment processing
- **Email Verification** - Account confirmation system
- **Product Search & Filtering** - Find products quickly
- **Wishlist Functionality** - Save favorite items for later
- **Product Reviews & Ratings** - Customer feedback system

## 🛠️ Technology Stack

### Frontend
- **React.js** - Component-based UI library
- **React Router** - Navigation and routing
- **Axios** - HTTP client for API calls
- **Bootstrap** - Responsive CSS framework
- **React Bootstrap Icons** - Icon library

### Backend
- **Laravel** - PHP web framework
- **MySQL** - Relational database
- **Stripe API** - Payment processing
- **Laravel Passport** - API authentication

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- PHP (v8.0 or higher)
- Composer
- MySQL (v5.7 or higher)

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/your-username/smartcart.git
cd smartcart/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your API URL
REACT_APP_API_URL=http://localhost:8000/api

# Start development server
npm start
```

### Backend Setup
```bash
# Navigate to backend directory
cd ../backend

# Install dependencies
composer install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
DB_DATABASE=smartcart
DB_USERNAME=root
DB_PASSWORD=

# Run migrations
php artisan migrate

# Seed database with sample data
php artisan db:seed

# Generate Passport keys
php artisan passport:install

# Start development server
php artisan serve
```

## 🚀 Usage

### For Customers
1. **Browse Products** - Visit the shop to see all available products
2. **Create Account** - Register for a new account
3. **Add to Cart** - Select products and add them to your shopping cart
4. **Checkout** - Proceed to checkout and complete your order
5. **Track Orders** - View order history and status in your account

### For Administrators
1. **Manage Products** - Add, edit, or remove products from the catalog
2. **Handle Orders** - Update order status and track fulfillment
3. **Manage Categories** - Organize products into categories and brands
4. **View Analytics** - Monitor sales and customer activity


### Development Guidelines
- Follow PSR-12 coding standards for PHP
- Use ESLint and Prettier for JavaScript code formatting
- Write tests for new features
- Update documentation for any changes


## 🙏 Acknowledgments

- Icons by [React Bootstrap Icons](https://github.com/ismamz/react-bootstrap-icons)
- UI components based on [Bootstrap](https://getbootstrap.com/)
- Payment processing by [Stripe](https://stripe.com/)


This project is actively maintained. We're working on adding new features and improving performance.

---
