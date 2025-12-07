import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Types ---
interface MessageItemData {
  id: string;
  type: 'user' | 'group' | 'system' | 'activity';
  title: string;
  subtitle: string;
  time: string;
  unreadCount: number;
  avatarColor?: string;
  avatarIcon?: string;
  isOfficial?: boolean;
}

// --- Mock Data ---
const MOCK_DATA: MessageItemData[] = [
  {
    id: '1',
    type: 'group',
    title: '大战冲冲冲',
    subtitle: '"      " 加入了群聊',
    time: '11-13',
    unreadCount: 10,
    avatarColor: '#E8E8E8',
    avatarIcon: 'people',
  },
  {
    id: '2',
    type: 'activity',
    title: '活动消息',
    subtitle: '看直播集章兑奖，赢明星同款周边',
    time: '11-08',
    unreadCount: 1, // Dot
    avatarColor: '#4A90E2',
    avatarIcon: 'chatbox-ellipses',
  },
  {
    id: '3',
    type: 'group',
    title: '备战双①①',
    subtitle: '"momo" 加入了群聊',
    time: '11-01',
    unreadCount: 40,
    avatarColor: '#E8E8E8',
    avatarIcon: 'people',
  },
  {
    id: '4',
    type: 'user',
    title: '神泉本港壹号海鲜',
    subtitle: '要回去了',
    time: '10-28',
    unreadCount: 0,
    avatarColor: '#FFF',
    // Using a placeholder image or icon
  },
  {
    id: '5',
    type: 'system',
    title: '系统消息',
    subtitle: '小红书用户体验调查',
    time: '08-29',
    unreadCount: 0,
    avatarColor: '#4A90E2',
    avatarIcon: 'notifications',
  },
  {
    id: '6',
    type: 'user',
    title: '租房优选 | 阿才 CH',
    subtitle: '你好，看房请看左下角房东联系方式',
    time: '08-12',
    unreadCount: 0,
    avatarColor: '#FF6B6B',
    avatarIcon: 'happy', // Frog placeholder
  },
  {
    id: '7',
    type: 'user',
    title: '必邦物业日记',
    subtitle: '[商家名片] 必邦物业日记',
    time: '08-12',
    unreadCount: 0,
    avatarColor: '#F4D03F',
    avatarIcon: 'person-circle', // Girl placeholder
  },
  {
    id: '8',
    type: 'user',
    title: '丫头好房分享',
    subtitle: 'g062729',
    time: '08-12',
    unreadCount: 0,
    avatarColor: '#D2B4DE',
    avatarIcon: 'person',
  },
];

// --- Components ---

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft} />
      <Text style={styles.headerTitle}>消息</Text>
      <TouchableOpacity style={styles.headerRight}>
        <Ionicons name="people-outline" size={20} color="#333" />
        <Text style={styles.headerRightText}>发现群聊</Text>
      </TouchableOpacity>
    </View>
  );
};

const ActionButton = ({ 
  icon, 
  color, 
  bgColor, 
  label 
}: { 
  icon: any, 
  color: string, 
  bgColor: string, 
  label: string 
}) => (
  <TouchableOpacity style={styles.actionButton}>
    <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
      {icon}
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const ActionRow = () => {
  return (
    <View style={styles.actionRowContainer}>
      <ActionButton 
        icon={<MaterialCommunityIcons name="heart" size={28} color="#FF2442" />}
        color="#FF2442"
        bgColor="#FFEBEE"
        label="赞和收藏"
      />
      <ActionButton 
        icon={<Ionicons name="person" size={28} color="#007AFF" />}
        color="#007AFF"
        bgColor="#E3F2FD"
        label="新增关注"
      />
      <ActionButton 
        icon={<Ionicons name="chatbubble-ellipses" size={28} color="#2ECC71" />}
        color="#2ECC71"
        bgColor="#E8F5E9"
        label="评论和@"
      />
    </View>
  );
};

const Avatar = ({ item }: { item: MessageItemData }) => {
  // Custom rendering based on type/mock data
  if (item.id === '1' || item.id === '3') {
     // Group Avatar Mock (Split)
     return (
       <View style={[styles.avatar, { backgroundColor: '#F0F0F0', overflow: 'hidden' }]}>
         <View style={{flexDirection: 'row', flexWrap: 'wrap', width: '100%', height: '100%'}}>
            <View style={{width: '50%', height: '50%', backgroundColor: '#ddd', borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#fff'}} />
            <View style={{width: '50%', height: '50%', backgroundColor: '#ccc', borderBottomWidth: 1, borderColor: '#fff'}} />
            <View style={{width: '50%', height: '50%', backgroundColor: '#bbb', borderRightWidth: 1, borderColor: '#fff'}} />
            <View style={{width: '50%', height: '50%', backgroundColor: '#aaa'}} />
         </View>
       </View>
     )
  }
  
  if (item.id === '4') {
      // Image avatar simulation
      return (
        <View style={[styles.avatar, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' }]}>
             <MaterialCommunityIcons name="fish" size={30} color="#333" />
        </View>
      )
  }

  return (
    <View style={[styles.avatar, { backgroundColor: item.avatarColor || '#eee', justifyContent: 'center', alignItems: 'center' }]}>
      <Ionicons name={item.avatarIcon as any || 'person'} size={28} color="#fff" />
    </View>
  );
};

const MessageItem = ({ item }: { item: MessageItemData }) => {
  return (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={styles.avatarContainer}>
        <Avatar item={item} />
        {item.unreadCount > 0 && (
          <View style={[styles.badge, item.unreadCount < 10 && styles.badgeSmall]}>
            <Text style={styles.badgeText}>
              {item.unreadCount > 99 ? '99+' : item.unreadCount}
            </Text>
          </View>
        )}
        {item.unreadCount === 1 && item.type === 'activity' && (
           <View style={styles.dotBadge} />
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            {item.type === 'group' && (
                <View style={styles.groupTag}>
                   <Text style={styles.groupTagText}>{item.unreadCount > 0 ? '3' : '2'}</Text> 
                </View>
            )}
          </View>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function MessagePage() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header />
      <FlatList
        data={MOCK_DATA}
        renderItem={({ item }) => <MessageItem item={item} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={<ActionRow />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Header
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 0, // No border in design
  },
  headerLeft: {
    width: 80, // Balancing right side
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'flex-end',
  },
  headerRightText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    fontWeight: '500',
  },
  // Action Row
  actionRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  // List Item
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    height: 76,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: '#FF2442',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeSmall: {
     // smaller badge style if needed
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dotBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#FF2442',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginRight: 6,
  },
  groupTag: {
    backgroundColor: '#A8B0C3',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 4,
  },
  groupTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
});
