import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { PageContainer } from '@/components/page-container';

export default function CreatePage() {
  return (
    <PageContainer style={styles.container}>
      <ThemedText type="title">发布</ThemedText>
      <ThemedText>这是发布内容页面</ThemedText>
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