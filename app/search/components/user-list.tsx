import React, { useState } from "react"
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"

interface UserItem {
  id: string
  name: string
  fans: number
  redId: string
  avatar: string
  isFollowed: boolean
}

const MOCK_USERS: UserItem[] = [
  { id: "1", name: "DAQI.", fans: 10, redId: "362713740", avatar: "https://picsum.photos/seed/u1/80/80", isFollowed: true },
  { id: "2", name: "DAQI大琪.", fans: 5700, redId: "268528417", avatar: "https://picsum.photos/seed/u2/80/80", isFollowed: false },
  { id: "3", name: "Daqi（预备退休版）", fans: 1049, redId: "573641306", avatar: "https://picsum.photos/seed/u3/80/80", isFollowed: false },
  { id: "4", name: "Daqi", fans: 12, redId: "567937825", avatar: "https://picsum.photos/seed/u4/80/80", isFollowed: false },
  { id: "5", name: "DAQI", fans: 695, redId: "501729687", avatar: "https://picsum.photos/seed/u5/80/80", isFollowed: false },
  { id: "6", name: "Daqi", fans: 15, redId: "101819528", avatar: "https://picsum.photos/seed/u6/80/80", isFollowed: false },
  { id: "7", name: "daqi", fans: 20, redId: "487009476", avatar: "https://picsum.photos/seed/u7/80/80", isFollowed: false },
]

export default function UserList() {
  const router = useRouter()
  const [users, setUsers] = useState<UserItem[]>(MOCK_USERS)

  const toggleFollow = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isFollowed: !u.isFollowed } : u)))
  }

  const renderItem = ({ item }: { item: UserItem }) => (
    <TouchableOpacity style={styles.item} onPress={() => router.push({ pathname: "/user/[id]", params: { id: item.id, name: item.name, redId: item.redId, fans: String(item.fans), avatar: item.avatar } })}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.meta}>粉丝 {item.fans}</Text>
        <Text style={styles.meta}>小红书号：{item.redId}</Text>
      </View>
      <TouchableOpacity
        style={[styles.followBtn, item.isFollowed ? styles.followedBtn : styles.unfollowedBtn]}
        onPress={() => toggleFollow(item.id)}
      >
        <Text style={[styles.followText, item.isFollowed ? styles.followedText : styles.unfollowedText]}>
          {item.isFollowed ? "已关注" : "关注"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={styles.listContent}
    />
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  separator: {
    height: 1,
    backgroundColor: "#f2f2f2",
    marginLeft: 72,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#eee",
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  followBtn: {
    height: 30,
    paddingHorizontal: 16,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 72,
  },
  unfollowedBtn: {
    borderColor: "#ff2442",
    backgroundColor: "#fff",
  },
  followedBtn: {
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  followText: {
    fontSize: 14,
    fontWeight: "500",
  },
  unfollowedText: {
    color: "#ff2442",
  },
  followedText: {
    color: "#999",
  },
})

