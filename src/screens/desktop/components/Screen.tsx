import { useDispatch, useSelector } from "react-redux";
import { DesktopHeader } from "./DesktopHeader";
import "./styles/Screen.css";
import { RootReducer } from "app/shared/rootReducer";

import { setDisplayForDRP } from "../../background/stores/background";
import { getPresence } from "screens/background/components/ValorantPresence";
import { Presence } from "features/discordRichPresence";
import { getValorantGame } from "lib/games";
import { useEffect, useState } from "react";

//avoid the use of static text, use i18n instead, each language has its own text, and the text is stored in the
//locales folder in the project root

const PresencePreview = ({ presence, disabled, isGameEnabled } : { presence: Presence, disabled: boolean, isGameEnabled:boolean}) => {
  if (!isGameEnabled )return <div className={"presencePreview"}>Game not detected</div>
  if (disabled) return <div className={"presencePreview"}>Discord Rich Presence is disabled</div>
  return <div className={"presencePreview"}>
    <div>
      <div className={"presenceMap"}>{presence.assets.large_text}</div>
      <div className={"presenceDetails"}>{presence.details}</div>
    </div>
    <div>
      <div className={"presenceAgent"}>{presence.assets.small_text || "No agent"}</div>
      <div className={"presenceState"}>{presence.state}</div>
    </div>
  </div>
}

const Screen = () => {
  const [isGameEnabled, setGameEnabled] = useState(false);
  const { displayDRP, matchInfo, me, gameInfo, kill } = useSelector(
    (state: RootReducer) => state.background,
  )

  const presence = getPresence(matchInfo, me, gameInfo, kill);

  useEffect(() => {
    async function getValorantState() {
      const valorant = await getValorantGame();
      setGameEnabled(!!valorant);
    }
    getValorantState();
  })

  const dispatch = useDispatch();

  return (
    <div className='desktop'>
      <DesktopHeader />
      <div className={"desktopContainer"}>
        <div className={"buttonToggleDRP"}>
          <button 
            className="switch-button" 
            data-active={displayDRP}
            onClick={() => dispatch(setDisplayForDRP(!displayDRP))}
            aria-label="Toggle Discord Rich Presence"
          />
          {
            displayDRP ? <div>Disable Discord Rich Presence</div> : <div>Enable Discord Rich Presence</div>
          }
        </div>
        <PresencePreview presence={presence} isGameEnabled={isGameEnabled} disabled={!displayDRP}/>
      </div>
    </div>
  );
}

export default Screen;