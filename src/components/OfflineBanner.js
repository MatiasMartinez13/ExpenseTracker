import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '../theme';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline =
        state.isConnected === false || state.isInternetReachable === false;
      setIsOffline(offline);
    });

    return () => unsubscribe();
  }, []);

  if (!isOffline) return null;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View testID="offline-banner" style={styles.banner}>
        <Text style={styles.text}>
          Sin conexión — Los cambios se sincronizarán al volver a conectarse
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fef3c7',
  },
  banner: {
    backgroundColor: '#fef3c7',
    borderBottomWidth: 1,
    borderBottomColor: '#fde68a',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    alignItems: 'center',
  },
  text: {
    color: '#92400e',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
