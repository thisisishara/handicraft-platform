import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Colors, IconSizes, Spacing, StandardIcons, Typography } from '../../constants/Design';
import { useCart } from '../../contexts/CartContext';

// Mock product data
const mockProducts = [
  {
    id: 'prod1',
    name: 'Traditional Clay Pot',
    price: 2500,
    originalPrice: 2800,
    image: '🏺',
    seller: 'Kamala Pottery',
    sellerId: 'seller1',
    shopName: 'Kamala\'s Clay Works',
    location: 'Kandy',
    rating: 4.8,
    reviews: 45,
    category: 'pottery',
    discount: 10,
    inStock: true,
    description: 'Handcrafted traditional clay pot perfect for cooking and storage.',
  },
  {
    id: 'prod2',
    name: 'Handwoven Basket',
    price: 1800,
    image: '🧺',
    seller: 'Village Crafts',
    sellerId: 'seller2',
    shopName: 'Village Handicrafts',
    location: 'Matara',
    rating: 4.6,
    reviews: 32,
    category: 'textiles',
    inStock: true,
    description: 'Beautiful handwoven basket made from natural fibers.',
  },
  {
    id: 'prod3',
    name: 'Carved Wooden Mask',
    price: 3200,
    image: '🎭',
    seller: 'Traditional Arts',
    sellerId: 'seller3',
    shopName: 'Heritage Wood Art',
    location: 'Colombo',
    rating: 4.9,
    reviews: 67,
    category: 'woodwork',
    inStock: true,
    description: 'Intricately carved traditional Sri Lankan wooden mask.',
  },
  {
    id: 'prod4',
    name: 'Brass Oil Lamp',
    price: 2200,
    originalPrice: 2500,
    image: '🪔',
    seller: 'Metal Crafters',
    sellerId: 'seller4',
    shopName: 'Ancient Metals',
    location: 'Galle',
    rating: 4.7,
    reviews: 28,
    category: 'metalwork',
    discount: 12,
    inStock: true,
    description: 'Handcrafted brass oil lamp with traditional designs.',
  },
  {
    id: 'prod5',
    name: 'Batik Wall Hanging',
    price: 4500,
    image: '🎨',
    seller: 'Batik Masters',
    sellerId: 'seller5',
    shopName: 'Colorful Batiks',
    location: 'Kandy',
    rating: 4.8,
    reviews: 52,
    category: 'textiles',
    inStock: true,
    description: 'Stunning batik wall hanging with vibrant colors.',
  },
  {
    id: 'prod6',
    name: 'Coconut Shell Bowl',
    price: 850,
    image: '🥥',
    seller: 'Eco Crafts',
    sellerId: 'seller6',
    shopName: 'Sustainable Crafts',
    location: 'Negombo',
    rating: 4.5,
    reviews: 19,
    category: 'woodwork',
    inStock: false,
    description: 'Eco-friendly bowl made from coconut shell.',
  },
];

// mockRecommendations moved inside component to access t function

export default function BuyerShopScreen() {
  const { t } = useTranslation();
  const { totalItems } = useCart();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  
  const mockRecommendations = [
    {
      id: 'rec1',
      title: t('buyer.shop.recommendations.popularInArea'),
      products: mockProducts.slice(0, 3),
    },
    {
      id: 'rec2',
      title: t('buyer.shop.recommendations.recentlyAdded'),
      products: mockProducts.slice(2, 5),
    },
    {
      id: 'rec3',
      title: t('buyer.shop.recommendations.specialOffers'),
      products: mockProducts.filter(p => p.discount),
    },
  ];
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(params.category as string || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: t('buyer.shop.allCategories'), icon: '🛍️' },
    { id: 'pottery', name: t('buyer.shop.pottery'), icon: '🏺' },
    { id: 'textiles', name: t('buyer.shop.textiles'), icon: '🧶' },
    { id: 'woodwork', name: t('buyer.shop.woodwork'), icon: '🪵' },
    { id: 'metalwork', name: t('buyer.shop.metalwork'), icon: '🔨' },
  ];

  const sortOptions = [
    { id: 'featured', name: t('buyer.shop.sortFeatured') },
    { id: 'price-low', name: t('buyer.shop.sortPriceLow') },
    { id: 'price-high', name: t('buyer.shop.sortPriceHigh') },
    { id: 'rating', name: t('buyer.shop.sortRating') },
    { id: 'newest', name: t('buyer.shop.sortNewest') },
  ];

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.shopName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // For demo, just reverse the order
        filtered.reverse();
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  };

  const handleProductPress = (product: any) => {
    router.push(`/buyer/product-details?id=${product.id}`);
  };

  const handleShopPress = (product: any) => {
    router.push(`/buyer/shop-details?id=${product.sellerId}&name=${encodeURIComponent(product.shopName)}`);
  };

  const renderProduct = ({ item: product }: { item: any }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(product)}
    >
      <View style={styles.productImageContainer}>
        <Text style={styles.productEmoji}>{product.image}</Text>
        {product.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{product.discount}%</Text>
          </View>
        )}
        {!product.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>{t('buyer.shop.outOfStock')}</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <TouchableOpacity onPress={() => handleShopPress(product)}>
          <Text style={styles.productSeller}>{product.shopName}</Text>
        </TouchableOpacity>
        <Text style={styles.productLocation}>{product.location}</Text>
        <View style={styles.productRating}>
          <MaterialCommunityIcons name="star" size={14} color="#F59E0B" />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.reviewsText}>({product.reviews})</Text>
        </View>
        <View style={styles.productPricing}>
          {product.originalPrice && product.discount && (
            <Text style={styles.originalPrice}>
              Rs. {product.originalPrice.toLocaleString()}
            </Text>
          )}
          <Text style={styles.productPrice}>Rs. {product.price.toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecommendationSection = (section: any) => (
    <View key={section.id} style={styles.recommendationSection}>
      <View style={styles.recommendationHeader}>
        <Text style={styles.recommendationTitle}>{section.title}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllButton}>{t('common.viewMore')}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {section.products.map((product: any) => (
          <View key={product.id} style={styles.recommendationProductCard}>
            <TouchableOpacity onPress={() => handleProductPress(product)}>
              <View style={styles.recommendationImageContainer}>
                <Text style={styles.recommendationEmoji}>{product.image}</Text>
                {product.discount && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{product.discount}%</Text>
                  </View>
                )}
              </View>
              <View style={styles.recommendationInfo}>
                <Text style={styles.recommendationName}>{product.name}</Text>
                <Text style={styles.recommendationPrice}>Rs. {product.price.toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('buyer.shop.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('buyer.shop.subtitle')}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => router.push('/buyer/cart')}
          >
            <MaterialCommunityIcons name={StandardIcons.cart as any} size={IconSizes.md} color={Colors.text.secondary} />
            {totalItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name={StandardIcons.search as any} size={IconSizes.sm} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('buyer.shop.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <MaterialCommunityIcons name={StandardIcons.filter as any} size={IconSizes.sm} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Categories Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.tabContainer}
        contentContainerStyle={styles.tabScrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.tab,
              selectedCategory === category.id && styles.activeTab
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <View style={styles.tabContent}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.tabText,
                selectedCategory === category.id && styles.activeTabText
              ]}>
                {category.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <Text style={styles.filterTitle}>{t('buyer.shop.sortBy')}</Text>
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
      )}

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {/* Show recommendations when no search */}
        {searchQuery === '' && (
          <View>
            {mockRecommendations.map(renderRecommendationSection)}
          </View>
        )}

        {/* Product Results */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {searchQuery ? t('buyer.shop.resultsFor', { query: searchQuery }) : t('buyer.shop.allProducts')}
            </Text>
            <Text style={styles.resultsCount}>
              {getFilteredProducts().length} {t('buyer.shop.productsCount')}
            </Text>
          </View>
          <FlatList
            data={getFilteredProducts()}
            renderItem={renderProduct}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productGrid}
            columnWrapperStyle={styles.productRow}
          />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  headerContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    position: 'relative',
    padding: Spacing.sm,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.primary,
    borderRadius: Spacing.sm,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    gap: Spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
  },
  filterButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
  },
  tabContainer: {
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
    maxHeight: 70,
  },
  tabScrollContent: {
    paddingHorizontal: Spacing.sm,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minWidth: 90,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  categoryIcon: {
    fontSize: Typography.fontSize.md,
  },
  tabText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  activeTabText: {
    color: Colors.primary,
  },
  filtersPanel: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  filterTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  sortOptions: {
    flexDirection: 'row',
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F9FAFB',
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
  content: {
    flex: 1,
  },
  recommendationSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingVertical: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  seeAllButton: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  recommendationProductCard: {
    width: 140,
    marginLeft: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  recommendationImageContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  recommendationEmoji: {
    fontSize: 36,
  },
  recommendationInfo: {
    padding: 8,
  },
  recommendationName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  recommendationPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  resultsSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingTop: 16,
    paddingBottom: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  productGrid: {
    paddingHorizontal: 16,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    width: '48%',
    marginBottom: 16,
    overflow: 'hidden',
  },
  productImageContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  productEmoji: {
    fontSize: 48,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
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
    marginBottom: 4,
  },
  productSeller: {
    fontSize: 12,
    color: '#3B82F6',
    marginBottom: 2,
    textDecorationLine: 'underline',
  },
  productLocation: {
    fontSize: 10,
    color: '#6B7280',
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
  productPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
});
