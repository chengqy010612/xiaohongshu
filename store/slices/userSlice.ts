import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isLoggedIn: boolean;
  userInfo: {
    id: string | null;
    username: string | null;
    avatar: string | null;
    email: string | null;
  };
  likes: string[]; // 存储用户喜欢的帖子ID
}

const initialState: UserState = {
  isLoggedIn: false,
  userInfo: {
    id: null,
    username: null,
    avatar: null,
    email: null,
  },
  likes: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ id: string; username: string; avatar?: string; email?: string }>) => {
      state.isLoggedIn = true;
      state.userInfo = {
        id: action.payload.id,
        username: action.payload.username,
        avatar: action.payload.avatar || null,
        email: action.payload.email || null,
      };
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userInfo = {
        id: null,
        username: null,
        avatar: null,
        email: null,
      };
      state.likes = [];
    },
    updateUserInfo: (state, action: PayloadAction<Partial<UserState['userInfo']>>) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const index = state.likes.indexOf(postId);
      if (index === -1) {
        state.likes.push(postId);
      } else {
        state.likes.splice(index, 1);
      }
    },
  },
});

export const { login, logout, updateUserInfo, toggleLike } = userSlice.actions;
export default userSlice.reducer;