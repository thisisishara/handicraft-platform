# Viskam - Sri Lankan Handicraft Marketplace

## 📱 App Overview

**Viskam** is a bilingual (English/Sinhala) mobile marketplace application built with React Native, specifically designed to connect Sri Lankan handicraft artisans with customers. The platform enables traditional craftspeople to sell their authentic handmade products while providing buyers with access to genuine Sri Lankan handicrafts.

### 🎯 Mission
Preserve and promote Sri Lankan traditional crafts by providing artisans with a digital platform to reach customers locally and globally.

---

## 🛠️ Technology Stack

### Core Framework
- **React Native**: Cross-platform mobile development
- **Expo**: Development and deployment platform
- **TypeScript**: Type-safe JavaScript development
- **React 18**: Latest React features and hooks

### Key Dependencies
- **React Navigation**: App navigation and routing
- **React i18next**: Internationalization and localization
- **React Native Safe Area Context**: Safe area handling
- **Expo Vector Icons**: Icon library (MaterialCommunityIcons)

### Development Tools
- **ESLint**: Code linting and style enforcement
- **TypeScript**: Static type checking
- **Expo CLI**: Development and build tools
- **React Native Debugger**: Debugging capabilities

---

## 🏗️ Project Architecture

### Folder Structure
```
viskam-app/
├── app/                    # Screen components (Expo Router structure)
│   ├── (tabs)/            # Tab-based navigation
│   ├── auth/              # Authentication screens
│   ├── buyer/             # Buyer-specific screens
│   ├── seller/            # Seller-specific screens
│   └── index.tsx          # App entry point
├── components/            # Reusable UI components
│   └── ui/               # Custom UI components (Button, Input, etc.)
├── constants/            # App constants and design tokens
├── contexts/             # React Context providers
├── hooks/                # Custom React hooks
├── locales/              # Translation files
├── screens/              # Screen components
└── services/             # API and utility services
```

### State Management
- **React Context**: Global state management
- **AuthContext**: User authentication and role switching
- **CartContext**: Shopping cart functionality
- **Custom Hooks**: Encapsulated business logic

### Design System
- **Consistent Color Palette**: Primary, secondary, background colors
- **Typography Scale**: Standardized font sizes and weights
- **Spacing System**: Consistent spacing values
- **Border Radius**: Unified border radius values
- **Shadow System**: Consistent drop shadows

---

## 👥 User Roles & Features

### 🛒 Buyer Features

#### Navigation & Discovery
- **Shop Browse**: Category-filtered product browsing
- **Search & Filter**: Product search with sorting options
- **Product Details**: Comprehensive product information
- **Shop Profiles**: Individual seller shop pages

#### Shopping Experience
- **Shopping Cart**: Add/remove products, quantity management
- **Checkout Process**: Streamlined purchase flow
- **Order Tracking**: Real-time order status updates
- **Wishlist**: Save products for later

#### Account Management
- **Profile Management**: Personal information and preferences
- **Order History**: Past purchases and tracking
- **Analytics Dashboard**: Personal shopping insights
- **Language Toggle**: English ⇄ Sinhala switching

### 🏪 Seller Features

#### Business Management
- **Product Listing**: Add/edit product information and images
- **Inventory Management**: Stock tracking and updates
- **Order Processing**: Manage incoming orders
- **Shop Profile**: Customize shop appearance and information

#### Analytics & Insights
- **Sales Dashboard**: Revenue and performance metrics
- **Product Analytics**: Best-selling products and views
- **Customer Insights**: Customer interaction data
- **Growth Trends**: Month-over-month comparisons

#### Communication
- **Customer Messages**: Direct communication with buyers
- **Support System**: Help and tutorial resources
- **Order Updates**: Customer notification system

#### Profile & Settings
- **Business Profile**: Shop details and contact information
- **Account Settings**: Personal and business preferences
- **Help Center**: Support documentation and guides

---

## 🌐 Localization & Translation

### Bilingual Support
- **English**: Default language for international users
- **Sinhala (සිංහල)**: Native language support for local users
- **Dynamic Switching**: Real-time language switching
- **Complete Coverage**: All UI elements, messages, and content translated

### Translation Architecture
- **i18next Framework**: Industry-standard localization
- **JSON Translation Files**: Organized translation keys
- **Interpolation Support**: Dynamic content translation
- **Pluralization**: Proper plural form handling

### Translation Coverage
- ✅ Navigation and menus
- ✅ Forms and inputs
- ✅ Product and shop information
- ✅ Error messages and alerts
- ✅ Business analytics and reports
- ✅ User profiles and settings

---

## 📊 Key Features Implemented

### Authentication System
- **Dual Mode Support**: Switch between buyer and seller roles
- **Profile Management**: Comprehensive user profiles
- **Secure Login**: Authentication with role-based access

### E-commerce Functionality
- **Product Management**: Full CRUD operations for products
- **Shopping Cart**: Complete cart functionality
- **Order Management**: End-to-end order processing
- **Payment Integration Ready**: Structured for payment gateway integration

### Business Intelligence
- **Buyer Analytics**: Shopping patterns and spending insights
- **Seller Analytics**: Sales performance and growth metrics
- **Recommendation Engine**: Product recommendations based on user behavior

### AI-Powered Features
- **Smart Shop Generation**: AI-powered automatic shop details generation using Google Gemini
- **Professional Content Creation**: AI generates shop names, descriptions, specialties, and business hours
- **Intelligent Fallback**: Smart fallback system when AI service is unavailable
- **Cultural Context**: AI trained to understand Sri Lankan handicraft traditions

### User Experience
- **Intuitive Navigation**: Tab-based navigation with role switching
- **Responsive Design**: Optimized for various screen sizes
- **Offline Support**: Basic offline functionality
- **Performance Optimized**: Efficient rendering and state management

---

## 🧭 Key Tasks & Navigation Guide

This section outlines the main user journeys and navigation paths for comprehensive testing and understanding of the app's functionality.

### 🔐 Authentication Tasks

#### **Task: User Registration**
- **Navigation**: Launch App → Register Screen
- **Path**: `app/index.tsx` → `app/auth/register.tsx`
- **Screen Component**: `screens/auth/RegisterScreen.tsx`
- **Key Features**: Form validation, role selection (buyer/seller), bilingual support

#### **Task: User Login**
- **Navigation**: Launch App → Login Screen
- **Path**: `app/index.tsx` → `app/auth/login.tsx`
- **Screen Component**: `screens/auth/LoginScreen.tsx`
- **Key Features**: Credential validation, role-based routing, "Remember Me" option

#### **Task: Role Switching**
- **Navigation**: From any authenticated screen → Profile → Switch Role
- **Context**: `contexts/AuthContext.tsx`
- **Key Features**: Seamless role transition, state persistence, maintains user data

### 🛒 Buyer User Journey

#### **Task: Browse Products by Category**
- **Navigation**: Buyer Home → Shop Tab → Category Filter
- **Path**: `app/buyer/home.tsx` → `app/buyer/shop.tsx`
- **Screen Component**: `screens/buyer/ShopScreen.tsx`
- **Key Features**: Category filtering, search functionality, product grid

#### **Task: View Product Details**
- **Navigation**: Shop → Product Card → Product Details
- **Path**: `app/buyer/shop.tsx` → `app/buyer/product-details.tsx`
- **Screen Component**: `screens/buyer/ProductDetailsScreen.tsx`
- **Key Features**: Image gallery, specifications, seller info, add to cart

#### **Task: Manage Shopping Cart**
- **Navigation**: Any Screen → Cart Tab → Cart Management
- **Path**: `app/buyer/cart.tsx`
- **Screen Component**: `screens/buyer/CartScreen.tsx`
- **Context**: `contexts/CartContext.tsx`
- **Key Features**: Quantity adjustment, item removal, price calculation

#### **Task: Complete Purchase**
- **Navigation**: Cart → Checkout → Payment → Confirmation
- **Path**: `app/buyer/cart.tsx` → `app/buyer/checkout.tsx`
- **Screen Component**: `screens/buyer/CheckoutScreen.tsx`
- **Key Features**: Address management, payment selection, order summary

#### **Task: Track Orders**
- **Navigation**: Buyer Home → Orders Tab
- **Path**: `app/buyer/orders.tsx`
- **Screen Component**: `screens/buyer/OrdersScreen.tsx`
- **Key Features**: Order status, tracking information, reorder functionality

#### **Task: View Buyer Analytics**
- **Navigation**: Buyer Home → Analytics Tab
- **Path**: `app/buyer/analytics.tsx`
- **Screen Component**: `screens/buyer/AnalyticsScreen.tsx`
- **Key Features**: Spending insights, purchase history, recommendations

### 🏪 Seller User Journey

#### **Task: Complete Seller Onboarding**
- **Navigation**: First Seller Login → Onboarding Flow
- **Path**: `app/seller/onboarding.tsx`
- **Screen Component**: `screens/seller/OnboardingScreen.tsx`
- **Key Features**: Business setup, AI shop generation, profile completion

#### **Task: AI-Powered Shop Setup**
- **Navigation**: Seller Onboarding → Shop Details → AI Generation
- **Service**: `services/aiService.ts`
- **Config**: `config/aiConfig.ts`
- **Key Features**: Google Gemini integration, automated content generation, fallback options

#### **Task: Update Shop Details**
- **Navigation**: Seller Profile → Edit Shop Details → Update Information
- **Path**: `app/seller/profile.tsx` → Shop Details Section
- **Screen Component**: `screens/seller/ProfileScreen.tsx`
- **Key Features**: Edit shop name, description, specialties, business hours, contact information

#### **Task: Add New Product**
- **Navigation**: Seller Home → Products Tab → Add Product
- **Path**: `app/seller/products.tsx` → `app/seller/add-product.tsx`
- **Screen Component**: `screens/seller/AddProductScreen.tsx`
- **Key Features**: Image upload, product details, inventory management

#### **Task: Manage Products**
- **Navigation**: Seller Home → Products Tab
- **Path**: `app/seller/products.tsx`
- **Screen Component**: `screens/seller/ProductsScreen.tsx`
- **Key Features**: Product listing, edit/delete operations, stock status

#### **Task: Process Orders**
- **Navigation**: Seller Home → Orders Tab
- **Path**: `app/seller/orders.tsx`
- **Screen Component**: `screens/seller/OrdersScreen.tsx`
- **Key Features**: Order management, status updates, customer communication

#### **Task: View Seller Analytics**
- **Navigation**: Seller Home → Analytics Tab
- **Path**: `app/seller/analytics.tsx`
- **Screen Component**: `screens/seller/AnalyticsScreen.tsx`
- **Key Features**: Sales performance, revenue tracking, growth metrics

#### **Task: Customer Support**
- **Navigation**: Seller Home → Support Tab
- **Path**: `app/seller/support.tsx`
- **Screen Component**: `screens/seller/SupportScreen.tsx`
- **Key Features**: Help documentation, contact support, tutorials

### 📱 Cross-Platform Tasks

#### **Task: Language Switching**
- **Navigation**: Any Screen → Profile → Language Settings
- **Service**: `services/i18n.ts`
- **Locale Files**: `locales/en.json`, `locales/si.json`
- **Key Features**: Real-time language switching, complete UI translation

#### **Task: Profile Management**
- **Navigation**: Profile Tab → Profile Details
- **Paths**: 
  - Buyer: `app/buyer/profile-details.tsx`
  - Seller: `app/seller/profile-details.tsx`
- **Screen Components**: 
  - `screens/buyer/ProfileDetailsScreen.tsx`
  - `screens/seller/ProfileDetailsScreen.tsx`
- **Key Features**: Personal information, preferences, account settings

#### **Task: Message Center**
- **Navigation**: Buyer Home → Messages Tab
- **Path**: `app/buyer/messages.tsx`
- **Screen Component**: `screens/buyer/MessagesScreen.tsx`
- **Key Features**: Seller communication, order inquiries, support tickets

#### **Task: Switch Between Buyer and Seller Modes**
- **Navigation**: Profile Tab → Switch Role Button → Confirm Role Change
- **Paths**: 
  - From Buyer: `app/buyer/profile.tsx` → Role Switch → `app/seller/home.tsx`
  - From Seller: `app/seller/profile.tsx` → Role Switch → `app/buyer/home.tsx`
- **Context**: `contexts/AuthContext.tsx`
- **Screen Components**: 
  - `screens/buyer/ProfileScreen.tsx`
  - `screens/seller/ProfileScreen.tsx`
- **Key Features**: 
  - Instant role transition without re-authentication
  - Preserves user session and data
  - Updates navigation tabs and available features
  - Maintains cart data when switching from buyer mode
  - Preserves seller inventory and orders when switching from seller mode
- **Testing Points**:
  - Verify buyer cart persists after switching to seller and back
  - Check seller data remains intact after switching to buyer mode
  - Confirm proper navigation tab updates
  - Test role-specific feature access after switching

### 🧪 Testing Navigation Paths

#### **Critical User Flows for Testing**
1. **Complete Buyer Journey**: Registration → Browse → Add to Cart → Checkout → Track Order
2. **Complete Seller Journey**: Registration → Onboarding → AI Shop Setup → Add Product → Manage Orders
3. **Role Switching Flow**: Login as Buyer → Switch to Seller → Navigate Features → Switch Back
4. **Bilingual Testing**: English Interface → Switch to Sinhala → Test All Features → Switch Back
5. **Cart Persistence**: Add Items → Navigate Away → Return → Verify Cart State
6. **Authentication Flow**: Logout → Login → Verify State Restoration

#### **Navigation Structure Overview**
```
App Root (index.tsx)
├── Authentication
│   ├── Login (auth/login.tsx)
│   └── Register (auth/register.tsx)
├── Buyer Mode
│   ├── Home (buyer/home.tsx)
│   ├── Shop (buyer/shop.tsx)
│   ├── Product Details (buyer/product-details.tsx)
│   ├── Cart (buyer/cart.tsx)
│   ├── Checkout (buyer/checkout.tsx)
│   ├── Orders (buyer/orders.tsx)
│   ├── Messages (buyer/messages.tsx)
│   ├── Analytics (buyer/analytics.tsx)
│   ├── Profile (buyer/profile.tsx)
│   ├── Profile Details (buyer/profile-details.tsx)
│   └── Shop Details (buyer/shop-details.tsx)
└── Seller Mode
    ├── Home (seller/home.tsx)
    ├── Onboarding (seller/onboarding.tsx)
    ├── Products (seller/products.tsx)
    ├── Add Product (seller/add-product.tsx)
    ├── Orders (seller/orders.tsx)
    ├── Analytics (seller/analytics.tsx)
    ├── Support (seller/support.tsx)
    ├── Profile (seller/profile.tsx)
    └── Profile Details (seller/profile-details.tsx)
```

---

## 🎨 Design & UI/UX

### Design Principles
- **Cultural Authenticity**: Reflects Sri Lankan heritage
- **Accessibility**: Inclusive design for all users
- **Simplicity**: Clean, intuitive interface
- **Consistency**: Unified design language throughout

### UI Components
- **Custom Components**: Button, Input, and specialized components
- **Material Icons**: Consistent iconography
- **Typography System**: Readable fonts with proper hierarchy
- **Color System**: Culturally appropriate color palette

### Navigation
- **Bottom Tabs**: Primary navigation method
- **Stack Navigation**: Hierarchical screen navigation
- **Modal Screens**: Overlay screens for specific actions
- **Deep Linking**: Direct access to specific content

---

## 🔧 Development Process

### Code Quality
- **TypeScript**: Type safety and better developer experience
- **ESLint**: Code linting and style consistency
- **Component Architecture**: Reusable and maintainable components
- **Error Handling**: Comprehensive error management

### Testing Strategy
- **Component Testing**: Individual component validation
- **Integration Testing**: Feature workflow testing
- **User Acceptance Testing**: Real user scenario testing
- **Performance Testing**: App performance optimization

### Version Control & Collaboration
- **Git Workflow**: Feature branch development
- **Code Reviews**: Peer review process
- **Documentation**: Comprehensive code documentation
- **Issue Tracking**: Organized development workflow

---

## 📈 Recent Improvements & Fixes

### Translation System Overhaul
- **Complete Localization**: Fixed all hardcoded English strings
- **Dynamic Translation**: Proper interpolation for dynamic content
- **Cultural Adaptation**: Contextually appropriate Sinhala translations
- **User Experience**: Seamless language switching

### Areas Improved
1. **Buyer Shop Screen**: Header, categories, filters, and product listings
2. **Seller Profile Management**: Business and account sections
3. **Order Management**: Status tracking and customer communication
4. **Product Management**: CRUD operations and inventory tracking
5. **Analytics Dashboards**: Business insights and performance metrics

### Technical Debt Resolution
- **Code Standardization**: Consistent coding patterns
- **Performance Optimization**: Efficient state management
- **Error Handling**: Robust error management
- **Documentation**: Updated code documentation

---

## 🚀 Future Development Roadmap

### Phase 1: Core Enhancements
- **Payment Integration**: Multiple payment gateway support
- **Push Notifications**: Real-time order and message notifications
- **Image Optimization**: Better product image handling
- **Search Enhancement**: Advanced search and filtering

### Phase 2: Business Features
- **Multi-vendor Support**: Support for multiple sellers per shop
- **Inventory Management**: Advanced stock tracking
- **Promotion System**: Discount and coupon functionality
- **Review System**: Customer review and rating system

### Phase 3: Growth Features
- **Social Integration**: Social sharing and authentication
- **Advanced Analytics**: Detailed business intelligence
- **Export Market**: International shipping and currency support
- **Mobile App Store**: Publishing to app stores

---

## 💡 Technical Highlights

### Performance
- **Optimized Rendering**: Efficient list virtualization
- **State Management**: Context-based architecture
- **Memory Management**: Proper cleanup and resource management
- **Bundle Size**: Optimized for mobile networks

### Security
- **Authentication**: Secure user authentication
- **Data Validation**: Input sanitization and validation
- **Error Boundaries**: Graceful error handling
- **API Security**: Secure API communication ready

### Scalability
- **Modular Architecture**: Easy feature addition
- **Component Reusability**: DRY principle implementation
- **State Normalization**: Efficient data structure
- **Code Splitting**: Optimized bundle loading

---

## 📞 Contact & Support

This documentation represents the current state of the Viskam app as of December 2024, with comprehensive bilingual support and a robust feature set for both buyers and sellers in the Sri Lankan handicraft marketplace.

---

*Built with ❤️ for preserving Sri Lankan traditional crafts and empowering local artisans.*
