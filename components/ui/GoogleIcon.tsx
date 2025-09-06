import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export const GoogleIcon: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/google_logo.png')} 
        style={styles.icon}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  icon: {
    width: 14,
    height: 14,
  },
});
