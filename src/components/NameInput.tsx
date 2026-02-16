import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { useCatStore } from '../stores/catStore';
import CatIllustration from './CatIllustration';

interface NameInputProps {
  onComplete: () => void;
}

export default function NameInput({ onComplete }: NameInputProps) {
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { setUserName, completeOnboarding } = useCatStore();

  const handleGetStarted = async () => {
    if (name.trim().length === 0) return;
    setUserName(name.trim());
    await completeOnboarding();
    onComplete();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Floating decorations */}
      <Text style={[styles.floatingDecor, { top: '8%', left: '10%' }]}>🐾</Text>
      <Text style={[styles.floatingDecor, { top: '12%', right: '12%' }]}>✨</Text>
      <Text style={[styles.floatingDecor, { top: '6%', right: '30%' }]}>💛</Text>
      <Text style={[styles.floatingDecor, { bottom: '18%', left: '8%' }]}>🌟</Text>
      <Text style={[styles.floatingDecor, { bottom: '22%', right: '10%' }]}>�</Text>

      <View style={styles.content}>
        {/* Cat illustration */}
        <View style={styles.catContainer}>
          <CatIllustration breed="basic" size={120} state="excited" showBackground={false} />
        </View>

        {/* Speech bubble */}
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>Hi there! What should I call you?</Text>
          <View style={styles.speechTail} />
        </View>

        <Text style={styles.title}>What's your name?</Text>
        <Text style={styles.subtitle}>
          Your kawaii companion is excited to meet you!
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              isFocused && styles.inputFocused,
            ]}
            placeholder="Enter your name..."
            placeholderTextColor={Colors.inactive}
            value={name}
            onChangeText={setName}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleGetStarted}
            maxLength={20}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            name.trim().length === 0 && styles.buttonDisabled,
          ]}
          onPress={handleGetStarted}
          disabled={name.trim().length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Let's Go! ✨</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  floatingDecor: {
    position: 'absolute',
    fontSize: 20,
    opacity: 0.2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  catContainer: {
    marginBottom: Spacing.md,
  },
  speechBubble: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 4,
    marginBottom: Spacing.lg,
    ...Shadows.small,
  },
  speechText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.secondary,
    textAlign: 'center',
  },
  speechTail: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    left: '45%',
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  input: {
    width: '100%',
    height: 58,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    borderWidth: 2.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    fontSize: 18,
    fontWeight: '500',
    color: Colors.primary,
    textAlign: 'center',
    ...Shadows.small,
  },
  inputFocused: {
    borderColor: Colors.warm,
    shadowColor: Colors.warm,
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.warm,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.warm,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: Colors.inactive,
    shadowOpacity: 0,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
});
