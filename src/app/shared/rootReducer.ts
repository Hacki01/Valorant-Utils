import { combineReducers } from "@reduxjs/toolkit";
import background from "screens/background/stores/background";
import ingame from "screens/ingame/stores/ingame";


const rootReducer = combineReducers({
  background,
  ingame,
});

export type RootReducer = ReturnType<typeof rootReducer>;
export default rootReducer;
