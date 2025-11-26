// 模拟数据用于瀑布流展示
export interface WaterfallItem {
  id: string;
  type: 'image' | 'video'; // 支持图片和视频
  image: string;
  videoUrl?: string; // 视频URL，仅在type为video时需要
  title: string;
  description: string;
  user: {
    name: string;
    avatar: string;
  };
  likes: number;
  comments?: number;
  height: number; // 图片高度，用于瀑布流布局
}

// 生成随机高度的函数
const getRandomHeight = () => Math.floor(Math.random() * 150) + 200; // 200-350之间的随机高度

// 生成随机点赞数
const getRandomLikes = () => Math.floor(Math.random() * 9000) + 1000; // 1000-10000之间的随机点赞数

// 模拟数据 - 支持图片和视频
export const mockWaterfallData: WaterfallItem[] = [
  // 图片内容
  {
    id: '1',
    type: 'image',
    image: 'https://picsum.photos/seed/1/400/600',
    title: '这是一个很长的标题，用来测试文本显示效果，看看会不会换行显示',
    user: {
      name: '小红书用户1',
      avatar: 'https://picsum.photos/seed/user1/100/100.jpg',
    },
    likes: 1234,
    height: 450,
  },
  {
    id: '2',
    type: 'video',
    image: 'https://picsum.photos/seed/video2/300/350.jpg',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    title: '自制甜品 | 免烤箱的芒果慕斯',
    description: '超级简单的芒果慕斯制作教程！不需要烤箱，新手也能轻松搞定。香甜的芒果配上丝滑的慕斯，入口即化的幸福感～',
    user: {
      name: '美食家小王',
      avatar: 'https://picsum.photos/seed/avatar2/100/100.jpg',
    },
    likes: 5678,
    comments: 456,
    height: 350,
  },
  {
    id: '3',
    type: 'video',
    image: 'https://picsum.photos/seed/video3/300/450.jpg',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    title: '周末游 | 郊外徒步感受大自然',
    description: '今天天气太好了，和朋友们一起去郊外徒步。空气清新，风景如画，这样的周末真是太治愈了！推荐几个小众徒步地点～',
    user: {
      name: '旅行爱好者',
      avatar: 'https://picsum.photos/seed/avatar3/100/100.jpg',
    },
    likes: 2345,
    comments: 189,
    height: 450,
  },
  // 图片内容
  {
    id: '4',
    type: 'image',
    image: 'https://picsum.photos/seed/home1/300/300.jpg',
    title: '家居改造 | 小空间大利用',
    description: '分享一些超实用的小空间收纳技巧，让你的家瞬间变得整洁有序！低成本改造，效果立竿见影～',
    user: {
      name: '生活小能手',
      avatar: 'https://picsum.photos/seed/avatar4/100/100.jpg',
    },
    likes: 4567,
    comments: 345,
    height: 300,
  },
  {
    id: '5',
    type: 'video',
    image: 'https://picsum.photos/seed/video5/300/380.jpg',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    title: '萌宠日常 | 我家猫咪的搞笑瞬间',
    description: '养猫的快乐你懂的！这些搞笑瞬间每天都在我家上演简直就是个活宝，建议点进来观看，真的太治愈了～',
    user: {
      name: '猫咪铲屎官',
      avatar: 'https://picsum.photos/seed/avatar5/100/100.jpg',
    },
    likes: 7890,
    comments: 678,
    height: 380,
  },
  {
    id: '6',
    type: 'image',
    image: 'https://picsum.photos/seed/beauty1/300/420.jpg',
    title: '护肤心得 | 夏季清爽护肤步骤',
    description: '夏季护肤很重要！分享我的日常护肤步骤和产品推荐，都是亲测好用的。油皮和混合皮的姐妹看过来～',
    user: {
      name: '美妆博主',
      avatar: 'https://picsum.photos/seed/avatar6/100/100.jpg',
    },
    likes: 6789,
    comments: 567,
    height: 420,
  },
  {
    id: '7',
    type: 'video',
    image: 'https://picsum.photos/seed/video7/300/360.jpg',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    title: '阳台花园 | 小空间也能打造绿洲',
    description: '分享一下我在阳台打造小花园的经验！即使只有几平米也能种出属于自己的一方绿色天地，春夏秋冬都有花看～',
    user: {
      name: '园艺爱好者',
      avatar: 'https://picsum.photos/seed/avatar7/100/100.jpg',
    },
    likes: 3456,
    comments: 234,
    height: 360,
  },
  {
    id: '8',
    type: 'image',
    image: 'https://picsum.photos/seed/fitness1/300/400.jpg',
    title: '健身打卡 | 居家健身轻松塑形',
    description: '不需要健身房，在家也能练出好身材！分享几个简单有效的居家健身动作，每天坚持15分钟就有明显效果～',
    user: {
      name: '健身达人',
      avatar: 'https://picsum.photos/seed/avatar8/100/100.jpg',
    },
    likes: 4567,
    comments: 345,
    height: 400,
  },
  {
    id: '9',
    type: 'video',
    image: 'https://picsum.photos/seed/video9/300/320.jpg',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    title: '手作分享 | 简单易学的手绘技巧',
    description: '零基础学手绘！今天教大家几个超实用的绘画技巧，不需要专业工具，普通彩笔就能画出美美的作品～',
    user: {
      name: '艺术家小李',
      avatar: 'https://picsum.photos/seed/avatar9/100/100.jpg',
    },
    likes: 2345,
    comments: 189,
    height: 320,
  },
  {
    id: '10',
    type: 'image',
    image: 'https://picsum.photos/seed/tech1/300/380.jpg',
    title: '数码测评 | 新款耳机使用体验',
    description: '入手了一款新耳机，来分享一下使用感受！音质、降噪、续航等方面都挺不错的，性价比很高～',
    user: {
      name: '科技控',
      avatar: 'https://picsum.photos/seed/avatar10/100/100.jpg',
    },
    likes: 5678,
    comments: 456,
    height: 380,
  },
  {
    id: '11',
    type: 'video',
    image: 'https://picsum.photos/seed/video11/300/350.jpg',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    title: '读书笔记 | 近期阅读好书推荐',
    description: '最近读了几本很棒的书，来分享一下读书笔记和心得体会！这些书让我受益匪浅，推荐给同样喜欢读书的小伙伴们～',
    user: {
      name: '书虫小张',
      avatar: 'https://picsum.photos/seed/avatar11/100/100.jpg',
    },
    likes: 3456,
    comments: 234,
    height: 350,
  },
  {
    id: '12',
    type: 'image',
    image: 'https://picsum.photos/seed/photo1/300/410.jpg',
    title: '摄影技巧 | 手机也能拍大片',
    description: '手机摄影技巧分享！学会这些技巧，你的手机也能拍出专业级的照片。构图、光线、后期都有关键技巧～',
    user: {
      name: '摄影师小陈',
      avatar: 'https://picsum.photos/seed/avatar12/100/100.jpg',
    },
    likes: 6789,
    comments: 567,
    height: 410,
  },
];