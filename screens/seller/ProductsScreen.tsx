import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { BorderRadius, Colors, IconSizes, Shadow, Spacing, StandardIcons, Typography } from '../../constants/Design';

// Mock product data with enhanced seller information
const mockProducts = [
  {
    id: '1',
    name: 'Traditional Clay Pot',
    price: 'Rs. 2,500',
    status: 'Active',
    image: '🏺',
    stock: 15,
    views: 245,
    sales: 12,
    rating: 4.8,
    category: 'Pottery',
    dateAdded: '2024-01-15',
  },
  {
    id: '2',
    name: 'Handwoven Basket',
    price: 'Rs. 1,800',
    status: 'Active',
    image: '🧺',
    stock: 8,
    views: 189,
    sales: 7,
    rating: 4.9,
    category: 'Textiles',
    dateAdded: '2024-01-20',
  },
  {
    id: '3',
    name: 'Wooden Carved Mask',
    price: 'Rs. 3,200',
    status: 'Draft',
    image: '🎭',
    stock: 5,
    views: 0,
    sales: 0,
    rating: 0,
    category: 'Woodwork',
    dateAdded: '2024-02-01',
  },
  {
    id: '4',
    name: 'Brass Oil Lamp',
    price: 'Rs. 1,200',
    status: 'Low Stock',
    image: '🪔',
    stock: 2,
    views: 156,
    sales: 18,
    rating: 4.7,
    category: 'Metalwork',
    dateAdded: '2024-01-10',
  },
  {
    id: '5',
    name: 'Batik Wall Hanging',
    price: 'Rs. 4,500',
    status: 'Active',
    image: '🎨',
    stock: 12,
    views: 298,
    sales: 5,
    rating: 4.6,
    category: 'Textiles',
    dateAdded: '2024-01-25',
  },
];

export default function ProductsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = [t('seller.products.filters.all'), t('seller.products.filters.active'), t('seller.products.filters.draft'), t('seller.products.filters.lowStock')];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || product.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleEditProduct = (productId: string) => {
    router.push(`/seller/add-product?edit=${productId}`);
  };

  const handleDeleteProduct = (productId: string) => {
    Alert.alert(
      t('seller.products.alerts.deleteProduct.title'),
      t('seller.products.alerts.deleteProduct.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('seller.products.actionButtons.delete'), style: 'destructive', onPress: () => {
          // In real app, this would delete from backend
          Alert.alert(t('seller.products.alerts.success'), t('seller.products.alerts.productDeleted'));
        }},
      ]
    );
  };

  const toggleProductStatus = (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Draft' : 'Active';
    Alert.alert(
      t('seller.products.alerts.updateStatus.title'),
      t('seller.products.alerts.updateStatus.message', { status: newStatus }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('seller.products.alerts.update'), onPress: () => {
          // In real app, this would update backend
          Alert.alert(t('seller.products.alerts.success'), t('seller.products.alerts.statusChanged', { status: newStatus }));
        }},
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return Colors.success;
      case 'Draft':
        return Colors.text.secondary;
      case 'Low Stock':
        return Colors.warning;
      default:
        return Colors.text.secondary;
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: 90 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{t('seller.products.title')}</Text>
          <Text style={styles.subtitle}>{t('seller.products.subtitle')}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerActionButton}
            onPress={() => router.push('/seller/add-product')}
          >
            <MaterialCommunityIcons name={StandardIcons.add as any} size={IconSizes.md} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.controls}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name={StandardIcons.search as any} size={IconSizes.sm} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('seller.products.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Status Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.tabContainer}
          contentContainerStyle={styles.tabScrollContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.tab,
                selectedFilter === filter && styles.activeTab
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.tabText,
                selectedFilter === filter && styles.activeTabText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Button
          title={t('seller.products.addNewProduct')}
          onPress={() => router.push('/seller/add-product')}
          style={styles.addButton}
          leftIcon={<MaterialCommunityIcons name={StandardIcons.add as any} size={IconSizes.sm} color={Colors.text.inverse} />}
        />
      </View>

      {/* Products List */}
      <View style={styles.productsList}>
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name={StandardIcons.products as any} size={IconSizes.xxl} color={Colors.text.disabled} />
            <Text style={styles.emptyStateText}>
              {searchQuery ? t('seller.products.noProducts') : t('seller.products.noProducts')}
            </Text>
          </View>
        ) : (
          filteredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productHeader}>
                <View style={styles.productBasicInfo}>
                  <Text style={styles.productEmoji}>{product.image}</Text>
                  <View style={styles.productTitleInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productCategory}>{product.category}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(product.status)}15` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(product.status) }]}>
                    {product.status}
                  </Text>
                </View>
              </View>

              <View style={styles.productStats}>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="currency-usd" size={IconSizes.xs} color={Colors.text.primary} />
                  <Text style={styles.statValue}>{product.price}</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="package-variant" size={IconSizes.xs} color={Colors.text.primary} />
                  <Text style={styles.statValue}>{t('seller.products.stockCount', { count: product.stock })}</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="eye" size={IconSizes.xs} color={Colors.text.primary} />
                  <Text style={styles.statValue}>{t('seller.products.viewsCount', { count: product.views })}</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="shopping" size={IconSizes.xs} color={Colors.text.primary} />
                  <Text style={styles.statValue}>{product.sales} sold</Text>
                </View>
              </View>

              {product.rating > 0 && (
                <View style={styles.productRating}>
                  <MaterialCommunityIcons name="star" size={IconSizes.xs} color={Colors.warning} />
                  <Text style={styles.ratingText}>{product.rating} rating</Text>
                </View>
              )}

              <View style={styles.productActions}>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => handleEditProduct(product.id)}
                >
                  <MaterialCommunityIcons name={StandardIcons.edit as any} size={IconSizes.xs} color={Colors.text.primary} />
                  <Text style={styles.actionButtonText}>{t('seller.products.actionButtons.edit')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => toggleProductStatus(product.id, product.status)}
                >
                  <MaterialCommunityIcons 
                    name={product.status === 'Active' ? 'pause' : 'play'} 
                    size={IconSizes.xs} 
                    color={Colors.text.primary} 
                  />
                  <Text style={styles.actionButtonText}>
                    {product.status === 'Active' ? t('seller.products.actionButtons.deactivate') : t('seller.products.actionButtons.activate')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]} 
                  onPress={() => handleDeleteProduct(product.id)}
                >
                  <MaterialCommunityIcons name={StandardIcons.delete as any} size={IconSizes.xs} color={Colors.error} />
                  <Text style={[styles.actionButtonText, styles.deleteButtonText]}>{t('seller.products.actionButtons.delete')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
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
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  headerContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    padding: Spacing.sm,
  },
  controls: {
    backgroundColor: Colors.background.primary,
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
  },
  tabContainer: {
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
    marginBottom: Spacing.lg,
    maxHeight: 60,
  },
  tabScrollContent: {
    paddingHorizontal: Spacing.sm,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    minWidth: 80,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  activeTabText: {
    color: Colors.primary,
  },
  addButton: {
    marginTop: Spacing.sm,
  },
  productsList: {
    padding: Spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.massive,
  },
  emptyStateText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.disabled,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  productCard: {
    backgroundColor: Colors.card.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.card.border,
    ...Shadow.small,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  productBasicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  productEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  productTitleInfo: {
    flex: 1,
  },
  productName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  productCategory: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    textTransform: 'uppercase',
  },
  productStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  ratingText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border.secondary,
    paddingTop: Spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    backgroundColor: Colors.background.tertiary,
    flex: 1,
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  deleteButton: {
    backgroundColor: `${Colors.error}15`,
  },
  deleteButtonText: {
    color: Colors.error,
  },
});