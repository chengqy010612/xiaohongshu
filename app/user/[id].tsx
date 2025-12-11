import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, Stack, useRouter } from 'expo-router'
import WaterfallFlow from '@/components/waterfall-flow'
import { mockWaterfallData, WaterfallItem } from '@/data/mock-data'

const THEME_COLOR = '#FF2442'
const BG_COLOR = '#121212'
const TEXT_COLOR = '#FFFFFF'
const SECONDARY_TEXT_COLOR = '#999999'

export default function UserProfileScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ id: string; name?: string; redId?: string; fans?: string; avatar?: string }>()
  const [activeTab, setActiveTab] = useState<'notes'|'favorites'>('notes')

  const name = params.name || '小红书用户'
  const redId = params.redId || '000000000'
  const fans = params.fans || '0'
  const avatar = params.avatar || 'https://ui-avatars.com/api/?name=XHS&background=FF2442&color=fff&size=128'

  const handleItemPress = (item: WaterfallItem) => {
    router.push('/post-detail')
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor={BG_COLOR} />
      <ScrollView stickyHeaderIndices={[2]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={TEXT_COLOR} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.ellipsisBtn}>
              <Ionicons name="ellipsis-horizontal-outline" size={22} color={TEXT_COLOR} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.userInfoContainer}>
          <View style={styles.avatarRow}>
            <Image source={{ uri: avatar as string }} style={styles.avatar} />
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{name}</Text>
              <View style={styles.idRow}>
                <Text style={styles.userId}>小红书号：{redId}</Text>
                <Ionicons name="qr-code-outline" size={14} color={SECONDARY_TEXT_COLOR} style={{ marginLeft: 4 }} />
              </View>
              <Text style={styles.ipText}>IP属地：北京</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>90</Text>
              <Text style={styles.statLabel}>关注</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{fans}</Text>
              <Text style={styles.statLabel}>粉丝</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>589</Text>
              <Text style={styles.statLabel}>获赞与收藏</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>关注</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageButton}>
                <Text style={styles.messageButtonText}>私信</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tabItem, activeTab === 'notes' && styles.activeTabItem]} onPress={() => setActiveTab('notes')}>
            <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>笔记</Text>
            {activeTab === 'notes' && <View style={styles.activeTabLine} />}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabItem, activeTab === 'favorites' && styles.activeTabItem]} onPress={() => setActiveTab('favorites')}>
            <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>收藏</Text>
            {activeTab === 'favorites' && <View style={styles.activeTabLine} />}
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={{ padding: 4 }}>
            <Ionicons name="search-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {activeTab === 'notes' && (
            <WaterfallFlow data={mockWaterfallData} onItemPress={handleItemPress} />
          )}
          {activeTab === 'favorites' && (
            <WaterfallFlow data={mockWaterfallData.slice().reverse()} onItemPress={handleItemPress} />
          )}
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_COLOR },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  ellipsisBtn: { marginLeft: 12 },
  userInfoContainer: { paddingHorizontal: 16, marginTop: 10 },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  nameContainer: { marginLeft: 16, justifyContent: 'center' },
  userName: { color: TEXT_COLOR, fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  idRow: { flexDirection: 'row', alignItems: 'center' },
  userId: { color: SECONDARY_TEXT_COLOR, fontSize: 12 },
  ipText: { color: SECONDARY_TEXT_COLOR, fontSize: 12, marginTop: 4 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  statItem: { alignItems: 'center', marginRight: 24 },
  statNumber: { color: TEXT_COLOR, fontSize: 16, fontWeight: 'bold' },
  statLabel: { color: SECONDARY_TEXT_COLOR, fontSize: 12, marginTop: 2 },
  actionButtons: { flexDirection: 'row', marginLeft: 'auto' },
  followButton: { backgroundColor: THEME_COLOR, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginRight: 10 },
  followButtonText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  messageButton: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  messageButtonText: { color: TEXT_COLOR, fontSize: 14, fontWeight: '500' },
  tabContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, height: 48, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  tabItem: { marginRight: 24, height: 48, justifyContent: 'center', position: 'relative' },
  activeTabItem: {},
  tabText: { color: '#999', fontSize: 16, fontWeight: '500' },
  activeTabText: { color: '#333', fontWeight: 'bold' },
  activeTabLine: { position: 'absolute', bottom: 0, left: '25%', width: '50%', height: 2, backgroundColor: THEME_COLOR, borderRadius: 1 },
  contentContainer: { backgroundColor: '#fff', paddingTop: 16 },
})

