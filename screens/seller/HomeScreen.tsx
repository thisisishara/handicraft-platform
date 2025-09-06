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
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Colors, IconSizes, Shadow, Spacing, StandardIcons, Typography } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';

export default function SellerHomeScreen() {
  const { t } = useTranslation();
  const { user, switchMode } = useAuth();
  const insets = useSafeAreaInsets();

  // Mock shop stats - in real app this would come from API
  const shopStats = {
    totalOrders: 127,
    pendingOrders: 8,
    totalEarnings: 'Rs. 45,670',
    thisMonth: 'Rs. 12,450',
    rating: 4.8,
    reviews: 89,
    products: 24,
    returns: 3,
  };

  const quickActions = [
    {
      id: 'add-product',
      title: t('seller.home.addProduct'),
      subtitle: t('seller.home.addProductSubtitle'),
      icon: StandardIcons.add,
      route: '/seller/add-product',
    },
    {
      id: 'pending-orders',
      title: t('seller.home.pendingOrders'),
      subtitle: t('seller.home.pendingOrdersSubtitle', { count: shopStats.pendingOrders }),
      icon: 'clock-outline',
      route: '/seller/orders',
    },
    {
      id: 'messages',
      title: t('seller.home.messages'),
      subtitle: t('seller.home.messagesSubtitle', { count: 3 }),
      icon: StandardIcons.messages,
      route: '/seller/support',
    },
    {
      id: 'analytics',
      title: t('seller.home.analytics'),
      subtitle: t('seller.home.analyticsSubtitle'),
      icon: 'chart-line',
      route: '/seller/home',
    },
  ];

  const handleSwitchMode = async () => {
    Alert.alert(
      t('seller.home.switchToBuyerModeAlert.title'),
      t('seller.home.switchToBuyerModeAlert.message'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.switch'), 
          onPress: async () => {
            try {
              await switchMode('buyer');
              router.replace('/buyer/home');
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
          <Text style={styles.greeting}>{t('seller.home.greeting', { name: user?.firstName || 'Seller' })}</Text>
          <Text style={styles.subtitle}>{t('seller.home.subtitle')}</Text>
        </View>
        <View style={styles.shopIcon}>
          <MaterialCommunityIcons name="store" size={IconSizes.xl} color={Colors.text.primary} />
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>{t('seller.home.businessOverview')}</Text>
        
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.primaryCard]}>
            <MaterialCommunityIcons name="currency-usd" size={IconSizes.md} color={Colors.text.inverse} />
            <Text style={styles.statValue}>{shopStats.thisMonth}</Text>
            <Text style={styles.statLabel}>{t('seller.home.thisMonth')}</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="package-variant" size={IconSizes.md} color={Colors.text.primary} />
            <Text style={[styles.statValue, { color: Colors.text.primary }]}>{shopStats.totalOrders}</Text>
            <Text style={[styles.statLabel, { color: Colors.text.secondary }]}>{t('seller.home.totalOrders')}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.miniStat}>
            <MaterialCommunityIcons name="star" size={IconSizes.xs} color={Colors.warning} />
            <Text style={styles.miniStatText}>{shopStats.rating} ({shopStats.reviews})</Text>
          </View>
          <View style={styles.miniStat}>
            <MaterialCommunityIcons name="package" size={IconSizes.xs} color={Colors.success} />
            <Text style={styles.miniStatText}>{shopStats.products} {t('seller.home.totalProducts')}</Text>
          </View>
          <View style={styles.miniStat}>
            <MaterialCommunityIcons name="arrow-u-left-bottom" size={IconSizes.xs} color={Colors.error} />
            <Text style={styles.miniStatText}>{shopStats.returns} Returns</Text>
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
              onPress={() => router.push(action.route as any)}
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
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        <View style={styles.activityCard}>
          <MaterialCommunityIcons name="shopping" size={IconSizes.sm} color={Colors.success} />
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>New order received</Text>
            <Text style={styles.activityTime}>2 minutes ago</Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <MaterialCommunityIcons name="star" size={IconSizes.sm} color={Colors.warning} />
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>New 5-star review</Text>
            <Text style={styles.activityTime}>1 hour ago</Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <MaterialCommunityIcons name="package-variant-closed" size={IconSizes.sm} color={Colors.info} />
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Product shipped</Text>
            <Text style={styles.activityTime}>3 hours ago</Text>
          </View>
        </View>
      </View>

      {/* Mode Switch Button */}
      <View style={styles.modeSwitchContainer}>
        <TouchableOpacity 
          style={styles.modeSwitchButton}
          onPress={handleSwitchMode}
        >
          <MaterialCommunityIcons name="shopping" size={IconSizes.sm} color={Colors.text.inverse} />
          <Text style={styles.modeSwitchText}>Switch to Buyer Mode</Text>
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
