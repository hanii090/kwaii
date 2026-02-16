import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { getMedicationIcon, MEDICATION_ICON_MAP } from './icons/KawaiiIcons';

const MEDICATION_ICONS = [
  { id: 'pill', label: 'Pill' },
  { id: 'syringe', label: 'Syringe' },
  { id: 'bandage', label: 'Bandage' },
  { id: 'sun_med', label: 'Sun' },
  { id: 'moon_med', label: 'Moon' },
  { id: 'fish_oil', label: 'Fish Oil' },
  { id: 'brain', label: 'Brain' },
  { id: 'heart_med', label: 'Heart' },
  { id: 'herbal', label: 'Herbal' },
  { id: 'drops', label: 'Drops' },
];

const ICON_COLORS = [
  '#FFF3D6',
  '#D6EAF8',
  '#E8DAEF',
  '#D4E7D6',
  '#FDEBD0',
  '#F9E4E4',
  '#D6F5F5',
  '#FFF0F5',
];

function AnimatedIconOption({
  id,
  isSelected,
  onSelect,
}: {
  id: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const borderAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(borderAnim, {
      toValue: isSelected ? 1 : 0,
      damping: 12,
      stiffness: 200,
      useNativeDriver: false,
    }).start();
  }, [isSelected]);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.85, damping: 15, stiffness: 400, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, damping: 8, stiffness: 200, useNativeDriver: true }),
    ]).start();
    onSelect();
  };

  const IconComponent = getMedicationIcon(id);
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.warm],
  });
  const bgColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.white, '#FFF3D6'],
  });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Animated.View
          style={[
            styles.iconOption,
            {
              borderColor,
              backgroundColor: bgColor,
            },
          ]}
        >
          <IconComponent size={24} />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

function AnimatedColorOption({
  color,
  isSelected,
  onSelect,
}: {
  color: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.8, damping: 15, stiffness: 400, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, damping: 8, stiffness: 200, useNativeDriver: true }),
    ]).start();
    onSelect();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.colorOption,
          { backgroundColor: color, transform: [{ scale }] },
          isSelected && styles.colorSelected,
        ]}
      />
    </TouchableOpacity>
  );
}

interface IconPickerProps {
  selectedIcon: string;
  selectedColor: string;
  onSelectIcon: (icon: string) => void;
  onSelectColor: (color: string) => void;
}

export default function IconPicker({
  selectedIcon,
  selectedColor,
  onSelectIcon,
  onSelectColor,
}: IconPickerProps) {
  const previewScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(previewScale, { toValue: 1.15, damping: 8, stiffness: 300, useNativeDriver: true }),
      Animated.spring(previewScale, { toValue: 1, damping: 10, stiffness: 200, useNativeDriver: true }),
    ]).start();
  }, [selectedIcon, selectedColor]);

  const PreviewIcon = getMedicationIcon(selectedIcon);

  return (
    <View>
      <Text style={styles.label}>Icon</Text>
      <View style={styles.iconGrid}>
        {MEDICATION_ICONS.map((item) => (
          <AnimatedIconOption
            key={item.id}
            id={item.id}
            isSelected={selectedIcon === item.id}
            onSelect={() => onSelectIcon(item.id)}
          />
        ))}
      </View>

      <Text style={[styles.label, { marginTop: Spacing.lg }]}>Color</Text>
      <View style={styles.colorRow}>
        {ICON_COLORS.map((color) => (
          <AnimatedColorOption
            key={color}
            color={color}
            isSelected={selectedColor === color}
            onSelect={() => onSelectColor(color)}
          />
        ))}
      </View>

      <Animated.View
        style={[
          styles.preview,
          { backgroundColor: selectedColor, transform: [{ scale: previewScale }] },
        ]}
      >
        <PreviewIcon size={32} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: Colors.warm,
  },
  preview: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: Spacing.lg,
  },
});
