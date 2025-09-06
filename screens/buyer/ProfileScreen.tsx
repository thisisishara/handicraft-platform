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
import { useCart } from '../../contexts/CartContext';

export default function BuyerProfileScreen() {
  const { t, i18n } = useTranslation();
  const { user, logout, switchMode } = useAuth();
  const { totalItems } = useCart();
  const insets = useSafeAreaInsets();

  // Mock buyer stats
  const buyerStats = {
    totalOrders: 12,
    totalSpent: 28450,
    wishlistItems: 7,
    reviewsGiven: 8,
    accountAge: '2 years',
    rewardPoints: 245,
  };

  const handleSwitchMode = async () => {
    Alert.alert(
      t('buyer.profile.switchToSellerModeTitle'),
      t('buyer.profile.switchToSellerModeMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.switch'), 
          onPress: async () => {
            try {
              await switchMode('seller');
              router.replace('/seller/home');
            } catch (error) {
              Alert.alert(t('common.error'), t('common.switchModeError'));
            }
          }
        },
      ]
    );
  };

  const handleLanguageSwitch = () => {
    const newLang = i18n.language === 'en' ? 'si' : 'en';
    i18n.changeLanguage(newLang);
    const languageName = newLang === 'en' ? t('common.english') : t('common.sinhala');
    Alert.alert(t('common.languageChanged'), t('common.languageSwitchMessage', { language: languageName }));
  };

  const handleLogout = () => {
    Alert.alert(
      t('common.logout'),
      t('common.logoutConfirmation'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.logout'), 
          style: 'destructive',
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


  const profileMenuItems = [
    {
      id: '1',
      title: t('buyer.profile.orderHistory'),
      subtitle: t('buyer.profile.orderHistorySubtitle'),
      icon: StandardIcons.orders,
      onPress: () => router.push('/buyer/orders')
    },
    {
      id: '2',
      title: t('buyer.profile.myWishlist'),
      subtitle: t('buyer.profile.myWishlistSubtitle'),
      icon: StandardIcons.heart,
      onPress: () => router.push('/buyer/shop')
    },
    {
      id: '3',
      title: t('buyer.profile.profileDetails'),
      subtitle: t('buyer.profile.profileDetailsSubtitle'),
      icon: 'account-edit',
      onPress: () => router.push('/buyer/profile-details')
    },
    {
      id: 'notifications',
      title: t('buyer.profile.notifications'),
      subtitle: t('buyer.profile.notificationsSubtitle'),
      icon: 'bell',
      onPress: () => Alert.alert(t('common.comingSoon'), t('common.comingSoonMessage')),
    },
  ];

  // Support menu items
  const supportMenuItems = [
    {
      id: '1',
      title: t('buyer.profile.helpCenter'),
      subtitle: t('buyer.profile.helpCenterSubtitle'),
      icon: 'help-circle',
      onPress: () => Alert.alert(t('common.helpCenter'), t('common.helpCenterMessage'))
    },
    {
      id: '2',
      title: t('buyer.profile.contactSupport'),
      subtitle: t('buyer.profile.contactSupportSubtitle'),
      icon: 'message-text',
      onPress: () => Alert.alert(t('common.contactSupport'), t('common.contactSupportMessage'))
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
          <Text style={styles.headerTitle}>{t('buyer.profile.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('buyer.profile.subtitle')}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => Alert.alert(t('common.notifications'), t('common.notificationsMessage'))}
          >
            <MaterialCommunityIcons name={StandardIcons.bell as any} size={IconSizes.md} color={Colors.text.secondary} />
          </TouchableOpacity>
          {totalItems > 0 && (
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={() => router.push('/buyer/cart')}
            >
              <MaterialCommunityIcons name={StandardIcons.cart as any} size={IconSizes.md} color={Colors.text.secondary} />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalItems}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={IconSizes.xl} color={Colors.primary} />
          </View>
          <View style={styles.onlineStatus} />
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user ? `${user.firstName} ${user.lastName}` : 'User'}</Text>
          <Text style={styles.userSubtitle}>{t('buyer.profile.handicraftLover')}</Text>
          <View style={styles.memberSince}>
            <MaterialCommunityIcons name="calendar" size={IconSizes.xs} color={Colors.text.secondary} />
            <Text style={styles.memberSinceText}>{t('buyer.profile.memberSince', { period: buyerStats.accountAge })}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push('/buyer/profile-details')}
        >
          <MaterialCommunityIcons name={StandardIcons.edit as any} size={IconSizes.xs} color={Colors.primary} />
        </TouchableOpacity>
      </View>



      {/* Profile Menu */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>{t('buyer.profile.sections.shopping')}</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/buyer/analytics')}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="chart-donut" size={IconSizes.sm} color={Colors.primary} />
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>{t('buyer.profile.shoppingAnalytics')}</Text>
              <Text style={styles.menuItemSubtitle}>{t('buyer.profile.shoppingAnalyticsSubtitle')}</Text>
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
        <Text style={styles.sectionTitle}>{t('buyer.profile.sections.helpSupport')}</Text>
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
        <Text style={styles.sectionTitle}>{t('buyer.profile.sections.settings')}</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleLanguageSwitch}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="translate" size={IconSizes.sm} color={Colors.text.secondary} />
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>{t('buyer.profile.language')}</Text>
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
              <Text style={styles.menuItemTitle}>{t('buyer.profile.notifications')}</Text>
              <Text style={styles.menuItemSubtitle}>{t('buyer.profile.notificationsSubtitle')}</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={IconSizes.sm} color={Colors.border.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="shield-check-outline" size={IconSizes.sm} color={Colors.text.secondary} />
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>{t('buyer.profile.privacySecurity')}</Text>
              <Text style={styles.menuItemSubtitle}>{t('buyer.profile.privacySecuritySubtitle')}</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={IconSizes.sm} color={Colors.border.primary} />
        </TouchableOpacity>
      </View>

      {/* Account Actions */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>{t('buyer.profile.sections.account')}</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={handleSwitchMode}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="store" size={IconSizes.sm} color={Colors.primary} />
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>{t('buyer.profile.switchToSellerMode')}</Text>
              <Text style={styles.menuItemSubtitle}>{t('buyer.profile.switchToSellerModeSubtitle')}</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={IconSizes.sm} color={Colors.border.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="file-document-outline" size={IconSizes.sm} color={Colors.text.secondary} />
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>{t('buyer.profile.termsConditions')}</Text>
              <Text style={styles.menuItemSubtitle}>{t('buyer.profile.termsConditionsSubtitle')}</Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={IconSizes.sm} color={Colors.border.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={styles.menuItemLeft}>
            <MaterialCommunityIcons name="logout" size={IconSizes.sm} color={Colors.error} />
            <View style={styles.menuItemText}>
              <Text style={[styles.menuItemTitle, { color: Colors.error }]}>{t('buyer.profile.logout')}</Text>
              <Text style={styles.menuItemSubtitle}>{t('buyer.profile.logoutSubtitle')}</Text>
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
    marginRight: Spacing.sm,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: Colors.text.inverse,
    fontSize: 10,
    fontWeight: 'bold',
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
  avatarText: {
    color: Colors.text.inverse,
    fontSize: 24,
    fontWeight: 'bold',
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
