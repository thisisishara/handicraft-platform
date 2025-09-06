import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Design';
import { useCart } from '../../contexts/CartContext';

// Mock product data - in real app this would come from API
const mockProduct = {
  id: 'prod1',
  name: 'Traditional Clay Pot',
  price: 2500,
  originalPrice: 2800,
  images: ['🏺', '🏺', '🏺'], // In real app, these would be URLs
  seller: 'Kamala Pottery',
  sellerId: 'seller1',
  shopName: 'Kamala\'s Clay Works',
  location: 'Kandy, Sri Lanka',
  rating: 4.8,
  totalReviews: 45,
  description: 'This beautiful traditional clay pot is handcrafted by skilled artisans in Kandy. Made from high-quality clay and fired using traditional methods, this pot is perfect for both cooking and storage. The natural clay material helps maintain the temperature and adds a unique earthy flavor to your food.\n\nFeatures:\n• Handcrafted traditional design\n• Made from premium quality clay\n• Suitable for cooking and storage\n• Eco-friendly and natural\n• Easy to clean and maintain',
  specifications: {
    'Material': 'Natural Clay',
    'Dimensions': '8" x 6" (H x W)',
    'Weight': '1.2 kg',
    'Capacity': '2 liters',
    'Care': 'Hand wash with mild soap',
  },
  inStock: true,
  stockQuantity: 15,
  discount: 11,
  category: 'pottery',
  tags: ['Traditional', 'Handcrafted', 'Clay', 'Kitchen'],
  shippingInfo: 'Free shipping on orders over Rs. 2,000',
  returnPolicy: '7 days return policy',
};

const mockReviews = [
  {
    id: 'rev1',
    userName: 'Saman Perera',
    rating: 5,
    date: '2024-08-15',
    comment: 'Excellent quality clay pot! Very well made and arrived in perfect condition. The food tastes amazing when cooked in it.',
    verified: true,
    helpful: 12,
  },
  {
    id: 'rev2',
    userName: 'Nimal Silva',
    rating: 4,
    date: '2024-08-10',
    comment: 'Good product, but shipping took a bit longer than expected. Overall satisfied with the quality.',
    verified: true,
    helpful: 8,
  },
  {
    id: 'rev3',
    userName: 'Kanchana Fernando',
    rating: 5,
    date: '2024-08-05',
    comment: 'Beautiful traditional design. Perfect size for my family. Highly recommended!',
    verified: false,
    helpful: 15,
  },
];

const mockSimilarProducts = [
  {
    id: 'prod2',
    name: 'Handwoven Basket',
    price: 1800,
    image: '🧺',
    rating: 4.6,
    reviews: 32,
  },
  {
    id: 'prod4',
    name: 'Brass Oil Lamp',
    price: 2200,
    image: '🪔',
    rating: 4.7,
    reviews: 28,
  },
];

export default function ProductDetailsScreen() {
  const { t } = useTranslation();
  const { addItem, getItemQuantity } = useCart();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);

  const productId = params.id as string || mockProduct.id;
  const product = mockProduct; // In real app, fetch by ID

  const currentQuantityInCart = getItemQuantity(productId);

  const handleAddToCart = () => {
    if (!product.inStock) {
      Alert.alert(t('buyer.productDetails.outOfStock'), t('buyer.productDetails.outOfStockMessage'));
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      seller: product.seller,
      sellerId: product.sellerId,
      shopName: product.shopName,
      maxQuantity: product.stockQuantity,
    });

    Alert.alert(
      t('buyer.productDetails.addedToCart'),
      t('buyer.productDetails.addedToCartMessage', { product: product.name }),
      [
        { text: t('buyer.productDetails.continueShopping'), style: 'cancel' },
        { text: t('buyer.productDetails.viewCart'), onPress: () => router.push('/buyer/cart') },
      ]
    );
  };

  const handleBuyNow = () => {
    if (!product.inStock) {
      Alert.alert(t('buyer.productDetails.outOfStock'), t('buyer.productDetails.outOfStockMessage'));
      return;
    }

    // Add to cart first, then go to checkout
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      seller: product.seller,
      sellerId: product.sellerId,
      shopName: product.shopName,
      maxQuantity: product.stockQuantity,
    });

    router.push('/buyer/checkout');
  };

  const handleContactSeller = () => {
    router.push(`/buyer/messages?sellerId=${product.sellerId}&sellerName=${encodeURIComponent(product.seller)}`);
  };

  const handleShopPress = () => {
    router.push(`/buyer/shop-details?id=${product.sellerId}&name=${encodeURIComponent(product.shopName)}`);
  };

  const renderStars = (rating: number, size: number = 16) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialCommunityIcons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={size}
          color="#F59E0B"
        />
      );
    }
    return stars;
  };

  const renderReview = (review: any) => (
    <View key={review.id} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUserInfo}>
          <View style={styles.reviewAvatar}>
            <Text style={styles.reviewAvatarText}>{review.userName.charAt(0)}</Text>
          </View>
          <View>
            <View style={styles.reviewNameRow}>
              <Text style={styles.reviewUserName}>{review.userName}</Text>
              {review.verified && (
                <View style={styles.verifiedBadge}>
                  <MaterialCommunityIcons name="check-circle" size={12} color="#10B981" />
                  <Text style={styles.verifiedText}>{t('buyer.productDetails.verified')}</Text>
                </View>
              )}
            </View>
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        </View>
        <View style={styles.reviewRating}>
          {renderStars(review.rating, 14)}
        </View>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
      <View style={styles.reviewActions}>
        <TouchableOpacity style={styles.helpfulButton}>
          <MaterialCommunityIcons name="thumb-up-outline" size={16} color="#6B7280" />
          <Text style={styles.helpfulText}>{t('buyer.productDetails.helpful', { count: review.helpful })}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.shareButton}>
            <MaterialCommunityIcons name="share-variant" size={24} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.wishlistButton}>
            <MaterialCommunityIcons name="heart-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {/* Product Images */}
        <View style={styles.imageSection}>
          <View style={styles.mainImageContainer}>
            <Text style={styles.mainProductImage}>{product.images[selectedImageIndex]}</Text>
            {product.discount > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{product.discount}%</Text>
              </View>
            )}
          </View>
          <ScrollView horizontal style={styles.imageCarousel} showsHorizontalScrollIndicator={false}>
            {product.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.thumbnailContainer,
                  selectedImageIndex === index && styles.selectedThumbnail
                ]}
                onPress={() => setSelectedImageIndex(index)}
              >
                <Text style={styles.thumbnailImage}>{image}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              {product.originalPrice && (
                <Text style={styles.originalPrice}>Rs. {product.originalPrice.toLocaleString()}</Text>
              )}
              <Text style={styles.currentPrice}>Rs. {product.price.toLocaleString()}</Text>
              {product.discount > 0 && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>{t('buyer.productDetails.save')} Rs. {(product.originalPrice! - product.price).toLocaleString()}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.ratingSection}>
            <View style={styles.starsContainer}>
              {renderStars(Math.floor(product.rating))}
              <Text style={styles.ratingText}>{product.rating}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedTab('reviews')}>
              <Text style={styles.reviewsLink}>({t('buyer.productDetails.reviewsCount', { count: product.totalReviews })})</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stockSection}>
            <MaterialCommunityIcons 
              name={product.inStock ? "check-circle" : "close-circle"} 
              size={16} 
              color={product.inStock ? "#10B981" : "#EF4444"} 
            />
            <Text style={[
              styles.stockText,
              { color: product.inStock ? '#10B981' : '#EF4444' }
            ]}>
              {product.inStock ? t('buyer.productDetails.inStock', { count: product.stockQuantity }) : t('buyer.productDetails.outOfStock')}
            </Text>
          </View>

          {/* Seller Info */}
          <View style={styles.sellerSection}>
            <View style={styles.sellerInfo}>
              <MaterialCommunityIcons name="store" size={20} color="#6B7280" />
              <TouchableOpacity onPress={handleShopPress} style={styles.sellerDetails}>
                <Text style={styles.shopName}>{product.shopName}</Text>
                <Text style={styles.sellerLocation}>{product.location}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={handleContactSeller}
            >
              <MaterialCommunityIcons name="message-text" size={16} color="#3B82F6" />
              <Text style={styles.contactButtonText}>{t('buyer.productDetails.contact')}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.shippingInfo}>{product.shippingInfo}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'description' && styles.activeTab]}
            onPress={() => setSelectedTab('description')}
          >
            <Text style={[styles.tabText, selectedTab === 'description' && styles.activeTabText]}>
              {t('buyer.productDetails.description')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'specifications' && styles.activeTab]}
            onPress={() => setSelectedTab('specifications')}
          >
            <Text style={[styles.tabText, selectedTab === 'specifications' && styles.activeTabText]}>
              {t('buyer.productDetails.details')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'reviews' && styles.activeTab]}
            onPress={() => setSelectedTab('reviews')}
          >
            <Text style={[styles.tabText, selectedTab === 'reviews' && styles.activeTabText]}>
              {t('buyer.productDetails.reviewsTab', { count: product.totalReviews })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {selectedTab === 'description' && (
            <View>
              <Text style={styles.description}>{product.description}</Text>
              <View style={styles.tagsContainer}>
                {product.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {selectedTab === 'specifications' && (
            <View style={styles.specificationsContainer}>
              {Object.entries(product.specifications).map(([key, value], index) => (
                <View key={index} style={styles.specRow}>
                  <Text style={styles.specKey}>{key}</Text>
                  <Text style={styles.specValue}>{value}</Text>
                </View>
              ))}
              <View style={styles.policySection}>
                <Text style={styles.policyText}>📦 {product.shippingInfo}</Text>
                <Text style={styles.policyText}>🔄 {product.returnPolicy}</Text>
              </View>
            </View>
          )}

          {selectedTab === 'reviews' && (
            <View style={styles.reviewsContainer}>
              <View style={styles.reviewsHeader}>
                <Text style={styles.reviewsTitle}>Customer Reviews</Text>
                <View style={styles.overallRating}>
                  <Text style={styles.overallRatingText}>{product.rating}</Text>
                  <View style={styles.overallStars}>
                    {renderStars(Math.floor(product.rating))}
                  </View>
                  <Text style={styles.totalReviewsText}>Based on {product.totalReviews} reviews</Text>
                </View>
              </View>
              
              <View style={styles.addReviewSection}>
                <Text style={styles.addReviewTitle}>Write a Review</Text>
                <View style={styles.ratingInput}>
                  <Text style={styles.ratingInputLabel}>Your Rating:</Text>
                  <View style={styles.ratingButtons}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity 
                        key={star}
                        onPress={() => setNewRating(star)}
                      >
                        <MaterialCommunityIcons
                          name={star <= newRating ? 'star' : 'star-outline'}
                          size={20}
                          color="#F59E0B"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <TextInput
                  style={styles.reviewInput}
                  placeholder="Share your experience with this product..."
                  value={newReview}
                  onChangeText={setNewReview}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <TouchableOpacity style={styles.submitReviewButton}>
                  <Text style={styles.submitReviewText}>Submit Review</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.reviewsList}>
                {mockReviews.map(renderReview)}
              </View>
            </View>
          )}
        </View>

        {/* Similar Products */}
        <View style={styles.similarSection}>
          <Text style={styles.similarTitle}>{t('buyer.productDetails.similarProducts')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.similarProducts}>
            {mockSimilarProducts.map((product) => (
              <TouchableOpacity 
                key={product.id}
                style={styles.similarProductCard}
                onPress={() => router.push(`/buyer/product-details?id=${product.id}`)}
              >
                <Text style={styles.similarProductImage}>{product.image}</Text>
                <Text style={styles.similarProductName}>{product.name}</Text>
                <View style={styles.similarProductRating}>
                  <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.similarRatingText}>{product.rating}</Text>
                </View>
                <Text style={styles.similarProductPrice}>Rs. {product.price.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.quantitySection}>
          <Text style={styles.quantityLabel}>{t('buyer.productDetails.quantity')}:</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <MaterialCommunityIcons name="minus" size={16} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
            >
              <MaterialCommunityIcons name="plus" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          {currentQuantityInCart > 0 && (
            <Text style={styles.cartQuantityText}>({t('buyer.productDetails.inCart', { count: currentQuantityInCart })})</Text>
          )}
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.addToCartButton, !product.inStock && styles.disabledButton]}
            onPress={handleAddToCart}
            disabled={!product.inStock}
          >
            <MaterialCommunityIcons name="cart-plus" size={20} color="#FFFFFF" />
            <Text style={styles.addToCartText}>{t('buyer.productDetails.addToCart')}</Text>
          </TouchableOpacity>
          <Button
            title={t('buyer.productDetails.buyNow')}
            onPress={handleBuyNow}
            style={[styles.buyNowButton, !product.inStock && styles.disabledButton]}
            disabled={!product.inStock}
          />
        </View>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    padding: 8,
  },
  wishlistButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  imageSection: {
    backgroundColor: Colors.background.primary,
    paddingVertical: 20,
  },
  mainImageContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: Colors.background.secondary,
    marginHorizontal: 20,
    borderRadius: 16,
  },
  mainProductImage: {
    fontSize: 120,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: Colors.text.inverse,
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageCarousel: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: '#3B82F6',
  },
  thumbnailImage: {
    fontSize: 24,
  },
  productInfo: {
    backgroundColor: Colors.background.primary,
    padding: 20,
    marginTop: 8,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  priceSection: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: Colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  savingsBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.warning,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  reviewsLink: {
    fontSize: 14,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  stockSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sellerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  sellerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sellerDetails: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  sellerLocation: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contactButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  shippingInfo: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.primary,
    marginTop: 8,
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
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    backgroundColor: Colors.background.primary,
    padding: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  specificationsContainer: {
    gap: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  specKey: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
    textAlign: 'right',
    flex: 2,
  },
  policySection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
  },
  policyText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  reviewsContainer: {
    gap: 16,
  },
  reviewsHeader: {
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  overallRating: {
    alignItems: 'center',
    gap: 8,
  },
  overallRatingText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  overallStars: {
    flexDirection: 'row',
    gap: 2,
  },
  totalReviewsText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  addReviewSection: {
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
  },
  addReviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  ratingInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  ratingInputLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  ratingButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  reviewInput: {
    backgroundColor: Colors.background.primary,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
    minHeight: 80,
    marginBottom: 12,
  },
  submitReviewButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitReviewText: {
    color: Colors.text.inverse,
    fontSize: 14,
    fontWeight: '600',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewAvatarText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.text.secondary,
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
    marginBottom: 12,
  },
  reviewActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  helpfulText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  similarSection: {
    backgroundColor: Colors.background.primary,
    padding: 20,
    marginTop: 8,
    marginBottom: 100, // Space for bottom actions
  },
  similarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  similarProducts: {
    flexDirection: 'row',
  },
  similarProductCard: {
    width: 120,
    marginRight: 12,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: 12,
  },
  similarProductImage: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 8,
  },
  similarProductName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  similarProductRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 4,
  },
  similarRatingText: {
    fontSize: 10,
    color: Colors.text.secondary,
  },
  similarProductPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
    gap: 12,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  cartQuantityText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6B7280',
    paddingVertical: 12,
    borderRadius: 12,
  },
  addToCartText: {
    color: Colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  buyNowButton: {
    flex: 1,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
});
