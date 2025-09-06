import React, { useState } from 'react';
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
import { BorderRadius, Colors, Shadow, Spacing, Typography } from '../../constants/Design';

// Mock order data
const mockOrders = [
  {
    id: 'ORD001',
    items: [
      {
        name: 'Traditional Clay Pot',
        price: 'Rs. 2,500',
        quantity: 1,
        image: '🏺',
      }
    ],
    total: 'Rs. 2,650', // Including shipping
    status: 'Delivered',
    orderDate: '2024-08-15',
    deliveryDate: '2024-08-18',
    seller: 'Kamala Pottery',
  },
  {
    id: 'ORD002',
    items: [
      {
        name: 'Handwoven Basket',
        price: 'Rs. 1,800',
        quantity: 2,
        image: '🧺',
      }
    ],
    total: 'Rs. 3,750',
    status: 'Shipped',
    orderDate: '2024-08-20',
    estimatedDelivery: '2024-08-25',
    seller: 'Village Crafts',
    trackingNumber: 'TRK123456789',
  },
  {
    id: 'ORD003',
    items: [
      {
        name: 'Wooden Carved Mask',
        price: 'Rs. 3,200',
        quantity: 1,
        image: '🎭',
      }
    ],
    total: 'Rs. 3,350',
    status: 'Processing',
    orderDate: '2024-08-22',
    seller: 'Traditional Arts',
  },
];

export default function OrdersScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState('All');
  
  const tabs = [t('buyer.orders.tabs.all'), t('buyer.orders.tabs.processing'), t('buyer.orders.tabs.shipped'), t('buyer.orders.tabs.delivered')];

  const filteredOrders = mockOrders.filter(order => {
    if (selectedTab === 'All') return true;
    return order.status === selectedTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return { backgroundColor: `${Colors.warning}15`, color: Colors.warning };
      case 'Shipped':
        return { backgroundColor: `${Colors.info}15`, color: Colors.info };
      case 'Delivered':
        return { backgroundColor: `${Colors.success}15`, color: Colors.success };
      default:
        return { backgroundColor: Colors.background.tertiary, color: Colors.text.secondary };
    }
  };

  const handleOrderPress = (order: any) => {
    Alert.alert(
      `${t('common.order')} ${order.id}`,
      `Status: ${order.status}\nTotal: ${order.total}\nSeller: ${order.seller}\n\nItems:\n${order.items.map((item: any) => `• ${item.name} (x${item.quantity})`).join('\n')}`,
      [
        { text: t('common.close'), style: 'cancel' },
        ...(order.status === 'Delivered' ? [{ text: t('common.rateAndReview') }] : []),
        ...(order.trackingNumber ? [{ text: t('common.track') }] : []),
      ]
    );
  };

  const handleReorder = (order: any) => {
    Alert.alert(t('common.reorder'), t('common.reorderConfirmation', { count: order.items.length }));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{t('buyer.orders.title')}</Text>
          <Text style={styles.subtitle}>{t('buyer.orders.subtitle')}</Text>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.tabContainer}
        contentContainerStyle={styles.tabScrollContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView 
        style={styles.orderList}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {filteredOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            onPress={() => handleOrderPress(order)}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>{t('common.order')} {order.id}</Text>
                <Text style={styles.orderDate}>{order.orderDate}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(order.status).backgroundColor },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(order.status).color },
                  ]}
                >
                  {order.status}
                </Text>
              </View>
            </View>

            <View style={styles.orderItems}>
              {order.items.map((item, index) => (
                <View key={index} style={styles.orderItem}>
                  <Text style={styles.itemEmoji}>{item.image}</Text>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDetails}>
                      {t('common.quantity')}: {item.quantity} • {item.price}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.orderFooter}>
              <View style={styles.orderTotal}>
                <Text style={styles.totalLabel}>{t('common.total')}: </Text>
                <Text style={styles.totalAmount}>{order.total}</Text>
              </View>
              
              <View style={styles.orderActions}>
                {order.status === 'Delivered' && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleReorder(order)}
                  >
                    <Text style={styles.actionButtonText}>{t('common.reorder')}</Text>
                  </TouchableOpacity>
                )}
                {order.trackingNumber && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryAction]}
                    onPress={() => Alert.alert(t('common.tracking'), t('common.trackingNumber', { number: order.trackingNumber }))}
                  >
                    <Text style={[styles.actionButtonText, styles.primaryActionText]}>
                      {t('common.track')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {order.estimatedDelivery && (
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryText}>
                  📅 {t('common.estimatedDelivery', { date: order.estimatedDelivery })}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {filteredOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              {selectedTab === t('buyer.orders.tabs.all') 
                ? t('buyer.orders.noOrders') 
                : t('buyer.orders.noOrdersForStatus', { status: selectedTab.toLowerCase() })
              }
            </Text>
            <Text style={styles.emptyStateText}>
              {selectedTab === t('buyer.orders.tabs.all')
                ? t('buyer.orders.startShoppingMessage')
                : t('buyer.orders.noOrdersWithStatus', { status: selectedTab.toLowerCase() })
              }
            </Text>
          </View>
        )}
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
  tabContainer: {
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
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
    minWidth: 100,
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
  orderList: {
    flex: 1,
    padding: Spacing.lg,
  },
  orderCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    overflow: 'hidden',
    ...Shadow.small,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  orderInfo: {},
  orderId: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  orderDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  orderItems: {
    padding: Spacing.lg,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  itemEmoji: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  itemDetails: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  orderTotal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  totalAmount: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.success,
  },
  orderActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background.tertiary,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  primaryAction: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
  },
  primaryActionText: {
    color: Colors.text.inverse,
  },
  deliveryInfo: {
    backgroundColor: `${Colors.info}10`,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  deliveryText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.info,
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.massive,
  },
  emptyStateTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});
