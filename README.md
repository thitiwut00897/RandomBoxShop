# 🐾 RandomBoxShop - Pet Collection Platform

A modern React-based e-commerce platform for collecting random pet boxes from the Grow a Garden game. Users can purchase mystery boxes containing random pets with different rarity levels, manage their collection, and receive instant notifications.

## ✨ Features

### 🎁 Pet Box System
- **Mystery Boxes**: Purchase boxes containing 1 random pet each
- **Rarity System**: 8 different rarity levels (Common to Prismatic)
- **Guaranteed Rare Finds**: Every box contains pets with guaranteed rarity
- **Real Game Integration**: Pets sourced from official Grow a Garden API

### 🛒 E-commerce Features
- **Shopping Cart**: Add/remove items, quantity management
- **Secure Payments**: Stripe integration for payment processing
- **Order Management**: Track order status and history
- **User Authentication**: Auth0 integration for secure login

### 🎯 User Experience
- **Pet Collection**: View and manage your pet collection
- **Search & Filter**: Find pets by name, description, or rarity
- **Line Notifications**: Instant notifications when opening boxes
- **Responsive Design**: Beautiful UI that works on all devices
- **Loading States**: Smooth user experience with loading indicators

### 🎨 Modern UI/UX
- **Tailwind CSS**: Modern, responsive styling
- **Lucide Icons**: Beautiful iconography
- **Toast Notifications**: User feedback with react-hot-toast
- **Gradient Design**: Eye-catching visual design

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **Authentication**: Auth0
- **Payments**: Stripe
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Build Tool**: Create React App

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd RandomBoxShop
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Auth0 Configuration
REACT_APP_AUTH0_DOMAIN=your-auth0-domain
REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
REACT_APP_AUTH0_CALLBACK_URL=http://localhost:3000

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# API Configuration (if using external APIs)
REACT_APP_API_BASE_URL=your-api-base-url
```

### 4. Start Development Server
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Cart.tsx        # Shopping cart component
│   ├── Header.tsx      # Navigation header
│   ├── Login.tsx       # Authentication component
│   ├── PetBoxCard.tsx  # Pet box display card
│   ├── ProductCard.tsx # Product display card
│   └── Spinner.tsx     # Loading spinner
├── contexts/           # React context providers
│   ├── AuthContext.tsx # Authentication state
│   ├── BagContext.tsx  # User's pet collection
│   ├── CartContext.tsx # Shopping cart state
│   └── SpinnerContext.tsx # Loading state management
├── data/              # Static data files
│   ├── pets.ts        # Pet data
│   └── products.ts    # Product catalog
├── pages/             # Main application pages
│   ├── Bag.tsx        # User's pet collection
│   ├── Home.tsx       # Landing page
│   ├── Payment.tsx    # Payment processing
│   └── Products.tsx   # Product catalog
├── services/          # API and external services
│   ├── lineNotification.ts # Line notification service
│   └── petService.ts  # Pet API service
└── types/             # TypeScript type definitions
    └── index.ts       # Main type definitions
```

## 🎮 How to Use

### 1. Getting Started
- Visit the homepage to see featured pet boxes
- Browse available products in the Products section
- Create an account or log in using Auth0

### 2. Purchasing Pet Boxes
- Add pet boxes to your cart
- Proceed to checkout with Stripe payment
- Receive instant Line notifications when boxes are opened

### 3. Managing Your Collection
- View your pet collection in the Bag section
- Search and filter pets by rarity
- Track your collection progress

### 4. Features Overview
- **Home**: Featured boxes and pet gallery
- **Products**: Browse all available pet boxes
- **Cart**: Manage your shopping cart
- **Bag**: View your pet collection
- **Payment**: Secure checkout process

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App

## 🎨 Customization

### Styling
The project uses Tailwind CSS for styling. You can customize:
- Colors and themes in `tailwind.config.js`
- Component styles in individual component files
- Global styles in `src/index.css`

### Adding New Features
- **New Pet Types**: Add to `src/data/pets.ts`
- **New Products**: Add to `src/data/products.ts`
- **New Pages**: Create in `src/pages/` and add routes in `App.tsx`
- **New Components**: Create in `src/components/`

## 🔒 Security Features

- **Authentication**: Secure user authentication with Auth0
- **Payment Security**: PCI-compliant payments with Stripe
- **Environment Variables**: Sensitive data stored in environment variables
- **Type Safety**: Full TypeScript implementation

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Contact the development team

## 🎯 Roadmap

- [ ] Add more pet categories
- [ ] Implement trading system
- [ ] Add social features
- [ ] Mobile app development
- [ ] Advanced analytics dashboard

---

**Happy Pet Collecting! 🐾✨**
