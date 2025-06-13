import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, commonStyles, gradients, scoreColors } from '../styles/commonStyles';

interface TrendingEvent {
  id: string;
  name: string;
  location: string;
  type: 'stage' | 'food' | 'restroom' | 'bar' | 'chill';
  score: number;
  checkedIn: number;
  trending: boolean;
  festival: string;
  festivalId: string;
  festivalLogo: string;
  eventImage: string;
  description: string;
  timeRange: string;
}

const mockTrendingEvents: TrendingEvent[] = [
  { 
    id: '1', 
    name: 'Main Stage', 
    location: 'Central Arena',
    type: 'stage', 
    score: 4.6, 
    checkedIn: 1247, 
    trending: true,
    festival: 'Electric Dreams 2024',
    festivalId: 'electric-dreams',
    festivalLogo: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop&crop=center',
    eventImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    description: 'DJ NEXUS performing epic electronic beats',
    timeRange: 'Live now'
  },
  { 
    id: '2', 
    name: 'Chill Zone', 
    location: 'Garden Area',
    type: 'chill', 
    score: 4.3, 
    checkedIn: 324, 
    trending: true,
    festival: 'Summer Vibes Fest',
    festivalId: 'summer-vibes',
    festivalLogo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=center',
    eventImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    description: 'Perfect relaxation spot with ambient music',
    timeRange: 'Live now'
  },
  { 
    id: '3', 
    name: 'Food Court', 
    location: 'West Side',
    type: 'food', 
    score: 3.9, 
    checkedIn: 567, 
    trending: false,
    festival: 'Bass Drop Festival',
    festivalId: 'bass-drop',
    festivalLogo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center',
    eventImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    description: 'Diverse food options from local vendors',
    timeRange: 'Open all day'
  },
  { 
    id: '4', 
    name: 'VIP Bar', 
    location: 'North Deck',
    type: 'bar', 
    score: 4.1, 
    checkedIn: 189, 
    trending: true,
    festival: 'Electric Dreams 2024',
    festivalId: 'electric-dreams',
    festivalLogo: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop&crop=center',
    eventImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400',
    description: 'Premium cocktails with festival views',
    timeRange: 'Live now'
  },
  { 
    id: '5', 
    name: 'Underground Stage', 
    location: 'Basement Level',
    type: 'stage', 
    score: 4.8, 
    checkedIn: 892, 
    trending: true,
    festival: 'Bass Drop Festival',
    festivalId: 'bass-drop',
    festivalLogo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&crop=center',
    eventImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
    description: 'Heavy bass and underground vibes',
    timeRange: 'Live now'
  },
  { 
    id: '6', 
    name: 'Sunset Terrace', 
    location: 'Top Floor',
    type: 'chill', 
    score: 4.5, 
    checkedIn: 456, 
    trending: true,
    festival: 'Summer Vibes Fest',
    festivalId: 'summer-vibes',
    festivalLogo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=center',
    eventImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    description: 'Amazing sunset views with acoustic sets',
    timeRange: 'Live now'
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

export default function TrendingEventsScreen() {
  const [filter, setFilter] = useState<'all' | 'trending'>('all');

  const filteredEvents = filter === 'trending' 
    ? mockTrendingEvents.filter(event => event.trending)
    : mockTrendingEvents;

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

  const TrendingEventCard = ({ event }: { event: TrendingEvent }) => (
    <TouchableOpacity 
      style={styles.eventCard}
      onPress={() => {
        console.log('Navigating to event details for:', event.festivalId);
        router.push(`/event-details?id=${event.festivalId}`);
      }}
      activeOpacity={0.8}
    >
      <View style={styles.eventImageContainer}>
        <Image 
          source={{ uri: event.eventImage }} 
          style={styles.eventImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.6)', 'transparent']}
          style={styles.eventImageOverlay}
        />
        
        {/* Festival Logo */}
        <View style={styles.festivalLogoContainer}>
          <Image 
            source={{ uri: event.festivalLogo }} 
            style={styles.festivalLogo}
            resizeMode="cover"
          />
        </View>
        
        {event.trending && (
          <View style={styles.trendingBadge}>
            <Ionicons name="trending-up" size={12} color={colors.orange} />
            <Text style={styles.trendingBadgeText}>HOT</Text>
          </View>
        )}
      </View>

      <View style={styles.eventInfo}>
        <View style={styles.eventHeader}>
          <View style={styles.eventTitleRow}>
            <View style={styles.eventIconContainer}>
              <Ionicons 
                name={getLocationIcon(event.type) as keyof typeof Ionicons.glyphMap} 
                size={20} 
                color={colors.purple} 
              />
            </View>
            <View style={styles.eventTitleInfo}>
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={styles.eventLocation}>{event.location}</Text>
            </View>
          </View>
          <Text style={styles.festivalName}>{event.festival}</Text>
          <Text style={styles.eventDescription}>{event.description}</Text>
        </View>

        <View style={styles.eventStats}>
          <View style={styles.scoreSection}>
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreValue, { color: scoreColors.getScoreColor(event.score) }]}>
                {event.score.toFixed(1)}
              </Text>
              <View style={styles.starsContainer}>
                {renderStars(event.score, 12)}
              </View>
            </View>
          </View>
          
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>{event.checkedIn.toLocaleString()} checked in</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>{event.timeRange}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={gradients.background} style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.spaceBetween}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Trending Events</Text>
            <Text style={styles.headerSubtitle}>Overview of all trending locations</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <View style={commonStyles.content}>
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Ionicons 
              name="grid-outline" 
              size={16} 
              color={filter === 'all' ? colors.text : colors.textSecondary}
              style={styles.filterIcon}
            />
            <Text style={[
              styles.filterButtonText,
              filter === 'all' && styles.filterButtonTextActive
            ]}>
              All Events
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, filter === 'trending' && styles.filterButtonActive]}
            onPress={() => setFilter('trending')}
          >
            <Ionicons 
              name="trending-up" 
              size={16} 
              color={filter === 'trending' ? colors.text : colors.textSecondary}
              style={styles.filterIcon}
            />
            <Text style={[
              styles.filterButtonText,
              filter === 'trending' && styles.filterButtonTextActive
            ]}>
              Trending Only
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsOverview}>
          <View style={styles.overviewStat}>
            <Text style={styles.overviewStatValue}>{filteredEvents.length}</Text>
            <Text style={styles.overviewStatLabel}>Total Locations</Text>
          </View>
          <View style={styles.overviewStat}>
            <Text style={styles.overviewStatValue}>
              {filteredEvents.filter(e => e.trending).length}
            </Text>
            <Text style={styles.overviewStatLabel}>Currently Trending</Text>
          </View>
          <View style={styles.overviewStat}>
            <Text style={styles.overviewStatValue}>
              {filteredEvents.reduce((sum, e) => sum + e.checkedIn, 0).toLocaleString()}
            </Text>
            <Text style={styles.overviewStatLabel}>Total Check-ins</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.eventsList}>
          {filteredEvents.map((event) => (
            <TrendingEventCard key={event.id} event={event} />
          ))}
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: colors.purple,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: colors.text,
  },
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.purple,
    marginBottom: 4,
  },
  overviewStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  eventsList: {
    flex: 1,
  },
  eventCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 4,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  eventImageContainer: {
    height: 120,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  eventImageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  festivalLogoContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.text,
  },
  festivalLogo: {
    width: '100%',
    height: '100%',
  },
  trendingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.orange + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.orange + '40',
  },
  trendingBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.orange,
    marginLeft: 2,
  },
  eventInfo: {
    padding: 16,
  },
  eventHeader: {
    marginBottom: 12,
  },
  eventTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.purple + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventTitleInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  festivalName: {
    fontSize: 12,
    color: colors.purple,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  eventStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  scoreSection: {
    flex: 1,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '700',
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  statsSection: {
    alignItems: 'flex-end',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
});