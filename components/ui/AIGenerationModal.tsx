import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { BorderRadius, Colors, IconSizes, Spacing, Typography } from '../../constants/Design';
import { AIService, GeneratedShopData } from '../../services/aiService';
import { Button } from './Button';
import { ErrorBoundary } from './ErrorBoundary';

interface AIGenerationModalProps {
  visible: boolean;
  onClose: () => void;
  onGenerate: (data: GeneratedShopData) => void;
}

export function AIGenerationModal({
  visible,
  onClose,
  onGenerate,
}: AIGenerationModalProps) {
  const { t } = useTranslation();
  const [shopInfo, setShopInfo] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!shopInfo.trim()) {
      Alert.alert(
        t('seller.aiGeneration.error'),
        t('seller.aiGeneration.enterShopInfo')
      );
      return;
    }

    console.log('🔍 AI Generation Debug - Starting generation...');
    console.log('📝 Shop info input:', shopInfo.trim());

    setIsGenerating(true);
    
    try {
      const generatedData = await AIService.generateShopDetails({
        shopInfo: shopInfo.trim(),
      });

      onGenerate(generatedData);
      setShopInfo('');
      onClose();
      
      Alert.alert(
        t('common.success'),
        t('seller.aiGeneration.generationSuccess')
      );
    } catch (error) {
      console.error('Generation error:', error);
      
      // Get error message - use the detailed error message if available
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Check if it's an API configuration error
      if (errorMessage.includes('API Configuration Error')) {
        Alert.alert(
          t('seller.aiGeneration.error'),
          `${errorMessage}\n\nPlease check your API key configuration in the settings.`,
          [
            {
              text: t('common.ok'),
              style: 'default'
            }
          ]
        );
        return;
      }
      
      // For other errors, show fallback option
      Alert.alert(
        t('seller.aiGeneration.generationFailed'),
        `${errorMessage}\n\n${t('seller.aiGeneration.useFallbackQuestion')}`,
        [
          {
            text: t('common.cancel'),
            style: 'cancel'
          },
          {
            text: t('seller.aiGeneration.useFallback'),
            onPress: () => {
              try {
                const fallbackData = AIService.generateFallbackData(shopInfo.trim());
                onGenerate(fallbackData);
                setShopInfo('');
                onClose();
                Alert.alert(
                  t('common.success'),
                  t('seller.aiGeneration.fallbackSuccess')
                );
              } catch (fallbackError) {
                console.error('Fallback generation error:', fallbackError);
                Alert.alert(
                  t('common.error'),
                  t('seller.aiGeneration.fallbackFailed')
                );
              }
            }
          }
        ]
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      setShopInfo('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <ErrorBoundary 
        fallbackTitle="AI Generation Error"
        fallbackMessage="There was an issue with the AI generation feature. Please try again."
        onRetry={handleClose}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            disabled={isGenerating}
          >
            <MaterialCommunityIcons 
              name="close" 
              size={IconSizes.md} 
              color={Colors.text.primary} 
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {t('seller.aiGeneration.title')}
          </Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          {/* Main Content */}
          <View style={styles.mainContent}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="magic-staff" 
                size={48} 
                color={Colors.primary} 
              />
            </View>

            <Text style={styles.title}>
              {t('seller.aiGeneration.subtitle')}
            </Text>

            <Text style={styles.description}>
              {t('seller.aiGeneration.description')}
            </Text>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>
                {t('seller.aiGeneration.inputLabel')}
              </Text>
              
              <TextInput
                style={styles.textArea}
                value={shopInfo}
                onChangeText={setShopInfo}
                placeholder={t('seller.aiGeneration.inputPlaceholder')}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor={Colors.text.secondary}
                editable={!isGenerating}
              />
            </View>

            <View style={styles.exampleSection}>
              <Text style={styles.exampleTitle}>
                {t('seller.aiGeneration.exampleTitle')}
              </Text>
              <Text style={styles.exampleText}>
                {t('seller.aiGeneration.exampleText')}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title={t('common.cancel')}
            onPress={handleClose}
            variant="outline"
            style={styles.cancelButton}
            disabled={isGenerating}
          />
          <Button
            title={isGenerating ? t('seller.aiGeneration.generating') : t('seller.aiGeneration.generate')}
            onPress={handleGenerate}
            style={styles.generateButton}
            disabled={isGenerating || !shopInfo.trim()}
          />
        </View>
        </KeyboardAvoidingView>
      </ErrorBoundary>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerPlaceholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
  },
  mainContent: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  inputSection: {
    marginBottom: Spacing.xl,
  },
  inputLabel: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  textArea: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    minHeight: 120,
    maxHeight: 200,
  },
  exampleSection: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  exampleTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  exampleText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
  },
  cancelButton: {
    flex: 1,
  },
  generateButton: {
    flex: 2,
  },
});
