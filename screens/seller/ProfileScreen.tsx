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

export default function SellerProfileScreen() {
  const { t, i18n } = useTranslation();
  const { user, logout, switchMode } = useAuth();
  const insets = useSafeAreaInsets();


  const handleSwitchMode = async () => {
    Alert.alert(
      t('seller.profile.switchToBuyerModeTitle'),
      t('seller.profile.switchToBuyerModeMessage'),
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

  const handleLanguageSwitch = () => {
    const newLanguage = i18n.language === 'en' ? 'si' : 'en';
    i18n.changeLanguage(newLanguage);
    const languageName = newLanguage === 'en' ? t('common.english') : t('common.sinhala');
    Alert.alert(t('common.languageChanged'), t('common.languageSwitchMessage', { language: languageName }));
  };

  const handleLogout = async () => {
    Alert.alert(
      t('common.logout'),
      t('common.logoutConfirmation'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.logout'), 
          onPress: async () => {
            try {
              await logout();
              router.replace('/auth/login');
            } catch (error) {
              Alert.alert(t('common.error'), t('common.logoutError'));
            }
          }
        },
      ]
    );
  };


  // Mock seller stats - in real app this would come from API
  const sellerStats = {
    totalProducts: 24,
    totalSales: 15600,
    monthlyOrders: 42,
    rating: 4.8,
    accountAge: 'March 2020'
  };

  // Profile menu items
  const profileMenuItems = [
    {
      id: '1',
      title: t('seller.profile.orderHistory'),
      subtitle: t('seller.profile.orderHistorySubtitle'),
      icon: StandardIcons.orders,
      onPress: () => router.push('/seller/orders')
    },
    {
      id: '2', 
      title: t('seller.profile.productManagement'),
      subtitle: t('seller.profile.productManagementSubtitle'),
      icon: StandardIcons.products,
      onPress: () => router.push('/seller/products')
    },
    {
      id: '3',
      title: t('seller.profile.profileDetails'),
      subtitle: t('seller.profile.profileDetailsSubtitle'),
      icon: 'account-edit',
      onPress: () => router.push('/seller/profile-details')
    }
  ];

  // Support menu items
  const supportMenuItems = [
    {
      id: '1',
      title: t('seller.profile.helpCenter'),
      subtitle: t('seller.profile.helpCenterSubtitle'),
      icon: 'help-circle',
      onPress: () => router.push('/seller/support')
    },
    {
      id: '2',
      title: t('seller.profile.contactSupport'),
      subtitle: t('seller.profile.contactSupportSubtitle'),
      icon: 'message-text',
      onPress: () => router.push('/seller/support')
    }
  ];

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: 90 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('seller.profile.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('seller.profile.subtitle')}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => Alert.alert(t('common.notifications'), t('common.notificationsMessage'))}
          >
            <MaterialCommunityIcons name={StandardIcons.bell as any} size={IconSizes.md} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="store" size={IconSizes.xl} color={Colors.primary} />
          </View>
          <View style={styles.onlineStatus} />
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{t('seller.profile.shopName')}</Text>
          <Text style={styles.userSubtitle}>{user ? `${user.firstName} ${user.lastName}` : t('seller.profile.owner')}</Text>
          <View style={styles.memberSince}>
            <MaterialCommunityIcons name="calendar" size={IconSizes.xs} color={Colors.text.secondary} />
            <Text style={styles.memberSinceText}>{t('seller.profile.established', { date: sellerStats.accountAge })}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push('/seller/profile-details')}
        >
          <MaterialCommunityIcons name={StandardIcons.edit as any} size={IconSizes.xs} color={Colors.primary} />
        </TouchableOpacity>
      </View>



      {/* Profile Menu */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>{t('seller.profile.sections.business')}</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/seller/analytics')}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="chart-line" size={IconSizes.sm} color={Colors.primary} />
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>{t('seller.profile.analytics')}</Text>
              <Text style={styles.menuItemSubtitle}>{t('seller.profile.analyticsSubtitle')}</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={IconSizes.sm} color={Colors.border.primary} />
        </TouchableOpacity>
        
        {profileMenuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name={item.icon as any} size={IconSizes.sm} color={Colors.text.secondary} />
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={IconSizes.sm} color={Colors.border.primary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Support Menu */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>{t('seller.profile.sections.helpSupport')}</Text>
        {supportMenuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name={item.icon as any} size={IconSizes.sm} color={Colors.text.secondary} />
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={IconSizes.sm} color={Colors.border.primary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Settings */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>{t('seller.profile.sections.settings')}</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleLanguageSwitch}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="translate" size={IconSizes.sm} color={Colors.text.secondary} />
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>{t('seller.profile.language')}</Text>
              <Text style={styles.menuItemSubtitle}>
                {i18n.language === 'en' ? t('common.english') : t('common.sinhala')}
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={IconSizes.sm} color={Colors.border.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="bell-outline" size={IconSizes.sm} color={Colors.text.secondary} />
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>{t('seller.profile.notifications')}</Text>
              <Text style={styles.menuItemSubtitle}>{t('seller.profile.notificationsSubtitle')}</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={IconSizes.sm} color={Colors.border.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="shield-check-outline" size={IconSizes.sm} color={Colors.text.secondary} />
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>{t('seller.profile.privacySecurity')}</Text>
              <Text style={styles.menuItemSubtitle}>{t('seller.profile.privacySecuritySubtitle')}</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={IconSizes.sm} color={Colors.border.primary} />
        </TouchableOpacity>
      </View>

      {/* Account Actions */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>{t('seller.profile.sections.account')}</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleSwitchMode}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="shopping" size={IconSizes.sm} color={Colors.primary} />
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>{t('seller.profile.switchToBuyerMode')}</Text>
              <Text style={styles.menuItemSubtitle}>{t('seller.profile.switchToBuyerModeSubtitle')}</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={IconSizes.sm} color={Colors.border.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="file-document-outline" size={IconSizes.sm} color={Colors.text.secondary} />
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>{t('seller.profile.termsConditions')}</Text>
              <Text style={styles.menuItemSubtitle}>{t('seller.profile.termsConditionsSubtitle')}</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={IconSizes.sm} color={Colors.border.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="logout" size={IconSizes.sm} color={Colors.error} />
            <View style={styles.menuItemText}>
              <Text style={[styles.menuItemTitle, { color: Colors.error }]}>{t('seller.profile.logout')}</Text>
              <Text style={styles.menuItemSubtitle}>{t('seller.profile.logoutSubtitle')}</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={IconSizes.sm} color={Colors.border.primary} />
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  headerContent: {
    flex: 1,
    marginRight: Spacing.md,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    padding: Spacing.sm,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.small,
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.background.primary,
  },
  profileInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  userName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  userSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  memberSince: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  memberSinceText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editSection: {
    backgroundColor: Colors.background.primary,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  editForm: {
    gap: Spacing.md,
  },
  saveButton: {
    marginTop: Spacing.md,
  },
  menuSection: {
    backgroundColor: Colors.background.primary,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
});
