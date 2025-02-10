import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Timestamp {
  timestamp: number;
}

interface ValorantInfoUpdate extends overwolf.games.events.InfoUpdate2 {
  match_info?: {
    map?: string | null;
    roster?: any | null;
    round_number?: string | null;
    score?: {
      won: string;
      lost: string;
    } | null;
  };
}

type OwInfo = 
  | overwolf.games.events.InfoUpdates2Event
  | overwolf.games.InstalledGameInfo;
type OwEvent = overwolf.games.events.NewGameEvents;
type InfoPayload = PayloadAction<Timestamp & OwInfo>;
type EventPayload = PayloadAction<Timestamp & OwEvent>;

interface MatchInfo {
  map: string | null;
  roster: any;
  round_number: string | null;
  score: {"won": string, "lost": string } | null;
}

interface BackgroundState {
  events: Array<Timestamp & OwEvent>;
  infos: Array<Timestamp & OwInfo>;
  matchInfo: MatchInfo;
}

const initialState: BackgroundState = {
  events: [],
  infos: [],
  matchInfo: {
    map: null,
    roster: {},
    round_number: null,
    score: null
  }
};

function isInfoUpdates2Event(info: OwInfo): info is overwolf.games.events.InfoUpdates2Event {
  return 'info' in info;
}

const backgroundSlice = createSlice({
  name: "backgroundScreen",
  initialState,
  reducers: {
    setEvent(state, action: EventPayload) {
      state.events.push(action.payload);
    },
    setInfo(state, action: InfoPayload) {
      let payload = action.payload;
      state.infos.push(payload);
      
      if (isInfoUpdates2Event(payload)) {
        const valorantInfo = payload.info as ValorantInfoUpdate;
        const matchInfo = valorantInfo?.match_info;
        if (matchInfo) {
          state.matchInfo = {
            // If value is undefined, use previous value
            // If value is null, keep null
            map: matchInfo.map !== undefined ? matchInfo.map : state.matchInfo.map,
            roster: matchInfo.roster !== undefined ? matchInfo.roster : state.matchInfo.roster,
            round_number: matchInfo.round_number !== undefined ? matchInfo.round_number : state.matchInfo.round_number,
            score: matchInfo.score !== undefined ? matchInfo.score : state.matchInfo.score
          };
        }
      }
      overwolf.games.events.getInfo(function(info) {
        console.log(info);
      });
    },
    testFunction(state) {
      return state;
    }
  },
});

export const { setEvent, setInfo } = backgroundSlice.actions;

export default backgroundSlice.reducer;
