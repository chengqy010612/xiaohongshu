import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  Platform,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Modal,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionSheet } from '@ant-design/react-native';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

// Mock data for multiple images
const POST_IMAGES = [
  { type: 'component', id: '1' }, // The text-based image from the design
  { type: 'image', uri: 'https://picsum.photos/id/20/600/800', id: '2' },
  { type: 'image', uri: 'https://picsum.photos/id/36/600/800', id: '3' },
];

// Mock data for Share Modal
const SHARE_CONTACTS = [
  { name: '青禾锦年', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=1' },
  { name: '神泉本港壹号海鲜', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=2' },
  { name: '丫头好房分享', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=3' },
  { name: '静静霜烦恼', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=4' },
];

const SHARE_APPS = [
  { name: '私信好友', icon: 'chatbubble-ellipses', color: '#ff2442', type: 'ionicon' },
  { name: '微信好友', icon: 'wechat', color: '#07c160', type: 'material' },
  { name: '朋友圈', icon: 'camera-iris', color: '#07c160', type: 'material' },
  { name: 'QQ好友', icon: 'qqchat', color: '#00a4ff', type: 'ant' },
  { name: 'QQ空间', icon: 'star', color: '#f6c000', type: 'ant' },
];

const SHARE_ACTIONS = [
  { name: '建群分享', icon: 'account-group-outline', type: 'material' },
  { name: '生成分享图', icon: 'image-outline', type: 'ionicon' },
  { name: '复制链接', icon: 'link', type: 'feather' },
  { name: '为ta加热', icon: 'fire', type: 'material' },
  { name: '不喜欢', icon: 'sentiment-dissatisfied', type: 'material' },
];

export default function PostDetailScreen() {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isStared, setIsStared] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [sortOrder, setSortOrder] = useState('latest'); // 'latest' or 'hot'
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);
  
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveSlide(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  const handleSortComments = () => {
    const options = ['按热度排序', '按时间排序', '取消'];
    ActionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 2,
        title: '评论排序',
      },
      (buttonIndex: any) => {
        if (buttonIndex === 0) {
          setSortOrder('hot');
        } else if (buttonIndex === 1) {
          setSortOrder('latest');
        }
      }
    );
  };

  const openCommentInput = () => {
    setShowCommentInput(true);
    // Use timeout to wait for modal to show before focusing
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSend = () => {
    console.log('Sending comment:', commentText, 'Image:', selectedImage);
    setCommentText('');
    setSelectedImage(null);
    setShowCommentInput(false);
  };

  const renderImageItem = ({ item, index }: { item: any, index: number }) => {
    if (item.type === 'component') {
      return (
        <View style={[styles.imageContainer, { width }]}>
          <View style={styles.postImagePlaceholder}>
             <Text style={styles.imageTextMain}>姐妹们，能</Text>
             <Text style={styles.imageTextMain}>接受陪男生</Text>
             <Text style={styles.imageTextMain}>吃苦么🥵</Text>
          </View>
        </View>
      );
    }
    return (
      <View style={[styles.imageContainer, { width }]}>
        <Image source={{ uri: item.uri }} style={styles.postImage} resizeMode="cover" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          <Image 
            source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Felix' }} 
            style={styles.headerAvatar} 
          />
          <Text style={styles.headerUsername}>rygff</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>关注</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={() => setShowShareModal(true)}>
            <Ionicons name="share-social-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Post Images Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={POST_IMAGES}
            renderItem={renderImageItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            scrollEventThrottle={16}
          />
          
          {/* Image Counter Badge (Top Right) */}
          <View style={styles.imageCounterBadge}>
            <Text style={styles.imageCounterText}>{activeSlide + 1}/{POST_IMAGES.length}</Text>
          </View>
          
          {/* Pagination Dots (Bottom Center) */}
          <View style={styles.paginationContainer}>
            {POST_IMAGES.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.paginationDot, 
                  activeSlide === index ? styles.paginationDotActive : styles.paginationDotInactive
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Post Content */}
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>姐妹们，能接受陪男生吃苦吗..</Text>
          <Text style={styles.postDescription}>
            姐妹们，能接受陪男生吃苦吗..#现在的男朋友 #与异性的分寸感 #男生的心理和思维 #恋爱观
          </Text>
          <View style={styles.postMeta}>
            <Text style={styles.dateLocation}>今天 15:23 上海</Text>
            <TouchableOpacity style={styles.notInterested}>
               <Ionicons name="close-circle-outline" size={16} color="#999" />
               <Text style={styles.notInterestedText}>不喜欢</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <TouchableOpacity style={styles.commentsHeader} onPress={handleSortComments}>
            <Text style={styles.commentsCount}>共 99 条评论</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>
          
          {/* Comment Input Placeholder in List */}
          <TouchableOpacity style={styles.commentInputRow} onPress={openCommentInput}>
            <View style={styles.avatarContainer}>
               <Image source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=User' }} style={styles.userAvatar} />
            </View>
            <View style={styles.commentInputPlaceholder}>
              <Text style={styles.placeholderText}>爱评论的人运气都不差</Text>
            </View>
            <View style={styles.commentInputIcons}>
              <Text style={styles.inputIcon}>@</Text>
              <Feather name="smile" size={20} color="#666" style={styles.iconSpacing} />
              <Feather name="image" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          {/* Comment List */}
          <CommentItem 
            avatar="https://api.dicebear.com/7.x/avataaars/png?seed=Lily"
            name="浪花"
            content="什么叫陪男生吃苦 除非你自己是千金小姐 如果是普通人或者穷人自己也有很多苦要吃的"
            time="4小时前 贵州"
            likes={99}
            replies={[
              {
                name: "浪花",
                content: "真的很烦这句话",
                time: "4小时前 贵州",
                likes: 43
              }
            ]}
            replyCount={17}
          />
          
          <CommentItem 
            avatar="https://api.dicebear.com/7.x/avataaars/png?seed=Jack"
            name="jjjjj"
            content="各位，我女朋友美不🍑"
            time="1小时前 江西"
            likes={1}
            images={[
               "https://picsum.photos/id/10/200/200",
               "https://picsum.photos/id/11/200/200",
               "https://picsum.photos/id/12/200/200",
               "https://picsum.photos/id/13/200/200"
            ]}
            replies={[
              {
                name: "天地壹号",
                content: "怎么看上你的",
                time: "1小时前 江西",
                likes: 3
              }
            ]}
            replyCount={5}
          />

           <CommentItem 
            avatar="https://api.dicebear.com/7.x/avataaars/png?seed=Rose"
            name="染个面包"
            content="他可以直接入赘我家呀，就不用吃一点苦了"
            time="16分钟前 重庆"
            likes={0}
          />
          
           {/* Padding for bottom bar */}
           <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomInputContainer} onPress={openCommentInput}>
          <Feather name="edit-2" size={16} color="#666" style={{ marginRight: 8 }} />
          <Text style={styles.bottomInputText}>说点什么...</Text>
        </TouchableOpacity>
        
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setIsLiked(!isLiked)}>
            <AntDesign name={isLiked ? "heart" : "hearto"} size={24} color={isLiked ? "#ff2442" : "#333"} />
            <Text style={styles.actionText}>5</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => setIsStared(!isStared)}>
            <AntDesign name={isStared ? "star" : "staro"} size={24} color={isStared ? "#fadb14" : "#333"} />
            <Text style={styles.actionText}>3</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#333" />
            <Text style={styles.actionText}>99</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowShareModal(false)}
        >
          <View style={styles.shareModalContent}>
            <View style={styles.shareHeader}>
              <Text style={styles.shareTitle}>分享至</Text>
              <TouchableOpacity onPress={() => setShowShareModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Recent Contacts */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shareRow}>
              {SHARE_CONTACTS.map((contact, index) => (
                <TouchableOpacity key={index} style={styles.shareItem}>
                  <Image source={{ uri: contact.avatar }} style={styles.shareAvatar} />
                  <Text style={styles.shareName} numberOfLines={2}>{contact.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Apps */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shareRow}>
              {SHARE_APPS.map((app, index) => (
                <TouchableOpacity key={index} style={styles.shareItem}>
                  <View style={[styles.shareIconCircle, { backgroundColor: 'white' }]}>
                    {app.type === 'ionicon' && <Ionicons name={app.icon as any} size={28} color={app.color} />}
                    {app.type === 'material' && <MaterialCommunityIcons name={app.icon as any} size={28} color={app.color} />}
                    {app.type === 'ant' && <AntDesign name={app.icon as any} size={28} color={app.color} />}
                    {app.type === 'feather' && <Feather name={app.icon as any} size={28} color={app.color} />}
                  </View>
                  <Text style={styles.shareName}>{app.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Actions */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shareRow}>
              {SHARE_ACTIONS.map((action, index) => (
                <TouchableOpacity key={index} style={styles.shareItem}>
                  <View style={styles.shareActionCircle}>
                    {action.type === 'ionicon' && <Ionicons name={action.icon as any} size={24} color="#666" />}
                    {action.type === 'material' && <MaterialCommunityIcons name={action.icon as any} size={24} color="#666" />}
                    {action.type === 'feather' && <Feather name={action.icon as any} size={24} color="#666" />}
                  </View>
                  <Text style={styles.shareName}>{action.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={{ height: 20 }} />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Comment Input Modal */}
      <Modal
        visible={showCommentInput}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCommentInput(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCommentInput(false)}>
           <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.commentInputContainer}>
            <View style={styles.inputWrapper}>
              {selectedImage && (
                <View style={{ marginBottom: 10, position: 'relative', alignSelf: 'flex-start' }}>
                  <Image source={{ uri: selectedImage }} style={{ width: 100, height: 100, borderRadius: 8 }} />
                  <TouchableOpacity 
                    style={{ position: 'absolute', top: -8, right: -8, backgroundColor: '#fff', borderRadius: 10 }}
                    onPress={() => setSelectedImage(null)}
                  >
                    <AntDesign name="closecircle" size={20} color="#999" />
                  </TouchableOpacity>
                </View>
              )}
              <TextInput
                ref={inputRef}
                style={styles.realInput}
                placeholder="爱评论的人运气都不差"
                placeholderTextColor="#999"
                multiline
                value={commentText}
                onChangeText={setCommentText}
              />
            </View>
            
            <View style={styles.inputToolbar}>
              <View style={styles.toolbarLeft}>
                <TouchableOpacity style={styles.toolbarIcon}>
                  <Text style={styles.atSymbol}>@</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarIcon}>
                  <Feather name="smile" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarIcon} onPress={pickImage}>
                  <Feather name="image" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarIcon}>
                  <Feather name="mic" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarIcon}>
                  <AntDesign name="pluscircleo" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={[styles.sendButton, { backgroundColor: (commentText || selectedImage) ? '#ff2442' : '#f5f5f5' }]}
                disabled={!commentText && !selectedImage}
                onPress={handleSend}
              >
                <Text style={[styles.sendButtonText, { color: (commentText || selectedImage) ? '#fff' : '#999' }]}>发送</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// Helper Component for Comments
const CommentItem = ({ avatar, name, content, time, likes, replies = [], replyCount = 0, images = [] }: any) => (
  <View style={styles.commentItem}>
    <Image source={{ uri: avatar }} style={styles.commentAvatar} />
    <View style={styles.commentContent}>
      <Text style={styles.commentName}>{name}</Text>
      <Text style={styles.commentText}>{content}</Text>
      
      {images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.commentImages}>
          {images.map((img: string, index: number) => (
            <View key={index} style={styles.commentImageWrapper}>
               <Image source={{ uri: img }} style={styles.commentImage} />
               {index === images.length - 1 && (
                 <View style={styles.imageCountOverlay}>
                   <Text style={styles.imageCountText}>共4张</Text>
                 </View>
               )}
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.commentMeta}>
        <Text style={styles.metaText}>{time}  回复</Text>
        <View style={styles.likeContainer}>
          <AntDesign name="hearto" size={14} color="#999" />
          <Text style={styles.likeCount}>{likes > 0 ? likes : ''}</Text>
        </View>
      </View>
      
      {/* Replies */}
      {replies.map((reply: any, index: number) => (
        <View key={index} style={styles.replyItem}>
          <Image source={{ uri: avatar }} style={styles.replyAvatar} />
          <View style={styles.replyContent}>
            <Text style={styles.commentName}>{reply.name}</Text>
            <Text style={styles.commentText}>{reply.content}</Text>
            <View style={styles.commentMeta}>
              <Text style={styles.metaText}>{reply.time}  回复</Text>
              <View style={styles.likeContainer}>
                 <AntDesign name="hearto" size={14} color="#999" />
                 <Text style={styles.likeCount}>{reply.likes}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
      
      {replyCount > 0 && (
        <View style={styles.expandReplies}>
           <View style={styles.expandLine} />
           <Text style={styles.expandText}>展开 {replyCount} 条回复</Text>
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 50,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  headerUsername: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ff2442',
    marginRight: 12,
  },
  followButtonText: {
    color: '#ff2442',
    fontSize: 12,
    fontWeight: '600',
  },
  shareButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  carouselContainer: {
    position: 'relative',
  },
  imageContainer: {
    aspectRatio: 3/4, // Assuming portrait
    backgroundColor: '#ffffcc',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postImagePlaceholder: {
    padding: 20,
    alignItems: 'center',
  },
  imageTextMain: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#4a4a4a',
    textAlign: 'center',
  },
  imageCounterBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: '#ff2442',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paginationDotInactive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateLocation: {
    fontSize: 12,
    color: '#999',
  },
  notInterested: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  notInterestedText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 0,
  },
  commentsSection: {
    paddingBottom: 20,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  commentsCount: {
    fontSize: 14,
    color: '#333',
    marginRight: 4,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 12,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentInputPlaceholder: {
    flex: 1,
    height: 36,
    backgroundColor: '#f5f5f5',
    borderRadius: 18,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginRight: 12,
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  commentInputIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    fontSize: 20,
    color: '#666',
    marginRight: 16,
  },
  iconSpacing: {
    marginRight: 16,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentName: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  commentImages: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  commentImageWrapper: {
    marginRight: 8,
    position: 'relative',
  },
  commentImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  imageCountOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  imageCountText: {
    color: '#fff',
    fontSize: 10,
  },
  commentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#999',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  replyItem: {
    flexDirection: 'row',
    marginTop: 12,
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  expandReplies: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  expandLine: {
    width: 20,
    height: 1,
    backgroundColor: '#ddd',
    marginRight: 8,
  },
  expandText: {
    fontSize: 13,
    color: '#3370ff', // Link color
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60, // Increased height
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 0, // Adjust if needed for safe area, but SafeAreaView handles it
  },
  bottomInputContainer: {
    flex: 1,
    height: 36,
    backgroundColor: '#f5f5f5',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginRight: 20,
  },
  bottomInputText: {
    color: '#999',
    fontSize: 14,
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    fontWeight: '500',
  },
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
  keyboardAvoidingView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  commentInputContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  inputWrapper: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    minHeight: 80,
  },
  realInput: {
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 60,
  },
  inputToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolbarIcon: {
    marginRight: 20,
  },
  atSymbol: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
