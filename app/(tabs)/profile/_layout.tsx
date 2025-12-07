import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const THEME_COLOR = '#FF2442'; // Xiaohongshu Red
const BG_COLOR = '#121212'; // Dark Background
const CARD_BG_COLOR = '#262626'; // Dark Card Background
const TEXT_COLOR = '#FFFFFF';
const SECONDARY_TEXT_COLOR = '#999999';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('notes');

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity>
        <Ionicons name="menu-outline" size={28} color={TEXT_COLOR} />
      </TouchableOpacity>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.bgButton}>
          <Ionicons name="image-outline" size={16} color={TEXT_COLOR} style={{ marginRight: 4 }} />
          <Text style={styles.bgButtonText}>设置背景</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 16 }}>
          <Ionicons name="scan-outline" size={24} color={TEXT_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 16 }}>
          <Ionicons name="share-outline" size={24} color={TEXT_COLOR} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUserInfo = () => (
    <View style={styles.userInfoContainer}>
      <View style={styles.avatarRow}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://ui-avatars.com/api/?name=CC&background=FF2442&color=fff&size=128' }} 
            style={styles.avatar} 
          />
          <View style={styles.addIconContainer}>
            <Ionicons name="add" size={12} color="#000" />
          </View>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>CC</Text>
          <View style={styles.idRow}>
            <Text style={styles.userId}>小红书号：1062787524</Text>
            <Ionicons name="qr-code-outline" size={14} color={SECONDARY_TEXT_COLOR} style={{ marginLeft: 4 }} />
          </View>
        </View>
      </View>

      <Text style={styles.bio}>点击这里，填写简介</Text>
      
      <View style={styles.tagContainer}>
        <View style={styles.genderTag}>
          <Ionicons name="male" size={10} color="#6596D6" />
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>关注</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>粉丝</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>获赞与收藏</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>编辑资料</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingButton}>
            <Ionicons name="settings-outline" size={20} color={TEXT_COLOR} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsScroll}>
      <View style={styles.quickActionCard}>
        <Text style={styles.quickActionTitle}>订单</Text>
        <Text style={styles.quickActionDesc}>查看我的订单</Text>
      </View>
      <View style={styles.quickActionCard}>
        <Text style={styles.quickActionTitle}>购物车</Text>
        <Text style={styles.quickActionDesc}>查看推荐好物</Text>
      </View>
      <View style={styles.quickActionCard}>
        <Text style={styles.quickActionTitle}>创作灵感</Text>
        <Text style={styles.quickActionDesc}>学创作找灵感</Text>
      </View>
      <View style={styles.quickActionCard}>
        <Text style={styles.quickActionTitle}>浏览记录</Text>
        <Text style={styles.quickActionDesc}>看过的笔记</Text>
      </View>
    </ScrollView>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tabItem, activeTab === 'notes' && styles.activeTabItem]}
        onPress={() => setActiveTab('notes')}
      >
        <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>笔记</Text>
        {activeTab === 'notes' && <View style={styles.activeTabLine} />}
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tabItem, activeTab === 'favorites' && styles.activeTabItem]}
        onPress={() => setActiveTab('favorites')}
      >
        <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>收藏</Text>
        {activeTab === 'favorites' && <View style={styles.activeTabLine} />}
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tabItem, activeTab === 'liked' && styles.activeTabItem]}
        onPress={() => setActiveTab('liked')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="lock-closed-outline" size={14} color={activeTab === 'liked' ? '#333' : '#999'} style={{ marginRight: 4 }} />
            <Text style={[styles.tabText, activeTab === 'liked' && styles.activeTabText]}>赞过</Text>
        </View>
        {activeTab === 'liked' && <View style={styles.activeTabLine} />}
      </TouchableOpacity>
      <View style={{ flex: 1 }} />
      <TouchableOpacity style={styles.searchIcon}>
        <Ionicons name="search-outline" size={20} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderSubTabs = () => {
    if (activeTab === 'notes') {
      return (
        <View style={styles.subTabContainer}>
            <Text style={styles.subTabTextActive}>公开 0</Text>
            <View style={styles.subTabItem}>
                <Ionicons name="lock-closed-outline" size={12} color="#999" />
                <Text style={styles.subTabText}>私密 0</Text>
            </View>
             <Text style={styles.subTabText}>合集 0</Text>
        </View>
      );
    }
    return null;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyImageContainer}>
         <Ionicons name="images-outline" size={64} color="#ddd" />
      </View>
      <Text style={styles.emptyStateText}>发笔记问问大家~</Text>
      <TouchableOpacity style={styles.publishButton}>
        <Text style={styles.publishButtonText}>去发布</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={BG_COLOR} />
      <ScrollView 
        stickyHeaderIndices={[3]} // The Tabs component index
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {renderUserInfo()}
        {renderQuickActions()}
        {renderTabs()}
        <View style={styles.contentContainer}>
            {renderSubTabs()}
            {renderEmptyState()}
        </View>
        {/* Extra padding for bottom tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bgButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  bgButtonText: {
    color: TEXT_COLOR,
    fontSize: 12,
    fontWeight: '500',
  },
  userInfoContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: BG_COLOR,
  },
  addIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFD700', // Yellow badge
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: BG_COLOR,
  },
  nameContainer: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  userName: {
    color: TEXT_COLOR,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userId: {
    color: SECONDARY_TEXT_COLOR,
    fontSize: 12,
  },
  bio: {
    color: TEXT_COLOR,
    fontSize: 14,
    marginTop: 12,
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  genderTag: {
    backgroundColor: 'rgba(101, 150, 214, 0.2)', // Light blue bg
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    marginRight: 24,
  },
  statNumber: {
    color: TEXT_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: SECONDARY_TEXT_COLOR,
    fontSize: 12,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  editButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  editButtonText: {
    color: TEXT_COLOR,
    fontSize: 14,
    fontWeight: '500',
  },
  settingButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  quickActionsScroll: {
    paddingLeft: 16,
    marginBottom: 20,
  },
  quickActionCard: {
    backgroundColor: CARD_BG_COLOR,
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    width: 100,
    height: 60,
    justifyContent: 'center',
  },
  quickActionTitle: {
    color: TEXT_COLOR,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  quickActionDesc: {
    color: SECONDARY_TEXT_COLOR,
    fontSize: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Changed to White
    paddingHorizontal: 16,
    height: 48,
    borderTopLeftRadius: 16, // Rounded top corners
    borderTopRightRadius: 16,
  },
  tabItem: {
    marginRight: 24,
    height: 48,
    justifyContent: 'center',
    position: 'relative',
  },
  activeTabItem: {
    
  },
  tabText: {
    color: '#999', // Default grey
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#333', // Active dark
    fontWeight: 'bold',
  },
  activeTabLine: {
    position: 'absolute',
    bottom: 0,
    left: '25%', // Centered relative to text width roughly
    width: '50%',
    height: 2,
    backgroundColor: THEME_COLOR,
    borderRadius: 1,
  },
  searchIcon: {
    padding: 4,
  },
  contentContainer: {
    minHeight: 500, // Ensure enough height
    backgroundColor: '#fff', 
    paddingTop: 16,
  },
  subTabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  subTabText: {
    color: '#999',
    fontSize: 14,
    marginRight: 20,
  },
  subTabTextActive: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 20,
  },
  subTabItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyImageContainer: {
    marginBottom: 16,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 20,
  },
  publishButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  publishButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
});
