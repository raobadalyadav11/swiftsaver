/**
 * SwiftSaver - Video Downloader App
 * A Snaptube-inspired video downloader built with React Native CLI and Supabase
 */

import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation';
import { useAuthStore } from './src/store';
import { colors } from './src/theme';

// Ignore specific warnings (if needed)
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function App(): React.JSX.Element {
  const { initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth state on app start
    initialize();
  }, [initialize]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.background}
          translucent={false}
        />
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
