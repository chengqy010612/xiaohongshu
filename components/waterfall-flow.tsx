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

const { width: screenWidth } = Dimensions.get('window');

interface WaterfallItem {
  id: string;
  image: string;
  title: string;
  user: {
    name: string;
    avatar: string;
  };
  likes: number;
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
  
  // 获取屏幕宽度
  const screenWidth = Dimensions.get('window').width;
  const columnWidth = (screenWidth - 30) / 2; // 减去padding和gap

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
  const renderWaterfallItem = ({ item }: { item: WaterfallItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onItemPress && onItemPress(item)}
    >
      <Image
        source={{ uri: item.image }}
        style={[
          styles.itemImage,
          { height: item.height || 200 } // 使用动态高度，默认200
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
  },
  likesText: {
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