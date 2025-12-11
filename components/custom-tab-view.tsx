import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

interface Route {
  key: string;
  title: string;
}

interface SceneMap {
  [key: string]: React.ComponentType<any>;
}

interface CustomTabViewProps {
  // routes: Route[];
  // scenes: SceneMap;
  data: Route[];
  renderAfter?: React.ReactNode;
  onAskPress?: () => void;
  askButtonText?: string;
  askButtonTextColor?: string;
  askButtonTextSize?: number;
  indicatorColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
  tabPaddingVertical?: number;
  extraSpaceWidth?: number;
}

const Tabs: React.FC<CustomTabViewProps> = ({
  // routes,
  // scenes,
  data,
  renderAfter,
  onAskPress,
  askButtonText = '问一问 ★',
  askButtonTextColor = '#3b82f6',
  askButtonTextSize = 14,
  indicatorColor = '#ff2442',
  activeColor = '#ff2442',
  inactiveColor = '#666',
  backgroundColor = '#fff',
  tabPaddingVertical = 8,
  extraSpaceWidth = 40,
}) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const dataMap = {}
  data.forEach((item) => {
     dataMap[item.key] = item.component
  })
  const renderScene = SceneMap(dataMap);

  const renderTabBar = (props: any) => (
    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor }}>
      <View style={{ flex: 1 }}>
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: indicatorColor, height: 2 }}
          style={{ backgroundColor }}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
          // indicatorContainerStyle={{ width: 10 }}
          tabStyle={{ paddingVertical: tabPaddingVertical }}
          // renderTabBarItem={ ({ route, ...rest }) => (
          //   <View style={{ alignItems: 'center' }}>
          //     <Text style={{ fontSize: 14,width: 40,textAlign: 'center' }}>{route.title}</Text>
          //   </View>
          // )}
        />
      </View>
      {renderAfter}
      {/* <View style={{ width: extraSpaceWidth }}></View>
      <TouchableOpacity style={{ paddingHorizontal: 12 }} onPress={onAskPress}>
        <Text style={{ color: askButtonTextColor, fontSize: askButtonTextSize }}>{askButtonText}</Text>
      </TouchableOpacity> */}
    </View>
  );

  return (
    <TabView
      navigationState={{ index, routes:data }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
};

export default Tabs;