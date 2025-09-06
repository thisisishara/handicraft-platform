import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BorderRadius, Colors, IconSizes, Spacing, Typography } from '../../constants/Design';

// Mock messages data
const mockConversations = [
  {
    id: 'conv1',
    sellerId: 'seller1',
    sellerName: 'Kamala Pottery',
    shopName: 'Kamala\'s Clay Works',
    lastMessage: 'Thank you for your purchase! Your clay pot will be shipped tomorrow.',
    timestamp: '2024-08-20T14:30:00Z',
    unread: 2,
    online: true,
    avatar: '🏺',
  },
  {
    id: 'conv2',
    sellerId: 'seller2',
    sellerName: 'Village Crafts',
    shopName: 'Village Handicrafts',
    lastMessage: 'The handwoven basket is available in different sizes. Which one would you prefer?',
    timestamp: '2024-08-19T16:45:00Z',
    unread: 0,
    online: false,
    avatar: '🧺',
  },
  {
    id: 'conv3',
    sellerId: 'seller3',
    sellerName: 'Traditional Arts',
    shopName: 'Heritage Wood Art',
    lastMessage: 'Great! I\'ll prepare your wooden mask order.',
    timestamp: '2024-08-18T10:15:00Z',
    unread: 1,
    online: true,
    avatar: '🎭',
  },
];

const mockMessages = [
  {
    id: 'msg1',
    senderId: 'buyer',
    text: 'Hi, I\'m interested in your traditional clay pot. Is it suitable for cooking rice?',
    timestamp: '2024-08-20T14:25:00Z',
  },
  {
    id: 'msg2',
    senderId: 'seller1',
    text: 'Hello! Yes, absolutely! Our clay pots are perfect for cooking rice and other grains. The clay helps enhance the flavor naturally.',
    timestamp: '2024-08-20T14:27:00Z',
  },
  {
    id: 'msg3',
    senderId: 'buyer',
    text: 'That sounds perfect! I\'ll take one. How long does shipping take?',
    timestamp: '2024-08-20T14:28:00Z',
  },
  {
    id: 'msg4',
    senderId: 'seller1',
    text: 'Thank you for your purchase! Your clay pot will be shipped tomorrow and should arrive within 2-3 business days.',
    timestamp: '2024-08-20T14:30:00Z',
  },
];

export default function BuyerMessagesScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real app, this would send message to API
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const renderConversationItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        selectedConversation === item.id && styles.selectedConversation
      ]}
      onPress={() => setSelectedConversation(item.id)}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{item.avatar}</Text>
        {item.online && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.sellerName}>{item.sellerName}</Text>
          <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
        </View>
        <Text style={styles.shopName}>{item.shopName}</Text>
        <Text style={styles.lastMessage} numberOfLines={2}>
          {item.lastMessage}
        </Text>
      </View>
      
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }: { item: any }) => {
    const isFromBuyer = item.senderId === 'buyer';
    
    return (
      <View style={[
        styles.messageItem,
        isFromBuyer ? styles.buyerMessage : styles.sellerMessage
      ]}>
        <Text style={[
          styles.messageText,
          isFromBuyer ? styles.buyerMessageText : styles.sellerMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTime,
          isFromBuyer ? styles.buyerMessageTime : styles.sellerMessageTime
        ]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  if (selectedConversation) {
    const conversation = mockConversations.find(c => c.id === selectedConversation);
    
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity 
            onPress={() => setSelectedConversation(null)}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
          </TouchableOpacity>
          
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.avatar}>{conversation?.avatar}</Text>
            <View style={styles.chatHeaderText}>
              <Text style={styles.chatSellerName}>{conversation?.sellerName}</Text>
              <Text style={styles.chatShopName}>{conversation?.shopName}</Text>
            </View>
          </View>
          
          <View style={styles.chatActions}>
            <TouchableOpacity 
              style={styles.chatActionButton}
              onPress={() => router.push(`/buyer/shop-details?id=${conversation?.sellerId}&name=${encodeURIComponent(conversation?.shopName || '')}`)}
            >
              <MaterialCommunityIcons name="store" size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatActionButton}>
              <MaterialCommunityIcons name="phone" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          data={mockMessages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={[styles.messagesContent, { paddingBottom: 90 }]}
          showsVerticalScrollIndicator={false}
        />

        {/* Message Input */}
        <View style={[styles.messageInput, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageTextInput}
              placeholder={t('buyer.messages.messagePlaceholder')}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                !newMessage.trim() && styles.sendButtonDisabled
              ]}
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <MaterialCommunityIcons 
                name="send" 
                size={20} 
                color={newMessage.trim() ? "#FFFFFF" : "#9CA3AF"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('buyer.messages.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('buyer.messages.subtitle')}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerAction}>
            <MaterialCommunityIcons name="magnify" size={IconSizes.md} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conversations List */}
      {mockConversations.length > 0 ? (
        <FlatList
          data={mockConversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id}
          style={styles.conversationsList}
          contentContainerStyle={{ paddingBottom: 90 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyMessages}>
          <MaterialCommunityIcons name="message-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyMessagesTitle}>{t('buyer.messages.noConversations')}</Text>
          <Text style={styles.emptyMessagesSubtitle}>
            {t('buyer.messages.startShopping')}
          </Text>
          <TouchableOpacity 
            style={styles.startShoppingButton}
            onPress={() => router.push('/buyer/shop')}
          >
            <Text style={styles.startShoppingButtonText}>{t('buyer.messages.startShoppingButton')}</Text>
          </TouchableOpacity>
        </View>
      )}
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
  headerAction: {
    padding: Spacing.sm,
  },
  conversationsList: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.tertiary,
  },
  selectedConversation: {
    backgroundColor: `${Colors.primary}10`,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.sm,
  },
  avatar: {
    fontSize: 32,
    width: 48,
    height: 48,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.full,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: Colors.success,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.background.primary,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  sellerName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  timestamp: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  shopName: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  lastMessage: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  unreadText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  emptyMessages: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.massive,
  },
  emptyMessagesTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyMessagesSubtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  startShoppingButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  startShoppingButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
  // Chat View Styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.sm,
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  chatHeaderText: {
    flex: 1,
  },
  chatSellerName: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  chatShopName: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  chatActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chatActionButton: {
    padding: Spacing.sm,
  },
  messagesList: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  messagesContent: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  messageItem: {
    marginVertical: Spacing.xs,
    maxWidth: '80%',
  },
  buyerMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  sellerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  messageText: {
    fontSize: Typography.fontSize.md,
    lineHeight: 22,
  },
  buyerMessageText: {
    color: Colors.text.inverse,
  },
  sellerMessageText: {
    color: Colors.text.primary,
  },
  messageTime: {
    fontSize: Typography.fontSize.xs,
    marginTop: Spacing.xs,
  },
  buyerMessageTime: {
    color: Colors.border.primary,
    textAlign: 'right',
  },
  sellerMessageTime: {
    color: Colors.text.secondary,
  },
  messageInput: {
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  messageTextInput: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSize.md,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: Colors.primary,
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.background.tertiary,
  },
});
