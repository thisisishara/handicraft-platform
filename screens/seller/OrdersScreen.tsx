import { MaterialCommunityIcons } from '@expo/vector-icons';
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
import { BorderRadius, Colors, IconSizes, Shadow, Spacing, StandardIcons, Typography } from '../../constants/Design';

export default function SellerOrdersScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Mock orders data
  const mockOrders = [
    {
      id: '1001',
      customer: 'Priya Silva',
      customerPhone: '+94771234567',
      items: [
        { name: 'Traditional Clay Pot', quantity: 2, price: 1500 },
        { name: 'Handwoven Basket', quantity: 1, price: 2500 }
      ],
      total: 5500,
      status: 'pending',
      date: '2024-01-15',
      address: 'No. 45, Galle Road, Colombo 03',
      paymentMethod: 'Card Payment'
    },
    {
      id: '1002',
      customer: 'Rohan Perera',
      customerPhone: '+94712345678',
      items: [
        { name: 'Wooden Mask', quantity: 1, price: 3500 }
      ],
      total: 3500,
      status: 'processing',
      date: '2024-01-14',
      address: 'Temple Road, Kandy',
      paymentMethod: 'Cash on Delivery'
    },
    {
      id: '1003',
      customer: 'Anuki Fernando',
      customerPhone: '+94723456789',
      items: [
        { name: 'Batik Fabric', quantity: 3, price: 1200 }
      ],
      total: 3600,
      status: 'shipped',
      date: '2024-01-13',
      address: 'Beach Road, Galle',
      paymentMethod: 'Mobile Payment',
      trackingNumber: 'TRK123456'
    },
    {
      id: '1004',
      customer: 'Kasun Jayawardena',
      customerPhone: '+94734567890',
      items: [
        { name: 'Brass Ornament', quantity: 1, price: 4500 }
      ],
      total: 4500,
      status: 'delivered',
      date: '2024-01-12',
      address: 'Main Street, Negombo',
      paymentMethod: 'Bank Transfer'
    }
  ];

  const filters = [t('seller.orders.tabs.all'), t('seller.orders.tabs.pending'), t('seller.orders.tabs.processing'), t('seller.orders.tabs.shipped'), t('seller.orders.tabs.delivered')];

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.includes(searchQuery) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'All' || order.status === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return Colors.warning;
      case 'processing': return Colors.info;
      case 'shipped': return Colors.info;
      case 'delivered': return Colors.success;
      default: return Colors.text.secondary;
    }
  };

  const getNextAction = (status: string) => {
    switch (status) {
      case 'pending': return { text: 'Start Processing', nextStatus: 'processing' };
      case 'processing': return { text: 'Mark as Shipped', nextStatus: 'shipped' };
      case 'shipped': return { text: 'Mark Delivered', nextStatus: 'delivered' };
      default: return null;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    Alert.alert('Success', `Order ${orderId} updated to ${newStatus}`);
  };

  const handleContactCustomer = (customer: string, phone: string) => {
    Alert.alert('Contact Customer', `Call ${customer} at ${phone}?`);
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: 90 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{t('seller.orders.title')}</Text>
          <Text style={styles.subtitle}>{t('seller.orders.subtitle')}</Text>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.controls}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name={StandardIcons.search as any} size={IconSizes.sm} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('seller.orders.searchPlaceholder')}
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
      </View>

      {/* Orders List */}
      <View style={styles.ordersList}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name={StandardIcons.orders as any} size={IconSizes.xxl} color={Colors.text.disabled} />
            <Text style={styles.emptyStateText}>
              {searchQuery ? t('seller.orders.noOrders') : t('seller.orders.noOrders')}
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={styles.orderBasicInfo}>
                  <View style={styles.orderTitleInfo}>
                    <Text style={styles.orderId}>{t('seller.orders.orderNumber', { number: order.id })}</Text>
                    <Text style={styles.customerName}>{order.customer}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}15` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                    {order.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.orderStats}>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="currency-usd" size={16} color="#1F2937" />
                  <Text style={styles.statValue}>Rs. {order.total.toLocaleString()}</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="package-variant" size={16} color="#1F2937" />
                  <Text style={styles.statValue}>{order.items.length} item{order.items.length > 1 ? 's' : ''}</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="credit-card" size={16} color="#1F2937" />
                  <Text style={styles.statValue}>{order.paymentMethod}</Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="map-marker" size={16} color="#1F2937" />
                  <Text style={styles.statValue} numberOfLines={1}>{order.address}</Text>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <Text style={styles.sectionTitle}>Items:</Text>
                {order.items.map((orderItem: any, index: number) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={styles.itemName}>{orderItem.name} × {orderItem.quantity}</Text>
                    <Text style={styles.itemPrice}>Rs. {orderItem.price.toLocaleString()}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.orderActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleContactCustomer(order.customer, order.customerPhone)}
                >
                  <MaterialCommunityIcons name="phone" size={16} color="#3B82F6" />
                  <Text style={styles.actionButtonText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <MaterialCommunityIcons name="message" size={16} color="#10B981" />
                  <Text style={styles.actionButtonText}>Message</Text>
                </TouchableOpacity>

                {getNextAction(order.status) && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.primaryActionButton]}
                    onPress={() => handleStatusUpdate(order.id, getNextAction(order.status)!.nextStatus)}
                  >
                    <Text style={[styles.actionButtonText, styles.primaryActionButtonText]}>
                      {getNextAction(order.status)!.text}
                    </Text>
                  </TouchableOpacity>
                )}
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
  ordersList: {
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
  orderCard: {
    backgroundColor: Colors.card.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.card.border,
    ...Shadow.small,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderBasicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderTitleInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  customerName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  orderDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    textTransform: 'uppercase',
  },
  orderStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  orderDetails: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  itemName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    flex: 1,
  },
  itemPrice: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.background.tertiary,
    paddingTop: Spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
    backgroundColor: Colors.background.tertiary,
    flex: 1,
    marginHorizontal: Spacing.xs,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
  },
  primaryActionButton: {
    backgroundColor: Colors.primary,
    flex: 2,
  },
  primaryActionButtonText: {
    color: Colors.text.inverse,
  },
});