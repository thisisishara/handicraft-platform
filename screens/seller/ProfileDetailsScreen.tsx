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
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AIGenerationModal } from '../../components/ui/AIGenerationModal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BorderRadius, Colors, IconSizes, Spacing, Typography } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';
import { GeneratedShopData } from '../../services/aiService';

export default function SellerProfileDetailsScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  // Form state for profile details
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.mobileNumber || '',
    dateOfBirth: '1985-03-15',
    gender: 'Female',
    address: '456 Craft Street, Kandy',
    city: 'Kandy',
    postalCode: '20000',
  });

  // Form state for shop details
  const [shopData, setShopData] = useState({
    shopName: 'Traditional Crafts Lanka',
    description: 'Authentic Sri Lankan handicrafts made with traditional techniques passed down through generations.',
    contactEmail: 'shop@example.com',
    contactPhone: '+94 77 123 4567',
    website: 'www.traditionalcraftslanka.com',
    businessAddress: '456 Craft Street, Kandy',
    businessCity: 'Kandy',
    businessPostalCode: '20000',
    businessHours: '9:00 AM - 6:00 PM',
    specialties: 'Wood carving, Traditional masks, Handwoven textiles',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  const handleAIGeneration = (generatedData: GeneratedShopData) => {
    // Update shop data with AI-generated content
    setShopData(prev => ({
      ...prev,
      shopName: generatedData.shopName,
      description: generatedData.description,
      specialties: generatedData.specialties,
      businessHours: generatedData.businessHours,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // In real app, this would save to API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      Alert.alert(t('common.success'), t('seller.profileDetails.updateSuccess'));
      router.back();
    } catch (error) {
      Alert.alert(t('common.error'), t('seller.profileDetails.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleShopInputChange = (field: string, value: string) => {
    setShopData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={IconSizes.md} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('seller.profileDetails.title')}</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Personal Information */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>{t('seller.profileDetails.personalInformation')}</Text>
        
        <Input
          label={t('seller.profileDetails.firstName')}
          value={profileData.firstName}
          onChangeText={(text) => handleProfileInputChange('firstName', text)}
          placeholder={t('seller.profileDetails.firstNamePlaceholder')}
        />
        
        <Input
          label={t('seller.profileDetails.lastName')}
          value={profileData.lastName}
          onChangeText={(text) => handleProfileInputChange('lastName', text)}
          placeholder={t('seller.profileDetails.lastNamePlaceholder')}
        />
        
        <Input
          label={t('seller.profileDetails.emailAddress')}
          value={profileData.email}
          onChangeText={(text) => handleProfileInputChange('email', text)}
          placeholder={t('seller.profileDetails.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Input
          label={t('seller.profileDetails.phoneNumber')}
          value={profileData.phone}
          onChangeText={(text) => handleProfileInputChange('phone', text)}
          placeholder={t('seller.profileDetails.phonePlaceholder')}
          keyboardType="phone-pad"
        />
        
        <Input
          label={t('seller.profileDetails.dateOfBirth')}
          value={profileData.dateOfBirth}
          onChangeText={(text) => handleProfileInputChange('dateOfBirth', text)}
          placeholder={t('seller.profileDetails.dateOfBirthPlaceholder')}
        />
        
        <Input
          label={t('seller.profileDetails.gender')}
          value={profileData.gender}
          onChangeText={(text) => handleProfileInputChange('gender', text)}
          placeholder={t('seller.profileDetails.genderPlaceholder')}
        />
      </View>

      {/* Address Information */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>{t('seller.profileDetails.personalAddress')}</Text>
        
        <Input
          label={t('seller.profileDetails.streetAddress')}
          value={profileData.address}
          onChangeText={(text) => handleProfileInputChange('address', text)}
          placeholder={t('seller.profileDetails.addressPlaceholder')}
          multiline
          numberOfLines={2}
        />
        
        <Input
          label={t('seller.profileDetails.city')}
          value={profileData.city}
          onChangeText={(text) => handleProfileInputChange('city', text)}
          placeholder={t('seller.profileDetails.cityPlaceholder')}
        />
        
        <Input
          label={t('seller.profileDetails.postalCode')}
          value={profileData.postalCode}
          onChangeText={(text) => handleProfileInputChange('postalCode', text)}
          placeholder={t('seller.profileDetails.postalCodePlaceholder')}
        />
      </View>

      {/* Shop Information */}
      <View style={styles.formSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('seller.profileDetails.shopInformation')}</Text>
          <TouchableOpacity
            style={styles.aiButton}
            onPress={() => setShowAIModal(true)}
          >
            <MaterialCommunityIcons name="magic-staff" size={IconSizes.sm} color={Colors.primary} />
            <Text style={styles.aiButtonText}>{t('seller.aiGeneration.generate')}</Text>
          </TouchableOpacity>
        </View>
        
        <Input
          label={t('seller.profileDetails.shopName')}
          value={shopData.shopName}
          onChangeText={(text) => handleShopInputChange('shopName', text)}
          placeholder={t('seller.profileDetails.shopNamePlaceholder')}
        />
        
        <Input
          label={t('seller.profileDetails.shopDescription')}
          value={shopData.description}
          onChangeText={(text) => handleShopInputChange('description', text)}
          placeholder={t('seller.profileDetails.shopDescriptionPlaceholder')}
          multiline
          numberOfLines={3}
        />
        
        <Input
          label={t('seller.profileDetails.businessEmail')}
          value={shopData.contactEmail}
          onChangeText={(text) => handleShopInputChange('contactEmail', text)}
          placeholder={t('seller.profileDetails.businessEmailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Input
          label={t('seller.profileDetails.businessPhone')}
          value={shopData.contactPhone}
          onChangeText={(text) => handleShopInputChange('contactPhone', text)}
          placeholder={t('seller.profileDetails.businessPhonePlaceholder')}
          keyboardType="phone-pad"
        />
        
        <Input
          label={t('seller.profileDetails.website')}
          value={shopData.website}
          onChangeText={(text) => handleShopInputChange('website', text)}
          placeholder={t('seller.profileDetails.websitePlaceholder')}
          autoCapitalize="none"
        />
        
        <Input
          label={t('seller.profileDetails.specialties')}
          value={shopData.specialties}
          onChangeText={(text) => handleShopInputChange('specialties', text)}
          placeholder={t('seller.profileDetails.specialtiesPlaceholder')}
          multiline
          numberOfLines={2}
        />
      </View>

      {/* Business Address */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>{t('seller.profileDetails.businessAddress')}</Text>
        
        <Input
          label={t('seller.profileDetails.businessAddressField')}
          value={shopData.businessAddress}
          onChangeText={(text) => handleShopInputChange('businessAddress', text)}
          placeholder={t('seller.profileDetails.businessAddressPlaceholder')}
          multiline
          numberOfLines={2}
        />
        
        <Input
          label={t('seller.profileDetails.businessCity')}
          value={shopData.businessCity}
          onChangeText={(text) => handleShopInputChange('businessCity', text)}
          placeholder={t('seller.profileDetails.businessCityPlaceholder')}
        />
        
        <Input
          label={t('seller.profileDetails.businessPostalCode')}
          value={shopData.businessPostalCode}
          onChangeText={(text) => handleShopInputChange('businessPostalCode', text)}
          placeholder={t('seller.profileDetails.businessPostalCodePlaceholder')}
        />
        
        <Input
          label={t('seller.profileDetails.businessHours')}
          value={shopData.businessHours}
          onChangeText={(text) => handleShopInputChange('businessHours', text)}
          placeholder={t('seller.profileDetails.businessHoursPlaceholder')}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          title={t('common.cancel')}
          onPress={() => router.back()}
          variant="outline"
          style={styles.cancelButton}
        />
        <Button
          title={isLoading ? t('seller.profileDetails.saving') : t('seller.profileDetails.saveChanges')}
          onPress={handleSave}
          disabled={isLoading}
          style={styles.saveButton}
        />
      </View>

      {/* AI Generation Modal */}
      <AIGenerationModal
        visible={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleAIGeneration}
      />
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  headerPlaceholder: {
    width: 40,
  },
  formSection: {
    backgroundColor: Colors.background.primary,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    flex: 1,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
    gap: Spacing.xs,
  },
  aiButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
    backgroundColor: Colors.background.primary,
    marginTop: Spacing.sm,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});
