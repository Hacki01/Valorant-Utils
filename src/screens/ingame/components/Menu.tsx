import { useDispatch, useSelector } from "react-redux";
import { MenuHeader } from "./MenuHeader";
import "./styles/ingameMenu.css";
import { RootReducer } from "app/shared/rootReducer";

import { setDisplayAgent, setDisplayForDRP } from "../../background/stores/background";
import { PresencePreview } from "screens/background/components/ValorantPresence";

//avoid the use of static text, use i18n instead, each language has its own text, and the text is stored in the
//locales folder in the project root

export default function Menu () {
  const { displayDRP, displayAgent } = useSelector(
    (state: RootReducer) => state.background,
  )

  const dispatch = useDispatch();

  return (
    <div className='ingameMenu'>
      <MenuHeader />
      <div className={"ingameMenuContainer"}>
        <PresencePreview />
        <div className={"buttonToggleDRP"}>
          <button 
            className="switch-button" 
            data-active={displayDRP}
            onClick={() => dispatch(setDisplayForDRP(!displayDRP))}
            aria-label="Toggle Discord Rich Presence"
          />
          Show Valorant as Discord Status
        </div>
        <div className={"buttonToggleDRP"}>
          <button 
            className="switch-button" 
            data-active={displayAgent}
            onClick={() => dispatch(setDisplayAgent(!displayAgent))}
            aria-label="Toggle Discord Agent preview"
          />
          Show your Agent in Discord status
        </div>
      </div>
    </div>
  );
}