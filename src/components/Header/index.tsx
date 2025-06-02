import { useCallback, useEffect } from "react";
import {
  WINDOW_NAMES,
  DISPLAY_OVERWOLF_HOOKS_LOGS,
} from "app/shared/constants";
import { useWindow, useDrag } from "overwolf-hooks";
import { classNames, isDev } from "lib/utils";
import { SVGComponent } from "./MenuHeaderSVG";
import "./MenuHeader.css";

const handleDiscordClick = () => {
  if (isDev) return window.open("https://discord.gg/f6kHMT4A9F");
  overwolf.utils.openUrlInDefaultBrowser("https://discord.gg/f6kHMT4A9F");
};

export const Header = ({windowname} : {windowname: "DESKTOP" | "INGAME"}) => {
  const WINDOW = WINDOW_NAMES[windowname]
  const [userWindow] = useWindow(WINDOW, DISPLAY_OVERWOLF_HOOKS_LOGS);
  const { onDragStart, onMouseMove, setCurrentWindowID } = useDrag(
    null,
    DISPLAY_OVERWOLF_HOOKS_LOGS,
  );


  const updateDragWindow = useCallback(() => {
    if (userWindow?.id) setCurrentWindowID(userWindow.id);
  }, [userWindow, setCurrentWindowID]);

  useEffect(updateDragWindow, [updateDragWindow]);

  return (
    <header
      className={"header"}
      onMouseDown={onDragStart}
      onMouseMove={onMouseMove}
    >
      <SVGComponent />
      <span className={"header__title"}>
        Valorant Utils
      </span>
      <div className={"header__controls__group"}>
        {/* Discord Button */}
        <button
          className={classNames("header__icon header__control header__discord")}
          onClick={handleDiscordClick}
        >
          <svg>
            <use xlinkHref="#window-control_discord" />
          </svg>
        </button>
        <button
          className="header__icon header__control header__control__close"
          onClick={userWindow?.close}
        >
          <svg>
            <use xlinkHref="#window-control_close" />
          </svg>
        </button>
      </div>
    </header>
  );
};
