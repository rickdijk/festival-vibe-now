import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, commonStyles, gradients, buttonStyles, scoreColors } from '../../styles/commonStyles';

interface Festival {
  id: string;
  name: string;
  status: 'live' | 'upcoming' | 'ended';
  color: string;
  emoji: string;
  logo: string;
}

interface VibePost {
  id: string;
  user: string;
  userAvatar: string;
  location: string;
  festival: string;
  festivalId: string;
  score: number;
  emoji: string;
  comment: string;
  timeAgo: string;
  likes: number;
  vibeCheckPhoto: string;
  isLiked?: boolean;
}

interface TrendingLocation {
  id: string;
  name: string;
  type: 'stage' | 'food' | 'restroom' | 'bar' | 'chill';
  score: number;
  checkedIn: number;
  trending: boolean;
  festival: string;
  festivalId: string;
}

const mockFestivals: Festival[] = [
  { 
    id: 'electric-dreams', 
    name: 'Electric Dreams 2024', 
    status: 'live', 
    color: colors.purple, 
    emoji: '⚡',
    logo: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop&crop=center'
  },
  { 
    id: 'summer-vibes', 
    name: 'Summer Vibes Fest', 
    status: 'live', 
    color: colors.orange, 
    emoji: '☀️',
    logo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=center'
  },
  { 
    id: 'bass-drop', 
    name: 'Bass Drop Festival', 
    status: 'live', 
    color: colors.green, 
    emoji: '🎵',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center'
  },
  { 
    id: 'indie-nights', 
    name: 'Indie Nights', 
    status: 'upcoming', 
    color: colors.pink, 
    emoji: '🌙',
    logo: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop&crop=center'
  },
  { 
    id: 'techno-paradise', 
    name: 'Techno Paradise', 
    status: 'ended', 
    color: colors.blue, 
    emoji: '🎧',
    logo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&h=100&fit=crop&crop=center'
  },
];

const mockVibes: VibePost[] = [
  {
    id: '1',
    user: 'Alex_Raver',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    location: 'Main Stage',
    festival: 'Electric Dreams 2024',
    festivalId: 'electric-dreams',
    score: 4.8,
    emoji: '🔥',
    comment: 'DJ NEXUS is absolutely killing it! The crowd energy is insane!',
    timeAgo: '2m ago',
    likes: 24,
    vibeCheckPhoto: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=200&fit=crop',
    isLiked: false,
  },
  {
    id: '2',
    user: 'FestivalFoodie',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e7c2e8?w=80&h=80&fit=crop&crop=face',
    location: 'Taco Truck Paradise',
    festival: 'Summer Vibes Fest',
    festivalId: 'summer-vibes',
    score: 4.2,
    emoji: '🌮',
    comment: 'Best tacos at the festival! No wait time right now',
    timeAgo: '5m ago',
    likes: 18,
    vibeCheckPhoto: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
    isLiked: false,
  },
  {
    id: '3',
    user: 'ChillVibes92',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    location: 'Zen Garden',
    festival: 'Electric Dreams 2024',
    festivalId: 'electric-dreams',
    score: 4.5,
    emoji: '🧘',
    comment: 'Perfect spot to recharge. So peaceful here',
    timeAgo: '8m ago',
    likes: 31,
    vibeCheckPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
    isLiked: true,
  },
  {
    id: '4',
    user: 'BassHead_Mike',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    location: 'Underground Stage',
    festival: 'Bass Drop Festival',
    festivalId: 'bass-drop',
    score: 4.9,
    emoji: '🎛️',
    comment: 'This bassline is literally shaking the ground! 🔊',
    timeAgo: '12m ago',
    likes: 47,
    vibeCheckPhoto: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    isLiked: false,
  },
  {
    id: '5',
    user: 'SunnyDancer',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
    location: 'Main Beach Stage',
    festival: 'Summer Vibes Fest',
    festivalId: 'summer-vibes',
    score: 4.3,
    emoji: '🏖️',
    comment: 'Dancing on the beach at sunset = pure magic ✨',
    timeAgo: '15m ago',
    likes: 29,
    vibeCheckPhoto: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
    isLiked: false,
  },
  {
    id: '6',
    user: 'TechnoLover',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    location: 'Warehouse Floor',
    festival: 'Bass Drop Festival',
    festivalId: 'bass-drop',
    score: 4.6,
    emoji: '🤖',
    comment: 'Industrial vibes are hitting different tonight',
    timeAgo: '18m ago',
    likes: 35,
    vibeCheckPhoto: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop',
    isLiked: false,
  },
];

const trendingLocations: TrendingLocation[] = [
  { 
    id: '1', 
    name: 'Main Stage', 
    type: 'stage', 
    score: 4.6, 
    checkedIn: 1247, 
    trending: true,
    festival: 'Electric Dreams 2024',
    festivalId: 'electric-dreams'
  },
  { 
    id: '2', 
    name: 'Chill Zone', 
    type: 'chill', 
    score: 4.3, 
    checkedIn: 324, 
    trending: true,
    festival: 'Summer Vibes Fest',
    festivalId: 'summer-vibes'
  },
  { 
    id: '3', 
    name: 'Food Court', 
    type: 'food', 
    score: 3.9, 
    checkedIn: 567, 
    trending: false,
    festival: 'Bass Drop Festival',
    festivalId: 'bass-drop'
  },
  { 
    id: '4', 
    name: 'VIP Bar', 
    type: 'bar', 
    score: 4.1, 
    checkedIn: 189, 
    trending: true,
    festival: 'Electric Dreams 2024',
    festivalId: 'electric-dreams'
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

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFestivalFilter, setSelectedFestivalFilter] = useState<string | null>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [vibes, setVibes] = useState<VibePost[]>(mockVibes);

  console.log('HomeScreen rendered with festival filter:', selectedFestivalFilter);

  // Filter vibes based on selected festival
  const filteredVibes = selectedFestivalFilter 
    ? vibes.filter(vibe => vibe.festivalId === selectedFestivalFilter)
    : vibes;

  // Filter trending locations based on selected festival
  const filteredTrendingLocations = selectedFestivalFilter 
    ? trendingLocations.filter(location => location.festivalId === selectedFestivalFilter)
    : trendingLocations;

  console.log('Filtered trending locations:', filteredTrendingLocations.length, 'of', trendingLocations.length);

  // Get current festival info for header
  const currentFestival = selectedFestivalFilter 
    ? mockFestivals.find(f => f.id === selectedFestivalFilter)
    : null;

  const handleSearchToggle = () => {
    console.log('Search toggle triggered, current state:', isSearchExpanded);
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded) {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = () => {
    console.log('Search functionality triggered with query:', searchQuery);
    // TODO: Implement search functionality
    setIsSearchExpanded(false);
  };

  const handleLikePress = (vibeId: string) => {
    console.log('Like button pressed for vibe:', vibeId);
    setVibes(prevVibes => 
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

  const VibeCard = ({ vibe }: { vibe: VibePost }) => {
    const festival = mockFestivals.find(f => f.id === vibe.festivalId);
    
    return (
      <View style={styles.vibeCard}>
        <View style={styles.vibeHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: vibe.userAvatar }} style={styles.userAvatarImage} />
            </View>
            <View style={styles.userDetails}>
              <View style={styles.userNameRow}>
                <Text style={styles.username}>{vibe.user}</Text>
                <View style={styles.vibeRatingContainer}>
                  <Text style={[styles.vibeRatingText, { color: scoreColors.getScoreColor(vibe.score) }]}>
                    {vibe.score}
                  </Text>
                  <Text style={styles.vibeRatingEmoji}>
                    {scoreColors.getScoreEmoji(vibe.score)}
                  </Text>
                </View>
              </View>
              <View style={styles.locationTimeInfo}>
                <Text style={styles.timeAgo}>{vibe.timeAgo}</Text>
                <Ionicons name="location" size={12} color={colors.textMuted} style={styles.pinpointer} />
                <Text style={styles.locationText}>{vibe.location}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <Text style={styles.vibeComment}>{vibe.comment}</Text>
        
        {/* Vibe Check Photo with Festival Info */}
        <View style={styles.vibePhotoContainer}>
          <Image source={{ uri: vibe.vibeCheckPhoto }} style={styles.vibePhoto} />
          <View style={styles.photoOverlay}>
            <View style={styles.festivalBadgeOnPhoto}>
              <Image source={{ uri: festival?.logo }} style={styles.festivalLogoOnPhoto} />
              <Text style={styles.festivalNameOnPhoto}>{festival?.name}</Text>
            </View>
          </View>
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
  };

  const renderStars = (rating: number, size: number = 12) => {
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
            style={{ marginRight: 1 }}
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons 
            key={i} 
            name="star-half" 
            size={size} 
            color={colors.orange} 
            style={{ marginRight: 1 }}
          />
        );
      } else {
        stars.push(
          <Ionicons 
            key={i} 
            name="star-outline" 
            size={size} 
            color={colors.textMuted} 
            style={{ marginRight: 1 }}
          />
        );
      }
    }
    return stars;
  };

  const TrendingCard = ({ location }: { location: TrendingLocation }) => {
    const festival = mockFestivals.find(f => f.id === location.festivalId);
    
    return (
      <TouchableOpacity 
        style={styles.trendingCard}
        onPress={() => {
          console.log('Navigating to event details for:', location.festivalId);
          router.push(`/event-details?id=${location.festivalId}`);
        }}
      >
        {/* Festival Header */}
        <View style={styles.trendingFestivalHeader}>
          <Image source={{ uri: festival?.logo }} style={styles.festivalLogo} />
          <View style={styles.festivalInfo}>
            <Text style={styles.festivalName} numberOfLines={1}>{festival?.name}</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.trendingInfo}>
          <View style={styles.trendingHeader}>
            <Text style={styles.trendingName}>{location.name}</Text>
            {location.trending && (
              <View style={styles.trendingBadge}>
                <Ionicons name="trending-up" size={12} color={colors.orange} />
                <Text style={styles.trendingBadgeText}>HOT</Text>
              </View>
            )}
          </View>
          <Text style={styles.trendingCheckedIn}>{location.checkedIn} people checked in</Text>
        </View>
        <View style={styles.trendingScoreContainer}>
          <View style={styles.trendingScoreRow}>
            <View style={[styles.trendingScore, { backgroundColor: scoreColors.getScoreBackground(location.score) }]}>
              <Text style={[styles.trendingScoreText, { color: scoreColors.getScoreColor(location.score) }]}>
                {location.score}
              </Text>
            </View>
            <View style={styles.trendingStars}>
              {renderStars(location.score, 10)}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const FestivalFilter = ({ festival }: { festival: Festival }) => {
    const isSelected = selectedFestivalFilter === festival.id;
    const isLive = festival.status === 'live';
    
    return (
      <TouchableOpacity 
        style={[
          styles.festivalFilterChip,
          isSelected && { backgroundColor: festival.color + '30', borderColor: festival.color },
          !isLive && { opacity: 0.6 }
        ]}
        onPress={() => {
          console.log('Festival filter selected:', festival.id);
          setSelectedFestivalFilter(isSelected ? null : festival.id);
        }}
        disabled={!isLive}
      >
        <Text style={styles.festivalEmoji}>{festival.emoji}</Text>
        <Text style={[
          styles.festivalFilterText,
          isSelected && { color: festival.color, fontWeight: '600' }
        ]}>
          {festival.name}
        </Text>
        {festival.status === 'live' && (
          <View style={styles.liveDot} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={gradients.background} style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.spaceBetween}>
          <View>
            <View style={styles.appTitleContainer}>
              <View style={styles.appLogo}>
                <Ionicons name="pulse" size={24} color={colors.purple} />
              </View>
              <Text style={commonStyles.title}>Vibescore</Text>
            </View>
            <Text style={commonStyles.subtitle}>
              {currentFestival 
                ? `Live at ${currentFestival.name}` 
                : 'Live from Various Events'
              }
            </Text>
          </View>
          <View style={styles.topBarActions}>
            {isSearchExpanded ? (
              <View style={styles.expandedSearchContainer}>
                <TextInput
                  style={styles.expandedSearchInput}
                  placeholder="search"
                  placeholderTextColor={colors.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearchSubmit}
                  autoFocus
                />
                <TouchableOpacity style={styles.searchCloseButton} onPress={handleSearchToggle}>
                  <Ionicons name="close" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.topBarButton} onPress={handleSearchToggle}>
                <Ionicons name="search" size={24} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Festival Filter Section */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Filter by Event</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity 
              style={[
                styles.festivalFilterChip,
                !selectedFestivalFilter && { backgroundColor: colors.purple + '30', borderColor: colors.purple }
              ]}
              onPress={() => {
                console.log('All festivals filter selected');
                setSelectedFestivalFilter(null);
              }}
            >
              <Text style={styles.festivalEmoji}>🌍</Text>
              <Text style={[
                styles.festivalFilterText,
                !selectedFestivalFilter && { color: colors.purple, fontWeight: '600' }
              ]}>
                All Events
              </Text>
            </TouchableOpacity>
            {mockFestivals.filter(f => f.status === 'live').map((festival) => (
              <FestivalFilter key={festival.id} festival={festival} />
            ))}
          </ScrollView>
        </View>

        <View style={commonStyles.spaceBetween}>
          <Text style={commonStyles.sectionTitle}>Trending Now</Text>
          <TouchableOpacity onPress={() => router.push('/trending-events')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {filteredTrendingLocations.length === 0 ? (
          <View style={styles.emptyTrendingState}>
            <Ionicons name="trending-up-outline" size={32} color={colors.textMuted} />
            <Text style={styles.emptyTrendingText}>
              {selectedFestivalFilter 
                ? `No trending locations at ${currentFestival?.name} right now`
                : 'No trending locations right now'
              }
            </Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll}>
            {filteredTrendingLocations.map((location) => (
              <TrendingCard key={location.id} location={location} />
            ))}
          </ScrollView>
        )}

        <View style={commonStyles.spaceBetween}>
          <Text style={commonStyles.sectionTitle}>
            Live Feed 
            {selectedFestivalFilter && (
              <Text style={[styles.feedFilterIndicator, { color: currentFestival?.color }]}>
                {' '}• {currentFestival?.name}
              </Text>
            )}
          </Text>
          <Text style={styles.feedCount}>
            {filteredVibes.length} {filteredVibes.length === 1 ? 'vibe' : 'vibes'}
          </Text>
        </View>

        {filteredVibes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="musical-notes-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyStateTitle}>No vibes yet</Text>
            <Text style={styles.emptyStateText}>
              {selectedFestivalFilter 
                ? `Be the first to share a vibe from ${currentFestival?.name}!`
                : 'Be the first to share your festival experience!'
              }
            </Text>
          </View>
        ) : (
          filteredVibes.map((vibe) => (
            <VibeCard key={vibe.id} vibe={vibe} />
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity 
        style={buttonStyles.floating}
        onPress={() => {
          console.log('Starting vibe check flow - redirecting to event check-in');
          router.push('/event-checkin');
        }}
      >
        <View style={styles.fabContent}>
          <Ionicons name="add" size={24} color={colors.text} />
          <Text style={styles.fabText}>Share your vibe</Text>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
    marginRight: 12,
  },
  userAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.purple,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  vibeRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vibeRatingText: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 4,
  },
  vibeRatingEmoji: {
    fontSize: 14,
  },
  locationTimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeAgo: {
    fontSize: 12,
    color: colors.textMuted,
    marginRight: 6,
  },
  pinpointer: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  vibeComment: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  vibePhotoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  vibePhoto: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  festivalBadgeOnPhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 120,
    maxWidth: 220,
  },
  festivalLogoOnPhoto: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  festivalNameOnPhoto: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'left',
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
  trendingScroll: {
    marginBottom: 24,
  },
  trendingCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trendingFestivalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  festivalLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  festivalInfo: {
    flex: 1,
  },
  festivalName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.green,
    marginLeft: 4,
  },
  trendingInfo: {
    flex: 1,
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  trendingName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.orange + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendingBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.orange,
    marginLeft: 2,
  },
  trendingCheckedIn: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
  },
  trendingScoreContainer: {
    alignItems: 'flex-start',
  },
  trendingScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendingScore: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendingScoreText: {
    fontSize: 14,
    fontWeight: '700',
  },
  trendingStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAll: {
    fontSize: 14,
    color: colors.purple,
    fontWeight: '600',
  },
  fabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fabText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  filterSection: {
    marginBottom: 16,
    marginTop: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  filterScroll: {
    marginBottom: 8,
  },
  festivalFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  festivalEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  festivalFilterText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green,
    marginLeft: 8,
  },
  feedFilterIndicator: {
    fontSize: 16,
    fontWeight: '600',
  },
  feedCount: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
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
  emptyTrendingState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  emptyTrendingText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  appTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.purple + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.purple + '30',
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  topBarButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  expandedSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 200,
  },
  expandedSearchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 4,
  },
  searchCloseButton: {
    padding: 4,
    marginLeft: 8,
  },
});