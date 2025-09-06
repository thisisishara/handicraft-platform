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
import { Input } from '../../components/ui/Input';

export default function AddProductScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    story: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddImage = () => {
    // In a real app, this would open image picker
    Alert.alert('Image Picker', 'This would open the camera/gallery');
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description || !formData.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(t('common.success'), t('seller.addProduct.productAddedSuccessfully'), [
        { text: t('common.ok'), onPress: () => router.back() }
      ]);
    }, 1500);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('seller.addProduct.title')}</Text>
        <Text style={styles.subtitle}>{t('seller.addProduct.subtitle')}</Text>
      </View>

      <View style={styles.form}>
        <Input
          label={t('seller.addProduct.productName')}
          value={formData.name}
          onChangeText={(name) => setFormData({ ...formData, name })}
          placeholder={t('seller.addProduct.productNamePlaceholder')}
        />

        <Input
          label={t('seller.addProduct.description')}
          value={formData.description}
          onChangeText={(description) => setFormData({ ...formData, description })}
          placeholder={t('seller.addProduct.descriptionPlaceholder')}
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        <Input
          label={t('seller.addProduct.price')}
          value={formData.price}
          onChangeText={(price) => setFormData({ ...formData, price })}
          placeholder={t('seller.addProduct.pricePlaceholder')}
          keyboardType="numeric"
        />

        <Input
          label={t('seller.addProduct.category')}
          value={formData.category}
          onChangeText={(category) => setFormData({ ...formData, category })}
          placeholder={t('seller.addProduct.categoryPlaceholder')}
        />

        <View style={styles.imageSection}>
          <Text style={styles.label}>{t('seller.addProduct.productImages')}</Text>
          <TouchableOpacity style={styles.imageUpload} onPress={handleAddImage}>
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadText}>{t('seller.addProduct.addPhotos')}</Text>
            <Text style={styles.uploadSubtext}>{t('seller.addProduct.showCraftsmanship')}</Text>
          </TouchableOpacity>
        </View>

        <Input
          label={t('seller.addProduct.yourStory')}
          value={formData.story}
          onChangeText={(story) => setFormData({ ...formData, story })}
          placeholder={t('seller.addProduct.storyPlaceholder')}
          multiline
          numberOfLines={6}
          style={styles.textArea}
        />

        <View style={styles.storyTip}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipText}>
            {t('seller.addProduct.storyTip')}
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title={t('seller.addProduct.saveAsDraft')}
            variant="outline"
            onPress={() => Alert.alert(t('seller.addProduct.draft'), t('seller.addProduct.savedAsDraft'))}
            style={styles.actionButton}
          />
          <Button
            title={t('seller.addProduct.publishProduct')}
            onPress={handleSave}
            loading={loading}
            style={styles.actionButton}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    padding: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  imageUpload: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  storyTip: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
