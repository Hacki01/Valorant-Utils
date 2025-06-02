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
export interface MatchInfo {
  map: string | null;
  roundNumber: string | null;
  score: {
    won: number
    lost: number 
  } | null
  game_mode: {
    mode: string
    custom: boolean
    ranked: string
  } | null
  escalationStage: {
    attacker: number
    defender: number
  } | null
  team: string | null
}

export interface GameInfo {
  scene: string | null;
}

export interface Me {
  agent: string | null;
}

export interface Death {
  deaths: string | null
}

export interface Kill {
  kills: string | null
  headshots: string | null
  assists: string | null
}

interface BackgroundState {
  events: Array<Timestamp & OwEvent>
  infos: Array<Timestamp & OwInfo>
  discordConfig: {
    displayDRP: boolean
    displayAgent: boolean
  }
  matchInfo: MatchInfo
  gameInfo: GameInfo
  me: Me
  kill: Kill
  death: Death
}

const initialState: BackgroundState = {
  events: [],
  infos: [],
  discordConfig: {
    displayDRP: true,
    displayAgent: true
  },
  gameInfo:{
    scene: null
  },
  me: {
    agent: null
  },
  matchInfo: {
    map: null,
    roundNumber: null,
    score: null,
    game_mode: null,
    escalationStage: null,
    team: null
  },
  kill: {
    kills: null,
    headshots: null,
    assists: null
  },
  death: {
    deaths: null
  }
};

function isInfoUpdates2Event(info: OwInfo): info is overwolf.games.events.InfoUpdates2Event {
  return 'info' in info;
}

const backgroundSlice = createSlice({
  name: "backgroundScreen",
  initialState,
  reducers: {
    changeDiscordConfigValue(state, action: PayloadAction<{key: keyof BackgroundState['discordConfig'], value: boolean}>) {
      state.discordConfig[action.payload.key] = action.payload.value;
      localStorage.setItem(action.payload.key, action.payload.value.toString());
    },
    setEvent(state, action: EventPayload) {
      let payload = action.payload
      state.events.push(payload);
      console.log(payload)
    },
    setInfo(state, action: InfoPayload) {
      let payload = action.payload;
      console.log(payload)
      state.infos.push(payload);
      if (isInfoUpdates2Event(payload)) {
        const VI = payload.info as ValorantInfoUpdate;
        const VMI = VI?.match_info;
        if (VMI) {
          state.matchInfo = {
            // If value is undefined, use previous value
            // If value is null, keep null
            map: VMI.map !== undefined ? VMI.map : state.matchInfo.map,
            roundNumber: VMI.roundNumber !== undefined ? VMI.round_number : state.matchInfo.roundNumber,
            score: VMI.score !== undefined  ? (VMI.score == null ? null : JSON.parse(VMI.score)) : state.matchInfo.score,
            game_mode: VMI.game_mode !== undefined ? (VMI.game_mode == null ? null : JSON.parse(VMI.game_mode) ): state.matchInfo.game_mode,
            escalationStage: VMI.escalation_stage !== undefined ? (VMI.escalation_stage == null ? null : JSON.parse(VMI.escalation_stage)) : state.matchInfo.escalationStage,
            team: VMI.team !== undefined ? VMI.team : state.matchInfo.team
          };
        }
        if (VI?.me?.agent !== undefined) {
          state.me.agent = VI.me.agent;
        }
        if (VI?.game_info?.scene !== undefined) {
          state.gameInfo.scene = VI.game_info.scene;
        }
        if (VI.kill !== undefined) {
          state.kill = {
            kills: VI.kill.kills !== undefined ? VI.kill.kills : state.kill.kills,
            headshots: VI.kill.headshots !== undefined ? VI.kill.headshots : state.kill.headshots,
            assists: VI.kill.assists !== undefined ? VI.kill.assists : state.kill.assists,
          }
        }
        if (VI.death !== undefined) {
          state.death = VI.death;
        }
      }
      overwolf.games.events.getInfo(function(info) {
        console.log(info);
      });
    },
  },
});

export const { setEvent, setInfo, changeDiscordConfigValue } = backgroundSlice.actions;

export default backgroundSlice.reducer;
