import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IngameState {
  isCatVisible: boolean;
  notifications: {message:string, timeout: number}[]
}

const initialState: IngameState = {
  isCatVisible: false,
  notifications: []
};

const ingameSlice = createSlice({
  name: "ingameScreen",
  initialState,
  reducers: {
    setCatVisibility(state, action: PayloadAction<boolean>) {
      state.isCatVisible = action.payload;
    },
    addNotification(state, action: PayloadAction<{message:string, timeout: number}>) {
      console.log('New notification:', action.payload)
      state.notifications = [...state.notifications, action.payload]
    },
    removeNotification(state) {
      state.notifications.shift()
    }
  },
});

export const { setCatVisibility, addNotification, removeNotification } = ingameSlice.actions;

export default ingameSlice.reducer;
