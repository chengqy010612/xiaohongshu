import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { PageContainer } from '@/components/page-container';
import { useAppSelector, useAppDispatch } from '@/store';
import { login, logout } from '@/store/slices/userSlice';

export default function ProfilePage() {
  // 使用类型化的hooks获取Redux状态和dispatch
  const dispatch = useAppDispatch();
  const { isLoggedIn, userInfo } = useAppSelector(state => state.user);

  // 登录处理函数
  const handleLogin = () => {
    dispatch(login({
      id: '123',
      username: '小红书用户',
      avatar: 'https://picsum.photos/seed/user123/100/100.jpg',
      email: 'user@example.com'
    }));
  };

  // 登出处理函数
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <PageContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title">我的</ThemedText>
        
        {isLoggedIn ? (
          <View style={styles.profileContainer}>
            <View style={styles.userInfo}>
              {userInfo.avatar && (
                <Image 
                  source={{ uri: userInfo.avatar }} 
                  style={styles.avatar}
                />
              )}
              <View style={styles.userDetails}>
                <ThemedText type="subtitle">{userInfo.username}</ThemedText>
                <ThemedText style={styles.userId}>ID: {userInfo.id}</ThemedText>
                {userInfo.email && (
                  <ThemedText style={styles.email}>{userInfo.email}</ThemedText>
                )}
              </View>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <ThemedText type="subtitle">128</ThemedText>
                <ThemedText>关注</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText type="subtitle">256</ThemedText>
                <ThemedText>粉丝</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText type="subtitle">42</ThemedText>
                <ThemedText>获赞</ThemedText>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <Button title="编辑资料" onPress={() => {}} />
              <Button title="登出" onPress={handleLogout} color="#ff5c5c" />
            </View>
          </View>
        ) : (
          <View style={styles.loginContainer}>
            <ThemedText style={styles.loginText}>请登录以查看个人信息</ThemedText>
            <Button title="登录" onPress={handleLogin} />
          </View>
        )}
      </ScrollView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  profileContainer: {
    marginTop: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userId: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 5,
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loginText: {
    marginBottom: 20,
    textAlign: 'center',
  },
});