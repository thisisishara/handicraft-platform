import { Picker } from '@react-native-picker/picker';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterScreen() {
  const { t, i18n } = useTranslation();
  const { user, register } = useAuth();
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    language: 'en' as 'en' | 'si',
    defaultMode: 'buyer' as 'buyer' | 'seller',
  });
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const { sendOTP, verifyOTP } = useAuth();
  
  // Handle navigation after successful registration
  useEffect(() => {
    if (user) {
      if (user.defaultMode === 'seller') {
        router.replace('/seller/onboarding');
      } else {
        router.replace('/buyer/home');
      }
    }
  }, [user]);

  const handleRegister = async () => {
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.mobileNumber || !formData.password) {
      Alert.alert(t('common.error'), t('auth.register.errorFillFields'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert(t('common.error'), t('auth.register.errorPasswordMismatch'));
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert(t('common.error'), t('auth.register.errorPasswordLength'));
      return;
    }

    setLoading(true);
    try {
      // Send OTP first
      await sendOTP(formData.mobileNumber);
      setShowOTP(true);
      Alert.alert('Success', t('otpSent'));
    } catch (error) {
      Alert.alert(t('common.error'), t('auth.register.errorOtpFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (!otp || otp.length !== 4) {
      Alert.alert(t('common.error'), t('auth.otp.errorInvalidOtp'));
      return;
    }

    setOtpLoading(true);
    try {
      const isValidOTP = await verifyOTP(formData.mobileNumber, otp);
      if (isValidOTP) {
        // Complete registration
        await register(formData);
        // Change app language if selected
        if (formData.language !== i18n.language) {
          i18n.changeLanguage(formData.language);
        }
        // Navigation will be handled after auth state updates
      } else {
        Alert.alert(t('common.error'), t('auth.otp.errorInvalidOtp'));
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('auth.register.registrationError'));
    } finally {
      setOtpLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      await sendOTP(formData.mobileNumber);
      Alert.alert('Success', t('otpSent'));
    } catch (error) {
      Alert.alert(t('common.error'), t('auth.register.errorOtpFailed'));
    }
  };

  if (showOTP) {
    return (
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 20 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('verifyOTP')}</Text>
          <Text style={styles.subtitle}>{t('otpSent')}</Text>
          <Text style={styles.mobileNumber}>{formData.mobileNumber}</Text>
        </View>

        <View style={styles.form}>
          <Input
            label={t('enterOTP')}
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={4}
            placeholder="1234"
            style={styles.otpInput}
          />

          <Button
            title={t('verifyOTP')}
            onPress={handleOTPVerification}
            loading={otpLoading}
            style={styles.verifyButton}
          />

          <Button
            title={t('resendOTP')}
            variant="outline"
            onPress={resendOTP}
            style={styles.resendButton}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('auth.register.title')}</Text>
        <Text style={styles.subtitle}>{t('auth.register.subtitle')}</Text>
      </View>

      <View style={styles.form}>
        <Input
          label={t('firstName')}
          value={formData.firstName}
          onChangeText={(firstName) => setFormData({ ...formData, firstName })}
          placeholder={t('auth.register.firstNamePlaceholder')}
        />
        
        <Input
          label={t('lastName')}
          value={formData.lastName}
          onChangeText={(lastName) => setFormData({ ...formData, lastName })}
          placeholder={t('auth.register.lastNamePlaceholder')}
        />

        <Input
          label={t('email')}
          value={formData.email}
          onChangeText={(email) => setFormData({ ...formData, email })}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={t('auth.register.emailPlaceholder')}
        />

        <Input
          label={t('mobileNumber')}
          value={formData.mobileNumber}
          onChangeText={(mobileNumber) => setFormData({ ...formData, mobileNumber })}
          keyboardType="phone-pad"
          placeholder={t('auth.register.mobilePlaceholder')}
        />

        <Input
          label={t('password')}
          value={formData.password}
          onChangeText={(password) => setFormData({ ...formData, password })}
          secureTextEntry
          placeholder={t('auth.register.passwordPlaceholder')}
        />

        <Input
          label={t('auth.register.confirmPassword')}
          value={formData.confirmPassword}
          onChangeText={(confirmPassword) => setFormData({ ...formData, confirmPassword })}
          secureTextEntry
          placeholder={t('auth.register.confirmPasswordPlaceholder')}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>{t('auth.register.selectLanguage')}</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={formData.language}
              onValueChange={(language) => setFormData({ ...formData, language })}
            >
              <Picker.Item label={t('auth.register.english')} value="en" />
              <Picker.Item label={t('auth.register.sinhala')} value="si" />
            </Picker>
          </View>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>{t('auth.register.selectMode')}</Text>
          <Text style={styles.subtitle}>{t('auth.register.modeDescription')}</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={formData.defaultMode}
              onValueChange={(defaultMode) => setFormData({ ...formData, defaultMode })}
            >
              <Picker.Item label={t('buyer')} value="buyer" />
              <Picker.Item label={t('seller')} value="seller" />
            </Picker>
          </View>
        </View>

        <Button
          title={t('auth.register.registerButton')}
          onPress={handleRegister}
          loading={loading}
          style={styles.registerButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {t('auth.register.haveAccount')}{' '}
          <Link href="/auth/login" style={styles.link}>
            {t('auth.register.signInLink')}
          </Link>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.xl,
    backgroundColor: Colors.background.primary,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
    marginTop: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontWeight: Typography.fontWeight.normal,
  },
  mobileNumber: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  form: {
    marginBottom: Spacing.xxxl,
  },
  pickerContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  picker: {
    borderWidth: 1,
    borderColor: Colors.border.primary,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background.primary,
  },
  registerButton: {
    marginTop: Spacing.lg,
  },
  otpInput: {
    textAlign: 'center',
    fontSize: Typography.fontSize.xxl,
    letterSpacing: 8,
  },
  verifyButton: {
    marginTop: Spacing.lg,
  },
  resendButton: {
    marginTop: Spacing.md,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  link: {
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
    textDecorationLine: 'underline',
  },
});
