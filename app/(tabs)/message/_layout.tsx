import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { PageContainer } from '@/components/page-container';

export default function MessagePage() {
  return (
    <PageContainer style={styles.container}>
      <ThemedText type="title">消息</ThemedText>
      <ThemedText>这是消息内容</ThemedText>
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