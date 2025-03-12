import { useDispatch, useSelector } from "react-redux";
import { DesktopHeader } from "./DesktopHeader";
import "./styles/Screen.css";
import { RootReducer } from "app/shared/rootReducer";

import { setDisplayForDRP } from "../../background/stores/background";
import { PresencePreview } from "screens/background/components/ValorantPresence";

//avoid the use of static text, use i18n instead, each language has its own text, and the text is stored in the
//locales folder in the project root

const Screen = () => {
  const { displayDRP } = useSelector(
    (state: RootReducer) => state.background,
  )

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
        <PresencePreview/>
      </div>
    </div>
  );
}

export default Screen;