import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, commonStyles, gradients, scoreColors } from '../styles/commonStyles';

interface LocationScore {
  id: string;
  name: string;
  category: string;
  type: 'stage' | 'food' | 'restroom' | 'bar' | 'chill' | 'shop';
  score: number;
  reviewCount: number;
  timeRange: string;
}

const mockLocationScores: LocationScore[] = [
  { id: '1', name: 'Main Stage', category: 'Entertainment', type: 'stage', score: 4.8, reviewCount: 847, timeRange: 'Last 1h' },
  { id: '2', name: 'Chill Zone', category: 'Relaxation', type: 'chill', score: 4.6, reviewCount: 324, timeRange: 'Last 2h' },
  { id: '3', name: 'VIP Bar', category: 'Drinks', type: 'bar', score: 4.3, reviewCount: 189, timeRange: 'Last 30m' },
  { id: '4', name: 'Taco Paradise', category: 'Food', type: 'food', score: 4.2, reviewCount: 156, timeRange: 'Last 45m' },
  { id: '5', name: 'Side Stage', category: 'Entertainment', type: 'stage', score: 4.1, reviewCount: 267, timeRange: 'Last 1h' },
  { id: '6', name: 'Food Court', category: 'Food', type: 'food', score: 3.9, reviewCount: 423, timeRange: 'Last 2h' },
  { id: '7', name: 'Restroom Block A', category: 'Facilities', type: 'restroom', score: 3.7, reviewCount: 89, timeRange: 'Last 30m' },
  { id: '8', name: 'Merch Store', category: 'Shopping', type: 'shop', score: 3.5, reviewCount: 67, timeRange: 'Last 3h' },
  { id: '9', name: 'Beer Garden', category: 'Drinks', type: 'bar', score: 3.2, reviewCount: 134, timeRange: 'Last 1h' },
  { id: '10', name: 'Restroom Block B', category: 'Facilities', type: 'restroom', score: 2.8, reviewCount: 56, timeRange: 'Last 45m' },
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

function getScoreLabel(score: number) {
  if (score >= 4.5) return 'Excellent';
  if (score >= 3.5) return 'Good';
  if (score >= 2.5) return 'Okay';
  if (score >= 1.5) return 'Poor';
  return 'Bad';
}

export default function LocationScoresScreen() {
  const [sortBy, setSortBy] = useState<'score' | 'reviews'>('score');

  const sortedLocations = [...mockLocationScores].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    return b.reviewCount - a.reviewCount;
  });

  const averageScore = mockLocationScores.reduce((sum, location) => sum + location.score, 0) / mockLocationScores.length;
  const totalReviews = mockLocationScores.reduce((sum, location) => sum + location.reviewCount, 0);
  const activeUsers = 2847;

  const LocationCard = ({ location }: { location: LocationScore }) => (
    <TouchableOpacity style={[
      styles.locationCard,
      { backgroundColor: scoreColors.getScoreBackground(location.score) }
    ]}>
      <View style={styles.locationHeader}>
        <View style={styles.locationIconContainer}>
          <Ionicons 
            name={getLocationIcon(location.type) as keyof typeof Ionicons.glyphMap} 
            size={24} 
            color={scoreColors.getScoreColor(location.score)} 
          />
        </View>
        <View style={styles.locationInfo}>
          <Text style={styles.locationName}>{location.name}</Text>
          <Text style={styles.locationCategory}>{location.category}</Text>
        </View>
        <View style={styles.locationScore}>
          <Text style={[
            styles.scoreValue,
            { color: scoreColors.getScoreColor(location.score) }
          ]}>
            {location.score.toFixed(1)}
          </Text>
          <Text style={[
            styles.scoreLabel,
            { color: scoreColors.getScoreColor(location.score) }
          ]}>
            {getScoreLabel(location.score)}
          </Text>
        </View>
      </View>
      
      <View style={styles.locationStats}>
        <Text style={styles.reviewStats}>
          {location.reviewCount} reviews • {location.timeRange}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const ScoreLegend = () => (
    <View style={styles.legendContainer}>
      <Text style={styles.legendTitle}>Score Ranges</Text>
      <View style={styles.legendItems}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.scoreExcellent }]} />
          <Text style={styles.legendText}>4.5+ Excellent</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.scoreGood }]} />
          <Text style={styles.legendText}>3.5+ Good</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.scoreOkay }]} />
          <Text style={styles.legendText}>2.5+ Okay</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.scorePoor }]} />
          <Text style={styles.legendText}>1.5+ Poor</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.scoreBad }]} />
          <Text style={styles.legendText}>Below 1.5 Bad</Text>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={gradients.background} style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={commonStyles.spaceBetween}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Location Scores</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <View style={styles.festivalInfo}>
        <Text style={styles.festivalName}>Electric Dreams 2024</Text>
        <View style={styles.festivalStats}>
          <View style={styles.festivalStat}>
            <Text style={styles.festivalStatValue}>{averageScore.toFixed(1)}</Text>
            <Text style={styles.festivalStatLabel}>Overall Rating</Text>
          </View>
          <View style={styles.festivalStat}>
            <Text style={styles.festivalStatValue}>{activeUsers.toLocaleString()}</Text>
            <Text style={styles.festivalStatLabel}>Active Users</Text>
          </View>
          <View style={styles.festivalStat}>
            <Text style={styles.festivalStatValue}>Just now</Text>
            <Text style={styles.festivalStatLabel}>Last Update</Text>
          </View>
        </View>
      </View>

      <View style={commonStyles.content}>
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'score' && styles.sortButtonActive]}
            onPress={() => setSortBy('score')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'score' && styles.sortButtonTextActive]}>
              Score
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'reviews' && styles.sortButtonActive]}
            onPress={() => setSortBy('reviews')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'reviews' && styles.sortButtonTextActive]}>
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.locationsList}>
          {sortedLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
          
          <ScoreLegend />
          
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
  festivalInfo: {
    backgroundColor: colors.backgroundCard,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  festivalName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  festivalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  festivalStat: {
    alignItems: 'center',
  },
  festivalStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.purple,
    marginBottom: 4,
  },
  festivalStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sortLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginRight: 12,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortButtonActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },
  sortButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: colors.text,
  },
  locationsList: {
    flex: 1,
  },
  locationCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(55, 65, 81, 0.4)',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(10, 10, 15, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  locationCategory: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  locationScore: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationStats: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(55, 65, 81, 0.4)',
  },
  reviewStats: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  legendContainer: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  legendTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  legendItems: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});