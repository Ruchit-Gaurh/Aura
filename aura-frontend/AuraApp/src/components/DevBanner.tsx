import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DEV_CONFIG = {
  MOCK_API: false, // Now using real backend
};

export const DevBanner: React.FC = () => {
  if (!DEV_CONFIG.MOCK_API) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>
        🔧 Development Mode - Using Mock Data
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#f39c12',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});