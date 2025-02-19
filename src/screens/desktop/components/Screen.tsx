import { DesktopHeader } from "./DesktopHeader";
import "./styles/Screen.css";
import { useDispatch, useSelector } from "react-redux";
import { RootReducer } from "app/shared/rootReducer";
import { clearPresence, initialize, setPresence, isReady, Presence } from "features/discordRichPresence";
import { useEffect } from "react";
import { ValorantAgents, ValorantMaps, ValorantModes } from "types/valorant";
import { GameInfo, Kill, MatchInfo, Me } from "screens/background/stores/background";

function setValorantPresence(matchInfo: MatchInfo, me: Me, gameInfo: GameInfo, kill:Kill) {
  if (!matchInfo.map || !matchInfo.game_mode) return clearPresence()
  console.log(matchInfo)
  let map = ValorantMaps[matchInfo.map as keyof typeof ValorantMaps] as string
  let gamemode = matchInfo.game_mode.mode
  let gameScene = gameInfo.scene
  let custom = matchInfo.game_mode.custom === true ? "Custom game - " : ""

  let state = '...'

  if (gameScene === "CharacterSelectPersistentLevel") {
    state = "Agent Select"
  } else {
    switch (gamemode) {
      case "bomb":
      case "swift":
      case "quick_bomb":
        state = `${matchInfo?.score?.won  || 0}-${matchInfo?.score?.lost || 0}`
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
        /* Add a sum of team and enemiesw kills */
        state = `${kill.kills || 0} Kills`
        break;
    }
  }

  if (gamemode === "bomb") {
    gamemode = matchInfo.game_mode.ranked === "1" ? "Competetive" : "Unrated"
  } else {
    gamemode = ValorantModes[gamemode as keyof typeof ValorantModes]
  }




  let presence : Presence = {
    details: custom + gamemode,
    state: state,
    assets: {
      large_image: map.toLowerCase(),
      large_text: map,
    }
  }

  if (me.agent) {
    presence.assets= {
      ...presence.assets,
      small_image: ValorantAgents[me.agent as keyof typeof ValorantAgents].toLowerCase(),
      small_text: ValorantAgents[me.agent as keyof typeof ValorantAgents]
    }
  }

  setPresence(presence)
}

//avoid the use of static text, use i18n instead, each language has its own text, and the text is stored in the
//locales folder in the project root
const Screen = () => {

  const { matchInfo, me ,gameInfo, kill, death } = useSelector(
    (state: RootReducer) => state.background,
  );


  useEffect(() => {
    initialize().then(() => {
      setValorantPresence(matchInfo,me,gameInfo,kill)
    })
  })
  
  useEffect(() => {
    if (!isReady()) return
    setValorantPresence(matchInfo,me,gameInfo,kill)
  },[matchInfo, me, gameInfo,kill,death])



  const dispatch = useDispatch();
  return (
    <div className='desktop'>
      <DesktopHeader />
      <div className={"desktopContainer"}>
        <div>Stats</div>
        <div>{JSON.stringify(matchInfo)}</div>
        <input type="button" disabled value="TEST" onClick={() => {
          dispatch({ type: "backgroundScreen/testFunction" });
        }} />
      </div>
    </div>
  );
};

export default Screen;
