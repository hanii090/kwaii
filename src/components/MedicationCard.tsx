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
import { Check, Clock } from 'lucide-react-native';
import { Medication } from '../stores/medicationStore';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { getMedicationIcon } from './icons/KawaiiIcons';

// Softer palette keyed off the card's user-chosen color
const ACCENT_MAP: Record<string, { bg: string; text: string; strip: string }> = {
  '#FFF3D6': { bg: '#FFF8E8', text: '#B8860B', strip: '#F4C430' },  // gold
  '#FFE4E1': { bg: '#FFF0EE', text: '#C0392B', strip: '#E57373' },  // rose
  '#E8F5E9': { bg: '#F0FAF0', text: '#388E3C', strip: '#81C784' },  // mint
  '#E3F2FD': { bg: '#EEF6FF', text: '#1565C0', strip: '#64B5F6' },  // sky
  '#F3E5F5': { bg: '#F9F0FB', text: '#7B1FA2', strip: '#BA68C8' },  // lilac
  '#FFF9F0': { bg: '#FFFAF4', text: '#8B5E3C', strip: '#F4A261' },  // warm
  '#FFF5E6': { bg: '#FFF8F0', text: '#A67C52', strip: '#E8A87C' },  // peach
};
const DEFAULT_ACCENT = { bg: '#FFF8F0', text: '#A67C52', strip: '#E8A87C' };

function getAccent(color?: string) {
  if (!color) return DEFAULT_ACCENT;
  return ACCENT_MAP[color] || DEFAULT_ACCENT;
}

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
  const checkScale = useRef(new Animated.Value(medication.taken ? 1 : 0)).current;
  const checkRotate = useRef(new Animated.Value(medication.taken ? 0 : -0.3)).current;
  const takenFade = useRef(new Animated.Value(medication.taken ? 1 : 0)).current;
  const stripWidth = useRef(new Animated.Value(medication.taken ? 6 : 4)).current;

  const accent = getAccent(medication.color);

  useEffect(() => {
    if (medication.taken) {
      Animated.parallel([
        Animated.timing(checkScale, { toValue: 1, duration: 300, easing: Easing.out(Easing.back(1.8)), useNativeDriver: true }),
        Animated.timing(checkRotate, { toValue: 0, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(takenFade, { toValue: 1, duration: 250, useNativeDriver: false }),
        Animated.timing(stripWidth, { toValue: 6, duration: 250, useNativeDriver: false }),
      ]).start();
    } else {
      checkScale.setValue(0);
      checkRotate.setValue(-0.3);
      takenFade.setValue(0);
      stripWidth.setValue(4);
    }
  }, [medication.taken]);

  const handlePress = () => {
    if (medication.taken) return;
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
    ]).start();
    onTakeMedication(medication.id);
  };

  const handleLongPress = () => {
    if (!onDeleteMedication) return;
    Alert.alert(
      `Delete ${medication.name}?`,
      'This will remove the pill and cancel its reminders.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDeleteMedication(medication.id) },
      ]
    );
  };

  const cardBgColor = takenFade.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.white, '#F4FAF4'],
  });

  const checkRotateDeg = checkRotate.interpolate({
    inputRange: [-0.3, 0],
    outputRange: ['-15deg', '0deg'],
  });

  const MedIcon = getMedicationIcon(medication.icon || 'pill');

  return (
    <Animated.View style={[styles.cardOuter, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={500}
        disabled={medication.taken}
        style={{ flex: 1 }}
      >
        <Animated.View style={[styles.card, { backgroundColor: cardBgColor }]}>
          {/* Color accent strip on the left */}
          <Animated.View
            style={[
              styles.accentStrip,
              {
                backgroundColor: medication.taken ? Colors.success : accent.strip,
                width: stripWidth,
              },
            ]}
          />

          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: medication.taken ? '#E8F5E9' : accent.bg,
                borderColor: medication.taken ? '#C8E6C9' : 'transparent',
                borderWidth: medication.taken ? 1 : 0,
              },
            ]}
          >
            <MedIcon size={22} />
          </View>

          {/* Middle: name, dosage chip, time */}
          <View style={styles.info}>
            <Text
              style={[
                styles.name,
                medication.taken && styles.nameTaken,
              ]}
              numberOfLines={1}
            >
              {medication.name}
            </Text>

            <View style={styles.metaRow}>
              {/* Dosage chip */}
              <View style={[styles.dosageChip, medication.taken && styles.dosageChipTaken]}>
                <Text
                  style={[styles.dosageText, medication.taken && styles.dosageTextTaken]}
                  numberOfLines={1}
                >
                  {medication.dosage}
                </Text>
              </View>

              {/* Time */}
              <View style={styles.timeRow}>
                <Clock
                  size={11}
                  color={medication.taken ? '#9E9E9E' : Colors.lightText}
                  strokeWidth={2}
                />
                <Text style={[styles.time, medication.taken && styles.timeTaken]}>
                  {medication.scheduledTime}
                </Text>
              </View>
            </View>
          </View>

          {/* Checkbox */}
          <View style={styles.checkboxArea}>
            <View
              style={[
                styles.checkbox,
                medication.taken && styles.checkboxTaken,
                !medication.taken && { borderColor: accent.strip },
              ]}
            >
              {medication.taken && (
                <Animated.View
                  style={{
                    transform: [
                      { scale: checkScale },
                      { rotate: checkRotateDeg },
                    ],
                  }}
                >
                  <Check size={16} color={Colors.white} strokeWidth={3} />
                </Animated.View>
              )}
            </View>
            {medication.taken && (
              <Text style={styles.doneLabel}>Done</Text>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    marginBottom: 10,
    borderRadius: 18,
    ...Shadows.medium,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 14,
    paddingRight: 14,
    paddingLeft: 0,
    overflow: 'hidden',
    minHeight: 76,
  },
  accentStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.2,
  },
  nameTaken: {
    color: '#9E9E9E',
    textDecorationLine: 'line-through',
    textDecorationColor: '#BDBDBD',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dosageChip: {
    backgroundColor: '#F5EDE3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dosageChipTaken: {
    backgroundColor: '#E8F5E9',
  },
  dosageText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
  },
  dosageTextTaken: {
    color: '#81C784',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.lightText,
  },
  timeTaken: {
    color: '#BDBDBD',
  },
  checkboxArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    gap: 3,
  },
  checkbox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    borderWidth: 2.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  checkboxTaken: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  doneLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.success,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
