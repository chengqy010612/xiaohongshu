import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  type ViewStyle,
  type StyleProp,
} from 'react-native';

export interface CustomDrawerProps {
  children: React.ReactNode;
  drawerContent: React.ReactNode;
  drawerWidth?: number;
  drawerBackgroundColor?: string;
  overlayColor?: string;
  animationDuration?: number;
  drawerStyle?: StyleProp<ViewStyle>;
  overlayStyle?: StyleProp<ViewStyle>;
}

export interface DrawerRef {
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const CustomDrawer = forwardRef<DrawerRef, CustomDrawerProps>(({
  children,
  drawerContent,
  drawerWidth = 300,
  drawerBackgroundColor = '#fff',
  overlayColor = 'rgba(0,0,0,0.5)',
  animationDuration = 300,
  drawerStyle,
  overlayStyle,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-drawerWidth)).current;

  const openDrawer = () => {
    setIsOpen(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  };

  const closeDrawer = () => {
    setIsOpen(false);
    Animated.timing(translateX, {
      toValue: -drawerWidth,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    openDrawer,
    closeDrawer,
  }));

  return (
    <View style={styles.container}>
      {/* 侧边栏 */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: drawerWidth,
            backgroundColor: drawerBackgroundColor,
            transform: [{ translateX }],
          },
          drawerStyle,
        ]}
      >
        {drawerContent}
      </Animated.View>

      {/* 遮罩层 */}
      {isOpen && (
        <TouchableOpacity
          style={[
            styles.overlay,
            {
              backgroundColor: overlayColor,
            },
            overlayStyle,
          ]}
          onPress={closeDrawer}
          activeOpacity={1}
        />
      )}

      {/* 主内容 */}
      <View style={styles.content}>{children}</View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  content: {
    flex: 1,
  },
});