import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native"
import { Stack, useRouter } from "expo-router"
import { IconSymbol } from "@/components/ui/icon-symbol" // Assuming this component works with MaterialIcons names
import { PageContainer } from "@/components/page-container"
import  SearchHeader  from "./components/search-header"

const HISTORY_TAGS = [
  "王梓薇",
  "怎样把老公的钱搞到手",
  "小奶狗",
  "DAQI",
  "DAQI .",
  "包",
  "ai生成图片",
  "清湖北",
  "如何让老公相信儿子...",
  "创业项目女生",
  "创业",
  "火车查看座位位置",
  "中性洗洁精",
  "洗镜片",
  "游戏手柄国补",
  "国补",
  "深圳国补",
  "拼多度国补怎么领",
]

const GUESS_ITEMS = [
  "张子枫王梓薇",
  "陈震偷税案件细节公布",
  "怎么把老公当挣钱工具",
  "姐妹们能接受黑人么",
  "爸爸的葬礼和漫展撞了",
  "清湖北一房一厅",
]

const HOT_ITEMS = [
  { rank: 1, title: "皮蛋小酥肉", views: "926万", badge: null },
  { rank: 2, title: "马克龙来四川大学了", views: "853.7万", badge: "新" },
  { rank: 3, title: "用双重曝光拍下了人生拍立得", views: "712万", badge: null },
  {
    rank: 4,
    title: "甘蔗主理人：真挺想你们的",
    views: "689.5万",
    badge: "独家",
  },
  { rank: 5, title: "挑战怪奇物语威尔仿妆", views: "680万", badge: "热" },
  {
    rank: 6,
    title: "发明雪地爱心拍照的是个天才",
    views: "636.4万",
    badge: "热",
  },
  { rank: 7, title: "肠包蛋爷爷奶奶摆摊圣体", views: "611.6万", badge: "热" },
  { rank: 8, title: "跟疯狂动物城学穿搭", views: "600.2万", badge: "热" },
  { rank: 9, title: "我为一棵树拨打了12345", views: "591.2万", badge: null },
  { rank: 10, title: "老己想吃就吃", views: "589.4万", badge: "梗" },
  { rank: 11, title: "陈震偷税案件细节公布", views: "587.6万", badge: "新" },
]

export default function SearchScreen() {
  const router = useRouter()
  const [searchText, setSearchText] = useState("")
  const [historyExpanded, setHistoryExpanded] = useState(false)

  // Display limited history tags initially
  const displayedHistoryTags = historyExpanded
    ? HISTORY_TAGS
    : HISTORY_TAGS.slice(0, 10)

  const getBadgeColor = (badge: string | null) => {
    switch (badge) {
      case "新":
        return "#FFB800" // Yellowish/Orange
      case "独家":
        return "#FF6600" // Orange
      case "热":
        return "#FF2442" // Red
      case "爆":
        return "#8B0000" // Dark Red
      case "梗":
        return "#FFB800"
      default:
        return "#999"
    }
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#FF2442"
    if (rank === 2) return "#FF6600"
    if (rank === 3) return "#FFB800"
    return "#999"
  }

  return (
    <PageContainer style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <SearchHeader searchText={searchText} setSearchText={setSearchText} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>历史记录</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>全部删除</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>完成</Text>
              </TouchableOpacity>
              {/* Trash icon can replace text if needed, sticking to text/layout from screenshot */}
            </View>
          </View>

          <View style={styles.tagsContainer}>
            {displayedHistoryTags.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
            {!historyExpanded && HISTORY_TAGS.length > 10 && (
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => setHistoryExpanded(true)}
              >
                <IconSymbol name="keyboard-arrow-down" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Guess You Want Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>猜你想搜</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <IconSymbol name="refresh" size={18} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                {/* Eye hidden icon approximation */}
                <IconSymbol name="visibility-off" size={18} color="#999" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.guessContainer}>
            {GUESS_ITEMS.map((item, index) => (
              <TouchableOpacity key={index} style={styles.guessItem}>
                <Text style={styles.guessText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Hot Spots Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.hotHeaderLeft}>
              <IconSymbol
                name="local-fire-department"
                size={20}
                color="#FF2442"
              />
              <Text style={[styles.sectionTitle, styles.hotTitle]}>
                小红书热点
              </Text>
            </View>
          </View>

          <View style={styles.hotList}>
            {HOT_ITEMS.map((item, index) => (
              <TouchableOpacity key={index} style={styles.hotItem}>
                <Text style={[styles.rank, { color: getRankColor(item.rank) }]}>
                  {item.rank}
                </Text>
                <Text style={styles.hotItemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                {item.badge && (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: getBadgeColor(item.badge) },
                    ]}
                  >
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <Text style={styles.views}>{item.views}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </PageContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    paddingHorizontal: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#999",
  },
  divider: {
    width: 1,
    height: 10,
    backgroundColor: "#ddd",
    marginHorizontal: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: "#333",
  },
  expandButton: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 12,
  },
  guessContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  guessItem: {
    width: "48%",
    marginBottom: 12,
  },
  guessText: {
    fontSize: 14,
    color: "#333",
  },
  hotHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  hotTitle: {
    marginLeft: 4,
    color: "#FF2442",
    fontSize: 16,
  },
  hotList: {
    marginTop: 4,
  },
  hotItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  rank: {
    width: 20,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
    textAlign: "center",
  },
  hotItemTitle: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  badge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  badgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  views: {
    fontSize: 12,
    color: "#999",
  },
})
