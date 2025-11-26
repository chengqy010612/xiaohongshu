import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface VideoPlayerProps {
  id: string;
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
  onLike?: (isLiked: boolean) => void;
  onCollect?: (isCollected: boolean) => void;
  onComment?: (comment: string) => void;
  comments?: {
    id: string;
    user: {
      name: string;
      avatar: string;
    };
    content: string;
    time: string;
  }[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  id,
  videoUrl,
  thumbnailUrl,
  title,
  description,
  user,
  initialLikes,
  initialIsLiked = false,
  initialIsCollected = false,
  onLike,
  onCollect,
  onComment,
  comments = []
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isCollected, setIsCollected] = useState(initialIsCollected);
  const [likes, setLikes] = useState(initialLikes);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [allComments, setAllComments] = useState(comments);

  // 处理播放/暂停
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // 处理视频结束
  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  // 视频播放器引用
  const videoRef = useRef<Video>(null);

  // 处理点赞
  const handleLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes(prev => newIsLiked ? prev + 1 : prev - 1);
    onLike?.(newIsLiked);
  };

  // 处理收藏
  const handleCollect = () => {
    const newIsCollected = !isCollected;
    setIsCollected(newIsCollected);
    onCollect?.(newIsCollected);
  };

  // 处理评论
  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        user: {
          name: '当前用户',
          avatar: 'https://picsum.photos/seed/currentuser/100/100.jpg'
        },
        content: newComment.trim(),
        time: '刚刚'
      };
      
      setAllComments(prev => [comment, ...prev]);
      setNewComment('');
      onComment?.(newComment.trim());
    }
  };

  // 格式化点赞数
  const formatLikes = (count: number) => {
    if (count >= 10000) {
      return (count / 10000).toFixed(1) + 'w';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  // 渲染右侧操作栏
  const renderActionBar = () => (
    <View style={styles.actionBar}>
      {/* 用户头像 */}
      <TouchableOpacity style={styles.userAvatarContainer}>
        <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
        <View style={styles.avatarBorder} />
      </TouchableOpacity>

      {/* 点赞 */}
      <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
        <View style={[styles.iconContainer, isLiked && styles.likedIconContainer]}>
          <Text style={[styles.actionIcon, isLiked && styles.likedIcon]}>{isLiked ? '❤️' : '🤍'}</Text>
        </View>
        <ThemedText style={[styles.actionText, isLiked && styles.likedText]}>
          {formatLikes(likes)}
        </ThemedText>
      </TouchableOpacity>

      {/* 评论 */}
      <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => setShowComments(true)}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.actionIcon}>💬</Text>
        </View>
        <ThemedText style={styles.actionText}>
          {allComments.length}
        </ThemedText>
      </TouchableOpacity>

      {/* 收藏 */}
      <TouchableOpacity style={styles.actionButton} onPress={handleCollect}>
        <View style={[styles.iconContainer, isCollected && styles.collectedIconContainer]}>
          <Text style={[styles.actionIcon, isCollected && styles.collectedIcon]}>
            {isCollected ? '⭐' : '☆'}
          </Text>
        </View>
        <ThemedText style={styles.actionText}>
          {isCollected ? '已收藏' : '收藏'}
        </ThemedText>
      </TouchableOpacity>

      {/* 分享 */}
      <TouchableOpacity style={styles.actionButton}>
        <View style={styles.iconContainer}>
          <Text style={styles.actionIcon}>🔗</Text>
        </View>
        <ThemedText style={styles.actionText}>分享</ThemedText>
      </TouchableOpacity>
    </View>
  );

  // 渲染底部信息栏
  const renderInfoBar = () => (
    <View style={styles.infoBar}>
      <View style={styles.userInfo}>
        <ThemedText style={styles.userName}>@{user.name}</ThemedText>
        <ThemedText style={styles.description} numberOfLines={2}>
          {description}
        </ThemedText>
      </View>
    </View>
  );

  // 渲染播放按钮
  const renderPlayButton = () => (
    <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
      <View style={styles.playIconContainer}>
        <Text style={styles.playIcon}>
          {isPlaying ? '❚❚' : '▶'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // 渲染评论弹窗
  const renderCommentsModal = () => (
    <Modal
      visible={showComments}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowComments(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* 弹窗头部 */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowComments(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle}>评论 ({allComments.length})</ThemedText>
            <View style={styles.modalSpacer} />
          </View>

          {/* 评论输入框 */}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="说点什么..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmitComment}
            >
              <Text style={styles.submitText}>发送</Text>
            </TouchableOpacity>
          </View>

          {/* 评论列表 */}
          <ScrollView style={styles.commentsList}>
            {allComments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <Image source={{ uri: comment.user.avatar }} style={styles.commentAvatar} />
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <ThemedText style={styles.commentUserName}>
                      {comment.user.name}
                    </ThemedText>
                    <ThemedText style={styles.commentTime}>
                      {comment.time}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.commentText}>
                    {comment.content}
                  </ThemedText>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <ThemedView style={styles.container}>
      {/* 视频缩略图/播放器 */}
      <View style={styles.videoContainer}>
        {isPlaying ? (
          <Video
            ref={videoRef}
            source={{ uri: videoUrl }}
            style={styles.videoPlayer}
            controls={false}
            resizeMode="cover"
            onEnd={handleVideoEnd}
            paused={!isPlaying}
            repeat={false}
          />
        ) : (
          <Image source={{ uri: thumbnailUrl }} style={styles.videoThumbnail} />
        )}
        {renderPlayButton()}
      </View>

      {/* 右侧操作栏 */}
      {renderActionBar()}

      {/* 底部信息栏 */}
      {renderInfoBar()}

      {/* 评论弹窗 */}
      {renderCommentsModal()}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  videoContainer: {
    width: screenWidth,
    height: screenHeight * 0.9,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  playIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  actionBar: {
    position: 'absolute',
    right: 20,
    bottom: 120,
    alignItems: 'center',
  },
  userAvatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarBorder: {
    position: 'absolute',
    bottom: -5,
    left: '50%',
    transform: [{ translateX: -10 }],
    width: 20,
    height: 20,
    backgroundColor: '#ff2442',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  actionButton: {
    alignItems: 'center',
    marginVertical: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  likedIconContainer: {
    transform: [{ scale: 1.1 }],
  },
  collectedIconContainer: {
    transform: [{ scale: 1.1 }],
  },
  actionIcon: {
    fontSize: 28,
  },
  likedIcon: {
    color: '#ff2442',
  },
  collectedIcon: {
    color: '#ff9500',
  },
  actionText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#fff',
  },
  likedText: {
    color: '#ff2442',
  },
  infoBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 80,
  },
  userInfo: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  description: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 22,
    color: '#666',
    lineHeight: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  modalSpacer: {
    flex: 1,
  },
  commentInputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    marginRight: 12,
  },
  submitButton: {
    backgroundColor: '#ff2442',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentsList: {
    maxHeight: 400,
  },
  commentItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
  },
});

export default VideoPlayer;