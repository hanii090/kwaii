import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { format, addMonths, subMonths } from 'date-fns';
import { Colors, Spacing, BorderRadius, Shadows } from '../src/constants/theme';
import { CheckIcon } from '../src/components/icons/KawaiiIcons';
import { useMedicationStore } from '../src/stores/medicationStore';
import CalendarGrid, { type DayStatus } from '../src/components/CalendarGrid';

export default function CalendarScreen() {
  const { medications, history } = useMedicationStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Build day statuses from persisted history + today's live data
  const dayStatuses = useMemo<DayStatus[]>(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const statuses: DayStatus[] = [];

    // Add all history entries
    for (const h of history) {
      if (h.date !== today) {
        statuses.push({ date: h.date, total: h.total, taken: h.taken });
      }
    }

    // Add today's live data
    const total = medications.length;
    const taken = medications.filter((m) => m.taken).length;
    if (total > 0) {
      statuses.push({ date: today, total, taken });
    }

    return statuses;
  }, [medications, history]);

  const selectedDayKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const selectedStatus = dayStatuses.find((d) => d.date === selectedDayKey);

  // Stats
  const perfectDays = dayStatuses.filter((d) => d.total > 0 && d.taken === d.total).length;
  const totalDaysWithMeds = dayStatuses.filter((d) => d.total > 0).length;
  const adherenceRate = totalDaysWithMeds > 0
    ? Math.round((dayStatuses.filter((d) => d.taken === d.total).length / totalDaysWithMeds) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <X size={22} color={Colors.secondary} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar</Text>
        <View style={styles.closeBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{perfectDays}</Text>
            <Text style={styles.statLabel}>Perfect Days</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{adherenceRate}%</Text>
            <Text style={styles.statLabel}>Adherence</Text>
          </View>
        </View>

        {/* Month Navigator */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>{format(currentMonth, 'MMMM yyyy')}</Text>
          <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <View style={styles.calendarCard}>
          <CalendarGrid
            currentMonth={currentMonth}
            dayStatuses={dayStatuses}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#6BBF6B' }]} />
            <Text style={styles.legendText}>All taken</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.warm }]} />
            <Text style={styles.legendText}>Partial</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F28B82' }]} />
            <Text style={styles.legendText}>Missed</Text>
          </View>
        </View>

        {/* Selected Day Detail */}
        {selectedDate && (
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>
              {format(selectedDate, 'EEEE, MMM d')}
            </Text>
            {selectedStatus ? (
              <View>
                <Text style={styles.detailSummary}>
                  {selectedStatus.taken}/{selectedStatus.total} medications taken
                </Text>
                {(() => {
                  const today = format(new Date(), 'yyyy-MM-dd');
                  if (selectedDayKey === today) {
                    return medications.map((med) => (
                      <View key={med.id} style={styles.detailMedRow}>
                        <Text style={styles.detailMedIcon}>{med.icon || '💊'}</Text>
                        <Text style={styles.detailMedName}>{med.name}</Text>
                        <View style={styles.detailMedStatus}>
                          {med.taken ? <CheckIcon size={18} color="#4CAF50" /> : <View style={styles.uncheckedBox} />}
                        </View>
                      </View>
                    ));
                  }
                  const historyEntry = history.find((h) => h.date === selectedDayKey);
                  if (historyEntry) {
                    return historyEntry.medications.map((med) => (
                      <View key={med.id} style={styles.detailMedRow}>
                        <Text style={styles.detailMedIcon}>{med.icon || '💊'}</Text>
                        <Text style={styles.detailMedName}>{med.name}</Text>
                        <View style={styles.detailMedStatus}>
                          {med.taken ? <CheckIcon size={18} color="#4CAF50" /> : <View style={styles.uncheckedBox} />}
                        </View>
                      </View>
                    ));
                  }
                  return null;
                })()}
              </View>
            ) : (
              <Text style={styles.detailEmpty}>No medications scheduled.</Text>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.small,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.lightText,
    marginTop: 2,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  calendarCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.lightText,
  },
  detailCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.small,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  detailSummary: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.secondary,
    marginBottom: Spacing.sm,
  },
  detailMedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: Spacing.sm,
  },
  detailMedIcon: {
    fontSize: 18,
  },
  detailMedName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  detailMedStatus: {
    width: 24,
    alignItems: 'center' as const,
  },
  uncheckedBox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  detailEmpty: {
    fontSize: 14,
    color: Colors.lightText,
  },
});
