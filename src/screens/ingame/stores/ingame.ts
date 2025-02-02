import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IngameState {
  isCatVisible: boolean;
}

const initialState: IngameState = {
  isCatVisible: false,
};

const ingameSlice = createSlice({
  name: "ingameScreen",
  initialState,
  reducers: {
    setCatVisibility(state, action: PayloadAction<boolean>) {
      state.isCatVisible = action.payload;
    },
  },
});

export const { setCatVisibility } = ingameSlice.actions;

export default ingameSlice.reducer;
