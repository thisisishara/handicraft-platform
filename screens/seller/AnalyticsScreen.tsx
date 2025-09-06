import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Colors, IconSizes, Spacing, StandardIcons, Typography } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';

export default function SellerAnalyticsScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  // Mock seller analytics data - in real app this would come from API
  const analyticsData = {
    overview: {
      totalRevenue: 156700,
      totalOrders: 42,
      totalProducts: 24,
      avgOrderValue: 3731,
    },
    performance: {
      thisMonth: {
        revenue: 18900,
        orders: 8,
        views: 1247,
        conversion: 0.64,
      },
      lastMonth: {
        revenue: 23400,
        orders: 12,
        views: 1890,
        conversion: 0.63,
      },
      shopRating: 4.8,
      responseTime: '2.5 hours',
      returnRate: 2.1,
    },
    products: [
      { name: 'Traditional Masks', revenue: 45600, orders: 18, views: 342, stock: 12 },
      { name: 'Clay Pottery Set', revenue: 38200, orders: 12, views: 298, stock: 8 },
      { name: 'Handwoven Baskets', revenue: 29800, orders: 8, views: 189, stock: 15 },
      { name: 'Wood Carvings', revenue: 24300, orders: 6, views: 156, stock: 5 },
      { name: 'Batik Fabrics', revenue: 18800, orders: 4, views: 134, stock: 22 },
    ],
    growth: {
      revenueGrowth: -19.4,
      orderGrowth: -33.3,
      viewGrowth: -34.0,
      newCustomers: 6,
      repeatCustomers: 2,
    },
  };

  const StatRow = ({ 
    icon, 
    title, 
    value, 
    subtitle, 
    trend, 
    trendIcon, 
    color = Colors.text.primary 
  }: {
    icon: string;
    title: string;
    value: string;
    subtitle?: string;
    trend?: string;
    trendIcon?: string;
    color?: string;
  }) => (
    <View style={styles.statRow}>
      <View style={styles.statIconContainer}>
        <MaterialCommunityIcons name={icon as any} size={IconSizes.md} color={Colors.primary} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.statValueContainer}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        {trend && (
          <View style={styles.trendContainer}>
            {trendIcon && (
              <MaterialCommunityIcons 
                name={trendIcon as any} 
                size={IconSizes.xs} 
                color={trendIcon.includes('up') ? Colors.success : Colors.error} 
              />
            )}
            <Text style={[styles.trendText, { 
              color: trendIcon?.includes('up') ? Colors.success : Colors.error 
            }]}>
              {trend}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const ProductRow = ({ 
    name, 
    revenue, 
    orders, 
    views, 
    stock 
  }: {
    name: string;
    revenue: number;
    orders: number;
    views: number;
    stock: number;
  }) => (
    <View style={styles.productRow}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productDetails}>{t('analytics.seller.topProducts.ordersAndViews', { orders, views })}</Text>
      </View>
      <View style={styles.productValue}>
        <Text style={styles.productRevenue}>LKR {revenue.toLocaleString()}</Text>
        <View style={styles.stockContainer}>
          <View style={[styles.stockIndicator, { 
            backgroundColor: stock > 10 ? Colors.success : stock > 5 ? Colors.warning : Colors.error 
          }]} />
          <Text style={styles.stockText}>{t('analytics.seller.topProducts.inStock', { count: stock })}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: 90 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name={StandardIcons.back as any} size={IconSizes.md} color={Colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('analytics.seller.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('analytics.seller.subtitle')}</Text>
        </View>
      </View>

      {/* Overview Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('analytics.seller.overview.title')}</Text>
        <StatRow
          icon="currency-usd"
          title={t('analytics.seller.overview.totalRevenue')}
          value={`LKR ${analyticsData.overview.totalRevenue.toLocaleString()}`}
          subtitle={t('analytics.seller.overview.totalRevenueSubtitle')}
          color={Colors.success}
        />
        <StatRow
          icon="clipboard-list"
          title={t('analytics.seller.overview.totalOrders')}
          value={analyticsData.overview.totalOrders.toString()}
          subtitle={t('analytics.seller.overview.totalOrdersSubtitle')}
        />
        <StatRow
          icon="package-variant"
          title={t('analytics.seller.overview.activeProducts')}
          value={analyticsData.overview.totalProducts.toString()}
          subtitle={t('analytics.seller.overview.activeProductsSubtitle')}
        />
        <StatRow
          icon="calculator"
          title={t('analytics.seller.overview.avgOrderValue')}
          value={`LKR ${analyticsData.overview.avgOrderValue.toLocaleString()}`}
          subtitle={t('analytics.seller.overview.avgOrderValueSubtitle')}
        />
      </View>

      {/* Monthly Performance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('analytics.seller.monthlyPerformance.title')}</Text>
        <StatRow
          icon="chart-line"
          title={t('analytics.seller.monthlyPerformance.thisMonthRevenue')}
          value={`LKR ${analyticsData.performance.thisMonth.revenue.toLocaleString()}`}
          subtitle={t('analytics.seller.monthlyPerformance.thisMonthRevenueSubtitle', { count: analyticsData.performance.thisMonth.orders })}
          trend="-19%"
          trendIcon="trending-down"
        />
        <StatRow
          icon="chart-bar"
          title={t('analytics.seller.monthlyPerformance.lastMonthRevenue')}
          value={`LKR ${analyticsData.performance.lastMonth.revenue.toLocaleString()}`}
          subtitle={t('analytics.seller.monthlyPerformance.lastMonthRevenueSubtitle', { count: analyticsData.performance.lastMonth.orders })}
        />
        <StatRow
          icon="eye"
          title={t('analytics.seller.monthlyPerformance.shopViewsThisMonth')}
          value={analyticsData.performance.thisMonth.views.toLocaleString()}
          subtitle={t('analytics.seller.monthlyPerformance.shopViewsThisMonthSubtitle')}
          trend="-34%"
          trendIcon="trending-down"
        />
        <StatRow
          icon="percent"
          title={t('analytics.seller.monthlyPerformance.conversionRate')}
          value={`${analyticsData.performance.thisMonth.conversion}%`}
          subtitle={t('analytics.seller.monthlyPerformance.conversionRateSubtitle')}
          trend="+0.01%"
          trendIcon="trending-up"
        />
      </View>

      {/* Shop Performance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('analytics.seller.shopPerformance.title')}</Text>
        <StatRow
          icon="star"
          title={t('analytics.seller.shopPerformance.shopRating')}
          value={analyticsData.performance.shopRating.toString()}
          subtitle={t('analytics.seller.shopPerformance.shopRatingSubtitle')}
          color={Colors.warning}
        />
        <StatRow
          icon="clock-outline"
          title={t('analytics.seller.shopPerformance.responseTime')}
          value={analyticsData.performance.responseTime}
          subtitle={t('analytics.seller.shopPerformance.responseTimeSubtitle')}
        />
        <StatRow
          icon="undo"
          title={t('analytics.seller.shopPerformance.returnRate')}
          value={`${analyticsData.performance.returnRate}%`}
          subtitle={t('analytics.seller.shopPerformance.returnRateSubtitle')}
          color={Colors.success}
        />
        <StatRow
          icon="account-group"
          title={t('analytics.seller.shopPerformance.newCustomers')}
          value={analyticsData.growth.newCustomers.toString()}
          subtitle={t('analytics.seller.shopPerformance.newCustomersSubtitle')}
        />
        <StatRow
          icon="account-heart"
          title={t('analytics.seller.shopPerformance.repeatCustomers')}
          value={analyticsData.growth.repeatCustomers.toString()}
          subtitle={t('analytics.seller.shopPerformance.repeatCustomersSubtitle')}
        />
      </View>

      {/* Top Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('analytics.seller.topProducts.title')}</Text>
        <Text style={styles.sectionSubtitle}>{t('analytics.seller.topProducts.subtitle')}</Text>
        {analyticsData.products.map((product, index) => (
          <ProductRow
            key={index}
            name={product.name}
            revenue={product.revenue}
            orders={product.orders}
            views={product.views}
            stock={product.stock}
          />
        ))}
      </View>

      {/* Growth Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('analytics.seller.growthTrends.title')}</Text>
        <Text style={styles.sectionSubtitle}>{t('analytics.seller.growthTrends.subtitle')}</Text>
        <StatRow
          icon="trending-up"
          title={t('analytics.seller.growthTrends.revenueGrowth')}
          value={`${analyticsData.growth.revenueGrowth}%`}
          subtitle={t('analytics.seller.growthTrends.revenueGrowthSubtitle')}
          trend={`${analyticsData.growth.revenueGrowth}%`}
          trendIcon="trending-down"
          color={Colors.error}
        />
        <StatRow
          icon="chart-line-variant"
          title={t('analytics.seller.growthTrends.orderGrowth')}
          value={`${analyticsData.growth.orderGrowth}%`}
          subtitle={t('analytics.seller.growthTrends.orderGrowthSubtitle')}
          trend={`${analyticsData.growth.orderGrowth}%`}
          trendIcon="trending-down"
          color={Colors.error}
        />
        <StatRow
          icon="eye-outline"
          title={t('analytics.seller.growthTrends.viewGrowth')}
          value={`${analyticsData.growth.viewGrowth}%`}
          subtitle={t('analytics.seller.growthTrends.viewGrowthSubtitle')}
          trend={`${analyticsData.growth.viewGrowth}%`}
          trendIcon="trending-down"
          color={Colors.error}
        />
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
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  backButton: {
    marginRight: Spacing.md,
    padding: Spacing.sm,
  },
  headerContent: {
    flex: 1,
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
  section: {
    backgroundColor: Colors.background.primary,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  statSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  statValueContainer: {
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  trendText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: 2,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  productDetails: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  productValue: {
    alignItems: 'flex-end',
    minWidth: 120,
  },
  productRevenue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.success,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  stockIndicator: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
  },
  stockText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
});
