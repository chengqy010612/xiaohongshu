import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { PageContainer } from '@/components/page-container';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function CreatePage() {
  const { imageUri, type } = useLocalSearchParams();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(imageUri || null);

  useEffect(() => {
    if (imageUri) {
      setSelectedImage(imageUri as string);
    }
  }, [imageUri]);

  const handlePublish = () => {
    // 这里可以添加发布逻辑
    Alert.alert('发布成功', '您的内容已成功发布');
    router.back();
  };

  return (
    <PageContainer style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText style={styles.cancelButton}>取消</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title">发布</ThemedText>
        <TouchableOpacity onPress={handlePublish}>
          <ThemedText style={styles.publishButton}>发布</ThemedText>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.contentContainer}>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        )}
        
        <TextInput
          style={styles.textInput}
          placeholder="分享你的想法..."
          multiline
          value={content}
          onChangeText={setContent}
        />
      </ScrollView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cancelButton: {
    color: '#666',
  },
  publishButton: {
    color: '#ff2442',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
  textInput: {
    minHeight: 100,
    fontSize: 16,
    textAlignVertical: 'top',
  },
});