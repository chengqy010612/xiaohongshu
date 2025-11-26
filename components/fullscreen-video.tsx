import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Animated,
} from 'react-native';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import VideoPlayer from './video-player';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { mockWaterfallData } from '@/data/mock-data';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface FullscreenVideoProps {
  route: {
    params: {
      videoId: string;
      videoUrl: string;
      thumbnailUrl: string;
      title: string;
      description: string;
      user: {
        name: string;
        avatar: string;
      };
      initialLikes: number;
      initialIsLiked?: boolean;
      initialIsCollected?: boolean;
      comments?: Array<{
        id: string;
        user: {
          name: string;
          avatar: string;
        };
        content: string;
        time: string;
      }>;
    };
  };
  navigation: any;
}

const FullscreenVideo: React.FC<FullscreenVideoProps> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { params } = route;
  const translateY = useRef(new Animated.Value(0)).current;
  const videoIndexRef = useRef(0);
  
  // 获取当前视频在数据中的索引
  const currentVideoIndex = mockWaterfallData.findIndex(item => item.id === params.videoId);
  videoIndexRef.current = currentVideoIndex;
  
  const [isLiked, setIsLiked] = useState(params.initialIsLiked || false);
  const [isCollected, setIsCollected] = useState(params.initialIsCollected || false);
  const [likes, setLikes] = useState(params.initialLikes);

  // 处理点赞回调
  const handleLike = (liked: boolean) => {
    setIsLiked(liked);
    setLikes(prev => liked ? prev + 1 : prev - 1);
  };

  // 处理收藏回调
  const handleCollect = (collected: boolean) => {
    setIsCollected(collected);
  };

  // 处理评论回调
  const handleComment = (comment: string) => {
    console.log('新评论:', comment);
  };

  // 处理返回按钮
  const handleBackPress = () => {
    navigation.goBack();
  };

  // 切换到下一个视频
  const switchToNextVideo = () => {
    const nextIndex = videoIndexRef.current + 1;
    if (nextIndex < mockWaterfallData.length && mockWaterfallData[nextIndex].type === 'video') {
      const nextVideo = mockWaterfallData[nextIndex];
      navigation.replace('FullscreenVideo', {
        videoId: nextVideo.id,
        videoUrl: nextVideo.videoUrl,
        thumbnailUrl: nextVideo.image,
        title: nextVideo.title,
        description: nextVideo.description,
        user: nextVideo.user,
        initialLikes: nextVideo.likes,
        initialIsLiked: false,
        initialIsCollected: false,
        comments: [],
      });
    }
  };

  // 切换到上一个视频
  const switchToPreviousVideo = () => {
    const prevIndex = videoIndexRef.current - 1;
    if (prevIndex >= 0 && mockWaterfallData[prevIndex].type === 'video') {
      const prevVideo = mockWaterfallData[prevIndex];
      navigation.replace('FullscreenVideo', {
        videoId: prevVideo.id,
        videoUrl: prevVideo.videoUrl,
        thumbnailUrl: prevVideo.image,
        title: prevVideo.title,
        description: prevVideo.description,
        user: prevVideo.user,
        initialLikes: prevVideo.likes,
        initialIsLiked: false,
        initialIsCollected: false,
        comments: [],
      });
    }
  };

  // 处理手势滑动
  const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const { translationY } = event.nativeEvent;
    translateY.setValue(translationY);
  };

  const onGestureEnd = (event: PanGestureHandlerGestureEvent) => {
    const { translationY } = event.nativeEvent;
    
    if (translationY > 50) {
      // 向下滑动，切换到下一个视频
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        switchToNextVideo();
        translateY.setValue(0);
      });
    } else if (translationY < -50) {
      // 向上滑动，切换到上一个视频
      Animated.timing(translateY, {
        toValue: -screenHeight,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        switchToPreviousVideo();
        translateY.setValue(0);
      });
    } else {
      // 回弹
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

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
          {/* 返回按钮 */}
          <TouchableOpacity 
            style={[styles.backButton, { top: insets.top + 10 }]} 
            onPress={handleBackPress}
          >
            <ThemedText style={styles.backButtonText}>←</ThemedText>
          </TouchableOpacity>

          {/* 视频切换指示器 */}
          <View style={[styles.videoIndicator, { bottom: insets.bottom + 50 }]}>
            <ThemedText style={styles.indicatorText}>
              {currentVideoIndex + 1} / {mockWaterfallData.filter(item => item.type === 'video').length}
            </ThemedText>
          </View>

          {/* 手势提示 */}
          <View style={styles.gestureHint}>
            <ThemedText style={styles.gestureHintText}>
              ↑ 向上滑动切换到上一个视频
            </ThemedText>
            <ThemedText style={styles.gestureHintText}>
              ↓ 向下滑动切换到下一个视频
            </ThemedText>
          </View>

          {/* 全屏视频播放器 */}
          <VideoPlayer
            id={params.videoId}
            videoUrl={params.videoUrl}
            thumbnailUrl={params.thumbnailUrl}
            title={params.title}
            description={params.description}
            user={params.user}
            initialLikes={likes}
            initialIsLiked={isLiked}
            initialIsCollected={isCollected}
            onLike={handleLike}
            onCollect={handleCollect}
            onComment={handleComment}
            comments={params.comments || []}
          />
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1000,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  videoIndicator: {
    position: 'absolute',
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  indicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gestureHint: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
    zIndex: 100,
  },
  gestureHintText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default FullscreenVideo;