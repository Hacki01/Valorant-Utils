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
        <PresencePreview />
        <div className={"buttonToggleDRP"}>
          <button 
            className="switch-button" 
            data-active={displayAgent}
            onClick={() => dispatch(setDisplayAgent(!displayAgent))}
            aria-label="Toggle Discord Agent preview"
          />
          {
            displayAgent ? <div>Disable Agent display</div> : <div>Enable Agent display</div>
          }
        </div>
      </div>
    </div>
  );
}