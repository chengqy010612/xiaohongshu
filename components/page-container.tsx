import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedView } from './themed-view';

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
        {children}
      </ThemedView>
    );
  }

  return (
    <View style={containerStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});