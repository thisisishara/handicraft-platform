import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Colors, IconSizes, Spacing, Typography } from '../../constants/Design';

export default function SellerSupportScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('messages');
  const [chatMessage, setChatMessage] = useState('');

  // Mock data
  const chatMessages = [
    {
      id: '1',
      sender: 'support',
      message: 'Hello! How can I help you today?',
      time: '10:30 AM',
      avatar: 'headset',
    },
    {
      id: '2',
      sender: 'me',
      message: 'I have a question about shipping fees.',
      time: '10:32 AM',
      avatar: 'account',
    },
    {
      id: '3',
      sender: 'support',
      message: 'Of course! Shipping fees are calculated based on weight and distance. For items under 1kg within Colombo, it\'s Rs. 200.',
      time: '10:33 AM',
      avatar: 'headset',
    },
  ];

  const tutorials = [
    {
      id: '1',
      title: t('seller.support.tutorial1.title'),
      description: t('seller.support.tutorial1.description'),
      icon: 'play-circle',
      duration: '5 min',
      color: '#3B82F6',
    },
    {
      id: '2',
      title: t('seller.support.tutorial2.title'),
      description: t('seller.support.tutorial2.description'),
      icon: 'camera',
      duration: '8 min',
      color: '#10B981',
    },
    {
      id: '3',
      title: t('seller.support.tutorial3.title'),
      description: t('seller.support.tutorial3.description'),
      icon: 'clipboard-list',
      duration: '6 min',
      color: '#F59E0B',
    },
    {
      id: '4',
      title: t('seller.support.tutorial4.title'),
      description: t('seller.support.tutorial4.description'),
      icon: 'account-group',
      duration: '7 min',
      color: '#EF4444',
    },
    {
      id: '5',
      title: t('seller.support.tutorial5.title'),
      description: t('seller.support.tutorial5.description'),
      icon: 'chart-line',
      duration: '10 min',
      color: '#8B5CF6',
    },
  ];

  const customerMessages = [
    {
      id: '1',
      customer: 'Priya S.',
      message: 'Is this clay pot dishwasher safe?',
      product: 'Traditional Clay Pot',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: '2',
      customer: 'Rohan M.',
      message: 'Can you make this in a smaller size?',
      product: 'Handwoven Basket',
      time: '5 hours ago',
      unread: true,
    },
    {
      id: '3',
      customer: 'Anjali P.',
      message: 'Thank you for the beautiful mask!',
      product: 'Wooden Carved Mask',
      time: '1 day ago',
      unread: false,
    },
  ];

  const sendMessage = () => {
    if (chatMessage.trim()) {
      // In real app, this would send message to support
      setChatMessage('');
    }
  };

  const renderChatMessage = ({ item }: { item: any }) => (
    <View style={[styles.chatMessage, item.sender === 'me' ? styles.myMessageContainer : styles.supportMessage]}>
      <View style={[styles.messageContent, item.sender === 'me' ? styles.myMessageBubble : null]}>
        <Text style={[styles.messageText, item.sender === 'me' ? styles.myMessageText : null]}>
          {item.message}
        </Text>
        <Text style={[styles.messageTime, item.sender === 'me' ? styles.myMessageTime : null]}>
          {item.time}
        </Text>
      </View>
    </View>
  );

  const renderTutorial = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.tutorialCard}>
      <View style={[styles.tutorialIcon, { backgroundColor: `${item.color}15` }]}>
        <MaterialCommunityIcons name={item.icon as any} size={IconSizes.md} color={item.color} />
      </View>
      <View style={styles.tutorialContent}>
        <Text style={styles.tutorialTitle}>{item.title}</Text>
        <Text style={styles.tutorialDescription}>{item.description}</Text>
        <Text style={styles.tutorialDuration}>{item.duration}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={IconSizes.sm} color={Colors.text.secondary} />
    </TouchableOpacity>
  );

  const renderCustomerMessage = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.customerMessageCard}>
      <View style={styles.customerMessageLeft}>
        <View style={styles.customerAvatar}>
          <Text style={styles.customerInitial}>{item.customer[0]}</Text>
          {item.unread && <View style={styles.unreadDot} />}
        </View>
        <View style={styles.customerMessageContent}>
          <Text style={styles.customerName}>{item.customer}</Text>
          <Text style={styles.customerProduct}>{item.product}</Text>
          <Text style={styles.customerMessageText} numberOfLines={2}>{item.message}</Text>
        </View>
      </View>
      <View style={styles.customerMessageRight}>
        <Text style={styles.customerMessageTime}>{item.time}</Text>
        <MaterialCommunityIcons name="chevron-right" size={IconSizes.xs} color={Colors.text.secondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('seller.support.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('seller.support.subtitle')}</Text>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.tabContainer}
        contentContainerStyle={styles.tabScrollContent}
      >
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'messages' && styles.activeTab]}
          onPress={() => setActiveTab('messages')}
        >
          <View style={styles.tabContent}>
            <MaterialCommunityIcons 
              name="account-group" 
              size={18} 
              color={activeTab === 'messages' ? Colors.primary : Colors.text.secondary} 
            />
            <Text style={[styles.tabText, activeTab === 'messages' && styles.activeTabText]}>
              {t('seller.support.customers')}
            </Text>
            {customerMessages.filter(m => m.unread).length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{customerMessages.filter(m => m.unread).length}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'chat' && styles.activeTab]}
          onPress={() => setActiveTab('chat')}
        >
          <View style={styles.tabContent}>
            <MaterialCommunityIcons 
              name="message-text" 
              size={20} 
              color={activeTab === 'chat' ? Colors.primary : Colors.text.secondary} 
            />
            <Text style={[styles.tabText, activeTab === 'chat' && styles.activeTabText]}>
              {t('seller.support.liveChat')}
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'tutorials' && styles.activeTab]}
          onPress={() => setActiveTab('tutorials')}
        >
          <View style={styles.tabContent}>
            <MaterialCommunityIcons 
              name="school" 
              size={20} 
              color={activeTab === 'tutorials' ? Colors.primary : Colors.text.secondary} 
            />
            <Text style={[styles.tabText, activeTab === 'tutorials' && styles.activeTabText]}>
              {t('seller.support.tutorials')}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'chat' && (
          <View style={styles.chatContainer}>
            <FlatList
              data={chatMessages}
              renderItem={renderChatMessage}
              keyExtractor={(item) => item.id}
              style={styles.chatList}
              contentContainerStyle={{ paddingBottom: 90 }}
              showsVerticalScrollIndicator={false}
            />
            <View style={styles.chatInput}>
              <TextInput
                style={styles.messageInput}
                value={chatMessage}
                onChangeText={setChatMessage}
                placeholder={t('seller.support.chat.inputPlaceholder')}
                multiline
                maxLength={500}
              />
              <TouchableOpacity 
                style={[styles.sendButton, !chatMessage.trim() && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!chatMessage.trim()}
              >
                <MaterialCommunityIcons name="send" size={IconSizes.sm} color={Colors.text.inverse} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'tutorials' && (
          <FlatList
            data={tutorials}
            renderItem={renderTutorial}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.tutorialsList, { paddingBottom: 90 }]}
          />
        )}

        {activeTab === 'messages' && (
          <FlatList
            data={customerMessages}
            renderItem={renderCustomerMessage}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.messagesList, { paddingBottom: 90 }]}
          />
        )}
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
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  headerContent: {
    flex: 1,
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
  tabContainer: {
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
    maxHeight: 70,
  },
  tabScrollContent: {
    paddingHorizontal: Spacing.sm,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 56,
    minWidth: 100,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
    flexShrink: 1,
  },
  activeTabText: {
    color: Colors.primary,
  },
  badge: {
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  badgeText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  content: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  chatList: {
    flex: 1,
    padding: Spacing.lg,
  },
  chatMessage: {
    marginBottom: Spacing.lg,
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  supportMessage: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    backgroundColor: Colors.background.primary,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
  },
  myMessageBubble: {
    backgroundColor: Colors.primary,
  },
  messageText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  myMessageText: {
    color: Colors.text.inverse,
  },
  messageTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  myMessageTime: {
    color: Colors.text.inverse,
    opacity: 0.8,
  },
  chatInput: {
    flexDirection: 'row',
    padding: Spacing.lg,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border.secondary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    maxHeight: 100,
    fontSize: Typography.fontSize.sm,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    padding: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.text.disabled,
  },
  tutorialsList: {
    padding: Spacing.lg,
  },
  tutorialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  tutorialIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  tutorialContent: {
    flex: 1,
  },
  tutorialTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  tutorialDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  tutorialDuration: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  messagesList: {
    padding: Spacing.lg,
  },
  customerMessageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  customerMessageLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    position: 'relative',
  },
  customerInitial: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.error,
    borderWidth: 2,
    borderColor: Colors.background.primary,
  },
  customerMessageContent: {
    flex: 1,
  },
  customerName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  customerProduct: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  customerMessageText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  customerMessageRight: {
    alignItems: 'flex-end',
  },
  customerMessageTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
  },
});
