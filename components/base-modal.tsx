import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  showCloseButton?: boolean;
  height?: 'auto' | 'half' | 'full' | number;
  children: React.ReactNode;
  style?: any;
}

const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  title,
  showCloseButton = true,
  height = 'auto',
  children,
  style,
}) => {
  const getModalHeight = () => {
    switch (height) {
      case 'half':
        return '50%';
      case 'full':
        return '90%';
      case 'auto':
        return 'auto';
      default:
        return height;
    }
  };

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
        <TouchableOpacity 
          activeOpacity={1} 
          style={[
            styles.modalContent, 
            { height: getModalHeight() },
            style
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {title && (
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              {showCloseButton && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              )}
            </View>
          )}
          
          <View style={styles.content}>
            {children}
          </View>
        </TouchableOpacity>
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
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default BaseModal;