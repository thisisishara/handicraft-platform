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
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BorderRadius, Colors, IconSizes, Spacing, Typography } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';

export default function BuyerProfileDetailsScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  // Form state for profile details
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.mobileNumber || '',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    address: '123 Main Street, Colombo 03',
    city: 'Colombo',
    postalCode: '00300',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // In real app, this would save to API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      Alert.alert(t('common.success'), t('buyer.profileDetails.updateSuccess'));
      router.back();
    } catch (error) {
      Alert.alert(t('common.error'), t('buyer.profileDetails.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
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
        <Text style={styles.headerTitle}>{t('buyer.profileDetails.title')}</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Profile Form */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>{t('buyer.profileDetails.personalInformation')}</Text>
        
        <Input
          label={t('buyer.profileDetails.firstName')}
          value={profileData.firstName}
          onChangeText={(text) => handleInputChange('firstName', text)}
          placeholder={t('buyer.profileDetails.firstNamePlaceholder')}
        />
        
        <Input
          label={t('buyer.profileDetails.lastName')}
          value={profileData.lastName}
          onChangeText={(text) => handleInputChange('lastName', text)}
          placeholder={t('buyer.profileDetails.lastNamePlaceholder')}
        />
        
        <Input
          label={t('buyer.profileDetails.emailAddress')}
          value={profileData.email}
          onChangeText={(text) => handleInputChange('email', text)}
          placeholder={t('buyer.profileDetails.emailPlaceholder')}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Input
          label={t('buyer.profileDetails.phoneNumber')}
          value={profileData.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
          placeholder={t('buyer.profileDetails.phonePlaceholder')}
          keyboardType="phone-pad"
        />
        
        <Input
          label={t('buyer.profileDetails.dateOfBirth')}
          value={profileData.dateOfBirth}
          onChangeText={(text) => handleInputChange('dateOfBirth', text)}
          placeholder={t('buyer.profileDetails.dateOfBirthPlaceholder')}
        />
        
        <Input
          label={t('buyer.profileDetails.gender')}
          value={profileData.gender}
          onChangeText={(text) => handleInputChange('gender', text)}
          placeholder={t('buyer.profileDetails.genderPlaceholder')}
        />
      </View>

      {/* Address Information */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>{t('buyer.profileDetails.addressInformation')}</Text>
        
        <Input
          label={t('buyer.profileDetails.streetAddress')}
          value={profileData.address}
          onChangeText={(text) => handleInputChange('address', text)}
          placeholder={t('buyer.profileDetails.addressPlaceholder')}
          multiline
          numberOfLines={2}
        />
        
        <Input
          label={t('buyer.profileDetails.city')}
          value={profileData.city}
          onChangeText={(text) => handleInputChange('city', text)}
          placeholder={t('buyer.profileDetails.cityPlaceholder')}
        />
        
        <Input
          label={t('buyer.profileDetails.postalCode')}
          value={profileData.postalCode}
          onChangeText={(text) => handleInputChange('postalCode', text)}
          placeholder={t('buyer.profileDetails.postalCodePlaceholder')}
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
          title={isLoading ? t('buyer.profileDetails.saving') : t('buyer.profileDetails.saveChanges')}
          onPress={handleSave}
          disabled={isLoading}
          style={styles.saveButton}
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
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
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
