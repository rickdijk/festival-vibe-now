import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, commonStyles, gradients } from '../../styles/commonStyles';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'event' | 'trending';
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  userAvatar?: string;
  eventImage?: string;
  actionUser?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    title: 'New Like',
    message: 'Alex_Raver liked your vibe check at Main Stage',
    timeAgo: '2m ago',
    read: false,
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    actionUser: 'Alex_Raver',
  },
  {
    id: '2',
    type: 'comment',
    title: 'New Comment',
    message: 'FestivalFoodie replied to your vibe: "Totally agree! Best tacos ever!"',
    timeAgo: '5m ago',
    read: false,
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e7c2e8?w=80&h=80&fit=crop&crop=face',
    actionUser: 'FestivalFoodie',
  },
  {
    id: '3',
    type: 'trending',
    title: 'Trending Location',
    message: 'Main Stage is trending! Join 1,247 people checking in',
    timeAgo: '15m ago',
    read: false,
    eventImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=80&h=80&fit=crop',
  },
  {
    id: '4',
    type: 'follow',
    title: 'New Follower',
    message: 'ChillVibes92 started following you',
    timeAgo: '1h ago',
    read: true,
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    actionUser: 'ChillVibes92',
  },
  {
    id: '5',
    type: 'event',
    title: 'Event Starting Soon',
    message: 'Bass Drop Festival starts in 30 minutes! Get ready to vibe',
    timeAgo: '2h ago',
    read: true,
    eventImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop',
  },
  {
    id: '6',
    type: 'like',
    title: 'Multiple Likes',
    message: 'Your vibe check received 10 new likes',
    timeAgo: '3h ago',
    read: true,
    eventImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop',
  },
];

function getNotificationIcon(type: string) {
  switch (type) {
    case 'like': return 'heart';
    case 'comment': return 'chatbubble';
    case 'follow': return 'person-add';
    case 'event': return 'calendar';
    case 'trending': return 'trending-up';
    default: return 'notifications';
  }
}

function getNotificationColor(type: string) {
  switch (type) {
    case 'like': return colors.pink;
    case 'comment': return colors.blue;
    case 'follow': return colors.purple;
    case 'event': return colors.orange;
    case 'trending': return colors.green;
    default: return colors.textMuted;
  }
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(mockNotifications);

  console.log('NotificationsScreen rendered with', notifications.length, 'notifications');

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const NotificationCard = ({ notification }: { notification: Notification }) => {
    return (
      <TouchableOpacity 
        style={[
          styles.notificationCard,
          !notification.read && styles.unreadCard
        ]}
        onPress={() => {
          console.log('Notification tapped:', notification.id);
          markAsRead(notification.id);
          // Navigate to relevant screen based on notification type
          if (notification.type === 'event') {
            router.push('/events');
          } else if (notification.type === 'trending') {
            router.push('/trending-events');
          }
        }}
      >
        <View style={styles.notificationContent}>
          <View style={styles.notificationLeft}>
            {notification.userAvatar ? (
              <Image source={{ uri: notification.userAvatar }} style={styles.avatarImage} />
            ) : notification.eventImage ? (
              <Image source={{ uri: notification.eventImage }} style={styles.eventImage} />
            ) : (
              <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(notification.type) + '20' }]}>
                <Ionicons 
                  name={getNotificationIcon(notification.type)} 
                  size={20} 
                  color={getNotificationColor(notification.type)} 
                />
              </View>
            )}
          </View>
          
          <View style={styles.notificationRight}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.timeAgo}>{notification.timeAgo}</Text>
            </View>
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {notification.message}
            </Text>
            {notification.actionUser && (
              <Text style={styles.actionUser}>@{notification.actionUser}</Text>
            )}
          </View>
        </View>
        
        {!notification.read && (
          <View style={styles.unreadDot} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={gradients.background} style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.spaceBetween}>
          <View>
            <Text style={commonStyles.title}>Notifications</Text>
            <Text style={commonStyles.subtitle}>
              {unreadCount > 0 ? `${unreadCount} new notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </Text>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity 
              style={styles.markAllButton}
              onPress={markAllAsRead}
            >
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyStateTitle}>No notifications yet</Text>
            <Text style={styles.emptyStateText}>
              We&apos;ll notify you when something interesting happens!
            </Text>
          </View>
        ) : (
          <>
            {unreadCount > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>New</Text>
                {notifications
                  .filter(n => !n.read)
                  .map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))
                }
              </View>
            )}
            
            {notifications.some(n => n.read) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Earlier</Text>
                {notifications
                  .filter(n => n.read)
                  .map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))
                }
              </View>
            )}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  notificationCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  unreadCard: {
    borderColor: colors.purple,
    backgroundColor: colors.purple + '10',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationLeft: {
    marginRight: 12,
  },
  notificationRight: {
    flex: 1,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.purple,
  },
  eventImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  timeAgo: {
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  actionUser: {
    fontSize: 12,
    color: colors.purple,
    fontWeight: '600',
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.purple,
  },
  markAllButton: {
    backgroundColor: colors.purple + '20',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.purple,
  },
  markAllText: {
    fontSize: 12,
    color: colors.purple,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
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