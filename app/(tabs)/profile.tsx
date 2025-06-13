import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, commonStyles, gradients, scoreColors } from '../../styles/commonStyles';

interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface VibeHistory {
  id: string;
  festival: string;
  location: string;
  rating: number;
  emoji: string;
  comment: string;
  date: string;
  xp: number;
}

const badges: Badge[] = [
  { id: '1', name: 'Vibe Master', icon: '🎭', color: colors.purple, description: '50+ vibe checks' },
  { id: '2', name: 'Trendsetter', icon: '🔥', color: colors.orange, description: 'First to discover 5 hot spots' },
  { id: '3', name: 'Food Explorer', icon: '🍕', color: colors.green, description: 'Rated 20+ food locations' },
  { id: '4', name: 'Night Owl', icon: '🦉', color: colors.pink, description: 'Active after midnight 10 times' },
];

const vibeHistory: VibeHistory[] = [
  {
    id: '1',
    festival: 'Electric Dreams 2024',
    location: 'Main Stage',
    rating: 5,
    emoji: '🔥',
    comment: 'DJ NEXUS absolutely killed it!',
    date: '2 hours ago',
    xp: 50,
  },
  {
    id: '2',
    festival: 'Electric Dreams 2024',
    location: 'Taco Truck Paradise',
    rating: 4,
    emoji: '🌮',
    comment: 'Amazing tacos, no wait!',
    date: '5 hours ago',
    xp: 25,
  },
  {
    id: '3',
    festival: 'Electric Dreams 2024',
    location: 'Chill Zone',
    rating: 4,
    emoji: '🧘',
    comment: 'Perfect for recharging',
    date: '1 day ago',
    xp: 30,
  },
];

export default function ProfileScreen() {
  const StatCard = ({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) => (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const BadgeCard = ({ badge }: { badge: Badge }) => (
    <View style={[styles.badgeCard, { borderColor: badge.color + '40' }]}>
      <View style={[styles.badgeIcon, { backgroundColor: badge.color + '20' }]}>
        <Text style={styles.badgeEmoji}>{badge.icon}</Text>
      </View>
      <Text style={styles.badgeName}>{badge.name}</Text>
      <Text style={styles.badgeDescription}>{badge.description}</Text>
    </View>
  );

  const VibeHistoryCard = ({ vibe }: { vibe: VibeHistory }) => (
    <View style={styles.vibeHistoryCard}>
      <View style={styles.vibeHistoryHeader}>
        <View style={styles.vibeHistoryInfo}>
          <Text style={styles.vibeHistoryFestival}>{vibe.festival}</Text>
          <Text style={styles.vibeHistoryDate}>{vibe.date}</Text>
        </View>
        <View style={styles.vibeHistoryXP}>
          <Text style={styles.xpText}>+{vibe.xp} XP</Text>
        </View>
      </View>
      
      <View style={styles.vibeHistoryContent}>
        <View style={[styles.vibeHistoryRating, { backgroundColor: scoreColors.getScoreBackground(vibe.rating) }]}>
          <Text style={[styles.vibeHistoryRatingText, { color: scoreColors.getScoreColor(vibe.rating) }]}>
            {vibe.rating} {vibe.emoji}
          </Text>
        </View>
        <View style={styles.vibeHistoryDetails}>
          <Text style={styles.vibeHistoryLocation}>{vibe.location}</Text>
          <Text style={styles.vibeHistoryComment}>{vibe.comment}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={gradients.background} style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' }} 
              style={styles.avatarImage}
            />
            <LinearGradient colors={gradients.purple} style={styles.avatarBorder} />
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="camera" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>Alex Raver</Text>
              <Ionicons name="checkmark-circle" size={20} color={colors.green} />
            </View>
            <Text style={styles.userTitle}>Festival Enthusiast</Text>
            <Text style={styles.userLevel}>Level 12 • 2,450 XP</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <StatCard title="Vibe Checks" value="127" />
          <StatCard title="Avg Rating" value="4.2" subtitle="⭐" />
          <StatCard title="Badges" value="12" />
        </View>

        <View style={styles.festivalStats}>
          <Text style={styles.sectionTitle}>Festival Stats</Text>
          <View style={styles.festivalStatsGrid}>
            <StatCard title="Festivals" value="8" subtitle="attended" />
            <StatCard title="Likes" value="1.2k" subtitle="received" />
            <StatCard title="Locations" value="89" subtitle="rated" />
            <StatCard title="Ranking" value="#247" subtitle="global" />
          </View>
        </View>

        <View style={styles.badgesSection}>
          <Text style={styles.sectionTitle}>Recent Badges</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {badges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Vibe History</Text>
          {vibeHistory.map((vibe) => (
            <VibeHistoryCard key={vibe.id} vibe={vibe} />
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <TouchableOpacity 
        style={styles.vibeCheckButton}
        onPress={() => router.push('/vibe-check')}
      >
        <LinearGradient colors={gradients.purple} style={styles.vibeCheckGradient}>
          <Ionicons name="add" size={24} color={colors.text} />
          <Text style={styles.vibeCheckText}>Share your vibe</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 104,
    height: 104,
    borderRadius: 52,
    zIndex: -1,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  userInfo: {
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginRight: 8,
  },
  userTitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 14,
    color: colors.purple,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  festivalStats: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  festivalStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgesSection: {
    marginBottom: 32,
  },
  badgeCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    width: 140,
    marginRight: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  historySection: {
    marginBottom: 32,
  },
  vibeHistoryCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vibeHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vibeHistoryInfo: {
    flex: 1,
  },
  vibeHistoryFestival: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  vibeHistoryDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
  vibeHistoryXP: {
    backgroundColor: colors.green + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.green,
  },
  vibeHistoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vibeHistoryRating: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  vibeHistoryRatingText: {
    fontSize: 14,
    fontWeight: '700',
  },
  vibeHistoryDetails: {
    flex: 1,
  },
  vibeHistoryLocation: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  vibeHistoryComment: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  vibeCheckButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  vibeCheckGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  vibeCheckText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});