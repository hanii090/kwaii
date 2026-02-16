import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Clock } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';

const DAYS = [
  { key: 'M', label: 'M' },
  { key: 'Tu', label: 'Tu' },
  { key: 'W', label: 'W' },
  { key: 'Th', label: 'Th' },
  { key: 'F', label: 'F' },
  { key: 'Sa', label: 'Sa' },
  { key: 'Su', label: 'Su' },
];

const ICONS = ['💊', '☀️', '🌙', '💉', '🩹', '🧴', '🫁', '🐟', '🧠', '❤️'];

interface ReminderTime {
  hour: string;
  minute: string;
  period: 'AM' | 'PM';
}

interface AddMedicationModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (medication: {
    name: string;
    dosage: string;
    frequency: string;
    times: string[];
    scheduledTime: string;
    icon: string;
    color: string;
  }) => void;
}

export default function AddMedicationModal({
  visible,
  onClose,
  onAdd,
}: AddMedicationModalProps) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su']);
  const [reminderTimes, setReminderTimes] = useState<ReminderTime[]>([
    { hour: '9', minute: '30', period: 'AM' },
  ]);
  const [selectedIcon, setSelectedIcon] = useState('💊');

  const resetForm = () => {
    setName('');
    setDosage('');
    setSelectedDays(['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su']);
    setReminderTimes([{ hour: '9', minute: '30', period: 'AM' }]);
    setSelectedIcon('💊');
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const updateTime = (index: number, field: keyof ReminderTime, value: string) => {
    setReminderTimes((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    );
  };

  const addTime = () => {
    setReminderTimes((prev) => [...prev, { hour: '12', minute: '00', period: 'PM' }]);
  };

  const removeTime = (index: number) => {
    if (reminderTimes.length <= 1) return;
    setReminderTimes((prev) => prev.filter((_, i) => i !== index));
  };

  const formatTime = (t: ReminderTime) => {
    const h = t.hour.padStart(2, '0');
    const m = t.minute.padStart(2, '0');
    return `${h}:${m} ${t.period}`;
  };

  const to24Hour = (t: ReminderTime) => {
    let h = parseInt(t.hour, 10);
    if (t.period === 'PM' && h !== 12) h += 12;
    if (t.period === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${t.minute.padStart(2, '0')}`;
  };

  const getFrequency = () => {
    if (selectedDays.length === 7) return 'Daily';
    if (selectedDays.length === 0) return 'None';
    return selectedDays.join(', ');
  };

  const handleAdd = () => {
    if (!name.trim()) return;

    const times = reminderTimes.map(to24Hour);
    const scheduledTime = reminderTimes.map(formatTime).join(', ');

    onAdd({
      name: name.trim(),
      dosage: dosage.trim() || 'As directed',
      frequency: getFrequency(),
      times,
      scheduledTime,
      icon: selectedIcon,
      color: '#FFF3D6',
    });

    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.pillIcon}>
              <Text style={styles.pillEmoji}>💊</Text>
            </View>
            <Text style={styles.headerTitle}>Add Medication</Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <X size={20} color={Colors.secondary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Medication Details Section */}
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

          {/* Icon Picker */}
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

          {/* Days Section */}
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
          <Text style={styles.daysHint}>Select which days you take this medication.</Text>

          {/* Reminder Times Section */}
          <View style={styles.divider} />
          <View style={styles.reminderHeader}>
            <Clock size={16} color={Colors.secondary} strokeWidth={2} />
            <Text style={styles.reminderLabel}>REMINDER TIMES</Text>
          </View>

          {reminderTimes.map((time, index) => (
            <View key={index} style={styles.timeRow}>
              <View style={styles.timeInputGroup}>
                <TextInput
                  style={styles.timeInput}
                  value={time.hour}
                  onChangeText={(v) => {
                    const num = v.replace(/[^0-9]/g, '');
                    if (num === '' || (parseInt(num, 10) >= 0 && parseInt(num, 10) <= 12)) {
                      updateTime(index, 'hour', num);
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={2}
                  textAlign="center"
                />
                <Text style={styles.timeSeparator}>:</Text>
                <TextInput
                  style={styles.timeInput}
                  value={time.minute}
                  onChangeText={(v) => {
                    const num = v.replace(/[^0-9]/g, '');
                    if (num === '' || (parseInt(num, 10) >= 0 && parseInt(num, 10) <= 59)) {
                      updateTime(index, 'minute', num);
                    }
                  }}
                  keyboardType="number-pad"
                  maxLength={2}
                  textAlign="center"
                />
              </View>

              <View style={styles.periodToggle}>
                <TouchableOpacity
                  style={[
                    styles.periodButton,
                    time.period === 'AM' && styles.periodButtonActive,
                  ]}
                  onPress={() => updateTime(index, 'period', 'AM')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.periodText,
                      time.period === 'AM' && styles.periodTextActive,
                    ]}
                  >
                    AM
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.periodButton,
                    time.period === 'PM' && styles.periodButtonActive,
                  ]}
                  onPress={() => updateTime(index, 'period', 'PM')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.periodText,
                      time.period === 'PM' && styles.periodTextActive,
                    ]}
                  >
                    PM
                  </Text>
                </TouchableOpacity>
              </View>

              {reminderTimes.length > 1 && (
                <TouchableOpacity
                  style={styles.removeTimeBtn}
                  onPress={() => removeTime(index)}
                  activeOpacity={0.7}
                >
                  <X size={16} color={Colors.lightText} strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity
            style={styles.addTimeButton}
            onPress={addTime}
            activeOpacity={0.7}
          >
            <Text style={styles.addTimeText}>+ Add Time</Text>
          </TouchableOpacity>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Bottom Add Button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.addButton, !name.trim() && styles.addButtonDisabled]}
            onPress={handleAdd}
            activeOpacity={0.85}
            disabled={!name.trim()}
          >
            <Text style={styles.addButtonText}>Add Medication</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
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
  pillEmoji: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  closeButton: {
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
    marginBottom: Spacing.xs + 2,
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
  daysHint: {
    fontSize: 12,
    color: Colors.lightText,
    marginBottom: Spacing.sm,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
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
  timeInputGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
  },
  timeInput: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    width: 40,
    textAlign: 'center',
    padding: 0,
  },
  timeSeparator: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 2,
  },
  periodToggle: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  periodButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    backgroundColor: Colors.white,
  },
  periodButtonActive: {
    backgroundColor: Colors.warm,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
  },
  periodTextActive: {
    color: Colors.white,
  },
  removeTimeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTimeButton: {
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
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.background,
    ...Shadows.medium,
  },
  addButton: {
    backgroundColor: Colors.warm,
    borderRadius: BorderRadius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.white,
  },
});
