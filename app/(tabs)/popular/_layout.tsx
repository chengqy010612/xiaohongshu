import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { PageContainer } from '@/components/page-container';

export default function PopularPage() {
  return (
    <PageContainer style={styles.container}>
      <ThemedText type="title">热门</ThemedText>
      <ThemedText>这是热门内容</ThemedText>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});