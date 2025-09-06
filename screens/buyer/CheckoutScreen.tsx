import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
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
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Colors, IconSizes, StandardIcons } from '../../constants/Design';
import { PaymentMethod, useCart } from '../../contexts/CartContext';

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    type: 'card',
    name: 'Credit/Debit Card',
    details: 'Visa, Mastercard, American Express',
  },
  {
    id: 'mobile',
    type: 'mobile',
    name: 'Mobile Payment',
    details: 'Dialog, Mobitel, Airtel, Hutch',
  },
  {
    id: 'bank',
    type: 'bank',
    name: 'Bank Transfer',
    details: 'Online banking or ATM transfer',
  },
  {
    id: 'cod',
    type: 'cod',
    name: 'Cash on Delivery',
    details: 'Pay when you receive your order',
    isDefault: true,
  },
];

export default function CheckoutScreen() {
  const { t } = useTranslation();
  const { 
    items, 
    totalAmount, 
    selectedPaymentMethod,
    setPaymentMethod,
    clearCart 
  } = useCart();
  const insets = useSafeAreaInsets();

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(
    selectedPaymentMethod || paymentMethods.find(p => p.isDefault) || paymentMethods[0]
  );

  // Delivery information
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: '',
    specialInstructions: '',
  });

  // Payment details for card
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  // Mobile payment details
  const [mobileDetails, setMobileDetails] = useState({
    phoneNumber: '',
    provider: 'Dialog',
  });

  // Calculate totals
  const subtotal = totalAmount;
  const deliveryFee = subtotal > 2000 ? 0 : 250;
  const finalTotal = subtotal + deliveryFee;

  const handlePaymentSelect = (payment: PaymentMethod) => {
    setSelectedPayment(payment);
    setPaymentMethod(payment);
  };

  const validateForm = () => {
    // Validate delivery info
    if (!deliveryInfo.fullName.trim()) {
      Alert.alert(t('buyer.checkout.missingInformation'), t('buyer.checkout.enterFullName'));
      return false;
    }
    if (!deliveryInfo.phoneNumber.trim()) {
      Alert.alert(t('buyer.checkout.missingInformation'), t('buyer.checkout.enterPhoneNumber'));
      return false;
    }
    if (!deliveryInfo.address.trim()) {
      Alert.alert(t('buyer.checkout.missingInformation'), t('buyer.checkout.enterAddress'));
      return false;
    }
    if (!deliveryInfo.city.trim()) {
      Alert.alert(t('buyer.checkout.missingInformation'), t('buyer.checkout.enterCity'));
      return false;
    }

    // Validate payment method specific fields
    if (selectedPayment.type === 'card') {
      if (!cardDetails.cardNumber.trim() || !cardDetails.expiryDate.trim() || 
          !cardDetails.cvv.trim() || !cardDetails.cardholderName.trim()) {
        Alert.alert(t('buyer.checkout.missingInformation'), t('buyer.checkout.fillCardDetails'));
        return false;
      }
    } else if (selectedPayment.type === 'mobile') {
      if (!mobileDetails.phoneNumber.trim()) {
        Alert.alert(t('buyer.checkout.missingInformation'), t('buyer.checkout.enterMobileNumber'));
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    Alert.alert(
      t('buyer.checkout.confirmOrder'),
      t('buyer.checkout.confirmOrderMessage', { total: finalTotal.toLocaleString(), payment: selectedPayment.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('buyer.checkout.confirm'), 
          onPress: () => {
            // In real app, this would process the payment and create order
            clearCart();
            Alert.alert(
              t('buyer.checkout.orderPlaced'),
              t('buyer.checkout.orderPlacedMessage'),
              [
                { 
                  text: t('common.ok'), 
                  onPress: () => router.replace('/buyer/orders')
                }
              ]
            );
          }
        },
      ]
    );
  };

  const renderPaymentMethodIcon = (type: string) => {
    const icons = {
      card: 'credit-card',
      mobile: 'cellphone',
      bank: 'bank',
      cod: 'cash',
    };
    return <MaterialCommunityIcons name={icons[type as keyof typeof icons] as any} size={IconSizes.sm} color={Colors.text.secondary} />;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name={StandardIcons.back as any} size={IconSizes.md} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('buyer.checkout.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('buyer.checkout.orderSummary', { count: items.length })}</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.orderItemEmoji}>{item.image}</Text>
              <View style={styles.orderItemDetails}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemSeller}>{item.shopName}</Text>
              </View>
              <View style={styles.orderItemPricing}>
                <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
                <Text style={styles.orderItemPrice}>Rs. {(item.price * item.quantity).toLocaleString()}</Text>
              </View>
            </View>
          ))}
          
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('buyer.checkout.subtotal')}</Text>
              <Text style={styles.summaryValue}>Rs. {subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('buyer.checkout.deliveryFee')}</Text>
              <Text style={[
                styles.summaryValue,
                deliveryFee === 0 && styles.freeDelivery
              ]}>
                {deliveryFee === 0 ? t('buyer.checkout.free') : `Rs. ${deliveryFee.toLocaleString()}`}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>{t('buyer.checkout.total')}</Text>
              <Text style={styles.totalValue}>Rs. {finalTotal.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('buyer.checkout.deliveryInformation')}</Text>
          
          <View style={styles.formGrid}>
            <Input
              label={t('buyer.checkout.fullName')}
              value={deliveryInfo.fullName}
              onChangeText={(text) => setDeliveryInfo(prev => ({ ...prev, fullName: text }))}
              placeholder={t('buyer.checkout.fullNamePlaceholder')}
              style={styles.fullWidthInput}
            />
            
            <Input
              label={t('buyer.checkout.phoneNumber')}
              value={deliveryInfo.phoneNumber}
              onChangeText={(text) => setDeliveryInfo(prev => ({ ...prev, phoneNumber: text }))}
              placeholder={t('buyer.checkout.phoneNumberPlaceholder')}
              keyboardType="phone-pad"
              style={styles.fullWidthInput}
            />
            
            <Input
              label={t('buyer.checkout.address')}
              value={deliveryInfo.address}
              onChangeText={(text) => setDeliveryInfo(prev => ({ ...prev, address: text }))}
              placeholder={t('buyer.checkout.addressPlaceholder')}
              multiline
              numberOfLines={2}
              style={styles.fullWidthInput}
            />
            
            <View style={styles.row}>
              <Input
                label={t('buyer.checkout.city')}
                value={deliveryInfo.city}
                onChangeText={(text) => setDeliveryInfo(prev => ({ ...prev, city: text }))}
                placeholder={t('buyer.checkout.cityPlaceholder')}
                style={styles.halfWidthInput}
              />
              
              <Input
                label={t('buyer.checkout.postalCode')}
                value={deliveryInfo.postalCode}
                onChangeText={(text) => setDeliveryInfo(prev => ({ ...prev, postalCode: text }))}
                placeholder={t('buyer.checkout.postalCodePlaceholder')}
                keyboardType="numeric"
                style={styles.halfWidthInput}
              />
            </View>
            
            <Input
              label={t('buyer.checkout.specialInstructions')}
              value={deliveryInfo.specialInstructions}
              onChangeText={(text) => setDeliveryInfo(prev => ({ ...prev, specialInstructions: text }))}
              placeholder={t('buyer.checkout.specialInstructionsPlaceholder')}
              multiline
              numberOfLines={2}
              style={styles.fullWidthInput}
            />
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('buyer.checkout.paymentMethod')}</Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedPayment.id === method.id && styles.selectedPaymentMethod
              ]}
              onPress={() => handlePaymentSelect(method)}
            >
              <View style={styles.paymentMethodInfo}>
                {renderPaymentMethodIcon(method.type)}
                <View style={styles.paymentMethodText}>
                  <Text style={styles.paymentMethodName}>{method.name}</Text>
                  <Text style={styles.paymentMethodDetails}>{method.details}</Text>
                </View>
              </View>
              <View style={styles.radioButton}>
                {selectedPayment.id === method.id && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Payment Method Details */}
          {selectedPayment.type === 'card' && (
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentDetailsTitle}>Card Details</Text>
              <View style={styles.formGrid}>
                <Input
                  label={t('buyer.checkout.cardNumber')}
                  value={cardDetails.cardNumber}
                  onChangeText={(text) => setCardDetails(prev => ({ ...prev, cardNumber: text }))}
                  placeholder={t('buyer.checkout.cardNumberPlaceholder')}
                  keyboardType="numeric"
                  style={styles.fullWidthInput}
                />
                
                <View style={styles.row}>
                  <Input
                    label={t('buyer.checkout.expiryDate')}
                    value={cardDetails.expiryDate}
                    onChangeText={(text) => setCardDetails(prev => ({ ...prev, expiryDate: text }))}
                    placeholder={t('buyer.checkout.expiryDatePlaceholder')}
                    keyboardType="numeric"
                    style={styles.halfWidthInput}
                  />
                  
                  <Input
                    label={t('buyer.checkout.cvv')}
                    value={cardDetails.cvv}
                    onChangeText={(text) => setCardDetails(prev => ({ ...prev, cvv: text }))}
                    placeholder={t('buyer.checkout.cvvPlaceholder')}
                    keyboardType="numeric"
                    secureTextEntry
                    style={styles.halfWidthInput}
                  />
                </View>
                
                <Input
                  label={t('buyer.checkout.cardholderName')}
                  value={cardDetails.cardholderName}
                  onChangeText={(text) => setCardDetails(prev => ({ ...prev, cardholderName: text }))}
                  placeholder={t('buyer.checkout.cardholderNamePlaceholder')}
                  style={styles.fullWidthInput}
                />
              </View>
            </View>
          )}

          {selectedPayment.type === 'mobile' && (
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentDetailsTitle}>{t('buyer.checkout.mobilePaymentDetails')}</Text>
              <View style={styles.formGrid}>
                <View style={styles.providerSelection}>
                  <Text style={styles.inputLabel}>{t('buyer.checkout.provider')}</Text>
                  <View style={styles.providerGrid}>
                    {['Dialog', 'Mobitel', 'Airtel', 'Hutch'].map((provider) => (
                      <TouchableOpacity
                        key={provider}
                        style={[
                          styles.providerButton,
                          mobileDetails.provider === provider && styles.selectedProvider
                        ]}
                        onPress={() => setMobileDetails(prev => ({ ...prev, provider }))}
                      >
                        <Text style={[
                          styles.providerText,
                          mobileDetails.provider === provider && styles.selectedProviderText
                        ]}>
                          {provider}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <Input
                  label={t('buyer.checkout.mobileNumber')}
                  value={mobileDetails.phoneNumber}
                  onChangeText={(text) => setMobileDetails(prev => ({ ...prev, phoneNumber: text }))}
                  placeholder={t('buyer.checkout.mobileNumberPlaceholder')}
                  keyboardType="phone-pad"
                  style={styles.fullWidthInput}
                />
              </View>
            </View>
          )}

          {selectedPayment.type === 'bank' && (
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentDetailsTitle}>Bank Transfer Instructions</Text>
              <Text style={styles.bankInstructions}>
                After placing your order, you will receive bank account details via SMS and email. 
                Please transfer the exact amount and send the payment receipt to confirm your order.
              </Text>
            </View>
          )}

          {selectedPayment.type === 'cod' && (
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentDetailsTitle}>Cash on Delivery</Text>
              <Text style={styles.codInstructions}>
                Pay with cash when your order is delivered. Please have the exact amount ready.
                Additional delivery charges may apply for COD orders.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Checkout Section */}
      <View style={[styles.checkoutSection, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.checkoutSummary}>
          <Text style={styles.checkoutTotal}>Rs. {finalTotal.toLocaleString()}</Text>
          <Text style={styles.checkoutMethod}>{selectedPayment.name}</Text>
        </View>
        <Button
          title={t('buyer.checkout.placeOrder')}
          onPress={handlePlaceOrder}
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.background.primary,
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  orderItemEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  orderItemSeller: {
    fontSize: 12,
    color: '#6B7280',
  },
  orderItemPricing: {
    alignItems: 'flex-end',
  },
  orderItemQuantity: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  orderSummary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  freeDelivery: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  formGrid: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  fullWidthInput: {
    flex: 1,
  },
  halfWidthInput: {
    flex: 1,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPaymentMethod: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  paymentMethodText: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  paymentMethodDetails: {
    fontSize: 12,
    color: '#6B7280',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  paymentDetails: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
  },
  paymentDetailsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  providerSelection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  providerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  providerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.background.primary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  selectedProvider: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  providerText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedProviderText: {
    color: '#FFFFFF',
  },
  bankInstructions: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  codInstructions: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  checkoutSection: {
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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
  checkoutMethod: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  checkoutButton: {
    minWidth: 120,
  },
});
