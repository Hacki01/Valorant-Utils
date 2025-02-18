import { DesktopHeader } from "./DesktopHeader";
import "./styles/Screen.css";
import { useDispatch, useSelector } from "react-redux";
import { RootReducer } from "app/shared/rootReducer";
import { clearPresence, initialize, setPresence, isReady } from "features/discordRichPresence";
import { useEffect } from "react";
import { ValorantCharacters, ValorantMaps, ValorantModes } from "types/valorant";
import { MatchInfo } from "screens/background/stores/background";

function setValorantPresence(matchInfo: MatchInfo) {
  if (!matchInfo.map || !matchInfo.game_mode) return clearPresence()
  console.log(matchInfo)
  let map = ValorantMaps[matchInfo.map as keyof typeof ValorantMaps]
  let gamemode = matchInfo.game_mode.mode
  if (gamemode === "bomb") {
    gamemode = matchInfo.game_mode.ranked === "1" ? "Competetive" : "Unrated"
  } else {
    gamemode = ""+ValorantModes[gamemode as keyof typeof ValorantModes]
  }
  let custom = matchInfo.game_mode.custom === true ? "Custom game - " : ""
  let matchScore = {
    won:  matchInfo?.score?.won  || 0,
    lost: matchInfo?.score?.lost || 0,
  }
  let score = `${matchScore.won}-${matchScore.lost}`
  let character = 'unknown'
  if (matchInfo.roster.character) {
    character = ValorantCharacters[matchInfo.roster.character as keyof typeof ValorantCharacters]
    console.log(ValorantCharacters[matchInfo.roster.character as keyof typeof ValorantCharacters])
    console.log(matchInfo.roster.character)
  }

  console.log(matchInfo.roster.character, custom,gamemode,matchInfo.game_mode.ranked,matchInfo.game_mode.custom)

  let presence = {
    details: `${custom}${gamemode} on ${map}`,
    state: character.toString() === 'unknown' ? 'No Agent Selected' : score,
    assets: {
      large_image: map.toString().toLowerCase(),
      large_text: map.toString(),
      small_image: character.toString().toLowerCase(),
      small_text: character.toString() === 'unknown' ? 'Agent Select' : character.toString()
    }
  }

  setPresence(presence)
}

//avoid the use of static text, use i18n instead, each language has its own text, and the text is stored in the
//locales folder in the project root
const Screen = () => {

  const { matchInfo } = useSelector(
    (state: RootReducer) => state.background,
  );


  useEffect(() => {
    initialize().then(() => {
      setValorantPresence(matchInfo)
    })
  })
  
  useEffect(() => {
    if (!isReady()) return
    setValorantPresence(matchInfo)
    console.log('Changed')
  },[matchInfo])



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
