import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { DodoProvider } from './src/contexts/DodoContext';
import { Platform } from 'react-native';
import WebFoundationApp from './src/web/WebFoundationApp';

const queryClient = new QueryClient();

export default function App() {
  if (Platform.OS === 'web') {
    return <WebFoundationApp />;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <DodoProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </DodoProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
