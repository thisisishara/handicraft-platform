import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Colors, IconSizes, Shadow, Spacing, StandardIcons, Typography } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export default function BuyerHomeScreen() {
  const { t } = useTranslation();
  const { user, switchMode } = useAuth();
  const { totalItems } = useCart();
  const insets = useSafeAreaInsets();

  // Mock buyer stats - in real app this would come from API
  const buyerStats = {
    totalOrders: 12,
    pendingDeliveries: 3,
    totalSpent: 'Rs. 28,450',
    thisMonth: 'Rs. 5,680',
    wishlistItems: 7,
    rewardPoints: 245,
    cartItems: totalItems,
    recentOrders: 2,
  };

  const quickActions = [
    {
      id: 'explore-shop',
      title: t('buyer.home.exploreShop'),
      subtitle: t('buyer.home.exploreShopSubtitle'),
      icon: StandardIcons.shop,
      route: '/buyer/shop',
    },
    {
      id: 'view-cart',
      title: t('buyer.home.viewCart'),
      subtitle: t('buyer.home.viewCartSubtitle', { count: buyerStats.cartItems }),
      icon: StandardIcons.cart,
      route: '/buyer/cart',
    },
    {
      id: 'track-orders',
      title: t('buyer.home.myOrders'),
      subtitle: t('buyer.home.myOrdersSubtitle'),
      icon: 'truck-delivery',
      route: '/buyer/orders',
    },
    {
      id: 'wishlist',
      title: t('buyer.home.wishlist'),
      subtitle: t('buyer.home.wishlistSubtitle', { count: buyerStats.wishlistItems }),
      icon: StandardIcons.heart,
      route: '/buyer/shop',
    },
  ];

  // Mock featured products/recommendations
  const featuredProducts = [
    {
      id: 'prod1',
      name: 'Traditional Clay Pot',
      price: 2500,
      image: '🏺',
      seller: 'Kamala Pottery',
      rating: 4.8,
      reviews: 45,
      discount: 10,
    },
    {
      id: 'prod2',
      name: 'Handwoven Basket',
      price: 1800,
      image: '🧺',
      seller: 'Village Crafts',
      rating: 4.6,
      reviews: 32,
    },
    {
      id: 'prod3',
      name: 'Carved Wooden Mask',
      price: 3200,
      image: '🎭',
      seller: 'Traditional Arts',
      rating: 4.9,
      reviews: 67,
    },
  ];

  const categories = [
    { id: 'pottery', name: t('buyer.home.categories.pottery'), icon: '🏺', color: '#3B82F6' },
    { id: 'textiles', name: t('buyer.home.categories.textiles'), icon: '🧶', color: '#10B981' },
    { id: 'woodwork', name: t('buyer.home.categories.woodwork'), icon: '🪵', color: '#F59E0B' },
    { id: 'metalwork', name: t('buyer.home.categories.metalwork'), icon: '🔨', color: '#EF4444' },
  ];

  const handleQuickAction = (route: string) => {
    router.push(route as any);
  };

  const handleProductPress = (product: any) => {
    router.push(`/buyer/product-details?id=${product.id}`);
  };

  const handleCategoryPress = (category: any) => {
    router.push(`/buyer/shop?category=${category.id}`);
  };

  const handleSwitchMode = async () => {
    Alert.alert(
      t('buyer.home.switchToSellerModeAlert.title'),
      t('buyer.home.switchToSellerModeAlert.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.switch'), 
          onPress: async () => {
            try {
              await switchMode('seller');
              router.replace('/seller/home');
            } catch (error) {
              Alert.alert(t('common.error'), t('common.switchModeError'));
            }
          }
        },
      ]
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: 90 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Good morning, {user?.firstName || 'Shopper'}! 👋</Text>
          <Text style={styles.subtitle}>{t('buyer.home.subtitle')}</Text>
        </View>
        <View style={styles.shopIcon}>
          <MaterialCommunityIcons name="shopping" size={IconSizes.xl} color={Colors.text.primary} />
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>{t('buyer.home.stats')}</Text>
        
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.primaryCard]}>
            <MaterialCommunityIcons name="currency-usd" size={IconSizes.md} color={Colors.text.inverse} />
            <Text style={styles.statValue}>{buyerStats.thisMonth}</Text>
            <Text style={styles.statLabel}>{t('buyer.home.thisMonth')}</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="shopping" size={IconSizes.md} color={Colors.text.primary} />
            <Text style={[styles.statValue, { color: Colors.text.primary }]}>{buyerStats.totalOrders}</Text>
            <Text style={[styles.statLabel, { color: Colors.text.secondary }]}>{t('buyer.home.totalOrders')}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.miniStat}>
            <MaterialCommunityIcons name="gift" size={IconSizes.xs} color={Colors.warning} />
            <Text style={styles.miniStatText}>{buyerStats.rewardPoints} Points</Text>
          </View>
          <View style={styles.miniStat}>
            <MaterialCommunityIcons name="heart" size={IconSizes.xs} color={Colors.error} />
            <Text style={styles.miniStatText}>{buyerStats.wishlistItems} Wishlist</Text>
          </View>
          <View style={styles.miniStat}>
            <MaterialCommunityIcons name="cart" size={IconSizes.xs} color={Colors.info} />
            <Text style={styles.miniStatText}>{buyerStats.cartItems} in Cart</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => handleQuickAction(action.route)}
            >
              <View style={styles.actionIcon}>
                <MaterialCommunityIcons 
                  name={action.icon as any} 
                  size={IconSizes.md} 
                  color={Colors.text.primary} 
                />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>


      {/* Recent Activity */}
      <View style={styles.recentContainer}>
        <Text style={styles.sectionTitle}>{t('buyer.home.recentActivity')}</Text>
        
        <View style={styles.activityCard}>
          <MaterialCommunityIcons name="truck-delivery" size={IconSizes.sm} color={Colors.success} />
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>{t('buyer.home.activity.orderDelivered')}</Text>
            <Text style={styles.activityTime}>{t('buyer.home.activity.timeAgo.minutes', { count: 2 })}</Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <MaterialCommunityIcons name="heart" size={IconSizes.sm} color={Colors.error} />
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>{t('buyer.home.activity.addedToWishlist')}</Text>
            <Text style={styles.activityTime}>{t('buyer.home.activity.timeAgo.hour', { count: 1 })}</Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <MaterialCommunityIcons name="shopping" size={IconSizes.sm} color={Colors.info} />
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>{t('buyer.home.activity.newOrderPlaced')}</Text>
            <Text style={styles.activityTime}>{t('buyer.home.activity.timeAgo.hours', { count: 3 })}</Text>
          </View>
        </View>
      </View>

      {/* Mode Switch Button */}
      <View style={styles.modeSwitchContainer}>
        <TouchableOpacity 
          style={styles.modeSwitchButton}
          onPress={handleSwitchMode}
        >
          <MaterialCommunityIcons name="store" size={IconSizes.sm} color={Colors.text.inverse} />
          <Text style={styles.modeSwitchText}>{t('buyer.home.switchToSellerMode')}</Text>
        </TouchableOpacity>
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
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  headerContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  greeting: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
  shopIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  statsContainer: {
    padding: Spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card.background,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.card.border,
    ...Shadow.small,
  },
  primaryCard: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  statValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
    marginTop: Spacing.sm,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.inverse,
    opacity: 0.8,
    marginTop: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.card.background,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.card.border,
    ...Shadow.small,
  },
  miniStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  miniStatText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  actionsContainer: {
    padding: Spacing.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  actionCard: {
    flex: 1,
    minWidth: '47%',
    maxWidth: '48%',
    backgroundColor: Colors.card.background,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.card.border,
    ...Shadow.small,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  actionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  actionSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  recentContainer: {
    padding: Spacing.xl,
    paddingTop: 0,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card.background,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.card.border,
    ...Shadow.small,
  },
  activityContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  activityTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  activityTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  modeSwitchContainer: {
    backgroundColor: Colors.background.primary,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  modeSwitchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    ...Shadow.small,
  },
  modeSwitchText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.inverse,
  },
});
