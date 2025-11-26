import { Redirect, Tabs } from "expo-router"
import React from "react"
import { Text, View } from "react-native"

import { HapticTab } from "@/components/haptic-tab"
import { IconSymbol } from "@/components/ui/icon-symbol"
import { Colors } from "@/constants/theme"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { loadAsync, useFonts } from "expo-font"
import { ActionSheet } from "@ant-design/react-native"

export default function TabLayout() {
  const colorScheme = useColorScheme()
  loadAsync({
    antoutline: require("@ant-design/icons-react-native/fonts/antoutline.ttf"),
  })
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarItemStyle: {
          padding: 5,
        },
      }}
    >
      {/* <Tabs.Screen 
        name="index" 
        options={{ 
          href: null, // <--- 这一行是关键，设置为 null 就会隐藏按钮
        }} 
      /> */}
      <Tabs.Screen
        name="home"
        options={{
          title: "首页",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="popular"
        options={{
          title: "热门",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="local-fire-department" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "",
          href: undefined,
          tabBarIcon: ({ color }) => (
            <View
              style={{
                width: 60,
                height: 50,
                borderRadius: 10,
                backgroundColor: Colors[colorScheme ?? "light"].tint,
                justifyContent: "center",
                alignItems: "center",
                // marginBottom: 25,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <IconSymbol size={35} name="add" color="#ffffff" />
            </View>
          ),
          tabBarItemStyle: {
            marginBottom: 15,
          },
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault() // 阻止默认的路由切换行为
            const BUTTONS = ["从相册选择", "相机", "写文字", "取消"]
            ActionSheet.showActionSheetWithOptions(
              {
                // title: "选择发布类型",
                // message: "请选择您要发布的内容类型",
                options: BUTTONS,
                cancelButtonIndex: 4,
                destructiveButtonIndex: 3,
              },
              (buttonIndex: any) => {
                // 这里可以根据选择的按钮执行不同的操作
                switch (buttonIndex) {
                  case 0:
                    // 从相册选择
                    break
                  case 1:
                    // 相机
                    break
                  case 2:
                    // 写文字
                    break
                  case 3:
                    // 取消
                    break
                }
              }
            )
          },
        })}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: "消息",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="message" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "我的",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
