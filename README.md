# Oska Handicrafts - Mobile Ecommerce App

A React Native mobile app for buying and selling traditional Sri Lankan handicrafts, built with Expo and featuring multilingual support (English/Sinhala).

## Features

### 🔐 Authentication
- **Email/Password Login**: Standard authentication with dummy validation
- **Google OAuth**: Dummy Google sign-in implementation
- **User Registration**: Complete onboarding with personal details
- **OTP Verification**: Dummy SMS OTP verification (accepts any 4-digit code)
- **Language Selection**: Choose between English and Sinhala during signup

### 👥 User Roles
- **Buyer Mode**: Browse and purchase handicrafts
- **Seller Mode**: List and manage handicraft products
- **Dynamic Role Switching**: Switch between buyer/seller modes anytime
- **Role Persistence**: Last selected mode becomes default

### 🌐 Multilingual Support
- **English**: Full app support
- **Sinhala**: Complete translation with Unicode support
- **Runtime Language Switching**: Change language instantly
- **Localized UI**: All text elements translated

### 🛍️ Buyer Features
- **Product Browsing**: Discover handicrafts with search and categories
- **Product Details**: View stories, ratings, seller info, location
- **Order Tracking**: Track purchases with status updates
- **Order History**: View past orders with reorder option

### 🏪 Seller Features
- **Product Listing**: Add handicrafts with photos and stories
- **Product Management**: Edit, delete, and manage inventory
- **Story Emphasis**: Highlight craftsmanship and cultural significance
- **Order Management**: View and process customer orders

## Technology Stack

- **Frontend**: React Native with Expo SDK 53
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context API
- **Authentication**: Custom auth service with secure storage
- **Storage**: Expo SecureStore + AsyncStorage
- **Internationalization**: react-i18next
- **UI Components**: Custom shadcn-style components
- **Language**: TypeScript

## Project Structure

```
oska-handicraft/
├── app/                    # Expo Router pages
│   ├── auth/              # Authentication screens
│   ├── buyer/             # Buyer mode screens
│   ├── seller/            # Seller mode screens
│   └── _layout.tsx        # Root layout with providers
├── components/            # Reusable UI components
│   └── ui/               # Base UI components (Button, Input)
├── contexts/             # React Context providers
│   └── AuthContext.tsx   # Authentication state management
├── locales/              # Translation files
│   ├── en.json           # English translations
│   └── si.json           # Sinhala translations
├── screens/              # Screen components
│   ├── auth/             # Authentication screens
│   ├── buyer/            # Buyer screens
│   └── seller/           # Seller screens
└── services/             # Business logic
    ├── authService.ts    # Authentication service
    └── i18n.ts          # Internationalization setup
```

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- iOS Simulator/Android Emulator or Expo Go app

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd oska-handicraft
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on device**:
   - Scan the QR code with Expo Go app
   - Or press 'i' for iOS simulator
   - Or press 'a' for Android emulator

## Demo Credentials

Since this is a prototype with dummy authentication:

### Login
- **Email**: Any valid email format
- **Password**: Any password (min 6 characters)

### OTP Verification
- **OTP**: Any 4-digit number (e.g., 1234)

### Google OAuth
- Automatically creates a demo account

## Key Features Walkthrough

### 🚀 User Onboarding
1. **Registration**: Users provide personal details and select default mode
2. **Language Selection**: Choose between English/Sinhala
3. **OTP Verification**: Verify mobile number with dummy OTP
4. **Mode Selection**: Choose starting as buyer or seller

### 🔄 Role Switching
- Dashboard provides easy mode switching
- Settings allow permanent role changes
- UI adapts based on current mode

### 🛒 Buyer Experience
- **Browse Products**: View handicrafts with stories and seller info
- **Search & Filter**: Find specific items by category
- **Product Details**: Rich product information with cultural context
- **Order Management**: Track purchases and delivery status

### 🏺 Seller Experience
- **Add Products**: Create listings with stories and photos
- **Product Stories**: Emphasize craftsmanship and cultural significance
- **Inventory Management**: Edit and manage product listings
- **Order Processing**: View and manage customer orders

## Localization

### Supported Languages
- **English (en)**: Default language
- **Sinhala (si)**: Full Unicode support with proper text rendering

### Adding New Languages
1. Create translation file in `locales/[lang].json`
2. Add language option in registration form
3. Update language switching logic

## UI Design

### Design Philosophy
- **Minimal & Clean**: shadcn-inspired design system
- **Accessibility**: High contrast and readable typography
- **Mobile-First**: Optimized for smartphone usage
- **Cultural Sensitivity**: Respectful representation of Sri Lankan crafts

### Color Scheme
- **Primary**: Blue (#3B82F6) - Trust and reliability
- **Success**: Green (#059669) - Financial transactions
- **Warning**: Amber (#F59E0B) - Status indicators
- **Gray Scale**: Modern neutral palette

## Data Structure

### User Model
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  language: 'en' | 'si';
  defaultMode: 'buyer' | 'seller';
  currentMode: 'buyer' | 'seller';
}
```

### Product Model (Mock)
```typescript
interface Product {
  id: string;
  name: string;
  price: string;
  seller: string;
  rating: number;
  image: string;
  story: string;
  location: string;
  category?: string;
}
```

## Future Enhancements

### Phase 1 - Core Features
- [ ] Real backend API integration
- [ ] Actual payment processing
- [ ] Real image upload functionality
- [ ] Push notifications

### Phase 2 - Advanced Features
- [ ] In-app messaging between buyers/sellers
- [ ] Review and rating system
- [ ] Advanced search with filters
- [ ] Wishlist functionality

### Phase 3 - Business Features
- [ ] Analytics dashboard for sellers
- [ ] Commission tracking
- [ ] Inventory management
- [ ] Multi-language customer support

## Contributing

This is a prototype demonstration app. For production use:

1. Replace dummy authentication with real backend
2. Implement actual payment processing
3. Add proper error handling and validation
4. Set up real-time data synchronization
5. Add comprehensive testing

## Market Research Integration

This prototype is built based on comprehensive market research showing:
- **High demand** for local language interfaces (63.3% preference)
- **Story-driven** product emphasis (4.14/5 importance)
- **Secure payment** priorities (4.20/5 importance) 
- **Step-by-step guidance** needs for sellers
- **Mobile wallet** payment preferences

## License

This is a prototype project for demonstration purposes.

---

## Demo Flow

1. **Launch App** → Auto-redirects to login
2. **Register** → Fill details, select language & mode, verify OTP
3. **Dashboard** → Role-specific quick actions
4. **Buyer Mode** → Browse products, view details, track orders
5. **Seller Mode** → Add products, manage listings, view orders
6. **Settings** → Switch roles, change language, logout

**Note**: All authentication and data storage is local/dummy for prototype purposes.