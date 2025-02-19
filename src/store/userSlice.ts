import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  avatar: string;
}

const initialState: UserState = {
  avatar: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
  },
});

export const { setUserAvatar } = userSlice.actions;
export default userSlice.reducer;
