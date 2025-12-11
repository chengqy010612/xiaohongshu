import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import VideoPlayer from '@/components/video-player';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { mockWaterfallData, WaterfallItem } from '@/data/mock-data';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PopularVideoPage: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const translateY = useRef(new Animated.Value(0)).current; 
  const [isLiked, setIsLiked] = useState<{ [key: string]: boolean }>({});
  const [isCollected, setIsCollected] = useState<{ [key: string]: boolean }>({});
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  
  // 获取所有视频数据
  const videoData = mockWaterfallData.filter(item => item.type === 'video');
  const currentVideo = videoData[currentVideoIndex];

  // 初始化点赞数据
  useEffect(() => {
    videoData.forEach(video => {
      if (likes[video.id] === undefined) {
        setLikes(prev => ({
          ...prev,
          [video.id]: video.likes
        }));
      }
    });
  }, [videoData]);

  // 处理手势滑动
  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const { translationY } = event.nativeEvent;
    translateY.setValue(translationY);
  };

  const onGestureEnd = (event: PanGestureHandlerGestureEvent) => {
    const { translationY } = event.nativeEvent;
    
    if (translationY > 50) {
      // 向下滑动，切换到下一个视频
      if (currentVideoIndex < videoData.length - 1) {
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setCurrentVideoIndex(prev => prev + 1);
          translateY.setValue(0);
        });
      } else {
        // 回到顶部
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    } else if (translationY < -50) {
      // 向上滑动，切换到上一个视频
      if (currentVideoIndex > 0) {
        Animated.timing(translateY, {
          toValue: -screenHeight,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setCurrentVideoIndex(prev => prev - 1);
          translateY.setValue(0);
        });
      } else {
        // 回弹
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    } else {
      // 回弹
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  // 处理点赞
  const handleLike = (videoId: string) => {
    const liked = !isLiked[videoId];
    setIsLiked(prev => ({
      ...prev,
      [videoId]: liked
    }));
    setLikes(prev => ({
      ...prev,
      [videoId]: prev[videoId] + (liked ? 1 : -1)
    }));
  };

  // 处理收藏
  const handleCollect = (videoId: string) => {
    const collected = !isCollected[videoId];
    setIsCollected(prev => ({
      ...prev,
      [videoId]: collected
    }));
  };

  // 处理评论
  const handleComment = (videoId: string, comment: string) => {
    console.log(`视频 ${videoId} 新评论:`, comment);
  };

  // 跳转到用户资料页
  const handleUserPress = (user: any) => {
    console.log('点击用户资料:', user.name);
  };

  if (!currentVideo) {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>暂无更多视频</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar hidden={true} />
      
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onEnded={onGestureEnd}
      >
        <Animated.View 
          style={[
            styles.container,
            {
              transform: [{ translateY }]
            }
          ]}
        >
          {/* 视频播放器 */}
          <VideoPlayer
            id={currentVideo.id}
            videoUrl={currentVideo.videoUrl!}
            thumbnailUrl={currentVideo.image}
            title={currentVideo.title}
            description={currentVideo.description}
            user={currentVideo.user}
            initialLikes={likes[currentVideo.id] || 0}
            initialIsLiked={isLiked[currentVideo.id] || false}
            initialIsCollected={isCollected[currentVideo.id] || false}
            onLike={() => handleLike(currentVideo.id)}
            onCollect={() => handleCollect(currentVideo.id)}
            onComment={(comment) => handleComment(currentVideo.id, comment)}
            comments={[]} // 可以根据需要添加评论数据
          />

          {/* 视频信息 */}
          {/* <View style={[styles.videoInfo, { bottom: insets.bottom + 100 }]}>
            <View style={styles.userInfo}>
              <TouchableOpacity onPress={() => handleUserPress(currentVideo.user)}>
                <ThemedText style={styles.username}>@{currentVideo.user.name}</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.description}>{currentVideo.description}</ThemedText>
            </View>
          </View> */}

          {/* 右侧操作栏 */}
          {/* <View style={[styles.actions, { bottom: insets.bottom + 120 }]}>
            <View style={styles.actionItem}>
              <TouchableOpacity onPress={() => handleLike(currentVideo.id)}>
                <ThemedText style={styles.actionIcon}>
                  {isLiked[currentVideo.id] ? '❤️' : '🤍'}
                </ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.actionText}>
                {likes[currentVideo.id] || 0}
              </ThemedText>
            </View>

            <View style={styles.actionItem}>
              <TouchableOpacity onPress={() => handleComment(currentVideo.id, '新评论')}>
                <ThemedText style={styles.actionIcon}>💬</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.actionText}>
                {currentVideo.comments || 0}
              </ThemedText>
            </View>

            <View style={styles.actionItem}>
              <TouchableOpacity onPress={() => handleCollect(currentVideo.id)}>
                <ThemedText style={styles.actionIcon}>
                  {isCollected[currentVideo.id] ? '📖' : '📚'}
                </ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.actionText}>收藏</ThemedText>
            </View>

            <View style={styles.actionItem}>
              <TouchableOpacity>
                <ThemedText style={styles.actionIcon}>📤</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.actionText}>分享</ThemedText>
            </View>
          </View> */}

          {/* 视频进度指示器 */}
          {/* <View style={[styles.progressIndicator, { top: insets.top + 50 }]}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${((currentVideoIndex + 1) / videoData.length) * 100}%` 
                  }
                ]}
              />
            </View>
            <ThemedText style={styles.progressText}>
              {currentVideoIndex + 1} / {videoData.length}
            </ThemedText>
          </View> */}

          {/* 手势提示 */}
          {/* <View style={[styles.gestureHint, { top: '50%' }]}>
            <ThemedText style={styles.gestureHintText}>
              ↑ 向上滑动查看上一个视频
            </ThemedText>
            <ThemedText style={styles.gestureHintText}>
              ↓ 向下滑动查看更多视频
            </ThemedText>
          </View> */}
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
  },
  videoInfo: {
    position: 'absolute',
    left: 20,
    right: 80,
    zIndex: 10,
  },
  userInfo: {
    marginBottom: 15,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    alignItems: 'center',
  },
  actionItem: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  progressIndicator: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 10,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gestureHint: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -50 }],
    alignItems: 'center',
    zIndex: 5,
  },
  gestureHintText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginVertical: 2,
    textAlign: 'center',
  },
});

export default PopularVideoPage;