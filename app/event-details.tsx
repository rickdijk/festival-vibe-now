import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, RefreshControl, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, gradients, scoreColors } from '../styles/commonStyles';

interface EventDetails {
  id: string;
  name: string;
  location: string;
  date: string;
  status: 'live' | 'upcoming' | 'ended';
  overallRating: number;
  musicRating: number;
  foodRating: number;
  facilitiesRating: number;
  crowdRating: number;
  activeUsers: number;
  totalUsers: number;
  image: string;
  logo: string;
  description: string;
  startTime: string;
  endTime: string;
  emoji: string;
  color: string;
}

interface LocationScore {
  id: string;
  name: string;
  type: 'stage' | 'food' | 'restroom' | 'bar' | 'chill';
  score: number;
  checkedIn: number;
  reviews: number;
  lastUpdate: string;
  trending: boolean;
}

interface EventVibePost {
  id: string;
  user: string;
  userAvatar: string;
  location: string;
  score: number;
  emoji: string;
  comment: string;
  timeAgo: string;
  likes: number;
  vibeCheckPhoto: string;
  verified: boolean;
  isLiked?: boolean;
}

const mockEventDetails: EventDetails = {
  id: 'electric-dreams',
  name: 'Electric Dreams 2024',
  location: 'Central Park, NYC',
  date: 'Dec 15-17, 2024',
  status: 'live',
  overallRating: 4.6,
  musicRating: 4.8,
  foodRating: 4.2,
  facilitiesRating: 4.1,
  crowdRating: 4.7,
  activeUsers: 2847,
  totalUsers: 12453,
  image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  logo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150',
  description: 'The most electrifying electronic music festival in NYC. Experience world-class DJs, immersive stages, and unforgettable vibes.',
  startTime: '2:00 PM',
  endTime: '2:00 AM',
  emoji: '⚡',
  color: colors.purple,
};

const mockLocationScores: LocationScore[] = [
  { id: '1', name: 'Main Stage', type: 'stage', score: 4.8, checkedIn: 1247, reviews: 89, lastUpdate: '2m ago', trending: true },
  { id: '2', name: 'Underground Stage', type: 'stage', score: 4.6, checkedIn: 834, reviews: 67, lastUpdate: '5m ago', trending: true },
  { id: '3', name: 'VIP Bar', type: 'bar', score: 4.3, checkedIn: 189, reviews: 34, lastUpdate: '8m ago', trending: false },
  { id: '4', name: 'Food Court', type: 'food', score: 4.1, checkedIn: 567, reviews: 102, lastUpdate: '3m ago', trending: false },
  { id: '5', name: 'Zen Garden', type: 'chill', score: 4.5, checkedIn: 324, reviews: 45, lastUpdate: '12m ago', trending: true },
  { id: '6', name: 'Restrooms East', type: 'restroom', score: 3.8, checkedIn: 78, reviews: 23, lastUpdate: '15m ago', trending: false },
];

const mockEventVibes: EventVibePost[] = [
  {
    id: '1',
    user: 'Alex_Raver',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    location: 'Main Stage',
    score: 4.8,
    emoji: '🔥',
    comment: 'DJ NEXUS is absolutely killing it! The crowd energy is insane!',
    timeAgo: '2m ago',
    likes: 24,
    vibeCheckPhoto: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=200&fit=crop',
    verified: true,
    isLiked: false,
  },
  {
    id: '2',
    user: 'ChillVibes92',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    location: 'Zen Garden',
    score: 4.5,
    emoji: '🧘',
    comment: 'Perfect spot to recharge. So peaceful here',
    timeAgo: '8m ago',
    likes: 31,
    vibeCheckPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    verified: true,
    isLiked: true,
  },
  {
    id: '3',
    user: 'BassHead_Mike',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    location: 'Underground Stage',
    score: 4.9,
    emoji: '🎛️',
    comment: 'This bassline is literally shaking the ground! 🔊',
    timeAgo: '12m ago',
    likes: 47,
    vibeCheckPhoto: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    verified: false,
    isLiked: false,
  },
  {
    id: '4',
    user: 'ElectroQueen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e7c2e8?w=80&h=80&fit=crop&crop=face',
    location: 'VIP Bar',
    score: 4.4,
    emoji: '🍸',
    comment: 'Amazing cocktails and perfect view of the main stage!',
    timeAgo: '15m ago',
    likes: 18,
    vibeCheckPhoto: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=200&fit=crop',
    verified: true,
    isLiked: false,
  },
  {
    id: '5',
    user: 'FoodieRaver',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
    location: 'Food Court',
    score: 4.2,
    emoji: '🌮',
    comment: 'The Korean BBQ truck is incredible! No wait time right now',
    timeAgo: '18m ago',
    likes: 22,
    vibeCheckPhoto: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
    verified: false,
    isLiked: false,
  },
];

function getLocationIcon(type: string) {
  switch (type) {
    case 'stage': return 'musical-notes';
    case 'food': return 'restaurant';
    case 'restroom': return 'medical';
    case 'bar': return 'wine';
    case 'chill': return 'leaf';
    default: return 'location';
  }
}

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'scores' | 'feed'>('scores');
  const [refreshing, setRefreshing] = useState(false);
  const [event] = useState<EventDetails>(mockEventDetails);
  const [locationScores] = useState<LocationScore[]>(mockLocationScores);
  const [eventVibes, setEventVibes] = useState<EventVibePost[]>(mockEventVibes);

  console.log('Event Details Screen loaded for event:', id);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false);
      console.log('Event data refreshed');
    }, 1000);
  };

  const handleLikePress = (vibeId: string) => {
    console.log('Like button pressed for vibe:', vibeId);
    setEventVibes(prevVibes => 
      prevVibes.map(vibe => {
        if (vibe.id === vibeId) {
          const isLiked = vibe.isLiked || false;
          return {
            ...vibe,
            isLiked: !isLiked,
            likes: isLiked ? vibe.likes - 1 : vibe.likes + 1
          };
        }
        return vibe;
      })
    );
  };

  const handleReplyPress = (vibeId: string, userName: string) => {
    console.log('Reply button pressed for vibe:', vibeId, 'by user:', userName);
    Alert.alert(
      'Reply to Vibe',
      `Reply to ${userName}'s vibe?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reply',
          onPress: () => {
            console.log('User confirmed reply to:', userName);
            // TODO: Navigate to reply screen or show reply input
            Alert.alert('Feature Coming Soon', 'Reply functionality will be available in the next update!');
          },
        },
      ],
    );
  };

  const handleSharePress = (vibeId: string, userName: string, comment: string) => {
    console.log('Share button pressed for vibe:', vibeId);
    Alert.alert(
      'Share Vibe',
      `Share ${userName}'s vibe: "${comment.substring(0, 50)}${comment.length > 50 ? '...' : ''}"`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Copy Link',
          onPress: () => {
            console.log('Copy link pressed for vibe:', vibeId);
            Alert.alert('Link Copied', 'Vibe link copied to clipboard!');
          },
        },
        {
          text: 'Share',
          onPress: () => {
            console.log('Share pressed for vibe:', vibeId);
            // TODO: Implement native share functionality
            Alert.alert('Feature Coming Soon', 'Share functionality will be available in the next update!');
          },
        },
      ],
    );
  };

  const renderStars = (rating: number, size: number = 14) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons 
            key={i} 
            name="star" 
            size={size} 
            color={colors.orange} 
            style={{ marginRight: 2 }}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons 
            key={i} 
            name="star-half" 
            size={size} 
            color={colors.orange} 
            style={{ marginRight: 2 }}
          />
        );
      } else {
        stars.push(
          <Ionicons 
            key={i} 
            name="star-outline" 
            size={size} 
            color={colors.textMuted} 
            style={{ marginRight: 2 }}
          />
        );
      }
    }
    return stars;
  };

  const LocationScoreCard = ({ location }: { location: LocationScore }) => (
    <View style={[styles.locationCard, { borderLeftColor: scoreColors.getScoreColor(location.score) }]}>
      <View style={styles.locationHeader}>
        <View style={styles.locationIconContainer}>
          <Ionicons 
            name={getLocationIcon(location.type) as keyof typeof Ionicons.glyphMap} 
            size={24} 
            color={scoreColors.getScoreColor(location.score)} 
          />
        </View>
        <View style={styles.locationInfo}>
          <View style={styles.locationTitleRow}>
            <Text style={styles.locationName}>{location.name}</Text>
            {location.trending && (
              <View style={styles.trendingBadge}>
                <Ionicons name="trending-up" size={12} color={colors.orange} />
                <Text style={styles.trendingText}>HOT</Text>
              </View>
            )}
          </View>
          <Text style={styles.locationMeta}>
            {location.checkedIn} checked in • {location.reviews} reviews
          </Text>
          <Text style={styles.lastUpdate}>Updated {location.lastUpdate}</Text>
        </View>
        <View style={[styles.scoreContainer, { backgroundColor: scoreColors.getScoreBackground(location.score) }]}>
          <Text style={[styles.scoreValue, { color: scoreColors.getScoreColor(location.score) }]}>
            {location.score.toFixed(1)}
          </Text>
          <View style={styles.scoreStars}>
            {renderStars(location.score, 10)}
          </View>
        </View>
      </View>
    </View>
  );

  const VibePostCard = ({ vibe }: { vibe: EventVibePost }) => (
    <View style={styles.vibeCard}>
      <View style={styles.vibeHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: vibe.userAvatar }} style={styles.userAvatar} />
            {vibe.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={10} color={colors.text} />
              </View>
            )}
          </View>
          <View style={styles.userDetails}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{vibe.user}</Text>
              <Text style={styles.timeAgo}>{vibe.timeAgo}</Text>
            </View>
            <Text style={styles.vibeLocation}>@ {vibe.location}</Text>
          </View>
        </View>
        <View style={[styles.vibeScoreChip, { backgroundColor: scoreColors.getScoreBackground(vibe.score) }]}>
          <Text style={[styles.vibeScoreText, { color: scoreColors.getScoreColor(vibe.score) }]}>
            {vibe.score} {scoreColors.getScoreEmoji(vibe.score)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.vibeComment}>{vibe.comment}</Text>
      
      <View style={styles.vibePhotoContainer}>
        <Image source={{ uri: vibe.vibeCheckPhoto }} style={styles.vibePhoto} />
      </View>
      
      <View style={styles.vibeActions}>
        <TouchableOpacity 
          style={[styles.actionButton, vibe.isLiked && styles.actionButtonLiked]}
          onPress={() => handleLikePress(vibe.id)}
        >
          <Ionicons 
            name={vibe.isLiked ? "heart" : "heart-outline"} 
            size={18} 
            color={vibe.isLiked ? colors.pink : colors.textSecondary} 
          />
          <Text style={[
            styles.actionText, 
            vibe.isLiked && { color: colors.pink }
          ]}>
            {vibe.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleReplyPress(vibe.id, vibe.user)}
        >
          <Ionicons name="chatbubble-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.actionText}>Reply</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleSharePress(vibe.id, vibe.user, vibe.comment)}
        >
          <Ionicons name="share-outline" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={gradients.background} style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <View style={styles.eventTitleRow}>
            <View style={styles.eventLogoContainer}>
              <Image source={{ uri: event.logo }} style={styles.eventLogo} />
            </View>
            <View style={styles.eventTitleInfo}>
              <Text style={styles.eventTitle}>{event.name}</Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE NOW</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.eventMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="location" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{event.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="people" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{event.activeUsers} active • {event.totalUsers} total</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Event Image */}
      <View style={styles.eventImageContainer}>
        <Image source={{ uri: event.image }} style={styles.eventImage} />
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.2)']}
          style={styles.eventImageOverlay}
        />
      </View>

      {/* Overall Ratings */}
      <View style={styles.ratingsContainer}>
        <View style={styles.overallRating}>
          <Text style={styles.overallScore}>{event.overallRating.toFixed(1)}</Text>
          <View style={styles.overallStars}>
            {renderStars(event.overallRating, 8)}
          </View>
          <Text style={styles.overallLabel}>Overall Rating</Text>
        </View>
        
        <View style={styles.categoryRatings}>
          <View style={styles.categoryRating}>
            <Ionicons name="musical-notes" size={12} color={colors.purple} />
            <Text style={styles.categoryLabel}>Music</Text>
            <Text style={styles.categoryScore}>{event.musicRating.toFixed(1)}</Text>
          </View>
          <View style={styles.categoryRating}>
            <Ionicons name="restaurant" size={12} color={colors.orange} />
            <Text style={styles.categoryLabel}>Food</Text>
            <Text style={styles.categoryScore}>{event.foodRating.toFixed(1)}</Text>
          </View>
          <View style={styles.categoryRating}>
            <Ionicons name="business" size={12} color={colors.green} />
            <Text style={styles.categoryLabel}>Facilities</Text>
            <Text style={styles.categoryScore}>{event.facilitiesRating.toFixed(1)}</Text>
          </View>
          <View style={styles.categoryRating}>
            <Ionicons name="people" size={12} color={colors.pink} />
            <Text style={styles.categoryLabel}>Crowd</Text>
            <Text style={styles.categoryScore}>{event.crowdRating.toFixed(1)}</Text>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'scores' && styles.tabActive]}
          onPress={() => setActiveTab('scores')}
        >
          <Ionicons 
            name="stats-chart" 
            size={20} 
            color={activeTab === 'scores' ? colors.text : colors.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'scores' && styles.tabTextActive]}>
            Location Scores
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'feed' && styles.tabActive]}
          onPress={() => setActiveTab('feed')}
        >
          <Ionicons 
            name="chatbubbles" 
            size={20} 
            color={activeTab === 'feed' ? colors.text : colors.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'feed' && styles.tabTextActive]}>
            Live Feed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'scores' ? (
          <View style={styles.scoresContent}>
            <Text style={styles.sectionTitle}>Location Scores</Text>
            <Text style={styles.sectionSubtitle}>
              Real-time ratings from {event.activeUsers} active vibers
            </Text>
            {locationScores.map((location) => (
              <LocationScoreCard key={location.id} location={location} />
            ))}
          </View>
        ) : (
          <View style={styles.feedContent}>
            <Text style={styles.sectionTitle}>Live Vibe Feed</Text>
            <Text style={styles.sectionSubtitle}>
              Latest vibes from {event.name}
            </Text>
            {eventVibes.map((vibe) => (
              <VibePostCard key={vibe.id} vibe={vibe} />
            ))}
          </View>
        )}
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/event-checkin')}
      >
        <LinearGradient colors={gradients.purple} style={styles.fabGradient}>
          <Ionicons name="add" size={24} color={colors.text} />
          <Text style={styles.fabText}>Vibe Check</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 60,
    backgroundColor: colors.backgroundAlt,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerContent: {
    flex: 1,
  },
  eventTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventLogoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.purple,
  },
  eventLogo: {
    width: '100%',
    height: '100%',
  },
  eventTitleInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
    marginRight: 6,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.green,
  },
  eventMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  eventImageContainer: {
    height: 120,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eventImageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  ratingsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundCard,
    margin: 16,
    borderRadius: 6,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  overallRating: {
    alignItems: 'center',
    marginRight: 8,
  },
  overallScore: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 1,
  },
  overallStars: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  overallLabel: {
    fontSize: 8,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  categoryRatings: {
    flex: 1,
    gap: 3,
  },
  categoryRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background + '40',
    borderRadius: 4,
    padding: 4,
  },
  categoryLabel: {
    fontSize: 10,
    color: colors.text,
    fontWeight: '600',
    marginLeft: 3,
    flex: 1,
  },
  categoryScore: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundCard,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  tabActive: {
    backgroundColor: colors.purple,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scoresContent: {
    paddingBottom: 20,
  },
  feedContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  locationCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background + '60',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.orange + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendingText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.orange,
    marginLeft: 4,
  },
  locationMeta: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  lastUpdate: {
    fontSize: 12,
    color: colors.textMuted,
  },
  scoreContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  scoreStars: {
    flexDirection: 'row',
  },
  vibeCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vibeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.purple,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.backgroundCard,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  timeAgo: {
    fontSize: 12,
    color: colors.textMuted,
  },
  vibeLocation: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  vibeScoreChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  vibeScoreText: {
    fontSize: 14,
    fontWeight: '700',
  },
  vibeComment: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  vibePhotoContainer: {
    marginBottom: 12,
  },
  vibePhoto: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  vibeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  actionButtonLiked: {
    backgroundColor: colors.pink + '10',
  },
  actionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 12,
    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 28,
  },
  fabText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});