import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  Easing,
} from 'react-native';
import { Check, Clock, Trash2 } from 'lucide-react-native';
import { Medication } from '../stores/medicationStore';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { getMedicationIcon } from './icons/KawaiiIcons';

interface MedicationCardProps {
  medication: Medication;
  onTakeMedication: (id: string) => void;
  onDeleteMedication?: (id: string) => void;
}

export default function MedicationCard({
  medication,
  onTakeMedication,
  onDeleteMedication,
}: MedicationCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const cardBg = useRef(new Animated.Value(medication.taken ? 1 : 0)).current;

  useEffect(() => {
    if (medication.taken) {
      Animated.parallel([
        Animated.spring(checkScale, { toValue: 1, damping: 8, stiffness: 200, useNativeDriver: true }),
        Animated.timing(checkOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(cardBg, { toValue: 1, duration: 300, easing: Easing.out(Easing.ease), useNativeDriver: false }),
      ]).start();
    } else {
      checkScale.setValue(0);
      checkOpacity.setValue(0);
      cardBg.setValue(0);
    }
  }, [medication.taken]);

  const handlePress = () => {
    if (medication.taken) return;

    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.93, damping: 15, stiffness: 400, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, damping: 8, stiffness: 200, useNativeDriver: true }),
    ]).start();

    onTakeMedication(medication.id);
  };

  const handleLongPress = () => {
    if (!onDeleteMedication) return;
    Alert.alert(
      `Delete ${medication.name}?`,
      'This will remove the medication and cancel its reminders.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteMedication(medication.id),
        },
      ]
    );
  };

  return (
    <Animated.View
      style={[
        styles.card,
        medication.taken && styles.cardTaken,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        style={styles.leftSection}
        onLongPress={handleLongPress}
        activeOpacity={0.8}
        delayLongPress={500}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: medication.taken ? Colors.takenGreen : medication.color || Colors.card },
          ]}
        >
          {(() => { const MedIcon = getMedicationIcon(medication.icon || 'pill'); return <MedIcon size={26} />; })()}
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
      </TouchableOpacity>

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
          <Animated.View style={{ transform: [{ scale: checkScale }], opacity: checkOpacity }}>
            <Check size={20} color={Colors.white} strokeWidth={3} />
          </Animated.View>
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
