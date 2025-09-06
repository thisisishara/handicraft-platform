import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Colors, Layout, StandardIcons, Typography } from '../../constants/Design';

export default function SellerLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.text.primary,
        tabBarInactiveTintColor: Colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: Colors.background.primary,
          borderTopWidth: 1,
          borderTopColor: Colors.border.primary,
          paddingBottom: Layout.tabBar.paddingBottom,
          height: Layout.tabBar.height,
        },
        tabBarLabelStyle: {
          fontSize: Typography.fontSize.xs,
          fontWeight: Typography.fontWeight.medium,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('common.navigation.home'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name={StandardIcons.home as any} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: t('common.navigation.products'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name={StandardIcons.products as any} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t('common.navigation.orders'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name={StandardIcons.orders as any} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: t('common.navigation.support'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name={StandardIcons.support as any} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('common.navigation.profile'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name={StandardIcons.profile as any} color={color} size={size} />
          ),
        }}
      />
      {/* Hidden screens */}
      <Tabs.Screen
        name="add-product"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="onboarding"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="profile-details"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
