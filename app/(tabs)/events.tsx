import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, commonStyles, gradients, scoreColors } from '../../styles/commonStyles';

interface Event {
  id: string;
  name: string;
  location: string;
  date: string;
  status: 'live' | 'upcoming' | 'ended';
  overallRating: number;
  musicRating: number;
  foodRating: number;
  facilitiesRating: number;
  activeUsers: number;
  image: string;
  logo: string;
  startsIn?: string;
  endedAgo?: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Electric Dreams 2024',
    location: 'Central Park, NYC',
    date: 'Dec 15-17, 2024',
    status: 'live',
    overallRating: 4.6,
    musicRating: 4.8,
    foodRating: 4.2,
    facilitiesRating: 4.1,
    activeUsers: 2847,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
    logo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=80',
  },
  {
    id: '2',
    name: 'Summer Solstice Fest',
    location: 'Golden Gate Park, SF',
    date: 'Jun 21-23, 2025',
    status: 'upcoming',
    overallRating: 0,
    musicRating: 0,
    foodRating: 0,
    facilitiesRating: 0,
    activeUsers: 124,
    startsIn: '6 months',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    logo: 'https://images.unsplash.com/photo-1611095973362-ee358fc2b9b7?w=80',
  },
  {
    id: '3',
    name: 'Neon Nights Festival',
    location: 'Miami Beach, FL',
    date: 'Nov 8-10, 2024',
    status: 'ended',
    overallRating: 4.3,
    musicRating: 4.5,
    foodRating: 3.9,
    facilitiesRating: 4.1,
    activeUsers: 0,
    endedAgo: '1 month ago',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    logo: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=80',
  },
  {
    id: '4',
    name: 'Coachella 2025',
    location: 'Indio, CA',
    date: 'Apr 11-13, 2025',
    status: 'upcoming',
    overallRating: 0,
    musicRating: 0,
    foodRating: 0,
    facilitiesRating: 0,
    activeUsers: 89,
    startsIn: '4 months',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80',
  },
];

type FilterType = 'all' | 'live' | 'upcoming' | 'near';

export default function EventsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  const filteredEvents = mockEvents.filter(event => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'live') return event.status === 'live';
    if (selectedFilter === 'upcoming') return event.status === 'upcoming';
    if (selectedFilter === 'near') return true; // In a real app, this would filter by location
    return true;
  });

  const getStatusBadge = (event: Event) => {
    switch (event.status) {
      case 'live':
        return { text: 'Live Now', color: colors.green, backgroundColor: colors.green + '20' };
      case 'upcoming':
        return { text: `Starts in ${event.startsIn}`, color: colors.orange, backgroundColor: colors.orange + '20' };
      case 'ended':
        return { text: `Ended ${event.endedAgo}`, color: colors.textMuted, backgroundColor: colors.textMuted + '20' };
    }
  };

  const getActionButton = (event: Event) => {
    switch (event.status) {
      case 'live':
        return { text: 'Join Event', color: colors.green, action: () => router.push(`/event-details?id=${event.id}`) };
      case 'upcoming':
        return { text: 'Set Reminder', color: colors.orange, action: () => console.log('Set reminder') };
      case 'ended':
        return { text: 'View Summary', color: colors.textSecondary, action: () => router.push(`/event-details?id=${event.id}`) };
    }
  };

  const getFilterIcon = (filter: FilterType) => {
    switch (filter) {
      case 'all':
        return 'grid-outline';
      case 'live':
        return 'radio-outline';
      case 'upcoming':
        return 'time-outline';
      case 'near':
        return 'location-outline';
      default:
        return 'grid-outline';
    }
  };

  const FilterButton = ({ filter, title }: { filter: FilterType; title: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Ionicons 
        name={getFilterIcon(filter)} 
        size={16} 
        color={selectedFilter === filter ? colors.text : colors.textSecondary}
        style={styles.filterIcon}
      />
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.filterButtonTextActive
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

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

  const EventCard = ({ event }: { event: Event }) => {
    const statusBadge = getStatusBadge(event);
    const actionButton = getActionButton(event);

    return (
      <TouchableOpacity 
        style={[
          styles.eventCard,
          event.status === 'ended' && styles.eventCardEnded
        ]}
        onPress={() => {
          console.log('Navigating to event details for:', event.id);
          router.push(`/event-details?id=${event.id}`);
        }}
        activeOpacity={0.8}
      >
        <View style={styles.eventImageContainer}>
          <Image 
            source={{ uri: event.image }} 
            style={styles.eventImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={event.status === 'live' ? ['rgba(16, 185, 129, 0.8)', 'rgba(16, 185, 129, 0.4)'] : 
                   event.status === 'upcoming' ? ['rgba(249, 115, 22, 0.8)', 'rgba(249, 115, 22, 0.4)'] : 
                   ['rgba(113, 113, 122, 0.8)', 'rgba(113, 113, 122, 0.4)']}
            style={styles.eventImageOverlay}
          />
          
          {/* Festival Logo */}
          <View style={styles.festivalLogoContainer}>
            <Image 
              source={{ uri: event.logo }} 
              style={styles.festivalLogo}
              resizeMode="cover"
            />
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: statusBadge.backgroundColor }]}>
            <Text style={[styles.statusBadgeText, { color: statusBadge.color }]}>
              {statusBadge.text}
            </Text>
          </View>
        </View>

        <View style={styles.eventInfo}>
          <View style={styles.eventHeader}>
            <View style={styles.eventTitleRow}>
              <Text style={styles.eventName}>{event.name}</Text>
            </View>
            <Text style={styles.eventLocation}>{event.location}</Text>
            <Text style={styles.eventDate}>{event.date}</Text>
          </View>

          {event.status !== 'upcoming' && (
            <View style={styles.ratingsContainer}>
              <View style={styles.overallRating}>
                <View style={styles.overallRatingHeader}>
                  <Text style={styles.overallRatingValue}>{event.overallRating.toFixed(1)}</Text>
                  <Text style={styles.overallRatingEmoji}>{scoreColors.getScoreEmoji(event.overallRating)}</Text>
                </View>
                <View style={styles.overallStars}>
                  {renderStars(event.overallRating, 14)}
                </View>
                <Text style={styles.overallRatingLabel}>Overall</Text>
              </View>
              
              <View style={styles.subRatings}>
                <View style={styles.subRating}>
                  <View style={styles.subRatingHeader}>
                    <Ionicons name="musical-notes" size={16} color={colors.textSecondary} />
                    <Text style={styles.subRatingLabel}>Music</Text>
                  </View>
                  <View style={styles.subRatingContent}>
                    <Text style={styles.subRatingValue}>{event.musicRating.toFixed(1)}</Text>
                    <View style={styles.subRatingStars}>
                      {renderStars(event.musicRating)}
                    </View>
                  </View>
                </View>
                
                <View style={styles.subRating}>
                  <View style={styles.subRatingHeader}>
                    <Ionicons name="restaurant" size={16} color={colors.textSecondary} />
                    <Text style={styles.subRatingLabel}>Food</Text>
                  </View>
                  <View style={styles.subRatingContent}>
                    <Text style={styles.subRatingValue}>{event.foodRating.toFixed(1)}</Text>
                    <View style={styles.subRatingStars}>
                      {renderStars(event.foodRating)}
                    </View>
                  </View>
                </View>
                
                <View style={styles.subRating}>
                  <View style={styles.subRatingHeader}>
                    <Ionicons name="business" size={16} color={colors.textSecondary} />
                    <Text style={styles.subRatingLabel}>Facilities</Text>
                  </View>
                  <View style={styles.subRatingContent}>
                    <Text style={styles.subRatingValue}>{event.facilitiesRating.toFixed(1)}</Text>
                    <View style={styles.subRatingStars}>
                      {renderStars(event.facilitiesRating)}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          <View style={styles.eventFooter}>
            <View style={styles.activeUsers}>
              <Ionicons name="people" size={16} color={colors.textSecondary} />
              <Text style={styles.activeUsersText}>
                {event.activeUsers} {event.status === 'live' ? 'active vibers' : 
                                   event.status === 'upcoming' ? 'interested' : 'participated'}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: actionButton.color + '20' }]}
              onPress={actionButton.action}
            >
              <Text style={[styles.actionButtonText, { color: actionButton.color }]}>
                {actionButton.text}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={gradients.background} style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>Events</Text>
        <Text style={commonStyles.subtitle}>Discover amazing festivals</Text>
      </View>

      <View style={commonStyles.content}>
        <View style={[styles.filtersContainer, styles.filtersSpacing]}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScrollContainer}
          >
            <FilterButton filter="all" title="All" />
            <FilterButton filter="live" title="Live" />
            <FilterButton filter="upcoming" title="Upcoming" />
            <FilterButton filter="near" title="Near Me" />
          </ScrollView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.eventsList}>
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      <TouchableOpacity 
        style={styles.vibeCheckFab}
        onPress={() => router.push('/vibe-check')}
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
  filtersSpacing: {
    marginTop: 24,
    marginBottom: 20,
  },
  filtersContainer: {
    marginBottom: 24,
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 6,
    elevation: 2,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  filtersScrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 80,
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.purple,
    elevation: 4,
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
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
  eventsList: {
    flex: 1,
  },
  eventCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 6,
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  },
  eventCardEnded: {
    opacity: 0.7,
  },
  eventImageContainer: {
    height: 140,
    position: 'relative',
    backgroundColor: colors.background,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: colors.text,
    borderWidth: 2,
    borderColor: colors.text,
    elevation: 4,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  festivalLogo: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  eventInfo: {
    padding: 20,
  },
  eventHeader: {
    marginBottom: 18,
  },
  eventTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  eventName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
  },
  eventLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  eventDate: {
    fontSize: 14,
    color: colors.purple,
    fontWeight: '700',
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  overallRating: {
    alignItems: 'center',
    marginRight: 24,
    backgroundColor: scoreColors.getScoreBackground(4.5),
    borderRadius: 16,
    padding: 16,
    minWidth: 80,
  },
  overallRatingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  overallRatingValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginRight: 8,
  },
  overallRatingEmoji: {
    fontSize: 24,
  },
  overallStars: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  overallRatingLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  subRatings: {
    flex: 1,
    gap: 14,
  },
  subRating: {
    backgroundColor: colors.background + '40',
    borderRadius: 12,
    padding: 12,
  },
  subRatingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  subRatingLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginLeft: 6,
  },
  subRatingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subRatingValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  subRatingStars: {
    flexDirection: 'row',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background + '20',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  activeUsers: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activeUsersText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    fontWeight: '500',
  },
  actionButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 2,
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  vibeCheckFab: {
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