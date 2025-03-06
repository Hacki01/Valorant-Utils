import { useCallback, useEffect } from "react";
import {
  WINDOW_NAMES,
  DISPLAY_OVERWOLF_HOOKS_LOGS,
} from "app/shared/constants";
import { useWindow, useDrag } from "overwolf-hooks";
import { classNames, isDev } from "lib/utils";
import { SVGComponent } from "./MenuHeaderSVG";
import "./styles/MenuHeader.css";

const { INGAME } = WINDOW_NAMES;

const handleDiscordClick = () => {
  if (isDev) return window.open("https://discord.gg/f6kHMT4A9F");
  overwolf.utils.openUrlInDefaultBrowser("https://discord.gg/f6kHMT4A9F");
};

export const MenuHeader = () => {
  const [ingameWindow] = useWindow(INGAME, DISPLAY_OVERWOLF_HOOKS_LOGS);
  const { onDragStart, onMouseMove, setCurrentWindowID } = useDrag(
    null,
    DISPLAY_OVERWOLF_HOOKS_LOGS,
  );


  const updateDragWindow = useCallback(() => {
    if (ingameWindow?.id) setCurrentWindowID(ingameWindow.id);
  }, [ingameWindow, setCurrentWindowID]);

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
          onClick={ingameWindow?.minimize}
        >
          <svg>
            <use xlinkHref="#window-control_close" />
          </svg>
        </button>
      </div>
    </header>
  );
};
