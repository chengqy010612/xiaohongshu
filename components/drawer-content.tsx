import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native"
import { IconSymbol } from "@/components/ui/icon-symbol"
import { useRouter } from "expo-router"
import { Card } from "react-native-paper"
import Cell from "./cell/cell"
import CellItem from "./cell/cell-item"
import { Grid } from "@ant-design/react-native"

interface DrawerContentProps {
  navigation: any
}

export const DrawerContent: React.FC<DrawerContentProps> = ({ navigation }) => {
  const router = useRouter()

  const menuItems = [
    {
      id: "1",
      title: "发现好友",
      icon: "person-add",
      route: "/friends",
      showBottomBorder: true,
    },
    {
      id: "2",
      title: "创作者中心",
      icon: "video-call",
      route: "/creator",
      showBottomBorder: true,
    },
    { id: "3", title: "我的草稿", icon: "drafts", route: "/drafts" },
    { id: "4", title: "我的评论", icon: "comment", route: "/comments" },
    { id: "5", title: "浏览记录", icon: "history", route: "/history" },
    {
      id: "6",
      title: "我的下载",
      icon: "file-download",
      route: "/downloads",
      showBottomBorder: true,
    },
    { id: "7", title: "订单", icon: "receipt-long", route: "/orders" },
    { id: "8", title: "购物车", icon: "shopping-cart", route: "/cart" },
    {
      id: "9",
      title: "钱包",
      icon: "account-balance-wallet",
      route: "/wallet",
      showBottomBorder: true,
    },
    {
      id: "10",
      title: "小程序",
      icon: "widgets",
      route: "/mini-programs",
      showBottomBorder: true,
    },
    { id: "11", title: "社区公约", icon: "gavel", route: "/community-rules" },
  ]

  return (
    <View style={styles.container}>
      {/* 用户信息区域 */}
      <View style={styles.userInfo}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.avatar}
        />
        <Text style={styles.username}>小红书用户</Text>
      </View>

      {/* 菜单项列表 */}
      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              item.showBottomBorder && styles.menuItemBottomBorder,
            ]}
            onPress={() => {
              router.push(item.route)
              navigation.closeDrawer()
            }}
          >
            <IconSymbol name={item.icon} size={24} color="#333" />
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
        <Grid
          data={[
            {
              icon: (
                <Image
                  source={require("@/assets/images/icon.png")}
                  style={{ width: 30, height: 30 }}
                />
              ),
              text: `扫一扫`,
            },
            {
               icon: (
                <Image
                  source={require("@/assets/images/icon.png")}
                  style={{ width: 30, height: 30 }}
                />
              ),
              text: `帮助与客服`,
            },
            {
              icon: (
                <Image
                  source={require("@/assets/images/icon.png")}
                  style={{ width: 30, height: 30 }}
                />
              ),
              text: `设置`,
            },
          ]}
          columnNum={3}
          isCarousel
          hasLine={false}
          carouselProps={{
            style: {
              width: "100%",
            },
          }}
          onPress={(_el: any, index: any) => alert(index)}
        />
        {/* 底部区域 */}
        {/* <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <IconSymbol name="logout" size={24} color="#333" />
          <Text style={styles.footerText}>退出登录</Text>
        </TouchableOpacity>
      </View> */}
        {/* <Card>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              router.push("/(auth)/login")
              navigation.closeDrawer()
            }}
          >
            <IconSymbol name="logout" size={24} color="#333" />
            <Text style={styles.menuText}>退出登录</Text>
          </TouchableOpacity>
          <Cell>
            <CellItem title={"标题"} url={"/"}></CellItem>
            <CellItem title={"标题"} url={"/"}></CellItem>
            <CellItem title={"标题"} url={"/"}></CellItem>
          </Cell>
           <Cell>
            <CellItem title={"标题"} url={"/"}></CellItem>
            <CellItem title={"标题"} url={"/"}></CellItem>
            <CellItem title={"标题"} url={"/"}></CellItem>
          </Cell>
        </Card> */}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  // 菜单列表容器
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  menuItemBottomBorder: {
    marginBottom: 10,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingVertical: 10,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  footerText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
})
