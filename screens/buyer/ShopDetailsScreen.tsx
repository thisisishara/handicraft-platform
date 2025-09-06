import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Design';
import { useCart } from '../../contexts/CartContext';

// Mock shop data
const mockShop = {
  id: 'seller1',
  name: 'Kamala\'s Clay Works',
  ownerName: 'Kamala Perera',
  description: 'Traditional clay pottery made with love and expertise passed down through generations. We specialize in handcrafted clay pots, vases, and decorative items that bring authentic Sri Lankan craftsmanship to your home.',
  location: 'Kandy, Sri Lanka',
  established: '2015',
  rating: 4.8,
  totalReviews: 89,
  totalProducts: 24,
  totalSales: 456,
  responseTime: '< 1 hour',
  categories: ['Pottery', 'Clay Items', 'Traditional Crafts'],
  coverImage: '🏺',
  contactEmail: 'kamala@clayworks.lk',
  contactPhone: '+94 77 123 4567',
  businessHours: 'Mon-Sat: 8:00 AM - 6:00 PM',
  shippingInfo: 'Free shipping on orders over Rs. 2,000',
  returnPolicy: '7 days return policy',
  certifications: ['Authentic Craft Verified', 'Quality Assured'],
};

const mockProducts = [
  {
    id: 'prod1',
    name: 'Traditional Clay Pot',
    price: 2500,
    image: '🏺',
    rating: 4.8,
    reviews: 45,
    inStock: true,
  },
  {
    id: 'prod2',
    name: 'Water Storage Jar',
    price: 3200,
    image: '🏺',
    rating: 4.9,
    reviews: 32,
    inStock: true,
  },
  {
    id: 'prod3',
    name: 'Decorative Vase',
    price: 1800,
    image: '🏺',
    rating: 4.7,
    reviews: 28,
    inStock: false,
  },
  {
    id: 'prod4',
    name: 'Clay Serving Bowl',
    price: 1200,
    image: '🏺',
    rating: 4.6,
    reviews: 19,
    inStock: true,
  },
];

const mockReviews = [
  {
    id: 'rev1',
    userName: 'Saman Perera',
    rating: 5,
    date: '2024-08-15',
    comment: 'Amazing quality pottery! Very authentic and well-made. The clay pot I bought cooks rice perfectly.',
    productName: 'Traditional Clay Pot',
  },
  {
    id: 'rev2',
    userName: 'Nimal Silva',
    rating: 4,
    date: '2024-08-10',
    comment: 'Good service and quality products. Kamala is very responsive and helpful.',
    productName: 'Water Storage Jar',
  },
  {
    id: 'rev3',
    userName: 'Kanchana Fernando',
    rating: 5,
    date: '2024-08-05',
    comment: 'Excellent craftsmanship! Highly recommend this shop for authentic Sri Lankan pottery.',
    productName: 'Decorative Vase',
  },
];

export default function ShopDetailsScreen() {
  const { t } = useTranslation();
  const { totalItems } = useCart();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  
  const [selectedTab, setSelectedTab] = useState('products');
  const [sortBy, setSortBy] = useState('featured');

  const shopId = params.id as string;
  const shopName = params.name as string;
  const shop = mockShop; // In real app, fetch by ID

  const sortOptions = [
    { id: 'featured', name: 'Featured' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Rating' },
    { id: 'newest', name: 'Newest' },
  ];

  const getSortedProducts = () => {
    let sorted = [...mockProducts];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        sorted.reverse();
        break;
      default:
        break;
    }
    return sorted;
  };

  const handleProductPress = (product: any) => {
    router.push(`/buyer/product-details?id=${product.id}`);
  };

  const handleContactShop = () => {
    router.push(`/buyer/messages?sellerId=${shop.id}&sellerName=${encodeURIComponent(shop.ownerName)}`);
  };

  const renderProduct = ({ item: product }: { item: any }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(product)}
    >
      <View style={styles.productImageContainer}>
        <Text style={styles.productEmoji}>{product.image}</Text>
        {!product.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <View style={styles.productRating}>
          <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.reviewsText}>({product.reviews})</Text>
        </View>
        <Text style={styles.productPrice}>Rs. {product.price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderReview = (review: any) => (
    <View key={review.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUserInfo}>
          <View style={styles.reviewAvatar}>
            <Text style={styles.reviewAvatarText}>{review.userName.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.reviewUserName}>{review.userName}</Text>
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        </View>
        <View style={styles.reviewRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <MaterialCommunityIcons
              key={star}
              name={star <= review.rating ? 'star' : 'star-outline'}
              size={14}
              color="#F59E0B"
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
      <Text style={styles.reviewProductName}>{t('buyer.shopDetails.product')}: {review.productName}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{shop.name}</Text>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => router.push('/buyer/cart')}
        >
          <MaterialCommunityIcons name="cart" size={24} color="#6B7280" />
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {/* Shop Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.shopImageContainer}>
            <Text style={styles.shopEmoji}>{shop.coverImage}</Text>
          </View>
          <View style={styles.shopInfo}>
            <Text style={styles.shopName}>{shop.name}</Text>
            <Text style={styles.ownerName}>by {shop.ownerName}</Text>
            <Text style={styles.location}>📍 {shop.location}</Text>
            
            <View style={styles.shopStats}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
                <Text style={styles.statText}>{shop.rating} ({t('buyer.shopDetails.reviewsCount', { count: shop.totalReviews })})</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="package-variant" size={16} color="#6B7280" />
                <Text style={styles.statText}>{t('buyer.shopDetails.productsCount', { count: shop.totalProducts })}</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="clock" size={16} color="#6B7280" />
                <Text style={styles.statText}>{t('buyer.shopDetails.response')}: {shop.responseTime}</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.contactButton} onPress={handleContactShop}>
                <MaterialCommunityIcons name="message-text" size={16} color="#FFFFFF" />
                <Text style={styles.contactButtonText}>{t('buyer.shopDetails.contactShop')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.followButton}>
                <MaterialCommunityIcons name="heart-outline" size={16} color="#3B82F6" />
                <Text style={styles.followButtonText}>{t('buyer.shopDetails.follow')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Shop Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionTitle}>{t('buyer.shopDetails.aboutThisShop')}</Text>
          <Text style={styles.description}>{shop.description}</Text>
          
          <View style={styles.shopDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('buyer.shopDetails.established')}:</Text>
              <Text style={styles.detailValue}>{shop.established}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('buyer.shopDetails.businessHours')}:</Text>
              <Text style={styles.detailValue}>{shop.businessHours}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('buyer.shopDetails.shipping')}:</Text>
              <Text style={styles.detailValue}>{shop.shippingInfo}</Text>
            </View>
          </View>

          <View style={styles.categoriesContainer}>
            <Text style={styles.categoriesTitle}>{t('buyer.shopDetails.categories')}:</Text>
            <View style={styles.categories}>
              {shop.categories.map((category, index) => (
                <View key={index} style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'products' && styles.activeTab]}
            onPress={() => setSelectedTab('products')}
          >
            <Text style={[styles.tabText, selectedTab === 'products' && styles.activeTabText]}>
              {t('buyer.shopDetails.productsTab', { count: mockProducts.length })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'reviews' && styles.activeTab]}
            onPress={() => setSelectedTab('reviews')}
          >
            <Text style={[styles.tabText, selectedTab === 'reviews' && styles.activeTabText]}>
              {t('buyer.shopDetails.reviewsTab', { count: mockReviews.length })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'info' && styles.activeTab]}
            onPress={() => setSelectedTab('info')}
          >
            <Text style={[styles.tabText, selectedTab === 'info' && styles.activeTabText]}>
              Info
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {selectedTab === 'products' && (
            <View>
              {/* Sort Options */}
              <View style={styles.sortContainer}>
                <Text style={styles.sortLabel}>Sort by:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortOptions}>
                  {sortOptions.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.sortOption,
                        sortBy === option.id && styles.selectedSortOption
                      ]}
                      onPress={() => setSortBy(option.id)}
                    >
                      <Text style={[
                        styles.sortOptionText,
                        sortBy === option.id && styles.selectedSortOptionText
                      ]}>
                        {option.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Products Grid */}
              <FlatList
                data={getSortedProducts()}
                renderItem={renderProduct}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={styles.productsGrid}
                columnWrapperStyle={styles.productsRow}
              />
            </View>
          )}

          {selectedTab === 'reviews' && (
            <View style={styles.reviewsContainer}>
              <View style={styles.reviewsHeader}>
                <Text style={styles.reviewsTitle}>{t('buyer.shopDetails.customerReviews')}</Text>
                <View style={styles.overallRating}>
                  <Text style={styles.overallRatingText}>{shop.rating}</Text>
                  <View style={styles.overallStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <MaterialCommunityIcons
                        key={star}
                        name={star <= Math.floor(shop.rating) ? 'star' : 'star-outline'}
                        size={16}
                        color="#F59E0B"
                      />
                    ))}
                  </View>
                  <Text style={styles.totalReviewsText}>{t('buyer.shopDetails.basedOnReviews', { count: shop.totalReviews })}</Text>
                </View>
              </View>
              
              <View style={styles.reviewsList}>
                {mockReviews.map(renderReview)}
              </View>
            </View>
          )}

          {selectedTab === 'info' && (
            <View style={styles.infoContainer}>
              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>Contact Information</Text>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="email" size={20} color="#6B7280" />
                  <Text style={styles.infoText}>{shop.contactEmail}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="phone" size={20} color="#6B7280" />
                  <Text style={styles.infoText}>{shop.contactPhone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="map-marker" size={20} color="#6B7280" />
                  <Text style={styles.infoText}>{shop.location}</Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>Policies</Text>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="truck-delivery" size={20} color="#6B7280" />
                  <Text style={styles.infoText}>{shop.shippingInfo}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="keyboard-return" size={20} color="#6B7280" />
                  <Text style={styles.infoText}>{shop.returnPolicy}</Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>Certifications</Text>
                {shop.certifications.map((cert, index) => (
                  <View key={index} style={styles.infoRow}>
                    <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
                    <Text style={styles.infoText}>{cert}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: Colors.background.primary,
    padding: 20,
    marginBottom: 8,
  },
  shopImageContainer: {
    height: 120,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  shopEmoji: {
    fontSize: 60,
  },
  shopInfo: {
    alignItems: 'center',
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  ownerName: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  shopStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 12,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  followButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  followButtonText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionSection: {
    backgroundColor: Colors.background.primary,
    padding: 20,
    marginBottom: 8,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  shopDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  categoriesContainer: {
    marginTop: 8,
  },
  categoriesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.primary,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  tabContent: {
    backgroundColor: Colors.background.primary,
    paddingBottom: 20,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginRight: 12,
  },
  sortOptions: {
    flex: 1,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedSortOption: {
    backgroundColor: '#3B82F6',
  },
  sortOptionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedSortOptionText: {
    color: '#FFFFFF',
  },
  productsGrid: {
    padding: 16,
  },
  productsRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    width: '48%',
    marginBottom: 16,
    overflow: 'hidden',
  },
  productImageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    position: 'relative',
  },
  productEmoji: {
    fontSize: 48,
  },
  outOfStockOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#111827',
    marginLeft: 4,
    fontWeight: '500',
  },
  reviewsText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  reviewsContainer: {
    padding: 20,
  },
  reviewsHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  overallRating: {
    alignItems: 'center',
    gap: 8,
  },
  overallRatingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  overallStars: {
    flexDirection: 'row',
    gap: 2,
  },
  totalReviewsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  reviewsList: {
    gap: 16,
  },
  reviewCard: {
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  reviewDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewProductName: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  infoContainer: {
    padding: 20,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
});
