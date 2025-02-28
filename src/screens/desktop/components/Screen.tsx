import { useDispatch, useSelector } from "react-redux";
import { DesktopHeader } from "./DesktopHeader";
import "./styles/Screen.css";
import { RootReducer } from "app/shared/rootReducer";

import { setDisplayForDRP } from "../../background/stores/background";
import { getPresence } from "screens/background/components/ValorantPresence";

//avoid the use of static text, use i18n instead, each language has its own text, and the text is stored in the
//locales folder in the project root
const Screen = () => {

  const { displayDRP, matchInfo, me, gameInfo, kill } = useSelector(
    (state: RootReducer) => state.background,
  )

  const presence = getPresence(matchInfo, me, gameInfo, kill);

  console.log(kill)

  const dispatch = useDispatch();

  return (
    <div className='desktop'>
      <DesktopHeader />
      <div className={"desktopContainer"}>
        <input type='button' onClick={() => {dispatch(setDisplayForDRP(!displayDRP))}} value={(displayDRP ? "Disable" : "Enable") + " DRP"}></input>
        <div className={"presencePreview"}>
          <div className={"presenceMap"}>Map: {presence.assets.large_text}</div>
          <div className={"presenceAgent"}>Agent: {presence.assets.small_text || "No agent"}</div>
          <div className={"presenceDetails"}>{presence.details}</div>
          <div className={"presenceState"}>{presence.state}</div>
        </div>
      </div>
    </div>
  );
};

export default Screen;
