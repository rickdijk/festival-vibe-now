import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles, gradients, scoreColors } from '../styles/commonStyles';

interface Location {
  id: string;
  name: string;
  description: string;
  type: 'stage' | 'food' | 'restroom' | 'bar' | 'chill' | 'shop';
  checkedIn: number;
  averageScore: number;
  distance: string;
}

const mockLocations: Location[] = [
  {
    id: '1',
    name: 'Main Stage',
    description: 'DJ NEXUS performing now',
    type: 'stage',
    checkedIn: 1247,
    averageScore: 4.6,
    distance: '50m',
  },
  {
    id: '2',
    name: 'Chill Zone',
    description: 'Relaxation area with ambient music',
    type: 'chill',
    checkedIn: 324,
    averageScore: 4.3,
    distance: '120m',
  },
  {
    id: '3',
    name: 'Taco Truck Paradise',
    description: 'Authentic Mexican street food',
    type: 'food',
    checkedIn: 89,
    averageScore: 4.2,
    distance: '200m',
  },
  {
    id: '4',
    name: 'VIP Bar',
    description: 'Premium cocktails & craft beer',
    type: 'bar',
    checkedIn: 156,
    averageScore: 4.1,
    distance: '180m',
  },
  {
    id: '5',
    name: 'Restroom Block A',
    description: 'Clean facilities near main entrance',
    type: 'restroom',
    checkedIn: 45,
    averageScore: 3.8,
    distance: '80m',
  },
  {
    id: '6',
    name: 'Merch Store',
    description: 'Official festival merchandise',
    type: 'shop',
    checkedIn: 67,
    averageScore: 4.0,
    distance: '150m',
  },
];

function getLocationIcon(type: string) {
  switch (type) {
    case 'stage': return 'musical-notes';
    case 'food': return 'restaurant';
    case 'restroom': return 'medical';
    case 'bar': return 'wine';
    case 'chill': return 'leaf';
    case 'shop': return 'storefront';
    default: return 'location';
  }
}

export default function VibeCheckScreen() {
  const { event, eventId } = useLocalSearchParams<{ event?: string; eventId?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [customLocation, setCustomLocation] = useState('');

  // If no event is provided, redirect to event check-in
  if (!event || !eventId) {
    console.log('No event provided, redirecting to check-in');
    router.replace('/event-checkin');
    return null;
  }

  const handleBackPress = () => {
    console.log('Back button pressed from vibe check screen');
    
    // Check if user has entered a custom location
    if (customLocation.trim() !== '') {
      Alert.alert(
        'Discard Custom Location?',
        'You have entered a custom location. Are you sure you want to go back?',
        [
          {
            text: 'Keep Writing',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              console.log('User chose to discard custom location and go back');
              router.back();
            },
          },
        ]
      );
    } else {
      console.log('Going back to event check-in');
      router.back();
    }
  };

  const filteredLocations = mockLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const LocationCard = ({ location }: { location: Location }) => (
    <TouchableOpacity 
      style={styles.locationCard}
      onPress={() => {
        console.log('Navigating to vibe rating for location:', location.name);
        router.push(`/vibe-rating?location=${encodeURIComponent(location.name)}&event=${encodeURIComponent(event)}&eventId=${eventId}`);
      }}
    >
      <View style={styles.locationIcon}>
        <Ionicons 
          name={getLocationIcon(location.type) as keyof typeof Ionicons.glyphMap} 
          size={28} 
          color={colors.purple} 
        />
      </View>
      
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{location.name}</Text>
        <Text style={styles.locationDescription}>{location.description}</Text>
        
        <View style={styles.locationStats}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={14} color={colors.textSecondary} />
            <Text style={styles.statText}>{location.checkedIn} checked in</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="location" size={14} color={colors.textSecondary} />
            <Text style={styles.statText}>{location.distance} away</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.locationScore}>
        <View style={[styles.scoreCircle, { backgroundColor: scoreColors.getScoreBackground(location.averageScore) }]}>
          <Text style={[styles.scoreValue, { color: scoreColors.getScoreColor(location.averageScore) }]}>
            {location.averageScore}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={gradients.background} style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.spaceBetween}>
          <TouchableOpacity 
            onPress={handleBackPress}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vibe Check</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <View style={commonStyles.content}>
        <View style={styles.eventInfo}>
          <View style={styles.eventBadge}>
            <Ionicons name="checkmark-circle" size={16} color={colors.green} />
            <Text style={styles.eventBadgeText}>Checked in</Text>
          </View>
          <Text style={styles.eventName}>{decodeURIComponent(event)}</Text>
        </View>

        <Text style={styles.questionTitle}>What are you experiencing right now?</Text>
        
        <TextInput
          style={commonStyles.searchBar}
          placeholder="Search locations..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView showsVerticalScrollIndicator={false} style={styles.locationsList}>
          {filteredLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
          
          <View style={styles.customLocationSection}>
            <Text style={styles.customLocationTitle}>Can&apos;t find your location?</Text>
            <TextInput
              style={styles.customLocationInput}
              placeholder="Describe where you are..."
              placeholderTextColor={colors.textMuted}
              value={customLocation}
              onChangeText={setCustomLocation}
              multiline
            />
            {customLocation.length > 0 && (
              <TouchableOpacity 
                style={styles.customLocationButton}
                onPress={() => {
                  console.log('Navigating to vibe rating for custom location:', customLocation);
                  router.push(`/vibe-rating?location=${encodeURIComponent(customLocation)}&event=${encodeURIComponent(event)}&eventId=${eventId}&custom=true`);
                }}
              >
                <Text style={styles.customLocationButtonText}>Continue with "{customLocation}"</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  backButton: {
    padding: 4,
    borderRadius: 8,
  },
  eventInfo: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
  },
  eventBadgeText: {
    color: colors.green,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  locationsList: {
    flex: 1,
  },
  locationCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.purple + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  locationDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  locationStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  locationScore: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  scoreCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  customLocationSection: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  customLocationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  customLocationInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
  },
  customLocationButton: {
    backgroundColor: colors.purple,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    alignItems: 'center',
  },
  customLocationButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});