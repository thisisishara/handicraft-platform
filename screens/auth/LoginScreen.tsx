import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { GoogleIcon } from '../../components/ui/GoogleIcon';
import { Input } from '../../components/ui/Input';
import { Colors, Spacing, Typography } from '../../constants/Design';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { user, login, loginWithGoogle } = useAuth();
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Handle navigation after successful login
  useEffect(() => {
    if (user) {
      if (user.currentMode === 'seller') {
        router.replace(user.hasCompletedOnboarding ? '/seller/home' : '/seller/onboarding');
      } else {
        router.replace('/buyer/home');
      }
    }
  }, [user]);

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert(t('common.error'), t('auth.login.errorFillFields'));
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      // Navigation will be handled after auth state updates
    } catch (error) {
      Alert.alert(t('common.error'), t('auth.login.errorInvalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      // Navigation will be handled after auth state updates
    } catch (error) {
      Alert.alert('Error', 'Google login failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('auth.login.title')}</Text>
        <Text style={styles.subtitle}>{t('auth.login.subtitle')}</Text>
      </View>

      <View style={styles.form}>
        <Input
          label={t('email')}
          value={formData.email}
          onChangeText={(email) => setFormData({ ...formData, email })}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={t('auth.login.emailPlaceholder')}
        />

        <Input
          label={t('password')}
          value={formData.password}
          onChangeText={(password) => setFormData({ ...formData, password })}
          secureTextEntry
          placeholder={t('auth.login.passwordPlaceholder')}
        />

        <Button
          title={t('auth.login.loginButton')}
          onPress={handleLogin}
          loading={loading}
          style={styles.loginButton}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t('or')}</Text>
          <View style={styles.dividerLine} />
        </View>

        <Button
          title={t('auth.login.continueWithGoogle')}
          variant="outline"
          onPress={handleGoogleLogin}
          loading={googleLoading}
          leftIcon={<GoogleIcon />}
          style={styles.googleButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {t('auth.login.noAccount')}{' '}
          <Link href="/auth/register" style={styles.link}>
            {t('auth.login.signUpLink')}
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.huge,
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
    fontWeight: Typography.fontWeight.normal,
  },
  form: {
    marginBottom: Spacing.huge,
  },
  loginButton: {
    marginTop: Spacing.xl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xxl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border.primary,
  },
  dividerText: {
    marginHorizontal: Spacing.lg,
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  googleButton: {
    borderColor: Colors.border.primary,
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
