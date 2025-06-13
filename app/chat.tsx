import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, commonStyles, gradients } from '../styles/commonStyles';

interface ChatRoom {
  id: string;
  name: string;
  type: 'event' | 'location' | 'direct';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  participants: number;
  eventName?: string;
  avatar?: string;
  isOnline?: boolean;
}

interface Message {
  id: string;
  user: string;
  userAvatar: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
}

const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    name: 'Main Stage Chat',
    type: 'location',
    lastMessage: 'This set is absolutely insane! 🔥',
    lastMessageTime: '2m ago',
    unreadCount: 3,
    participants: 247,
    eventName: 'Electric Dreams 2024',
    avatar: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=80&h=80&fit=crop',
  },
  {
    id: '2',
    name: 'Alex_Raver',
    type: 'direct',
    lastMessage: 'Hey! Are you at the Chill Zone?',
    lastMessageTime: '5m ago',
    unreadCount: 1,
    participants: 2,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Electric Dreams General',
    type: 'event',
    lastMessage: 'Anyone know the lineup for tomorrow?',
    lastMessageTime: '12m ago',
    unreadCount: 0,
    participants: 1247,
    eventName: 'Electric Dreams 2024',
    avatar: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=80&h=80&fit=crop',
  },
  {
    id: '4',
    name: 'FestivalFoodie',
    type: 'direct',
    lastMessage: 'Thanks for the taco recommendation!',
    lastMessageTime: '1h ago',
    unreadCount: 0,
    participants: 2,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e7c2e8?w=80&h=80&fit=crop&crop=face',
    isOnline: false,
  },
  {
    id: '5',
    name: 'Food Court Chat',
    type: 'location',
    lastMessage: 'Pizza truck has the shortest line right now',
    lastMessageTime: '2h ago',
    unreadCount: 0,
    participants: 89,
    eventName: 'Summer Vibes Fest',
    avatar: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=80&h=80&fit=crop',
  },
];

function getChatIcon(type: string) {
  switch (type) {
    case 'event': return 'calendar';
    case 'location': return 'location';
    case 'direct': return 'person';
    default: return 'chatbubble';
  }
}

function getChatTypeLabel(type: string) {
  switch (type) {
    case 'event': return 'Event Chat';
    case 'location': return 'Location Chat';
    case 'direct': return 'Direct Message';
    default: return 'Chat';
  }
}

export default function ChatScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  console.log('ChatScreen rendered');

  const filteredChats = searchQuery
    ? mockChatRooms.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockChatRooms;

  const totalUnread = mockChatRooms.reduce((sum, chat) => sum + chat.unreadCount, 0);

  const ChatRoomCard = ({ chat }: { chat: ChatRoom }) => {
    return (
      <TouchableOpacity 
        style={[
          styles.chatCard,
          chat.unreadCount > 0 && styles.unreadChatCard
        ]}
        onPress={() => {
          console.log('Opening chat:', chat.id);
          router.push(`/chat/${chat.id}`);
        }}
      >
        <View style={styles.chatContent}>
          <View style={styles.chatLeft}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: chat.avatar }} style={styles.chatAvatar} />
              {chat.type === 'direct' && chat.isOnline && (
                <View style={styles.onlineIndicator} />
              )}
              {chat.type !== 'direct' && (
                <View style={[styles.chatTypeIcon, { backgroundColor: getChatTypeColor(chat.type) }]}>
                  <Ionicons 
                    name={getChatIcon(chat.type)} 
                    size={12} 
                    color={colors.text} 
                  />
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.chatRight}>
            <View style={styles.chatHeader}>
              <View style={styles.chatTitleContainer}>
                <Text style={styles.chatName} numberOfLines={1}>{chat.name}</Text>
                {chat.type !== 'direct' && (
                  <Text style={styles.participantCount}>
                    {chat.participants} {chat.participants === 1 ? 'person' : 'people'}
                  </Text>
                )}
              </View>
              <View style={styles.chatMeta}>
                <Text style={styles.chatTime}>{chat.lastMessageTime}</Text>
                {chat.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            
            <Text style={styles.lastMessage} numberOfLines={2}>
              {chat.lastMessage}
            </Text>
            
            {chat.eventName && (
              <Text style={styles.eventName}>
                @ {chat.eventName}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  function getChatTypeColor(type: string) {
    switch (type) {
      case 'event': return colors.purple;
      case 'location': return colors.orange;
      default: return colors.blue;
    }
  }

  return (
    <LinearGradient colors={gradients.background} style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.spaceBetween}>
          <View>
            <Text style={commonStyles.title}>Chat</Text>
            <Text style={commonStyles.subtitle}>
              {totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? 's' : ''}` : 'All messages'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.newChatButton}
            onPress={() => {
              console.log('New chat button pressed');
              // TODO: Implement new chat functionality
            }}
          >
            <Ionicons name="add" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.purple + '20' }]}>
              <Ionicons name="calendar" size={20} color={colors.purple} />
            </View>
            <Text style={styles.quickActionText}>Event Chats</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.orange + '20' }]}>
              <Ionicons name="location" size={20} color={colors.orange} />
            </View>
            <Text style={styles.quickActionText}>Location Chats</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.blue + '20' }]}>
              <Ionicons name="people" size={20} color={colors.blue} />
            </View>
            <Text style={styles.quickActionText}>Direct Messages</Text>
          </TouchableOpacity>
        </View>

        {/* Chat List */}
        <Text style={styles.sectionTitle}>Recent Conversations</Text>
        
        {filteredChats.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyStateTitle}>No conversations found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Start chatting with other festival-goers!'
              }
            </Text>
          </View>
        ) : (
          filteredChats.map((chat) => (
            <ChatRoomCard key={chat.id} chat={chat} />
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  chatCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unreadChatCard: {
    borderColor: colors.purple,
    backgroundColor: colors.purple + '10',
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  chatLeft: {
    marginRight: 12,
  },
  chatRight: {
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.border,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.backgroundCard,
  },
  chatTypeIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.backgroundCard,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  chatTitleContainer: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  participantCount: {
    fontSize: 12,
    color: colors.textMuted,
  },
  chatMeta: {
    alignItems: 'flex-end',
  },
  chatTime: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: colors.purple,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  eventName: {
    fontSize: 12,
    color: colors.purple,
    fontWeight: '600',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  newChatButton: {
    backgroundColor: colors.purple,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});