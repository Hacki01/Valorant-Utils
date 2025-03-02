import { useDispatch, useSelector } from "react-redux";
import { DesktopHeader } from "./DesktopHeader";
import "./styles/Screen.css";
import { RootReducer } from "app/shared/rootReducer";

import { setDisplayForDRP } from "../../background/stores/background";
import { getPresence } from "screens/background/components/ValorantPresence";
import { Presence } from "features/discordRichPresence";

//avoid the use of static text, use i18n instead, each language has its own text, and the text is stored in the
//locales folder in the project root

const PresencePreview = ({ presence } : { presence: Presence}) => {
  return <div className={"presencePreview"}>
    <div>
      <div className={"presenceMap"}>Map: {presence.assets.large_text}</div>
      <div className={"presenceDetails"}>{presence.details}</div>
    </div>
    <div>
      <div className={"presenceAgent"}>Agent: {presence.assets.small_text || "No agent"}</div>
      <div className={"presenceState"}>{presence.state}</div>
    </div>
  </div>
}

const Screen = () => {

  const { displayDRP, matchInfo, me, gameInfo, kill } = useSelector(
    (state: RootReducer) => state.background,
  )

  const presence = getPresence(matchInfo, me, gameInfo, kill);

  const dispatch = useDispatch();

  return (
    <div className='desktop'>
      <DesktopHeader />
      <div className={"desktopContainer"}>
        <input type='button' onClick={() => {dispatch(setDisplayForDRP(!displayDRP))}} value={(displayDRP ? "Disable" : "Enable") + " DRP"}></input>
        {
          displayDRP ? <PresencePreview presence={presence} /> : <div>DRP is disabled</div>  
        }
      </div>
    </div>
  );
};

export default Screen;
