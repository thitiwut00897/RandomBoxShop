# 🐾 Pet Random Box Shop

A modern React web application featuring a pet random box shopping system with authentication, payment processing, and a loot box feature with Line notifications.

## 🚀 Features

### 🛍️ Shopping System
- Product catalog with pet random boxes
- Shopping cart functionality
- Secure checkout process
- Payment integration with Stripe

### 🔐 Authentication
- Social login (Facebook, Discord, Google)
- User session management
- Protected routes

### 🎰 Loot Box Feature
- Random item spinner
- Different rarity levels
- Line notifications for wins
- Pet collection system

### 📱 Line Notifications
- Purchase confirmations
- Pet box opening notifications
- Loot box win notifications

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **Authentication**: Firebase Auth
- **Payments**: Stripe
- **Notifications**: Line Notify API
- **UI Components**: Lucide React Icons

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx        # Navigation header
│   ├── Login.tsx         # Authentication component
│   ├── ProductCard.tsx   # Product display card
│   ├── Cart.tsx          # Shopping cart
│   └── Spinner.tsx       # Loot box wheel
├── contexts/
│   ├── AuthContext.tsx   # Authentication state
│   ├── CartContext.tsx   # Shopping cart state
│   └── SpinnerContext.tsx # Loot box state
├── pages/
│   ├── Home.tsx          # Landing page
│   └── Products.tsx      # Product catalog
├── services/
│   └── lineNotification.ts # Line notification service
├── data/
│   ├── products.ts       # Product data
│   └── pets.ts           # Pet collection data
└── types/
    └── index.ts          # TypeScript definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shop
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key
REACT_APP_LINE_NOTIFY_TOKEN=your_line_token
REACT_APP_FIREBASE_CONFIG=your_firebase_config
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 🎮 How to Use

### Authentication
1. Click "Login" in the header
2. Choose your preferred social login method
3. Complete the authentication process

### Shopping
1. Browse pet random boxes on the home page or products page
2. Add items to your cart
3. Proceed to checkout
4. Complete payment with Stripe

### Loot Box System
1. Navigate to the Loot Box page
2. Click "Spin the Loot Box!" button
3. Wait for the spinning animation
4. Collect your random pet reward
5. Receive Line notification of your win

### Pet Collection
1. Purchase pet random boxes
2. After successful purchase, you'll be redirected to see your pets
3. View rarity breakdown and individual pets
4. Collect pets from Common to Prismatic rarity

## 🎯 Pet Rarity System

- **Common** (40%): Basic pets with simple designs
- **Uncommon** (25%): Slightly more unique pets
- **Rare** (20%): Special pets with unique features
- **Legendary** (10%): Highly sought-after pets
- **Mythical** (3%): Extremely rare pets
- **Divine** (1.5%): Divine pets with special powers
- **Prismatic** (0.5%): The rarest pets with rainbow effects

## 🔧 Configuration

### Stripe Setup
1. Create a Stripe account
2. Get your publishable key
3. Add it to your environment variables

### Line Notify Setup
1. Create a Line Notify account
2. Generate a token
3. Add it to your environment variables

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication
3. Add your Firebase config to environment variables

## 📱 Features in Detail

### Pet Random Boxes
- **10 Pets Box**: $99.99 - Guaranteed 1+ Rare pets
- **25 Pets Box**: $199.99 - Guaranteed 3+ Rare pets
- **50 Pets Box**: $349.99 - Guaranteed 5+ Rare pets
- **100 Pets Box**: $599.99 - Guaranteed 10+ Rare pets

### Loot Box System
- Random pet rewards
- Different rarity chances
- Instant Line notifications
- Collection tracking

### Line Notifications
- Purchase confirmations
- Pet box opening results
- Loot box wins
- Detailed pet information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

1. **Tailwind CSS not working**: Make sure PostCSS is properly configured
2. **Authentication errors**: Check Firebase configuration
3. **Payment issues**: Verify Stripe keys
4. **Line notifications not working**: Check Line Notify token

### Build Issues

If you encounter build errors:
```bash
npm run build
```

For development:
```bash
npm start
```

## 📞 Support

For support and questions, please open an issue in the repository.
# RandomBoxShop
