import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons, AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// 定义数据类型
export interface ShareItem {
  id: string;
  name: string;
  avatar?: string;
  icon?: string;
  color?: string;
  type?: 'ionicon' | 'material' | 'ant' | 'feather';
  onPress?: () => void;
}

export interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  contacts?: ShareItem[];
  apps?: ShareItem[];
  actions?: ShareItem[];
  renderContact?: (item: ShareItem, index: number) => React.ReactNode;
  renderApp?: (item: ShareItem, index: number) => React.ReactNode;
  renderAction?: (item: ShareItem, index: number) => React.ReactNode;
  showContacts?: boolean;
  showApps?: boolean;
  showActions?: boolean;
}

// 默认数据
const DEFAULT_CONTACTS: ShareItem[] = [
  { id: '1', name: '青禾锦年', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=1' },
  { id: '2', name: '神泉本港壹号海鲜', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=2' },
  { id: '3', name: '丫头好房分享', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=3' },
  { id: '4', name: '静静霜烦恼', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=4' },
];

const DEFAULT_APPS: ShareItem[] = [
  { id: '1', name: '私信好友', icon: 'chatbubble-ellipses', color: '#ff2442', type: 'ionicon' },
  { id: '2', name: '微信好友', icon: 'wechat', color: '#07c160', type: 'material' },
  { id: '3', name: '朋友圈', icon: 'camera-iris', color: '#07c160', type: 'material' },
  { id: '4', name: 'QQ好友', icon: 'qqchat', color: '#00a4ff', type: 'ant' },
  { id: '5', name: 'QQ空间', icon: 'star', color: '#f6c000', type: 'ant' },
];

const DEFAULT_ACTIONS: ShareItem[] = [
  { id: '1', name: '建群分享', icon: 'account-group-outline', type: 'material' },
  { id: '2', name: '生成分享图', icon: 'image-outline', type: 'ionicon' },
  { id: '3', name: '复制链接', icon: 'link', type: 'feather' },
  { id: '4', name: '为ta加热', icon: 'fire', type: 'material' },
  { id: '5', name: '不喜欢', icon: 'sentiment-dissatisfied', type: 'material' },
];

const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  title = '分享至',
  contacts = DEFAULT_CONTACTS,
  apps = DEFAULT_APPS,
  actions = DEFAULT_ACTIONS,
  renderContact,
  renderApp,
  renderAction,
  showContacts = true,
  showApps = true,
  showActions = true,
}) => {
  // 默认渲染联系人
  const renderDefaultContact = (item: ShareItem, index: number) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.shareItem}
      onPress={() => {
        item.onPress?.();
        onClose();
      }}
    >
      <Image source={{ uri: item.avatar }} style={styles.shareAvatar} />
      <Text style={styles.shareName} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );

  // 默认渲染应用
  const renderDefaultApp = (item: ShareItem, index: number) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.shareItem}
      onPress={() => {
        item.onPress?.();
        onClose();
      }}
    >
      <View style={[styles.shareIconCircle, { backgroundColor: 'white' }]}>
        {item.type === 'ionicon' && <Ionicons name={item.icon as any} size={28} color={item.color} />}
        {item.type === 'material' && <MaterialCommunityIcons name={item.icon as any} size={28} color={item.color} />}
        {item.type === 'ant' && <AntDesign name={item.icon as any} size={28} color={item.color} />}
        {item.type === 'feather' && <Feather name={item.icon as any} size={28} color={item.color} />}
      </View>
      <Text style={styles.shareName}>{item.name}</Text>
    </TouchableOpacity>
  );

  // 默认渲染操作
  const renderDefaultAction = (item: ShareItem, index: number) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.shareItem}
      onPress={() => {
        item.onPress?.();
        onClose();
      }}
    >
      <View style={styles.shareActionCircle}>
        {item.type === 'ionicon' && <Ionicons name={item.icon as any} size={24} color="#666" />}
        {item.type === 'material' && <MaterialCommunityIcons name={item.icon as any} size={24} color="#666" />}
        {item.type === 'feather' && <Feather name={item.icon as any} size={24} color="#666" />}
      </View>
      <Text style={styles.shareName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.shareModalContent}>
          <View style={styles.shareHeader}>
            <Text style={styles.shareTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Recent Contacts */}
          {showContacts && contacts.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shareRow}>
              {contacts.map((contact, index) => 
                renderContact ? renderContact(contact, index) : renderDefaultContact(contact, index)
              )}
            </ScrollView>
          )}

          {/* Apps */}
          {showApps && apps.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shareRow}>
              {apps.map((app, index) => 
                renderApp ? renderApp(app, index) : renderDefaultApp(app, index)
              )}
            </ScrollView>
          )}

          {/* Actions */}
          {showActions && actions.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shareRow}>
              {actions.map((action, index) => 
                renderAction ? renderAction(action, index) : renderDefaultAction(action, index)
              )}
            </ScrollView>
          )}
          
          <View style={{ height: 20 }} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  shareModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 16,
  },
  shareHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    paddingHorizontal: 16,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  shareRow: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  shareItem: {
    alignItems: 'center',
    marginHorizontal: 12,
    width: 60,
  },
  shareAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  shareName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  shareIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    // Shadow for icons
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  shareActionCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default ShareModal;