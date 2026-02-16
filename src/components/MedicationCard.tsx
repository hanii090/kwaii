import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Check, Clock } from 'lucide-react-native';
import { Medication } from '../stores/medicationStore';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface MedicationCardProps {
  medication: Medication;
  onTakeMedication: (id: string) => void;
}

export default function MedicationCard({
  medication,
  onTakeMedication,
}: MedicationCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (medication.taken) return;

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    onTakeMedication(medication.id);
  };

  return (
    <Animated.View
      style={[
        styles.card,
        medication.taken && styles.cardTaken,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: medication.taken ? Colors.takenGreen : medication.color || Colors.card },
          ]}
        >
          <Text style={styles.icon}>{medication.icon || '💊'}</Text>
        </View>

        <View style={styles.info}>
          <Text
            style={[styles.name, medication.taken && styles.nameTaken]}
            numberOfLines={1}
          >
            {medication.name}
          </Text>
          <Text style={styles.dosage}>{medication.dosage}</Text>
          <View style={styles.timeRow}>
            <Clock size={12} color={Colors.lightText} strokeWidth={2} />
            <Text style={styles.time}>{medication.scheduledTime}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.checkbox,
          medication.taken && styles.checkboxTaken,
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={medication.taken}
      >
        {medication.taken && (
          <Check size={20} color={Colors.white} strokeWidth={3} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.medium,
  },
  cardTaken: {
    backgroundColor: '#F0F8F0',
    opacity: 0.85,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 2,
  },
  nameTaken: {
    textDecorationLine: 'line-through',
    color: Colors.lightText,
  },
  dosage: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.secondary,
    marginBottom: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.lightText,
  },
  checkbox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    borderWidth: 2.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  checkboxTaken: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
});
