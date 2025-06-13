import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, commonStyles, gradients } from '../styles/commonStyles';

interface Event {
  id: string;
  name: string;
  location: string;
  date: string;
  time: string;
  status: 'live' | 'upcoming' | 'ended';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius: number; // meters
  image: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Electric Dreams Festival',
    location: 'Central Park, NYC',
    date: 'Today',
    time: '2:00 PM - 11:00 PM',
    status: 'live',
    coordinates: { latitude: 40.7829, longitude: -73.9654 },
    radius: 500,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
  },
  {
    id: '2',
    name: 'Summer Beats',
    location: 'Golden Gate Park, SF',
    date: 'Today',
    time: '1:00 PM - 10:00 PM',
    status: 'live',
    coordinates: { latitude: 37.7694, longitude: -122.4862 },
    radius: 600,
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
  },
  {
    id: '3',
    name: 'Indie Vibes',
    location: 'Millennium Park, Chicago',
    date: 'Tomorrow',
    time: '3:00 PM - 9:00 PM',
    status: 'upcoming',
    coordinates: { latitude: 41.8826, longitude: -87.6226 },
    radius: 400,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
  },
];

export default function EventCheckInScreen() {
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [checkedInEvent, setCheckedInEvent] = useState<Event | null>(null);

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-request location when component mounts
    requestLocation();
  }, []);

  const handleBackPress = () => {
    console.log('Back button pressed from event check-in screen');
    
    // Check if user is in the middle of verification
    if (isVerifying) {
      Alert.alert(
        'Cancel Check-in?',
        'You are currently verifying your attendance. Are you sure you want to go back?',
        [
          {
            text: 'Continue Verification',
            style: 'cancel',
          },
          {
            text: 'Cancel',
            style: 'destructive',
            onPress: () => {
              console.log('User cancelled verification and went back');
              setIsVerifying(false);
              setSelectedEvent(null);
              // Try multiple navigation methods
              try {
                if (router.canGoBack()) {
                  console.log('Using router.back()');
                  router.back();
                } else {
                  console.log('Using router.push to home');
                  router.push('/(tabs)/');
                }
              } catch (error) {
                console.log('Navigation error, trying router.replace:', error);
                router.replace('/(tabs)/');
              }
            },
          },
        ]
      );
    } else {
      console.log('Going back from event check-in');
      // Try multiple navigation methods
      try {
        if (router.canGoBack()) {
          console.log('Using router.back()');
          router.back();
        } else {
          console.log('Using router.push to home');
          router.push('/(tabs)/');
        }
      } catch (error) {
        console.log('Navigation error, trying router.replace:', error);
        router.replace('/(tabs)/');
      }
    }
  };

  const requestLocation = async () => {
    console.log('Requesting user location...');
    setIsLoadingLocation(true);
    
    try {
      // Simulate location request - in real app use expo-location
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock location (Central Park area for demo)
      const mockLocation = {
        latitude: 40.7829 + (Math.random() - 0.5) * 0.01,
        longitude: -73.9654 + (Math.random() - 0.5) * 0.01,
      };
      
      setUserLocation(mockLocation);
      console.log('Location obtained:', mockLocation);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Unable to get your location. Please enable location services.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const handleEventPress = async (event: Event) => {
    console.log('Event pressed:', event.name);
    
    // Check if already checked in to this event
    if (checkedInEvent?.id === event.id) {
      console.log('Already checked in to this event, proceeding to vibe check');
      router.push(`/vibe-check?event=${encodeURIComponent(event.name)}&eventId=${event.id}`);
      return;
    }

    // Check if event is live
    if (event.status !== 'live') {
      Alert.alert(
        'Event Not Live', 
        event.status === 'upcoming' 
          ? 'This event hasn\'t started yet. Check back when it\'s live!'
          : 'This event has ended. Check out other live events!'
      );
      return;
    }

    // Check if location is available
    if (!userLocation) {
      Alert.alert(
        'Location Required', 
        'We need your location to verify you\'re at the event. Please allow location access.',
        [
          {
            text: 'Get Location',
            onPress: requestLocation
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }

    // Start verification process
    verifyEventAttendance(event);
  };

  const verifyEventAttendance = async (event: Event) => {
    console.log('Verifying attendance for event:', event.name);
    setIsVerifying(true);
    setSelectedEvent(event);

    try {
      const distance = calculateDistance(
        userLocation!.latitude,
        userLocation!.longitude,
        event.coordinates.latitude,
        event.coordinates.longitude
      );

      console.log('Distance to event:', distance, 'meters');
      console.log('Event radius:', event.radius, 'meters');

      // Show verification progress
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (distance <= event.radius) {
        // Verification successful - check in to event
        setCheckedInEvent(event);
        console.log('Check-in successful for event:', event.name);
        
        Alert.alert(
          'Check-in Successful! 🎉',
          `Welcome to ${event.name}! You can now share your vibe with the community.`,
          [
            {
              text: 'Start Vibe Check',
              onPress: () => {
                console.log('Navigating to vibe check for event:', event.name);
                router.push(`/vibe-check?event=${encodeURIComponent(event.name)}&eventId=${event.id}`);
              }
            },
            {
              text: 'Stay Here',
              style: 'cancel'
            }
          ]
        );
      } else {
        Alert.alert(
          'Check-in Failed',
          `You need to be within ${event.radius}m of ${event.name} to check in. You are currently ${Math.round(distance)}m away.`,
          [
            {
              text: 'Try Again',
              onPress: () => requestLocation()
            },
            { text: 'OK', style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      console.error('Error verifying attendance:', error);
      Alert.alert('Verification Error', 'Unable to verify your attendance. Please try again.');
    } finally {
      setIsVerifying(false);
      setSelectedEvent(null);
    }
  };

  const submitNewEvent = () => {
    console.log('Navigating to new event submission');
    router.push('/new-event');
  };

  const EventCard = ({ event }: { event: Event }) => {
    const distance = userLocation ? calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      event.coordinates.latitude,
      event.coordinates.longitude
    ) : null;

    const isWithinRange = distance ? distance <= event.radius : false;
    const isVerifyingThis = isVerifying && selectedEvent?.id === event.id;
    const isCheckedIn = checkedInEvent?.id === event.id;
    const canCheckIn = event.status === 'live' && userLocation;

    return (
      <TouchableOpacity 
        style={[
          styles.eventCard,
          isCheckedIn && styles.eventCardCheckedIn,
          !canCheckIn && styles.eventCardDisabled
        ]}
        onPress={() => handleEventPress(event)}
        disabled={isVerifyingThis}
        activeOpacity={0.7}
      >
        <View style={styles.eventImage}>
          <Ionicons 
            name={isCheckedIn ? "checkmark-circle" : "musical-notes"} 
            size={32} 
            color={isCheckedIn ? colors.green : colors.purple} 
          />
        </View>
        
        <View style={styles.eventInfo}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventName}>{event.name}</Text>
            {isCheckedIn && (
              <View style={styles.checkedInBadge}>
                <Ionicons name="checkmark" size={12} color={colors.text} />
                <Text style={styles.checkedInText}>Checked In</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.eventLocation}>{event.location}</Text>
          <Text style={styles.eventTime}>{event.date} • {event.time}</Text>
          
          <View style={styles.eventMeta}>
            <View style={[styles.statusBadge, 
              event.status === 'live' && styles.statusLive,
              event.status === 'upcoming' && styles.statusUpcoming,
              event.status === 'ended' && styles.statusEnded
            ]}>
              <Text style={[styles.statusText,
                event.status === 'live' && styles.statusTextLive,
                event.status === 'upcoming' && styles.statusTextUpcoming,
                event.status === 'ended' && styles.statusTextEnded
              ]}>
                {event.status === 'live' ? 'Live Now' : 
                 event.status === 'upcoming' ? 'Upcoming' : 'Ended'}
              </Text>
            </View>
            
            {distance && (
              <Text style={styles.distanceText}>
                {Math.round(distance)}m away
              </Text>
            )}

            {isWithinRange && event.status === 'live' && !isCheckedIn && (
              <View style={styles.inRangeBadge}>
                <Ionicons name="location" size={12} color={colors.green} />
                <Text style={styles.inRangeText}>In Range</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.checkInIndicator}>
          {isVerifyingThis ? (
            <ActivityIndicator size="small" color={colors.purple} />
          ) : (
            <Ionicons 
              name={
                isCheckedIn ? "checkmark-circle" :
                !canCheckIn ? "lock-closed" :
                isWithinRange ? "location" : "chevron-forward"
              }
              size={24} 
              color={
                isCheckedIn ? colors.green :
                !canCheckIn ? colors.textMuted :
                isWithinRange ? colors.green : colors.textSecondary
              }
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
          <Text style={styles.headerTitle}>Event Check-in</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <View style={commonStyles.content}>
        <View style={styles.verificationInfo}>
          <Ionicons name="shield-checkmark" size={32} color={colors.green} />
          <Text style={styles.verificationTitle}>Verify Your Attendance</Text>
          <Text style={styles.verificationDescription}>
            Tap on an event to check in using your location and current time
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <Ionicons name="time" size={20} color={colors.purple} />
            <View style={styles.statusInfo}>
              <Text style={styles.statusLabel}>Current Time</Text>
              <Text style={styles.statusValue}>
                {currentTime.toLocaleTimeString()}
              </Text>
            </View>
          </View>
          
          <View style={styles.statusItem}>
            <Ionicons 
              name="location" 
              size={20} 
              color={userLocation ? colors.green : colors.orange} 
            />
            <View style={styles.statusInfo}>
              <Text style={styles.statusLabel}>Location</Text>
              <Text style={styles.statusValue}>
                {userLocation ? 'Verified' : 'Getting Location...'}
              </Text>
            </View>
            {!userLocation && !isLoadingLocation && (
              <TouchableOpacity 
                style={styles.getLocationButton}
                onPress={requestLocation}
              >
                <Text style={styles.getLocationText}>Retry</Text>
              </TouchableOpacity>
            )}
            {isLoadingLocation && (
              <ActivityIndicator size="small" color={colors.purple} />
            )}
          </View>
        </View>

        {checkedInEvent && (
          <View style={styles.checkedInContainer}>
            <Ionicons name="checkmark-circle" size={24} color={colors.green} />
            <View style={styles.checkedInInfo}>
              <Text style={styles.checkedInTitle}>Checked in to {checkedInEvent.name}</Text>
              <Text style={styles.checkedInDescription}>You can now rate locations at this event</Text>
            </View>
            <TouchableOpacity 
              style={styles.vibeCheckButton}
              onPress={() => router.push(`/vibe-check?event=${encodeURIComponent(checkedInEvent.name)}&eventId=${checkedInEvent.id}`)}
            >
              <Text style={styles.vibeCheckButtonText}>Vibe Check</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.eventsTitle}>
          {checkedInEvent ? 'Other Events' : 'Available Events'}
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false} style={styles.eventsList}>
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
          
          <View style={styles.newEventSection}>
            <View style={styles.newEventIcon}>
              <Ionicons name="add-circle" size={32} color={colors.orange} />
            </View>
            <View style={styles.newEventInfo}>
              <Text style={styles.newEventTitle}>Event not listed?</Text>
              <Text style={styles.newEventDescription}>
                Submit a new event to the database
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.newEventButton}
              onPress={submitNewEvent}
            >
              <Text style={styles.newEventButtonText}>Submit Event</Text>
            </TouchableOpacity>
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
  verificationInfo: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  verificationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  verificationDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  statusContainer: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  statusInfo: {
    flex: 1,
    marginLeft: 12,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  getLocationButton: {
    backgroundColor: colors.purple,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  getLocationText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  checkedInContainer: {
    backgroundColor: colors.green + '20',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.green + '40',
  },
  checkedInInfo: {
    flex: 1,
    marginLeft: 12,
  },
  checkedInTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  checkedInDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  vibeCheckButton: {
    backgroundColor: colors.green,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  vibeCheckButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  eventsList: {
    flex: 1,
  },
  eventCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventCardCheckedIn: {
    backgroundColor: colors.green + '10',
    borderColor: colors.green + '40',
  },
  eventCardDisabled: {
    opacity: 0.6,
  },
  eventImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.purple + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  eventInfo: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  checkedInBadge: {
    backgroundColor: colors.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  checkedInText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text,
  },
  eventLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusLive: {
    backgroundColor: colors.green + '20',
  },
  statusUpcoming: {
    backgroundColor: colors.orange + '20',
  },
  statusEnded: {
    backgroundColor: colors.textMuted + '20',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statusTextLive: {
    color: colors.green,
  },
  statusTextUpcoming: {
    color: colors.orange,
  },
  statusTextEnded: {
    color: colors.textMuted,
  },
  distanceText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  inRangeBadge: {
    backgroundColor: colors.green + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  inRangeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.green,
  },
  checkInIndicator: {
    marginLeft: 12,
  },
  newEventSection: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  newEventIcon: {
    marginRight: 16,
  },
  newEventInfo: {
    flex: 1,
  },
  newEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  newEventDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  newEventButton: {
    backgroundColor: colors.orange,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  newEventButtonText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
});