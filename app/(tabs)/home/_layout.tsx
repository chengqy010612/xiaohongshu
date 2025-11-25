import * as React from "react"
import {
  View,
  Text,
  useWindowDimensions,
  StyleSheet,
  StyleProp,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native"
import { TabView, SceneMap, TabBar } from "react-native-tab-view"
import { PageContainer } from "@/components/page-container"
import { IconSymbol } from "@/components/ui/icon-symbol"
import { ScrollView as GestureHandlerScrollView } from "react-native-gesture-handler"
import { ActionSheet, Button } from "@ant-design/react-native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { useNavigation } from "@react-navigation/native"
import { DrawerContent } from "@/components/drawer-content"
import WaterfallFlow from "@/components/waterfall-flow"
import { mockWaterfallData, WaterfallItem } from "@/data/mock-data"
import { wait } from "@/utils"

const FirstRoute = ({ type }: { type: number }) => {
  const [refreshing, setRefreshing] = React.useState(false)
  const [loadingMore, setLoadingMore] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true)
  const [data, setData] = React.useState(mockWaterfallData)
  
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true)
    try {
      // 模拟刷新数据
      await wait(2000)
      // 这里可以重置数据或获取最新数据
      setData(mockWaterfallData)
      setHasMore(true)
    } finally {
      setRefreshing(false)
    }
  }, [])

  const onLoadMore = React.useCallback(async () => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    try {
      // 模拟加载更多数据
      await wait(1500)
      
      // 生成更多模拟数据
      const moreData = mockWaterfallData.map((item, index) => ({
        ...item,
        id: `${item.id}-more-${Date.now()}-${index}`,
        title: `${item.title} (更多)`,
        likes: item.likes + Math.floor(Math.random() * 1000),
      }))
      
      setData(prevData => [...prevData, ...moreData])
      
      // 模拟数据有限，加载3次后没有更多数据
      if (data.length > mockWaterfallData.length * 3) {
        setHasMore(false)
      }
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, data.length])

  const handleItemPress = (item: WaterfallItem) => {
    console.log("点击了项目:", item.title)
    // 这里可以添加导航到详情页的逻辑
  }

  return (
    <WaterfallFlow 
      data={data} 
      onItemPress={handleItemPress}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
      isRefreshing={refreshing}
      isLoadingMore={loadingMore}
      hasMore={hasMore}
    />
  )
}

// const SecondRoute = () => (
//   <View
//     style={{
//       flex: 1,
//       backgroundColor: "#673ab7",
//       alignItems: "center",
//       justifyContent: "center",
//     }}
//   >
//     <Text>发现页面</Text>
//   </View>
// )

// const ThirdRoute = () => (
//   <View
//     style={{
//       flex: 1,
//       backgroundColor: "#4caf50",
//       alignItems: "center",
//       justifyContent: "center",
//     }}
//   >
//     <Text>本地页面</Text>
//   </View>
// )

// 创建抽屉导航器
const Drawer = createDrawerNavigator()

// 创建包含TabView的主屏幕组件
const HomeScreen = () => {
  const layout = useWindowDimensions()
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: "first", title: <Text style={{ fontSize: 12 }}>关注</Text> },
    { key: "second", title: <Text style={{ fontSize: 12 }}>发现</Text> },
    { key: "third", title: <Text style={{ fontSize: 12 }}>本地</Text> },
  ])

  // 获取导航对象
  const navigation = useNavigation()

  return (
    <PageContainer>
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          first: (props) => FirstRoute({ ...props, type: 0 }),
          second: (props) => FirstRoute({ ...props, type: 1 }),
          third: (props) => FirstRoute({ ...props, type: 2 }),
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => {
          return (
            <View style={styles.tabBarContainer}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <IconSymbol
                  name="menu"
                  size={24}
                  color="white"
                  style={styles.sideIcon}
                />
              </TouchableOpacity>
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: "white" }}
                style={{ backgroundColor: "#2196f3", width: 200 }}
              />
              <IconSymbol
                name="search"
                size={24}
                color="white"
                style={styles.sideIcon}
              />
            </View>
          )
        }}
      />
    </PageContainer>
  )
}

export default function App() {
  const dimensions = useWindowDimensions()

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: dimensions.width >= 768 ? "permanent" : "front",
        headerShown: false,
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196f3",
    justifyContent: "space-between",
  },
  sideIcon: {
    paddingHorizontal: 15,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  labelIcon: {
    marginHorizontal: 4,
  },
})
