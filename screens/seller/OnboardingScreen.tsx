import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export default function SellerOnboardingScreen() {
  const { t } = useTranslation();
  const { completeOnboarding } = useAuth();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      icon: 'store',
      title: t('seller.onboarding.welcome.title'),
      description: t('seller.onboarding.welcome.description'),
      color: '#3B82F6',
    },
    {
      icon: 'camera-plus',
      title: t('seller.onboarding.addProducts.title'),
      description: t('seller.onboarding.addProducts.description'),
      color: '#10B981',
    },
    {
      icon: 'chart-line',
      title: t('seller.onboarding.trackSuccess.title'),
      description: t('seller.onboarding.trackSuccess.description'),
      color: '#F59E0B',
    },
    {
      icon: 'account-group',
      title: t('seller.onboarding.connect.title'),
      description: t('seller.onboarding.connect.description'),
      color: '#EF4444',
    },
  ];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = async () => {
    try {
      // Mark onboarding as completed for this user
      await completeOnboarding();
      router.replace('/seller/home');
    } catch (error) {
      Alert.alert(t('common.error'), t('seller.onboarding.errorCompleting'));
    }
  };

  const skipOnboarding = () => {
    Alert.alert(
      t('seller.onboarding.skipOnboarding'),
      t('seller.onboarding.skipConfirmation'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('seller.onboarding.skip'), onPress: finishOnboarding },
      ]
    );
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <ScrollView 
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
    >
      {/* Progress indicators */}
      <View style={styles.progressContainer}>
        {onboardingSteps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index <= currentStep ? styles.progressDotActive : styles.progressDotInactive,
            ]}
          />
        ))}
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${currentStepData.color}15` }]}>
                  <MaterialCommunityIcons 
          name={currentStepData.icon as any} 
          size={80} 
          color={currentStepData.color} 
        />
        </View>

        <Text style={styles.title}>{currentStepData.title}</Text>
        <Text style={styles.description}>{currentStepData.description}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title={currentStep === onboardingSteps.length - 1 ? t('seller.onboarding.letsStartSelling') : t('seller.onboarding.next')}
          onPress={nextStep}
          style={styles.nextButton}
        />
        
        {currentStep < onboardingSteps.length - 1 && (
          <TouchableOpacity onPress={skipOnboarding} style={styles.skipButton}>
            <Text style={styles.skipText}>{t('seller.onboarding.skipIntroduction')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Step counter */}
      <Text style={styles.stepCounter}>
        {t('seller.onboarding.stepCounter', { current: currentStep + 1, total: onboardingSteps.length })}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    backgroundColor: '#3B82F6',
  },
  progressDotInactive: {
    backgroundColor: '#E5E7EB',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  actions: {
    paddingHorizontal: 20,
    gap: 16,
  },
  nextButton: {
    marginBottom: 8,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    color: '#6B7280',
    fontSize: 16,
  },
  stepCounter: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 20,
  },
});
