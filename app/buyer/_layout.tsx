import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Colors, Layout, StandardIcons, Typography } from '../../constants/Design';

export default function BuyerLayout() {
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
        name="shop"
        options={{
          title: t('common.navigation.shop'),
          tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name={StandardIcons.shop as any} color={color} size={size} />
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
        name="messages"
        options={{
          title: t('common.navigation.messages'),
          tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name={StandardIcons.messages as any} color={color} size={size} />
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
        name="product-details"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="shop-details"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="checkout"
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
