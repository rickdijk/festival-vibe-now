import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { colors, commonStyles, gradients } from '../styles/commonStyles';

const ratingEmojis = ['😡', '😞', '😐', '😊', '🔥'];
const ratingLabels = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];

export default function VibeRatingScreen() {
  const { location, custom, event, eventId } = useLocalSearchParams<{ 
    location: string; 
    custom?: string; 
    event?: string;
    eventId?: string;
  }>();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Camera Permission Required',
        'Please allow camera access to capture photos during your vibe check.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    console.log('Taking photo for vibe check');
    setIsCapturingPhoto(true);
    
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        setIsCapturingPhoto(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        exif: true, // Include location data if available
      });

      if (!result.canceled && result.assets[0]) {
        console.log('Photo captured successfully:', result.assets[0].uri);
        setCapturedPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setIsCapturingPhoto(false);
    }
  };

  const removePhoto = () => {
    console.log('Removing captured photo');
    setCapturedPhoto(null);
  };

  const handleBackPress = () => {
    console.log('Back button pressed from vibe rating screen');
    
    // Check if user has made changes and warn them
    if (selectedRating !== null || comment.trim() !== '' || capturedPhoto !== null) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          {
            text: 'Keep Editing',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              console.log('User chose to discard changes and go back');
              // Reset all state
              setSelectedRating(null);
              setComment('');
              setCapturedPhoto(null);
              router.back();
            },
          },
        ]
      );
    } else {
      console.log('No changes to discard, going back to location selection');
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (selectedRating === null) {
      Alert.alert('Please select a rating', 'Rate your experience from 1 to 5 stars');
      return;
    }

    console.log('Submitting vibe check:', {
      location: decodeURIComponent(location),
      rating: selectedRating,
      comment,
      event: event ? decodeURIComponent(event) : null,
      eventId,
      photo: capturedPhoto,
      timestamp: new Date().toISOString()
    });

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    
    Alert.alert(
      'Vibe Check Submitted! 🎉',
      `Thanks for sharing your experience${capturedPhoto ? ' and photo' : ''} at ${event ? decodeURIComponent(event) : 'this location'}!`,
      [
        {
          text: 'OK',
          onPress: () => {
            console.log('Vibe check submitted successfully, navigating to home');
            // Navigate back to home and show success
            router.push('/(tabs)');
          }
        }
      ]
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
          <Text style={styles.headerTitle}>Rate Experience</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <View style={styles.contentWrapper}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {event && (
            <View style={styles.eventInfo}>
              <View style={styles.eventBadge}>
                <Ionicons name="musical-notes" size={14} color={colors.purple} />
                <Text style={styles.eventBadgeText}>{decodeURIComponent(event)}</Text>
              </View>
            </View>
          )}

          <View style={styles.locationInfo}>
            <View style={styles.locationIcon}>
              <Ionicons 
                name={custom ? "location" : "musical-notes"} 
                size={32} 
                color={colors.purple} 
              />
            </View>
            <Text style={styles.locationName}>{decodeURIComponent(location)}</Text>
            {custom && (
              <View style={styles.customBadge}>
                <Text style={styles.customBadgeText}>Custom Location</Text>
              </View>
            )}
          </View>

          <Text style={styles.ratingTitle}>How&apos;s your vibe?</Text>
          
          <View style={styles.ratingContainer}>
            {ratingEmojis.map((emoji, index) => {
              const rating = index + 1;
              const isSelected = selectedRating === rating;
              
              return (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.ratingButton,
                    isSelected && styles.ratingButtonSelected
                  ]}
                  onPress={() => {
                    console.log('Rating selected:', rating);
                    setSelectedRating(rating);
                  }}
                >
                  <Text style={styles.ratingEmoji}>{emoji}</Text>
                  <Text style={[
                    styles.ratingLabel,
                    isSelected && styles.ratingLabelSelected
                  ]}>
                    {ratingLabels[index]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          
          {/* Photo Capture Section */}
          <View style={styles.photoSection}>
            <Text style={styles.photoTitle}>Capture this moment (optional)</Text>
            
            {capturedPhoto ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: capturedPhoto }} style={styles.capturedPhoto} />
                <TouchableOpacity style={styles.removePhotoButton} onPress={removePhoto}>
                  <Ionicons name="close-circle" size={24} color={colors.red} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.photoButton}
                onPress={takePhoto}
                disabled={isCapturingPhoto}
              >
                <View style={styles.photoButtonContent}>
                  {isCapturingPhoto ? (
                    <>
                      <View style={styles.loadingSpinner} />
                      <Text style={styles.photoButtonText}>Opening Camera...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="camera" size={24} color={colors.purple} />
                      <Text style={styles.photoButtonText}>Take Photo</Text>
                    </>
                  )}
                </View>
                <Text style={styles.photoButtonSubtext}>Share what you&apos;re seeing right now</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.commentSection}>
            <Text style={styles.commentTitle}>Share your experience (optional)</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Tell the community about your vibe..."
              placeholderTextColor={colors.textMuted}
              value={comment}
              onChangeText={(text) => {
                console.log('Comment updated:', text.length, 'characters');
                setComment(text);
              }}
              multiline
              maxLength={280}
            />
            <Text style={styles.characterCount}>{comment.length}/280</Text>
          </View>

          <View style={styles.tipContainer}>
            <Ionicons name="information-circle" size={16} color={colors.purple} />
            <Text style={styles.tipText}>
              Your vibe check {capturedPhoto ? 'and photo ' : ''}helps other festival-goers discover the best spots in real-time!
            </Text>
          </View>
        </ScrollView>

        {/* Fixed Submit Button at Bottom */}
        <View style={styles.submitButtonContainer}>
          <TouchableOpacity 
            style={[
              styles.submitButton,
              selectedRating === null && styles.submitButtonDisabled,
              isSubmitting && styles.submitButtonSubmitting
            ]}
            onPress={handleSubmit}
            disabled={selectedRating === null || isSubmitting}
            activeOpacity={0.8}
          >
            <View style={styles.submitButtonContent}>
              {isSubmitting ? (
                <>
                  <View style={styles.loadingSpinner} />
                  <Text style={styles.submitButtonText}>Submitting...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={24} color={colors.text} />
                  <Text style={styles.submitButtonText}>Submit Vibe Check</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
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
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  submitButtonContainer: {
    backgroundColor: colors.background,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border + '30',
  },
  eventInfo: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.purple + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  eventBadgeText: {
    color: colors.purple,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  locationInfo: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  locationIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.purple + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  locationName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  customBadge: {
    backgroundColor: colors.orange + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  customBadgeText: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: '600',
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  ratingButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ratingButtonSelected: {
    backgroundColor: colors.purple + '20',
    borderColor: colors.purple,
  },
  ratingEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  ratingLabelSelected: {
    color: colors.purple,
  },
  photoSection: {
    marginBottom: 16,
  },
  photoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  photoButton: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.purple + '30',
    borderStyle: 'dashed',
  },
  photoButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.purple,
    marginLeft: 8,
  },
  photoButtonSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  photoContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  capturedPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: colors.backgroundCard,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.background + 'E6',
    borderRadius: 12,
    padding: 4,
  },
  commentSection: {
    marginBottom: 16,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
  },
  characterCount: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: colors.purple,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: colors.purple,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitButtonSubmitting: {
    backgroundColor: colors.purple + '80',
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingSpinner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.text + '30',
    borderTopColor: colors.text,
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: colors.purple + '10',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.purple + '30',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});