import { RootReducer } from "app/shared/rootReducer";
import { useDispatch, useSelector } from "react-redux";
import { getValorantGame, VALORANT_CLASS_ID } from "lib/games";
import { useCallback, useEffect } from "react";

import { initialize, isReady, setPresence,  dispose, Presence } from "features/discordRichPresence";
import { GameInfo, Kill, MatchInfo, Me, changeDiscordConfigValue } from "screens/background/stores/store";
import { ValorantAgents, ValorantMaps, ValorantModes } from "types/valorant";
import { ingameNotification } from "features/notification";

var gameStartTime : number | null = null
  

function getMainMenuPresence() {
  let presence : Presence = {
    details: "Main Menu",
    state: "Idle",
    assets: {
      large_image: "menu",
      large_text: "In main menu",
    }
  }
  return presence
}

const getPresence = (matchInfo: MatchInfo, me: Me, gameInfo: GameInfo, kill:Kill) => {
  let presence : Presence = getMainMenuPresence()
  if (!matchInfo.map || !matchInfo.game_mode) return presence
  let map = ValorantMaps[matchInfo.map as keyof typeof ValorantMaps] as string || "Unknown"
  let gamemode = matchInfo.game_mode.mode
  let gameScene = gameInfo.scene
  let custom = matchInfo.game_mode.custom === true ? "Custom game - " : ""
  if (gamemode === 'range') custom = ""

  let state = ''

  if (gameScene === "CharacterSelectPersistentLevel") {
    state = "Agent Select"
    gameStartTime = null
  } else {
    if (gameStartTime === null) gameStartTime = Date.now()
    switch (gamemode) {
      case "bomb":
      case "swift":
      case "quick_bomb":
        state = `${matchInfo?.score?.won  || 0} - ${matchInfo?.score?.lost || 0}`
        break;
      case "deathmatch":
        state = `${kill.kills || 0} Kills`
        break;
      case "range":
        state = "Training"
        break;
      case "escalation":
        if (matchInfo.team === 'attack') {
          state = `Team stage: ${matchInfo.escalationStage?.attacker || 0} Enemy stage: ${matchInfo.escalationStage?.defender || 0}`
        } else {
          state = `Team stage: ${matchInfo.escalationStage?.defender || 0} Enemy stage: ${matchInfo.escalationStage?.attacker || 0}`
        }
        break;
      case "team_deathmatch":
        /* Add a sum of team and enemies kills */
        state = `${kill.kills || 0} Kills`
        break;
    }
  }

  if (gamemode === "bomb") {
    gamemode = matchInfo.game_mode.ranked === "1" ? "Competitive" : "Unrated"
  } else {
    gamemode = ValorantModes[gamemode as keyof typeof ValorantModes]
  }

  presence = {
    details: custom + gamemode,
    state: state,
    assets: {
      large_image: map.toLowerCase(),
      large_text: map,
    }
  }

  if (gameStartTime) {
    presence.timestamps = {
      start: gameStartTime,
      end: null
    }
  }

  if (me.agent) {
    let agent = ValorantAgents[me.agent as keyof typeof ValorantAgents] || "Unknown"
    presence.assets= {
      ...presence.assets,
      small_image: agent.toLowerCase(),
      small_text: agent
    }
  }
  return presence
}


export default function ValorantPresence() {
  const { matchInfo, me ,gameInfo, kill } = useSelector(
    (state: RootReducer) => state.background,
  );
  const { displayDRP, displayAgent } = useSelector(
    (state: RootReducer) => state.background.discordConfig,
  )

  const dispatch = useDispatch();

  const lsDisplayDRP = localStorage.getItem("displayDRP");
  const lsDisplayAgent = localStorage.getItem("displayAgent");

  if (lsDisplayDRP !== null && lsDisplayDRP !== displayDRP.toString()) {
    dispatch(changeDiscordConfigValue({key:"displayDRP",value:lsDisplayDRP === "true"}))
  }
  if (lsDisplayAgent !== null && lsDisplayAgent !== displayAgent.toString()) {
    dispatch(changeDiscordConfigValue({key:"displayAgent",value:lsDisplayAgent === "true"}))
  }

  const setIngamePresence = useCallback(async (matchInfo: MatchInfo, me: Me, gameInfo: GameInfo, kill:Kill) => {
    if (!isReady()) return initialize().then(() => {
      setIngamePresence(matchInfo,me,gameInfo,kill)
      /* Show notification when connected to discord successfully */
      ingameNotification("✅ Connected to DRP!", 4)
    });
    setPresence(getPresence(matchInfo,me,gameInfo,kill))
  },[])

  const startPresence = useCallback(async () => {
    const valorant = await getValorantGame();
    if (valorant && displayDRP) {
      if (!displayAgent) {
        me.agent = null
      }
      setIngamePresence(matchInfo,me,gameInfo,kill)
    } else {
      dispose();
    }
  },[displayAgent,displayDRP,gameInfo,kill,matchInfo,me,setIngamePresence])

  useEffect(() => {
    startPresence()
    overwolf.games.onGameInfoUpdated.addListener(async (event) => {
      if (
        event.runningChanged &&
        event.gameInfo?.classId === VALORANT_CLASS_ID
      ) {
        startPresence()
      }
    });
    overwolf.extensions.onAppLaunchTriggered.addListener(() => {
      startPresence()
    });
    return () => {
      overwolf.games.onGameInfoUpdated.removeListener(() => {});
      overwolf.extensions.onAppLaunchTriggered.removeListener(() => {});
    };
  }, [startPresence,displayDRP]);

  return null;
}


export function PresencePreview() {
  const { matchInfo,me,gameInfo,kill } = useSelector(
    (state: RootReducer) => state.background,
  )

  const { displayDRP, displayAgent } = useSelector(
    (state: RootReducer) => state.background.discordConfig,
  )


  let presence = getPresence(matchInfo,me,gameInfo,kill)
  
  if (!displayDRP) return <div className={"presencePreview"}>Discord Presence is disabled</div>

  return <div className={"presencePreview"}>
    <div>
      <div className={"presenceMap"}>{presence.assets.large_text}</div>
      <div className={"presenceDetails"}>{presence.details}</div>
    </div>
    <div>
      <div className={"presenceAgent"}>{displayAgent ? (presence.assets.small_text || "No agent") : "Agent display is Disabled"}</div>
      <div className={"presenceState"}>{presence.state}</div>
    </div>
  </div>
}