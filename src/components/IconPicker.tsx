import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

const MEDICATION_ICONS = [
  { emoji: '💊', label: 'Pill' },
  { emoji: '💉', label: 'Syringe' },
  { emoji: '🩹', label: 'Bandage' },
  { emoji: '🧴', label: 'Lotion' },
  { emoji: '☀️', label: 'Sun' },
  { emoji: '🌙', label: 'Moon' },
  { emoji: '🐟', label: 'Fish Oil' },
  { emoji: '🧠', label: 'Brain' },
  { emoji: '❤️', label: 'Heart' },
  { emoji: '🫁', label: 'Lungs' },
  { emoji: '👁️', label: 'Eye' },
  { emoji: '🦴', label: 'Bone' },
  { emoji: '🍊', label: 'Vitamin C' },
  { emoji: '🥛', label: 'Calcium' },
  { emoji: '🌿', label: 'Herbal' },
  { emoji: '💧', label: 'Drops' },
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
  return (
    <View>
      <Text style={styles.label}>Choose an Icon</Text>
      <View style={styles.iconGrid}>
        {MEDICATION_ICONS.map((item) => (
          <TouchableOpacity
            key={item.emoji}
            style={[
              styles.iconOption,
              selectedIcon === item.emoji && styles.iconSelected,
            ]}
            onPress={() => onSelectIcon(item.emoji)}
            activeOpacity={0.7}
          >
            <Text style={styles.iconEmoji}>{item.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { marginTop: Spacing.lg }]}>Choose a Color</Text>
      <View style={styles.colorRow}>
        {ICON_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === color && styles.colorSelected,
            ]}
            onPress={() => onSelectColor(color)}
            activeOpacity={0.7}
          />
        ))}
      </View>

      <View style={[styles.preview, { backgroundColor: selectedColor }]}>
        <Text style={styles.previewEmoji}>{selectedIcon}</Text>
      </View>
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
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelected: {
    borderColor: Colors.warm,
    backgroundColor: '#FFF3D6',
  },
  iconEmoji: {
    fontSize: 22,
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
  previewEmoji: {
    fontSize: 32,
  },
});
