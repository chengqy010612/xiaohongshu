import React from 'react';
import { View, StyleSheet, ViewStyle  , Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedView } from './themed-view';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

interface PageContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  useTheme?: boolean;
}

export function PageContainer({ children, style, useTheme = true }: PageContainerProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';

  const containerStyle = [
    styles.container,
    {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
    style,
  ];

  if (useTheme) {
    return (
      <ThemedView style={containerStyle}>
      <Stack.Screen options={{ headerShown: false }} />
        {children}
      </ThemedView>
    );
  }

  return (
    <View style={containerStyle}>
      <Stack.Screen options={{ headerShown: false }} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});