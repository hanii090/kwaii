import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ChevronRight,
  User,
  Bell,
  Cat,
  Info,
  Trash2,
} from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { Colors, Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useCatStore } from '../../src/stores/catStore';
import { useMedicationStore } from '../../src/stores/medicationStore';
import { useNotificationStore } from '../../src/stores/notificationStore';
import { NotificationService } from '../../src/services/notificationService';
import { usePremiumStore } from '../../src/stores/premiumStore';
import PaywallModal from '../../src/components/modals/PaywallModal';
import {
  MedPillIcon,
  CelebrationIcon,
  StreakFlameIcon,
  SadCatIcon,
  ChartIcon,
  MoonIcon,
  CrownIcon,
  RestoreIcon,
  ClipboardIcon,
  SunIcon,
} from '../../src/components/icons/KawaiiIcons';

export default function SettingsScreen() {
  const {
    user,
    cats,
    activeCatId,
    streak,
    totalMedsTaken,
    setUserName,
    renameCat,
    clearAllData,
  } = useCatStore();
  const activeCat = cats.find((c) => c.id === activeCatId) ?? cats[0];
  const { medications } = useMedicationStore();
  const {
    isPremium,
    isLoading: premiumLoading,
    presentPaywall,
    presentCustomerCenter,
    restore,
    isTestMode,
    showFallbackPaywall,
    setShowFallbackPaywall,
    setPremium,
  } = usePremiumStore();
  const {
    preferences: notifPrefs,
    permissionStatus,
    setPreference: setNotifPreference,
    setMasterEnabled,
  } = useNotificationStore();

  // Refresh permission status when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      NotificationService.getPermissionStatus().then((status) => {
        useNotificationStore.getState().setPermissionStatus(
          status === 'granted' ? 'granted' : 'denied'
        );
      });
    }, [])
  );

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [editingCatName, setEditingCatName] = useState(false);
  const [catNameInput, setCatNameInput] = useState(activeCat?.name ?? 'Snowball');

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
    }
    setEditingName(false);
  };

  const handleSaveCatName = () => {
    if (catNameInput.trim() && activeCat) {
      renameCat(activeCat.id, catNameInput.trim());
    }
    setEditingCatName(false);
  };

  const handlePresentPaywall = async () => {
    const success = await presentPaywall();
    if (success) {
      Alert.alert('Welcome to Premium! \u{1F451}', 'All cats are now free to claim!');
    }
  };

  const handleRestore = async () => {
    const success = await restore();
    if (success) {
      Alert.alert('Restored!', 'Your premium access has been restored.');
    } else {
      Alert.alert('Nothing to Restore', 'No previous purchases found.');
    }
  };

  const handleManageSubscription = async () => {
    await presentCustomerCenter();
  };

  const handleClearData = () => {
    Alert.alert(
      '⚠️ Clear ALL Data?',
      'This will permanently delete everything — your profile, cat, medications, and all progress. You will be taken back to onboarding.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PaywallModal
        visible={showFallbackPaywall}
        isLoading={premiumLoading}
        onPurchase={() => {
          setPremium(true);
          setShowFallbackPaywall(false);
          Alert.alert('Welcome to Premium! \u{1F451}', 'All cats are now free to claim!');
        }}
        onRestore={async () => {
          const success = await restore();
          if (success) {
            setShowFallbackPaywall(false);
            Alert.alert('Restored!', 'Your premium access has been restored.');
          } else {
            Alert.alert('Nothing to Restore', 'No previous purchases found.');
          }
        }}
        onClose={() => setShowFallbackPaywall(false)}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Settings</Text>

        {/* Premium Section */}
        <Text style={styles.sectionLabel}>PREMIUM</Text>
        {isPremium ? (
          <View style={styles.card}>
            <View style={styles.row}>
              <CrownIcon size={20} />
              <Text style={styles.rowLabel}>Kawaii Premium</Text>
              <View style={styles.premiumActiveBadge}>
                <Text style={styles.premiumActiveText}>{isTestMode ? 'Test' : 'Active'}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.row} onPress={handleManageSubscription}>
              <ClipboardIcon size={20} />
              <Text style={styles.rowLabel}>Manage Subscription</Text>
              <ChevronRight size={16} color={Colors.lightText} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <TouchableOpacity style={styles.row} onPress={handlePresentPaywall}>
              <CrownIcon size={20} />
              <Text style={styles.rowLabel}>Unlock Premium</Text>
              <ChevronRight size={16} color={Colors.lightText} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.row} onPress={handleRestore}>
              <RestoreIcon size={20} />
              <Text style={styles.rowLabel}>Restore Purchases</Text>
              <ChevronRight size={16} color={Colors.lightText} />
            </TouchableOpacity>
          </View>
        )}

        {/* Profile Section */}
        <Text style={styles.sectionLabel}>PROFILE</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <User size={18} color={Colors.warm} />
            <Text style={styles.rowLabel}>Name</Text>
            {editingName ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.editInput}
                  value={nameInput}
                  onChangeText={setNameInput}
                  autoFocus
                  onBlur={handleSaveName}
                  onSubmitEditing={handleSaveName}
                />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.rowRight}
                onPress={() => { setNameInput(user.name); setEditingName(true); }}
              >
                <Text style={styles.rowValue}>{user.name || 'Not set'}</Text>
                <ChevronRight size={16} color={Colors.lightText} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <ChartIcon size={20} />
            <Text style={styles.rowLabel}>Lifetime Meds Taken</Text>
            <Text style={styles.rowValue}>{totalMedsTaken}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <StreakFlameIcon size={20} />
            <Text style={styles.rowLabel}>Best Streak</Text>
            <Text style={styles.rowValue}>{streak} days</Text>
          </View>
        </View>

        {/* Notifications Section */}
        <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
        {permissionStatus === 'denied' && (
          <TouchableOpacity
            style={styles.permissionBanner}
            onPress={() => Linking.openSettings()}
            activeOpacity={0.7}
          >
            <Text style={styles.permissionBannerText}>
              Notifications are disabled. Tap to open Settings.
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.card}>
          <View style={styles.row}>
            <Bell size={18} color={Colors.accent} />
            <Text style={styles.rowLabel}>All Notifications</Text>
            <Switch
              value={notifPrefs.masterEnabled}
              onValueChange={setMasterEnabled}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.white}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <MedPillIcon size={20} />
            <Text style={styles.rowLabel}>Medication Reminders</Text>
            <Switch
              value={notifPrefs.medicationReminders}
              onValueChange={(v) => setNotifPreference('medicationReminders', v)}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.white}
              disabled={!notifPrefs.masterEnabled}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <CelebrationIcon size={20} />
            <Text style={styles.rowLabel}>Celebrations</Text>
            <Switch
              value={notifPrefs.celebrations}
              onValueChange={(v) => setNotifPreference('celebrations', v)}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.white}
              disabled={!notifPrefs.masterEnabled}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <StreakFlameIcon size={20} />
            <Text style={styles.rowLabel}>Streak Milestones</Text>
            <Switch
              value={notifPrefs.streakMilestones}
              onValueChange={(v) => setNotifPreference('streakMilestones', v)}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.white}
              disabled={!notifPrefs.masterEnabled}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <SadCatIcon size={20} />
            <Text style={styles.rowLabel}>Encouragement</Text>
            <Switch
              value={notifPrefs.encouragement}
              onValueChange={(v) => setNotifPreference('encouragement', v)}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.white}
              disabled={!notifPrefs.masterEnabled}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <ChartIcon size={20} />
            <Text style={styles.rowLabel}>Daily Summary</Text>
            <Switch
              value={notifPrefs.dailySummary}
              onValueChange={(v) => setNotifPreference('dailySummary', v)}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.white}
              disabled={!notifPrefs.masterEnabled}
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <MoonIcon size={20} />
            <Text style={styles.rowLabel}>Quiet Hours</Text>
            <Switch
              value={notifPrefs.quietHoursEnabled}
              onValueChange={(v) => setNotifPreference('quietHoursEnabled', v)}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={Colors.white}
            />
          </View>
          {notifPrefs.quietHoursEnabled && (
            <>
              <View style={styles.divider} />
              <View style={styles.row}>
                <View style={styles.rowIconWrap}><SunIcon size={18} /></View>
                <Text style={styles.rowLabel}>Quiet Hours</Text>
                <Text style={styles.rowValue}>
                  {notifPrefs.quietHoursStart}:00 - {notifPrefs.quietHoursEnd}:00
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Cat Section */}
        <Text style={styles.sectionLabel}>YOUR CAT</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Cat size={18} color={Colors.warm} />
            <Text style={styles.rowLabel}>Cat Name</Text>
            {editingCatName ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.editInput}
                  value={catNameInput}
                  onChangeText={setCatNameInput}
                  autoFocus
                  onBlur={handleSaveCatName}
                  onSubmitEditing={handleSaveCatName}
                />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.rowRight}
                onPress={() => { setCatNameInput(activeCat?.name ?? ''); setEditingCatName(true); }}
              >
                <Text style={styles.rowValue}>{activeCat?.name ?? 'Snowball'}</Text>
                <ChevronRight size={16} color={Colors.lightText} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* App Section */}
        <Text style={styles.sectionLabel}>APP</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Info size={18} color={Colors.primary} />
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
        </View>

        {/* Data Section */}
        <Text style={styles.sectionLabel}>DATA</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={handleClearData}>
            <Trash2 size={18} color="#D44" />
            <Text style={[styles.rowLabel, { color: '#D44' }]}>Clear All Data</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Made with 💛 by Kawaii Meds</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.lightText,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.small,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: Spacing.sm,
  },
  rowIconWrap: {
    width: 22,
    alignItems: 'center' as const,
  },
  rowIcon: {
    fontSize: 18,
    width: 22,
    textAlign: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.lightText,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginLeft: Spacing.md + 22 + Spacing.sm,
  },
  editRow: {
    flex: 0,
  },
  editInput: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.warm,
    paddingVertical: 2,
    minWidth: 100,
    textAlign: 'right',
  },
  permissionBanner: {
    backgroundColor: '#FFF3CD',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    marginBottom: Spacing.sm,
  },
  permissionBannerText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#856404',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.lightText,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  premiumActiveBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  premiumActiveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#388E3C',
  },
});
