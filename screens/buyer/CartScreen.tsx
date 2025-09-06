import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/Design';
import { useCart } from '../../contexts/CartContext';

export default function CartScreen() {
  const { t } = useTranslation();
  const { 
    items, 
    totalItems, 
    totalAmount, 
    removeItem, 
    updateQuantity, 
    clearCart 
  } = useCart();
  const insets = useSafeAreaInsets();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<null | { code: string; discount: number }>(null);

  // Calculate totals
  const subtotal = totalAmount;
  const deliveryFee = subtotal > 2000 ? 0 : 250;
  const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discount / 100) : 0;
  const finalTotal = subtotal + deliveryFee - promoDiscount;

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        handleRemoveItem(id);
      } else {
        updateQuantity(id, newQuantity);
      }
    }
  };

  const handleRemoveItem = (id: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeItem(id) },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: () => clearCart() },
      ]
    );
  };

  const handleApplyPromo = () => {
    // Mock promo code validation
    const validPromoCodes = {
      'FIRST10': 10,
      'SAVE5': 5,
      'WELCOME15': 15,
    };

    if (validPromoCodes[promoCode as keyof typeof validPromoCodes]) {
      setAppliedPromo({
        code: promoCode,
        discount: validPromoCodes[promoCode as keyof typeof validPromoCodes]
      });
      Alert.alert('Success!', `Promo code applied. You saved ${validPromoCodes[promoCode as keyof typeof validPromoCodes]}%!`);
    } else {
      Alert.alert(t('common.error'), t('buyer.cart.errorInvalidPromo'));
    }
    setPromoCode('');
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert(t('common.error'), t('buyer.cart.errorEmptyCart'));
      return;
    }
    router.push('/buyer/checkout');
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImage}>
        <Text style={styles.itemEmoji}>{item.image}</Text>
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <TouchableOpacity 
          onPress={() => router.push(`/buyer/shop-details?id=${item.sellerId}&name=${encodeURIComponent(item.shopName)}`)}
        >
          <Text style={styles.itemSeller}>{item.shopName}</Text>
        </TouchableOpacity>
        <Text style={styles.itemPrice}>Rs. {item.price.toLocaleString()}</Text>
      </View>
      <View style={styles.itemActions}>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, -1)}
          >
            <MaterialCommunityIcons name="minus" size={16} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, 1)}
          >
            <MaterialCommunityIcons name="plus" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.id)}
        >
          <MaterialCommunityIcons name="delete-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('buyer.cart.title')}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.emptyCart}>
          <MaterialCommunityIcons name="cart-outline" size={120} color="#D1D5DB" />
          <Text style={styles.emptyCartTitle}>{t('buyer.cart.emptyCart')}</Text>
          <Text style={styles.emptyCartSubtitle}>
            {t('buyer.cart.emptyCartMessage')}
          </Text>
          <Button
            title={t('buyer.cart.continueShopping')}
            onPress={() => router.push('/buyer/shop')}
            style={styles.startShoppingButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('buyer.cart.title')} ({totalItems})</Text>
        <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
          <MaterialCommunityIcons name="delete-sweep" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {/* Cart Items */}
        <View style={styles.cartSection}>
          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          />
        </View>

        {/* Promo Code Section */}
        <View style={styles.promoSection}>
          <Text style={styles.sectionTitle}>{t('buyer.cart.promoCode')}</Text>
          {appliedPromo ? (
            <View style={styles.appliedPromo}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
              <Text style={styles.appliedPromoText}>
                {t('buyer.cart.promoApplied', { code: appliedPromo.code, discount: appliedPromo.discount })}
              </Text>
              <TouchableOpacity onPress={() => setAppliedPromo(null)}>
                <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.promoInput}>
              <View style={styles.promoInputField}>
                <MaterialCommunityIcons name="ticket" size={20} color="#6B7280" />
                <TextInput
                  style={styles.promoCode}
                  onChangeText={setPromoCode}
                  placeholder={t('buyer.cart.promoPlaceholder')}
                  value={promoCode}
                />
              </View>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={handleApplyPromo}
                disabled={!promoCode.trim()}
              >
                <Text style={[
                  styles.applyButtonText,
                  !promoCode.trim() && styles.disabledText
                ]}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.promoHint}>
            Try: FIRST10, SAVE5, WELCOME15
          </Text>
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>{t('buyer.cart.orderSummary')}</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('buyer.cart.subtotal', { count: totalItems })}</Text>
            <Text style={styles.summaryValue}>Rs. {subtotal.toLocaleString()}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('buyer.cart.deliveryFee')}</Text>
            <Text style={[
              styles.summaryValue,
              deliveryFee === 0 && styles.freeDelivery
            ]}>
              {deliveryFee === 0 ? t('buyer.cart.free') : `Rs. ${deliveryFee.toLocaleString()}`}
            </Text>
          </View>
          
          {deliveryFee > 0 && (
            <Text style={styles.freeDeliveryHint}>
              {t('buyer.cart.freeDeliveryHint', { amount: (2000 - subtotal).toLocaleString() })}
            </Text>
          )}

          {appliedPromo && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('buyer.cart.promoDiscount')} ({appliedPromo.code})</Text>
              <Text style={styles.discountValue}>-Rs. {promoDiscount.toLocaleString()}</Text>
            </View>
          )}
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>{t('buyer.cart.total')}</Text>
            <Text style={styles.totalValue}>Rs. {finalTotal.toLocaleString()}</Text>
          </View>
        </View>

        {/* Recommended Products */}
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>{t('buyer.cart.recommended')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { id: 'rec1', name: 'Handwoven Basket', price: 1800, image: '🧺' },
              { id: 'rec2', name: 'Brass Oil Lamp', price: 2200, image: '🪔' },
              { id: 'rec3', name: 'Batik Wall Art', price: 4500, image: '🎨' },
            ].map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.recommendationCard}
                onPress={() => router.push(`/buyer/product-details?id=${product.id}`)}
              >
                <Text style={styles.recommendationImage}>{product.image}</Text>
                <Text style={styles.recommendationName}>{product.name}</Text>
                <Text style={styles.recommendationPrice}>Rs. {product.price.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Checkout Section */}
      <View style={[styles.checkoutSection, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.checkoutSummary}>
          <Text style={styles.checkoutTotal}>Rs. {finalTotal.toLocaleString()}</Text>
          <Text style={styles.checkoutItems}>{t('buyer.cart.itemCount', { count: totalItems })}</Text>
        </View>
        <Button
          title={t('buyer.cart.proceedToCheckout')}
          onPress={handleCheckout}
          style={styles.checkoutButton}
        />
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  clearButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  startShoppingButton: {
    minWidth: 160,
  },
  cartSection: {
    backgroundColor: Colors.background.primary,
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  itemSeller: {
    fontSize: 12,
    color: Colors.primary,
    marginBottom: 4,
    textDecorationLine: 'underline',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  itemActions: {
    alignItems: 'center',
    gap: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 4,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: Colors.border.primary,
    marginVertical: 8,
  },
  promoSection: {
    backgroundColor: Colors.background.primary,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  appliedPromo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  appliedPromoText: {
    flex: 1,
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  promoInput: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInputField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  promoCode: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  applyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  promoHint: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  summarySection: {
    backgroundColor: Colors.background.primary,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  freeDelivery: {
    color: Colors.success,
    fontWeight: 'bold',
  },
  freeDeliveryHint: {
    fontSize: 12,
    color: Colors.primary,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  discountValue: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border.primary,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  recommendationsSection: {
    backgroundColor: Colors.background.primary,
    marginHorizontal: 16,
    marginBottom: 100,
    borderRadius: 12,
    padding: 16,
  },
  recommendationCard: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    padding: 8,
  },
  recommendationImage: {
    fontSize: 24,
    marginBottom: 4,
  },
  recommendationName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  recommendationPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  checkoutSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  checkoutSummary: {
    flex: 1,
  },
  checkoutTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  checkoutItems: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  checkoutButton: {
    minWidth: 160,
  },
});
