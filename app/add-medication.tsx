import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, Clock } from 'lucide-react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Colors, Spacing, BorderRadius, Shadows } from '../src/constants/theme';
import { useMedicationStore } from '../src/stores/medicationStore';

const DAYS = [
  { key: 'M', label: 'M' },
  { key: 'Tu', label: 'Tu' },
  { key: 'W', label: 'W' },
  { key: 'Th', label: 'Th' },
  { key: 'F', label: 'F' },
  { key: 'Sa', label: 'Sa' },
  { key: 'Su', label: 'Su' },
];

const ICONS = ['💊', '💉', '🩹', '☀️', '🌙', '🐟', '🧠', '❤️', '🌿', '💧'];

export default function AddMedicationScreen() {
  const { addMedication } = useMedicationStore();

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('💊');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [reminderTimes, setReminderTimes] = useState<Date[]>([
    (() => { const d = new Date(); d.setHours(9, 30, 0, 0); return d; })(),
  ]);
  const [editingTimeIndex, setEditingTimeIndex] = useState<number | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const formatTime12 = (date: Date) => {
    let h = date.getHours();
    const m = date.getMinutes();
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const formatTime24 = (date: Date) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const handleTimeChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate && editingTimeIndex !== null) {
      setReminderTimes((prev) =>
        prev.map((t, i) => (i === editingTimeIndex ? selectedDate : t))
      );
    }
  };

  const openTimePicker = (index: number) => {
    setEditingTimeIndex(index);
    setShowPicker(true);
  };

  const closeTimePicker = () => {
    setShowPicker(false);
    setEditingTimeIndex(null);
  };

  const addTime = () => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    setReminderTimes((prev) => [...prev, d]);
  };

  const removeTime = (index: number) => {
    if (reminderTimes.length <= 1) return;
    setReminderTimes((prev) => prev.filter((_, i) => i !== index));
  };

  const getFrequency = () => {
    if (selectedDays.length === 7) return 'Daily';
    if (selectedDays.length === 0) return 'As needed';
    return selectedDays.join(', ');
  };

  const canSubmit = name.trim().length >= 1;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const times = reminderTimes.map(formatTime24);
    const scheduledTime = reminderTimes.map(formatTime12).join(', ');

    addMedication({
      name: name.trim(),
      dosage: dosage.trim() || 'As directed',
      frequency: getFrequency(),
      times,
      scheduledTime,
      icon: selectedIcon,
      color: '#FFF3D6',
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.pillIcon}>
              <Text style={{ fontSize: 20 }}>💊</Text>
            </View>
            <Text style={styles.headerTitle}>Add Medication</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <X size={20} color={Colors.secondary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Medication Details */}
          <Text style={styles.sectionLabel}>MEDICATION DETAILS</Text>

          <Text style={styles.fieldLabel}>
            Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Aspirin, Vitamin D"
            placeholderTextColor={Colors.inactive}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.fieldLabel}>Dosage (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 100mg, 1 tablet"
            placeholderTextColor={Colors.inactive}
            value={dosage}
            onChangeText={setDosage}
          />

          {/* Icon Selector */}
          <Text style={styles.fieldLabel}>Icon</Text>
          <View style={styles.iconRow}>
            {ICONS.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconOption,
                  selectedIcon === icon && styles.iconOptionSelected,
                ]}
                onPress={() => setSelectedIcon(icon)}
                activeOpacity={0.7}
              >
                <Text style={styles.iconText}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Days */}
          <View style={styles.divider} />
          <Text style={styles.sectionLabel}>DAYS</Text>
          <View style={styles.daysRow}>
            {DAYS.map((day) => (
              <TouchableOpacity
                key={day.key}
                style={[
                  styles.dayCircle,
                  selectedDays.includes(day.key) && styles.dayCircleSelected,
                ]}
                onPress={() => toggleDay(day.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayText,
                    selectedDays.includes(day.key) && styles.dayTextSelected,
                  ]}
                >
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.hint}>Select which days you take this medication.</Text>

          {/* Reminder Times */}
          <View style={styles.divider} />
          <View style={styles.reminderHeader}>
            <Clock size={16} color={Colors.secondary} strokeWidth={2} />
            <Text style={styles.reminderLabel}>REMINDER TIMES</Text>
          </View>

          {reminderTimes.map((time, index) => (
            <View key={index} style={styles.timeRow}>
              <TouchableOpacity
                style={styles.timeDisplay}
                onPress={() => openTimePicker(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.timeText}>{formatTime12(time)}</Text>
              </TouchableOpacity>

              {reminderTimes.length > 1 && (
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeTime(index)}
                >
                  <X size={16} color={Colors.lightText} strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* Native time picker */}
          {showPicker && editingTimeIndex !== null && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={reminderTimes[editingTimeIndex]}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
                themeVariant="light"
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity style={styles.pickerDoneBtn} onPress={closeTimePicker}>
                  <Text style={styles.pickerDoneText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.addTimeBtn} onPress={addTime} activeOpacity={0.7}>
            <Text style={styles.addTimeText}>+ Add Time</Text>
          </TouchableOpacity>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.addButton, !canSubmit && styles.addButtonDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={!canSubmit}
          >
            <Text style={styles.addButtonText}>Add Medication</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  pillIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDEBD0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 6,
  },
  required: {
    color: Colors.warm,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 15,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOptionSelected: {
    borderColor: Colors.warm,
    backgroundColor: '#FFF3D6',
  },
  iconText: {
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  dayCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: Colors.warm,
    borderColor: Colors.warm,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondary,
  },
  dayTextSelected: {
    color: Colors.white,
  },
  hint: {
    fontSize: 12,
    color: Colors.lightText,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  reminderLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
    letterSpacing: 0.8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  timeDisplay: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.small,
  },
  pickerDoneBtn: {
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  pickerDoneText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.warm,
  },
  addTimeBtn: {
    borderWidth: 1.5,
    borderColor: Colors.warm,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  addTimeText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.warm,
  },
  bottomBar: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 8 : Spacing.md,
    paddingTop: Spacing.md,
    backgroundColor: Colors.background,
  },
  addButton: {
    backgroundColor: Colors.warm,
    borderRadius: BorderRadius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.45,
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
  },
});
