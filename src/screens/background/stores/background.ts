import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Timestamp {
  timestamp: number;
}
type OwInfo =
  | any 
  | overwolf.games.events.InfoUpdates2Event
  | overwolf.games.InstalledGameInfo;
type OwEvent = overwolf.games.events.NewGameEvents;
type InfoPayload = PayloadAction<Timestamp & OwInfo>;
type EventPayload = PayloadAction<Timestamp & OwEvent>;

interface BackgroundState {
  events: Array<Timestamp & OwEvent>;
  infos: Array<Timestamp & OwInfo>;
  match_info: {
    map: string | null;
    roster: any;
    round_number: string | null;
    score: {"won": string, "lost": string } | null;
  }
}

const initialState: BackgroundState = {
  events: [],
  infos: [],
  match_info: {
    map: null,
    roster: {},
    round_number: null,
    score: null
  }
};

const backgroundSlice = createSlice({
  name: "backgroundScreen",
  initialState,
  reducers: {
    setEvent(state, action: EventPayload) {
      state.events.push(action.payload);
    },
    setInfo(state, action: InfoPayload) {
      let info = action.payload;
      state.infos.push(info);
      /* ustawienie wartości if jest inna */
      state.match_info.map = info.info?.match_info?.map || state.match_info.map;
    },
  },
});

export const { setEvent, setInfo } = backgroundSlice.actions;

export default backgroundSlice.reducer;
