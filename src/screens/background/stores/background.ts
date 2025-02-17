import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {ValorantInfoUpdate} from "../../../types/valorant";
interface Timestamp {
  timestamp: number;
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
  score: {
    won: number,
    lost: number 
  } | null;
  game_mode: {
    mode: string;
    custom: boolean;
    ranked: string
  } | null;
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
    score: null,
    game_mode: null,
  }
};

function isInfoUpdates2Event(info: OwInfo): info is overwolf.games.events.InfoUpdates2Event {
  return 'info' in info;
}

function findRoster(info: ValorantInfoUpdate): number | null {
  if (!info.match_info) return null;
  for (let i = 0; i <= 27; i++) {
    if (info.match_info[`roster_${i}`]) {
      return i;
    }
  }
  return null
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
        const VMI = valorantInfo?.match_info;
        const rosterNumber = findRoster(valorantInfo)
        /* VMI - Valorant Match Info */
        if (VMI) {
          state.matchInfo = {
            // If value is undefined, use previous value
            // If value is null, keep null
            map: VMI.map !== undefined ? VMI.map : state.matchInfo.map,
            roster: rosterNumber !== null ? VMI[`roster_${rosterNumber}`] : state.matchInfo.roster,
            round_number: VMI.round_number !== undefined ? VMI.round_number : state.matchInfo.round_number,
            score: VMI.score !== undefined ? VMI.score : state.matchInfo.score,
            game_mode: VMI.game_mode !== undefined ? VMI.game_mode : state.matchInfo.game_mode,
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
