import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, commonStyles, gradients } from '../styles/commonStyles';

export default function NewEventScreen() {
  const [eventName, setEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!eventName.trim() || !eventLocation.trim() || !eventDate.trim() || !eventTime.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    console.log('Submitting new event:', {
      name: eventName,
      location: eventLocation,
      date: eventDate,
      time: eventTime,
      description: eventDescription
    });

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Event Submitted! 🎉',
        'Thank you for submitting a new event. It will be reviewed and added to the database soon.',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting event:', error);
      Alert.alert('Submission Error', 'Unable to submit event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={gradients.background} style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.spaceBetween}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Submit New Event</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add Event Details</Text>
          <Text style={styles.formDescription}>
            Help the community discover new events by submitting event information
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Event Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Electric Dreams Festival"
              placeholderTextColor={colors.textMuted}
              value={eventName}
              onChangeText={setEventName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Central Park, NYC"
              placeholderTextColor={colors.textMuted}
              value={eventLocation}
              onChangeText={setEventLocation}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Date *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Dec 15, 2024"
                placeholderTextColor={colors.textMuted}
                value={eventDate}
                onChangeText={setEventDate}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Time *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 2:00 PM - 11:00 PM"
                placeholderTextColor={colors.textMuted}
                value={eventTime}
                onChangeText={setEventTime}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Tell us more about this event..."
              placeholderTextColor={colors.textMuted}
              value={eventDescription}
              onChangeText={setEventDescription}
              multiline
              maxLength={500}
            />
            <Text style={styles.characterCount}>{eventDescription.length}/500</Text>
          </View>

          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={20} color={colors.purple} />
            <Text style={styles.infoText}>
              Events are manually reviewed before being added to ensure accuracy and prevent spam.
            </Text>
          </View>

          <TouchableOpacity 
            style={[
              styles.submitButton,
              (!eventName.trim() || !eventLocation.trim() || !eventDate.trim() || !eventTime.trim()) && styles.submitButtonDisabled,
              isSubmitting && styles.submitButtonSubmitting
            ]}
            onPress={handleSubmit}
            disabled={!eventName.trim() || !eventLocation.trim() || !eventDate.trim() || !eventTime.trim() || isSubmitting}
          >
            <View style={styles.submitButtonContent}>
              {isSubmitting ? (
                <>
                  <View style={styles.loadingSpinner} />
                  <Text style={styles.submitButtonText}>Submitting...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="send" size={20} color={colors.text} />
                  <Text style={styles.submitButtonText}>Submit Event</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  formContainer: {
    marginTop: 16,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  formDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 32,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: colors.purple + '10',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.purple + '30',
    marginBottom: 32,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: colors.purple,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
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
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.text + '30',
    borderTopColor: colors.text,
  },
});