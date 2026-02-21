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
import { Colors, Shadows } from '../constants/theme';
import { getMedicationIcon } from './icons/KawaiiIcons';

// Refined accent palette — one tint color per medication color, Apple HIG-inspired
const ACCENT_MAP: Record<string, { tint: string; bg: string }> = {
  '#FFF3D6': { tint: '#E8A440', bg: '#FEF5E7' },  // amber
  '#FFE4E1': { tint: '#E8636B', bg: '#FFF0EE' },  // coral
  '#E8F5E9': { tint: '#5ABE6E', bg: '#EFF8F0' },  // green
  '#E3F2FD': { tint: '#5B9FE8', bg: '#EDF5FC' },  // blue
  '#F3E5F5': { tint: '#A66BBF', bg: '#F6EEFA' },  // purple
  '#FFF9F0': { tint: '#D4895C', bg: '#FFF6EE' },  // warm
  '#FFF5E6': { tint: '#D4895C', bg: '#FFF6EE' },  // peach
};
const DEFAULT_ACCENT = { tint: '#D4895C', bg: '#FFF6EE' };

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
  const checkOpacity = useRef(new Animated.Value(medication.taken ? 1 : 0)).current;
  const takenBg = useRef(new Animated.Value(medication.taken ? 1 : 0)).current;

  const accent = getAccent(medication.color);
  const MedIcon = getMedicationIcon(medication.icon || 'pill');

  useEffect(() => {
    if (medication.taken) {
      Animated.parallel([
        Animated.spring(checkScale, { toValue: 1, speed: 16, bounciness: 12, useNativeDriver: true }),
        Animated.timing(checkOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(takenBg, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      ]).start();
    } else {
      checkScale.setValue(0);
      checkOpacity.setValue(0);
      takenBg.setValue(0);
    }
  }, [medication.taken]);

  const handlePress = () => {
    if (medication.taken) return;
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 60, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, speed: 50, bounciness: 6, useNativeDriver: true }),
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

  const cardBg = takenBg.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', '#F8FAF8'],
  });

  return (
    <Animated.View style={[styles.cardOuter, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => {
          if (!medication.taken) {
            Animated.spring(scaleAnim, { toValue: 0.97, speed: 50, bounciness: 4, useNativeDriver: true }).start();
          }
        }}
        onPressOut={() => {
          Animated.spring(scaleAnim, { toValue: 1, speed: 50, bounciness: 4, useNativeDriver: true }).start();
        }}
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={500}
        style={{ flex: 1 }}
      >
        <Animated.View style={[styles.card, { backgroundColor: cardBg }]}>
          {/* Icon bubble */}
          <View
            style={[
              styles.iconWrap,
              {
                backgroundColor: medication.taken ? '#EEF5EE' : accent.bg,
              },
            ]}
          >
            <MedIcon size={22} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text
              style={[styles.name, medication.taken && styles.nameDone]}
              numberOfLines={1}
            >
              {medication.name}
            </Text>

            <View style={styles.meta}>
              <Text
                style={[styles.dosage, medication.taken && styles.metaDone]}
                numberOfLines={1}
              >
                {medication.dosage}
              </Text>
              <View style={styles.dot} />
              <Clock
                size={11}
                color={medication.taken ? '#C7C7CC' : '#AAAAAA'}
                strokeWidth={2}
              />
              <Text style={[styles.time, medication.taken && styles.metaDone]}>
                {medication.scheduledTime}
              </Text>
            </View>
          </View>

          {/* Action — check button */}
          <View style={styles.actionArea}>
            {medication.taken ? (
              <Animated.View
                style={[
                  styles.checkBtn,
                  styles.checkBtnDone,
                  {
                    opacity: checkOpacity,
                    transform: [{ scale: checkScale }],
                  },
                ]}
              >
                <Check size={16} color="#FFFFFF" strokeWidth={3} />
              </Animated.View>
            ) : (
              <View style={[styles.checkBtn, { borderColor: accent.tint }]}>
                <View style={[styles.checkInner, { backgroundColor: accent.tint + '12' }]} />
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    marginBottom: 8,
    borderRadius: 16,
    // Apple-style subtle shadow
    shadowColor: '#8B7355',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    minHeight: 68,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  nameDone: {
    color: '#AEAEB2',
    textDecorationLine: 'line-through',
    textDecorationColor: '#D1D1D6',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dosage: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: -0.1,
  },
  dot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: '#D1D1D6',
    marginHorizontal: 4,
  },
  time: {
    fontSize: 13,
    fontWeight: '400',
    color: '#8E8E93',
    letterSpacing: -0.1,
    marginLeft: 2,
  },
  metaDone: {
    color: '#C7C7CC',
  },
  actionArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  checkInner: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
  },
  checkBtnDone: {
    backgroundColor: '#4CAF78',
    borderColor: '#4CAF78',
  },
});
