import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/store';
import { login, logout, toggleLike } from '@/store/slices/userSlice';

const ReduxExample: React.FC = () => {
  // 使用类型化的hooks获取Redux状态和dispatch
  const dispatch = useAppDispatch();
  const { isLoggedIn, userInfo, likes } = useAppSelector(state => state.user);

  // 登录处理函数
  const handleLogin = () => {
    dispatch(login({
      id: '123',
      username: '小红书用户',
      avatar: 'https://example.com/avatar.jpg',
      email: 'user@example.com'
    }));
  };

  // 登出处理函数
  const handleLogout = () => {
    dispatch(logout());
  };

  // 点赞处理函数
  const handleToggleLike = (postId: string) => {
    dispatch(toggleLike(postId));
    Alert.alert('提示', `已${likes.includes(postId) ? '取消' : ''}点赞帖子 ${postId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redux 使用示例</Text>
      
      {/* 显示用户登录状态 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>用户状态</Text>
        {isLoggedIn ? (
          <View>
            <Text>用户名: {userInfo.username}</Text>
            <Text>用户ID: {userInfo.id}</Text>
            <Text>邮箱: {userInfo.email}</Text>
            <Button title="登出" onPress={handleLogout} />
          </View>
        ) : (
          <Button title="登录" onPress={handleLogin} />
        )}
      </View>

      {/* 显示点赞状态 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>点赞功能</Text>
        <Text>当前点赞数: {likes.length}</Text>
        <Button 
          title="点赞帖子1" 
          onPress={() => handleToggleLike('post1')} 
          color={likes.includes('post1') ? '#ff5c5c' : undefined}
        />
        <Button 
          title="点赞帖子2" 
          onPress={() => handleToggleLike('post2')} 
          color={likes.includes('post2') ? '#ff5c5c' : undefined}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ReduxExample;