import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { Colors, Spacing, BorderRadius } from '../constants/theme';

export interface DayStatus {
  date: string;
  total: number;
  taken: number;
}

interface CalendarGridProps {
  currentMonth: Date;
  dayStatuses: DayStatus[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CalendarGrid({
  currentMonth,
  dayStatuses,
  selectedDate,
  onSelectDate,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getStatus = (date: Date) => {
    const key = format(date, 'yyyy-MM-dd');
    return dayStatuses.find((d) => d.date === key);
  };

  const getDot = (date: Date) => {
    const status = getStatus(date);
    if (!status || status.total === 0) return null;
    if (status.taken === status.total) return '#6BBF6B'; // green
    if (status.taken > 0) return Colors.warm; // orange
    return '#F28B82'; // red - missed
  };

  return (
    <View>
      {/* Weekday header */}
      <View style={styles.weekRow}>
        {WEEKDAY_LABELS.map((label) => (
          <View key={label} style={styles.weekCell}>
            <Text style={styles.weekLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Days grid */}
      <View style={styles.grid}>
        {days.map((day, idx) => {
          const inMonth = isSameMonth(day, currentMonth);
          const selected = selectedDate && isSameDay(day, selectedDate);
          const today = isToday(day);
          const dotColor = inMonth ? getDot(day) : null;

          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.dayCell,
                selected && styles.dayCellSelected,
                today && !selected && styles.dayCellToday,
              ]}
              onPress={() => inMonth && onSelectDate(day)}
              activeOpacity={inMonth ? 0.6 : 1}
            >
              <Text
                style={[
                  styles.dayText,
                  !inMonth && styles.dayTextOutside,
                  selected && styles.dayTextSelected,
                ]}
              >
                {format(day, 'd')}
              </Text>
              {dotColor && (
                <View style={[styles.dot, { backgroundColor: dotColor }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  weekLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.lightText,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
  },
  dayCellSelected: {
    backgroundColor: Colors.warm,
    borderRadius: 20,
  },
  dayCellToday: {
    backgroundColor: Colors.card,
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  dayTextOutside: {
    color: Colors.border,
  },
  dayTextSelected: {
    color: Colors.white,
    fontWeight: '700',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
});
