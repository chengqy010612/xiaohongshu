import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import VideoPlayer from './video-player';

interface WaterfallItem {
  id: string;
  type: 'image' | 'video'; // 支持图片和视频
  image: string;
  videoUrl?: string; // 视频URL，仅在type为video时需要
  title: string;
  description: string;
  user: {
    name: string;
    avatar: string;
  };
  likes: number;
  comments?: number;
  height: number; // 图片高度，用于瀑布流布局
}

interface WaterfallFlowProps {
  data: WaterfallItem[];
  onItemPress?: (item: WaterfallItem) => void;
  onRefresh?: () => Promise<void>;
  onLoadMore?: () => Promise<void>;
  isRefreshing?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  refreshColor?: string;
}

const WaterfallFlow: React.FC<WaterfallFlowProps> = ({ 
  data, 
  onItemPress, 
  onRefresh,
  onLoadMore,
  isRefreshing = false,
  isLoadingMore = false,
  hasMore = true,
  refreshColor = '#ff2442'
}) => {
  // 状态管理
  const [refreshing, setRefreshing] = useState(false);
  
  // 布局由样式控制，不需要预计算列宽

  // 使用useMemo优化数据分配
  const { leftColumnData, rightColumnData } = useMemo(() => {
    const left: WaterfallItem[] = [];
    const right: WaterfallItem[] = [];
    
    data.forEach((item, index) => {
      if (index % 2 === 0) {
        left.push(item);
      } else {
        right.push(item);
      }
    });
    
    return { leftColumnData: left, rightColumnData: right };
  }, [data]);

  // 处理下拉刷新
  const handleRefresh = useCallback(async () => {
    if (!onRefresh || refreshing) return;
    
    setRefreshing(true);
    
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, refreshing]);

  // 处理到达底部加载更多
  const handleLoadMore = useCallback(async () => {
    if (!onLoadMore || isLoadingMore || !hasMore) return;
    
    try {
      await onLoadMore();
    } catch (error) {
      console.error('加载更多失败:', error);
    }
  }, [onLoadMore, isLoadingMore, hasMore]);

  // 渲染底部加载指示器
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color={refreshColor} />
        <Text style={styles.footerText}>加载中...</Text>
      </View>
    );
  };

  // 渲染瀑布流项目
  const renderWaterfallItem = ({ item }: { item: WaterfallItem }) => {
    const handleItemPress = () => {
      if (item.type === 'video' && item.videoUrl) {
        // 视频项点击进入全屏播放页面
        onItemPress && onItemPress(item);
      }
    };

    if (item.type === 'video' && item.videoUrl) {
      // 渲染视频项目
      return (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={handleItemPress}
        >
          <View style={styles.videoThumbnailContainer}>
            <Image
              source={{ uri: item.image }}
              style={[
                styles.itemImage,
                { height: item.height || 200 }
              ]}
              resizeMode="cover"
            />
            <View style={styles.videoOverlay}>
              <Text style={styles.videoPlayIcon}>▶️</Text>
              <Text style={styles.videoTypeText}>视频</Text>
            </View>
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
            <View style={styles.itemFooter}>
              <Image
                source={{ uri: item.user.avatar }}
                style={styles.userAvatar}
              />
              <Text style={styles.userName}>{item.user.name}</Text>
              <View style={styles.likesContainer}>
                <Text style={styles.likesText}>❤️ {item.likes}</Text>
                {/* {item.comments && (
                  <Text style={styles.commentsText}>💬 {item.comments}</Text>
                )} */}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // 渲染图片项目
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onItemPress && onItemPress(item)}
      >
        <Image
          source={{ uri: item.image }}
          style={[
            styles.itemImage,
            { height: item.height || 200 }
          ]}
          resizeMode="cover"
        />
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.itemFooter}>
            <Image
              source={{ uri: item.user.avatar }}
              style={styles.userAvatar}
            />
            <Text style={styles.userName}>{item.user.name}</Text>
            <View style={styles.likesContainer}>
              <Text style={styles.likesText}>❤️ {item.likes}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // 渲染包含两列的行
  const renderRow = ({ index }: { index: number }) => {
    const leftItem = leftColumnData[index];
    const rightItem = rightColumnData[index];
    
    return (
      <View style={styles.row}>
        {leftItem && (
          <View style={styles.column}>
            {renderWaterfallItem({ item: leftItem })}
          </View>
        )}
        {rightItem && (
          <View style={styles.column}>
            {renderWaterfallItem({ item: rightItem })}
          </View>
        )}
      </View>
    );
  };

  // 计算行数
  const rowCount = Math.max(leftColumnData.length, rightColumnData.length);

  return (
    <FlatList
      data={Array.from({ length: rowCount }, (_, i) => i)}
      renderItem={renderRow}
      keyExtractor={(item) => `row-${item}`}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing || isRefreshing}
          onRefresh={handleRefresh}
          colors={[refreshColor]}
          tintColor={refreshColor}
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    paddingHorizontal: 5,
  },
  itemContainer: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoThumbnailContainer: {
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoPlayIcon: {
    fontSize: 12,
    color: '#fff',
    marginRight: 4,
  },
  videoTypeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  itemImage: {
    width: '100%',
    height: 200,
  },
  itemContent: {
    padding: 10,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  userName: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  likesText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  commentsText: {
    fontSize: 12,
    color: '#666',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
});

export default WaterfallFlow;
