import { useDispatch, useSelector } from "react-redux";
import { Header } from "../Header";
import "./panel.css";
import { RootReducer } from "app/shared/rootReducer";

import { changeDiscordConfigValue } from "../../screens/background/stores/store";
import { PresencePreview } from "screens/background/components/ValorantPresence";

//avoid the use of static text, use i18n instead, each language has its own text, and the text is stored in the
//locales folder in the project root

export default function Panel () {
  const { displayDRP, displayAgent } = useSelector(
    (state: RootReducer) => state.background.discordConfig,
  )

  const dispatch = useDispatch();

  return (
    <div className='panel'>
      <Header windowname="DESKTOP"/>
      <div className={"panelContainer"}>
        <PresencePreview />
        <div className={"buttonToggleDRP"}>
          <button 
            className="switch-button" 
            data-active={displayDRP}
            onClick={() => dispatch(changeDiscordConfigValue({key:"displayDRP",value:!displayDRP}))}
            aria-label="Toggle Discord Rich Presence"
          />
          Enable Discord Presence
        </div>
        <div className={"buttonToggleDRP"}>
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={displayAgent}
              disabled={!displayDRP}
              onChange={() => dispatch(changeDiscordConfigValue({key:"displayAgent",value:!displayAgent}))}
              aria-label="Toggle Discord Agent preview"
            />
            <span className="checkmark"></span>
            Show your Agent in Discord status
          </label>
        </div>
      </div>
    </div>
  );
}