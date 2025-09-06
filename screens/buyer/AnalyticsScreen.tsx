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

export default function BuyerAnalyticsScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  // Mock buyer analytics data - in real app this would come from API
  const analyticsData = {
    overview: {
      totalSpent: 28450,
      totalOrders: 12,
      avgOrderValue: 2370,
      savedAmount: 3200,
    },
    shopping: {
      thisMonth: {
        orders: 3,
        spent: 4500,
        items: 8,
      },
      lastMonth: {
        orders: 5,
        spent: 7200,
        items: 12,
      },
       categories: [
         { nameKey: 'analytics.buyer.categories.pottery', spent: 12500, orders: 5, percentage: 44 },
         { nameKey: 'analytics.buyer.categories.textiles', spent: 8900, orders: 4, percentage: 31 },
         { nameKey: 'analytics.buyer.categories.woodwork', spent: 4200, orders: 2, percentage: 15 },
         { nameKey: 'analytics.buyer.categories.jewelry', spent: 2850, orders: 1, percentage: 10 },
       ],
    },
    activity: {
      wishlistItems: 7,
      reviewsGiven: 8,
      rewardPoints: 245,
      accountAge: '2 years',
      favoriteShops: 4,
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

   const CategoryBar = ({ 
     nameKey, 
     spent, 
     orders, 
     percentage 
   }: {
     nameKey: string;
     spent: number;
     orders: number;
     percentage: number;
   }) => (
     <View style={styles.categoryRow}>
       <View style={styles.categoryInfo}>
         <Text style={styles.categoryName}>{t(nameKey)}</Text>
         <Text style={styles.categoryDetails}>{t('analytics.buyer.categories.ordersText', { count: orders })}</Text>
       </View>
      <View style={styles.categoryValue}>
        <Text style={styles.categoryAmount}>LKR {spent.toLocaleString()}</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percentage}%` }]} />
          </View>
          <Text style={styles.percentageText}>{percentage}%</Text>
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
          <Text style={styles.headerTitle}>{t('analytics.buyer.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('analytics.buyer.subtitle')}</Text>
        </View>
      </View>

      {/* Overview Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('analytics.buyer.overview.title')}</Text>
        <StatRow
          icon="currency-usd"
          title={t('analytics.buyer.overview.totalSpent')}
          value={`LKR ${analyticsData.overview.totalSpent.toLocaleString()}`}
          subtitle={t('analytics.buyer.overview.totalSpentSubtitle')}
        />
        <StatRow
          icon="clipboard-list"
          title={t('analytics.buyer.overview.totalOrders')}
          value={analyticsData.overview.totalOrders.toString()}
          subtitle={t('analytics.buyer.overview.totalOrdersSubtitle')}
        />
        <StatRow
          icon="calculator"
          title={t('analytics.buyer.overview.avgOrderValue')}
          value={`LKR ${analyticsData.overview.avgOrderValue.toLocaleString()}`}
          subtitle={t('analytics.buyer.overview.avgOrderValueSubtitle')}
        />
        <StatRow
          icon="piggy-bank"
          title={t('analytics.buyer.overview.savedAmount')}
          value={`LKR ${analyticsData.overview.savedAmount.toLocaleString()}`}
          subtitle={t('analytics.buyer.overview.savedAmountSubtitle')}
          color={Colors.success}
        />
      </View>

      {/* Monthly Comparison */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('analytics.buyer.monthlyActivity.title')}</Text>
        <StatRow
          icon="calendar-month"
          title={t('analytics.buyer.monthlyActivity.thisMonthOrders')}
          value={analyticsData.shopping.thisMonth.orders.toString()}
          subtitle={t('analytics.buyer.monthlyActivity.thisMonthOrdersSubtitle', { amount: analyticsData.shopping.thisMonth.spent.toLocaleString() })}
          trend="-40%"
          trendIcon="trending-down"
        />
        <StatRow
          icon="calendar-outline"
          title={t('analytics.buyer.monthlyActivity.lastMonthOrders')}
          value={analyticsData.shopping.lastMonth.orders.toString()}
          subtitle={t('analytics.buyer.monthlyActivity.lastMonthOrdersSubtitle', { amount: analyticsData.shopping.lastMonth.spent.toLocaleString() })}
        />
        <StatRow
          icon="package-variant"
          title={t('analytics.buyer.monthlyActivity.itemsThisMonth')}
          value={analyticsData.shopping.thisMonth.items.toString()}
          subtitle={t('analytics.buyer.monthlyActivity.itemsThisMonthSubtitle')}
          trend="-33%"
          trendIcon="trending-down"
        />
      </View>

      {/* Category Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('analytics.buyer.categories.title')}</Text>
        <Text style={styles.sectionSubtitle}>{t('analytics.buyer.categories.subtitle')}</Text>
         {analyticsData.shopping.categories.map((category, index) => (
           <CategoryBar
             key={index}
             nameKey={category.nameKey}
             spent={category.spent}
             orders={category.orders}
             percentage={category.percentage}
           />
         ))}
      </View>

      {/* Activity Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('analytics.buyer.activity.title')}</Text>
        <StatRow
          icon="heart"
          title={t('analytics.buyer.activity.wishlistItems')}
          value={analyticsData.activity.wishlistItems.toString()}
          subtitle={t('analytics.buyer.activity.wishlistItemsSubtitle')}
        />
        <StatRow
          icon="star"
          title={t('analytics.buyer.activity.reviewsGiven')}
          value={analyticsData.activity.reviewsGiven.toString()}
          subtitle={t('analytics.buyer.activity.reviewsGivenSubtitle')}
        />
        <StatRow
          icon="gift"
          title={t('analytics.buyer.activity.rewardPoints')}
          value={analyticsData.activity.rewardPoints.toString()}
          subtitle={t('analytics.buyer.activity.rewardPointsSubtitle')}
          color={Colors.info}
        />
        <StatRow
          icon="store-plus"
          title={t('analytics.buyer.activity.favoriteShops')}
          value={analyticsData.activity.favoriteShops.toString()}
          subtitle={t('analytics.buyer.activity.favoriteShopsSubtitle')}
        />
        <StatRow
          icon="calendar-clock"
          title={t('analytics.buyer.activity.memberSince')}
          value={analyticsData.activity.accountAge}
          subtitle={t('analytics.buyer.activity.memberSinceSubtitle')}
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
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  categoryDetails: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  categoryValue: {
    alignItems: 'flex-end',
    minWidth: 120,
  },
  categoryAmount: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.sm,
  },
  progressTrack: {
    width: 80,
    height: 4,
    backgroundColor: Colors.border.primary,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  percentageText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
    minWidth: 28,
  },
});
