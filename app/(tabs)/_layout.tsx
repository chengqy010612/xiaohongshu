import { Redirect, Tabs, useRouter } from "expo-router"
import React from "react"
import { Text, View, Alert } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as ImagePicker from 'expo-image-picker'

import { HapticTab } from "@/components/haptic-tab"
import { IconSymbol } from "@/components/ui/icon-symbol"
import { Colors } from "@/constants/theme"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { loadAsync, useFonts } from "expo-font"
import { ActionSheet } from "@ant-design/react-native"

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  
  // 请求媒体库权限
  const requestMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('权限请求', '需要访问相册权限才能选择图片');
      return false;
    }
    return true;
  };
  
  // 请求相机权限
  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('权限请求', '需要相机权限才能拍照');
      return false;
    }
    return true;
  };
  
  // 从相册选择图片
  const pickImage = async () => {
    const hasPermission = await requestMediaLibraryPermissions();
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // 导航到创建页面并传递选中的图片
        router.push({
          pathname: '/(tabs)/create',
          params: { imageUri: result.assets[0].uri, type: 'image' }
        });
      }
    } catch (error) {
      Alert.alert('错误', '选择图片时发生错误');
      console.error('Error picking image:', error);
    }
  };
  
  // 使用相机拍照
  const takePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // 导航到创建页面并传递拍摄的照片
        router.push({
          pathname: '/(tabs)/create',
          params: { imageUri: result.assets[0].uri, type: 'photo' }
        });
      }
    } catch (error) {
      Alert.alert('错误', '拍照时发生错误');
      console.error('Error taking photo:', error);
    }
  };
  
  // 写文字
  const writeText = () => {
    // 导航到创建页面并传递文本类型
    router.push({
      pathname: '/(tabs)/create',
      params: { type: 'text' }
    });
  };
  
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
          height: 80 + insets.bottom,
          paddingBottom: 10 + insets.bottom,
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
                    pickImage()
                    break
                  case 1:
                    // 相机
                    takePhoto()
                    break
                  case 2:
                    // 写文字
                    writeText()
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
          tabBarBadge: 71,
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
