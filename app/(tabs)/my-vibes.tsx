import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, commonStyles, gradients, scoreColors } from '../../styles/commonStyles';

interface MyVibe {
  id: string;
  location: string;
  festival: string;
  festivalLogo: string;
  photo: string;
  rating: number;
  emoji: string;
  comment: string;
  date: string;
  likes: number;
  replies: number;
  xp: number;
  trending: boolean;
}

const mockVibes: MyVibe[] = [
  {
    id: '1',
    location: 'Main Stage',
    festival: 'Electric Dreams 2024',
    festivalLogo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=center',
    photo: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop&crop=center',
    rating: 5,
    emoji: '🔥',
    comment: 'DJ NEXUS absolutely killed it! The crowd energy is insane!',
    date: '2 hours ago',
    likes: 24,
    replies: 7,
    xp: 50,
    trending: true,
  },
  {
    id: '2',
    location: 'Taco Truck Paradise',
    festival: 'Electric Dreams 2024',
    festivalLogo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=center',
    photo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
    rating: 4,
    emoji: '🌮',
    comment: 'Amazing tacos, no wait time right now!',
    date: '5 hours ago',
    likes: 18,
    replies: 3,
    xp: 25,
    trending: false,
  },
  {
    id: '3',
    location: 'Chill Zone',
    festival: 'Electric Dreams 2024',
    festivalLogo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=center',
    photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
    rating: 4,
    emoji: '🧘',
    comment: 'Perfect spot to recharge between sets',
    date: '1 day ago',
    likes: 31,
    replies: 12,
    xp: 30,
    trending: false,
  },
  {
    id: '4',
    location: 'VIP Bar',
    festival: 'Electric Dreams 2024',
    festivalLogo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=center',
    photo: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop&crop=center',
    rating: 3,
    emoji: '🍸',
    comment: 'Expensive but good cocktails',
    date: '1 day ago',
    likes: 9,
    replies: 2,
    xp: 15,
    trending: false,
  },
];

type FilterType = 'all' | 'trending' | 'recent' | 'top';

export default function MyVibesScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  const filteredVibes = mockVibes.filter(vibe => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'trending') return vibe.trending;
    if (selectedFilter === 'recent') return true; // In a real app, this would filter by recent dates
    if (selectedFilter === 'top') return vibe.likes > 20;
    return true;
  });

  const totalVibes = mockVibes.length;
  const totalLikes = mockVibes.reduce((sum, vibe) => sum + vibe.likes, 0);
  const totalXP = mockVibes.reduce((sum, vibe) => sum + vibe.xp, 0);
  const averageRating = mockVibes.reduce((sum, vibe) => sum + vibe.rating, 0) / mockVibes.length;

  const FilterButton = ({ filter, title }: { filter: FilterType; title: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.filterButtonTextActive
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const VibeCard = ({ vibe }: { vibe: MyVibe }) => (
    <View style={styles.vibeCard}>
      {/* Vibe Photo */}
      <View style={styles.vibeImageContainer}>
        <Image source={{ uri: vibe.photo }} style={styles.vibeImage} />
        
        {/* Trending Badge Overlay on Photo */}
        {vibe.trending && (
          <View style={styles.trendingBadgeOnPhoto}>
            <Ionicons name="trending-up" size={12} color={colors.orange} />
            <Text style={styles.trendingTextOnPhoto}>HOT</Text>
          </View>
        )}
      </View>

      <View style={styles.vibeContent}>
        <View style={styles.vibeHeader}>
          <View style={styles.vibeLocation}>
            <View style={styles.festivalRow}>
              <Image source={{ uri: vibe.festivalLogo }} style={styles.festivalLogo} />
              <View style={styles.festivalInfo}>
                <Text style={styles.locationName}>{vibe.location}</Text>
                <Text style={styles.festivalName}>{vibe.festival}</Text>
              </View>
            </View>
          </View>
          <View style={styles.vibeHeaderRight}>
            <View style={[styles.ratingChip, { backgroundColor: scoreColors.getScoreBackground(vibe.rating) }]}>
              <Text style={[styles.ratingText, { color: scoreColors.getScoreColor(vibe.rating) }]}>
                {vibe.rating} {scoreColors.getScoreEmoji(vibe.rating)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.vibeComment}>{vibe.comment}</Text>

        <View style={styles.vibeFooter}>
          <Text style={styles.vibeDate}>{vibe.date}</Text>
          <View style={styles.vibeStats}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={16} color={colors.pink} />
              <Text style={styles.statText}>{vibe.likes}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble" size={16} color={colors.blue} />
              <Text style={styles.statText}>{vibe.replies}</Text>
            </View>
            <View style={styles.xpBadge}>
              <Text style={styles.xpText}>+{vibe.xp} XP</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={gradients.background} style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>My Vibes</Text>
        <Text style={commonStyles.subtitle}>Your festival experiences</Text>
      </View>

      <View style={[styles.statsContainer, styles.statsSpacing]}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalVibes}</Text>
          <Text style={styles.statLabel}>Total Vibes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalLikes}</Text>
          <Text style={styles.statLabel}>Likes Received</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalXP}</Text>
          <Text style={styles.statLabel}>XP Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{averageRating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>
      </View>

      <View style={commonStyles.content}>
        <View style={styles.filtersContainer}>
          <FilterButton filter="all" title="All" />
          <FilterButton filter="trending" title="Trending" />
          <FilterButton filter="recent" title="Recent" />
          <FilterButton filter="top" title="Top Liked" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.vibesList}>
          {filteredVibes.map((vibe) => (
            <VibeCard key={vibe.id} vibe={vibe} />
          ))}
          
          {filteredVibes.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={64} color={colors.textMuted} />
              <Text style={styles.emptyStateTitle}>No vibes found</Text>
              <Text style={styles.emptyStateText}>
                {selectedFilter === 'trending' ? 'None of your vibes are trending right now' :
                 selectedFilter === 'top' ? 'You need more likes to see top vibes here' :
                 'Try a different filter or share your first vibe!'}
              </Text>
            </View>
          )}
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      <TouchableOpacity 
        style={styles.vibeCheckFab}
        onPress={() => router.push('/event-checkin')}
      >
        <LinearGradient colors={gradients.purple} style={styles.fabGradient}>
          <Ionicons name="add" size={24} color={colors.text} />
          <Text style={styles.fabText}>Share your vibe</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  statsSpacing: {
    marginTop: 24,
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.purple,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: colors.text,
  },
  vibesList: {
    flex: 1,
  },
  vibeCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  vibeImageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  vibeImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  trendingBadgeOnPhoto: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.orange + 'E6', // More opaque background
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trendingTextOnPhoto: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 4,
  },
  vibeContent: {
    padding: 16,
  },
  vibeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  vibeLocation: {
    flex: 1,
  },
  festivalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  festivalLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  festivalInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  festivalName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  vibeHeaderRight: {
    alignItems: 'flex-end',
  },
  ratingChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
  },
  vibeComment: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  vibeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  vibeDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
  vibeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  xpBadge: {
    backgroundColor: colors.green + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.green,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 32,
  },
  vibeCheckFab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 28,
    overflow: 'hidden',
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  fabText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});