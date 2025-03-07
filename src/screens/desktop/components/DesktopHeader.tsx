import { useCallback, useEffect } from "react";
import {
  WINDOW_NAMES,
  DISPLAY_OVERWOLF_HOOKS_LOGS,
} from "app/shared/constants";
import { useWindow, useDrag } from "overwolf-hooks";
import { classNames, isDev } from "lib/utils";
import { SVGComponent } from "./DesktopHeaderSVG";
import "./styles/DesktopHeader.css";

const { DESKTOP, /* BACKGROUND */ } = WINDOW_NAMES;

const handleDiscordClick = () => {
  if (isDev) return window.open("https://discord.gg/f6kHMT4A9F");
  overwolf.utils.openUrlInDefaultBrowser("https://discord.gg/f6kHMT4A9F");
};

export const DesktopHeader = () => {
  const [desktopWindow] = useWindow(DESKTOP, DISPLAY_OVERWOLF_HOOKS_LOGS);
 /*  const [backgroundWindow] = useWindow(BACKGROUND, DISPLAY_OVERWOLF_HOOKS_LOGS); */
  const { onDragStart, onMouseMove, setCurrentWindowID } = useDrag(
    null,
    DISPLAY_OVERWOLF_HOOKS_LOGS,
  );

  const updateDragWindow = useCallback(() => {
    if (desktopWindow?.id) setCurrentWindowID(desktopWindow.id);
  }, [desktopWindow, setCurrentWindowID]);

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
          className="header__icon header__control"
          onClick={() => (window.location.href = "overwolf://settings")}
        >
          <svg>
            <use xlinkHref="#window-control_settings" />
          </svg>
        </button>
        <button className="header__icon header__control">
          <svg>
            <use xlinkHref="#window-control_support" />
          </svg>
        </button>
        <button
          className="header__icon header__control"
          onClick={desktopWindow?.minimize}
        >
          <svg>
            <use xlinkHref="#window-control_minimize" />
          </svg>
        </button>
        <button
          className="header__icon header__control header__control__close"
          onClick={desktopWindow?.close}
        >
          <svg>
            <use xlinkHref="#window-control_close" />
          </svg>
        </button>
      </div>
    </header>
  );
};
