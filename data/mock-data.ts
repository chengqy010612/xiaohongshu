// 模拟数据用于瀑布流展示
export interface WaterfallItem {
  id: string;
  image: string;
  title: string;
  user: {
    name: string;
    avatar: string;
  };
  likes: number;
  height: number; // 图片高度，用于瀑布流布局
}

// 生成随机高度的函数
const getRandomHeight = () => Math.floor(Math.random() * 150) + 200; // 200-350之间的随机高度

// 生成随机点赞数
const getRandomLikes = () => Math.floor(Math.random() * 9000) + 1000; // 1000-10000之间的随机点赞数

// 模拟数据
export const mockWaterfallData: WaterfallItem[] = [
  {
    id: '1',
    image: 'https://picsum.photos/seed/fashion1/300/400.jpg',
    title: '夏日穿搭分享 | 轻盈透气的棉麻连衣裙，舒适又显瘦',
    user: {
      name: '时尚小达人',
      avatar: 'https://picsum.photos/seed/avatar1/100/100.jpg',
    },
    likes: 3456,
    height: getRandomHeight(),
  },
  {
    id: '2',
    image: 'https://picsum.photos/seed/food1/300/350.jpg',
    title: '自制甜品 | 免烤箱的芒果慕斯，简单易学',
    user: {
      name: '美食家小王',
      avatar: 'https://picsum.photos/seed/avatar2/100/100.jpg',
    },
    likes: 5678,
    height: getRandomHeight(),
  },
  {
    id: '3',
    image: 'https://picsum.photos/seed/travel1/300/450.jpg',
    title: '周末游 | 郊外徒步，感受大自然的美好',
    user: {
      name: '旅行爱好者',
      avatar: 'https://picsum.photos/seed/avatar3/100/100.jpg',
    },
    likes: 2345,
    height: getRandomHeight(),
  },
  {
    id: '4',
    image: 'https://picsum.photos/seed/home1/300/300.jpg',
    title: '家居改造 | 小空间大利用，收纳技巧分享',
    user: {
      name: '生活小能手',
      avatar: 'https://picsum.photos/seed/avatar4/100/100.jpg',
    },
    likes: 4567,
    height: getRandomHeight(),
  },
  {
    id: '5',
    image: 'https://picsum.photos/seed/pet1/300/380.jpg',
    title: '萌宠日常 | 我家猫咪的搞笑瞬间合集',
    user: {
      name: '猫咪铲屎官',
      avatar: 'https://picsum.photos/seed/avatar5/100/100.jpg',
    },
    likes: 7890,
    height: getRandomHeight(),
  },
  {
    id: '6',
    image: 'https://picsum.photos/seed/beauty1/300/420.jpg',
    title: '护肤心得 | 夏季清爽护肤步骤分享',
    user: {
      name: '美妆博主',
      avatar: 'https://picsum.photos/seed/avatar6/100/100.jpg',
    },
    likes: 6789,
    height: getRandomHeight(),
  },
  {
    id: '7',
    image: 'https://picsum.photos/seed/plant1/300/360.jpg',
    title: '阳台花园 | 小空间也能打造绿色天地',
    user: {
      name: '园艺爱好者',
      avatar: 'https://picsum.photos/seed/avatar7/100/100.jpg',
    },
    likes: 3456,
    height: getRandomHeight(),
  },
  {
    id: '8',
    image: 'https://picsum.photos/seed/fitness1/300/400.jpg',
    title: '健身打卡 | 居家健身，轻松塑形',
    user: {
      name: '健身达人',
      avatar: 'https://picsum.photos/seed/avatar8/100/100.jpg',
    },
    likes: 4567,
    height: getRandomHeight(),
  },
  {
    id: '9',
    image: 'https://picsum.photos/seed/art1/300/320.jpg',
    title: '手作分享 | 简单易学的手绘技巧',
    user: {
      name: '艺术家小李',
      avatar: 'https://picsum.photos/seed/avatar9/100/100.jpg',
    },
    likes: 2345,
    height: getRandomHeight(),
  },
  {
    id: '10',
    image: 'https://picsum.photos/seed/tech1/300/380.jpg',
    title: '数码测评 | 新款耳机使用体验分享',
    user: {
      name: '科技控',
      avatar: 'https://picsum.photos/seed/avatar10/100/100.jpg',
    },
    likes: 5678,
    height: getRandomHeight(),
  },
  {
    id: '11',
    image: 'https://picsum.photos/seed/book1/300/350.jpg',
    title: '读书笔记 | 近期阅读的好书推荐',
    user: {
      name: '书虫小张',
      avatar: 'https://picsum.photos/seed/avatar11/100/100.jpg',
    },
    likes: 3456,
    height: getRandomHeight(),
  },
  {
    id: '12',
    image: 'https://picsum.photos/seed/photo1/300/410.jpg',
    title: '摄影技巧 | 手机也能拍出大片感',
    user: {
      name: '摄影师小陈',
      avatar: 'https://picsum.photos/seed/avatar12/100/100.jpg',
    },
    likes: 6789,
    height: getRandomHeight(),
  },
];