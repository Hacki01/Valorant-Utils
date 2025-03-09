import {
  REQUIRED_FEATURES,
  WINDOW_NAMES,
  RETRY_TIMES,
  DISPLAY_OVERWOLF_HOOKS_LOGS,
} from "app/shared/constants";
import { useGameEventProvider, useWindow } from "overwolf-hooks";
import { useCallback, useEffect } from "react";
import { VALORANT_CLASS_ID, getValorantGame } from "lib/games";
import { setInfo, setEvent } from "../stores/background";
import store from "app/shared/store";
import { log } from "lib/log";
import ValorantPresence from "./ValorantPresence";

const { INGAME, NOTIFICATION } = WINDOW_NAMES;

const BackgroundWindow = () => {
  const [ingame] = useWindow(INGAME, DISPLAY_OVERWOLF_HOOKS_LOGS);
  const [notification] = useWindow(NOTIFICATION, DISPLAY_OVERWOLF_HOOKS_LOGS);

  const { start, stop } = useGameEventProvider(
    {
      onInfoUpdates: (info) =>
      {
        store.dispatch(
          setInfo({
            ...info,
            timestamp: Date.now(),
          })
        )
      },
      onNewEvents: (events) =>
        {
          store.dispatch(
            setEvent({
              ...events,
              timestamp: Date.now(),
            })
          )
        },
    },
    REQUIRED_FEATURES,
    RETRY_TIMES,
    DISPLAY_OVERWOLF_HOOKS_LOGS
  );

  const getWindowState = useCallback(() => {
    return new Promise((resolve) => {
      overwolf.windows.getWindowState(ingame?.id, (result) => {
        resolve(result.window_state);
      });
    });
  }, [ingame]);

  const startApp = useCallback(
    async (reason: string) => {
      log(reason, "src/screens/background/components/Screen.tsx", "startApp");
      const valorant = await getValorantGame();
      if (valorant) {
        await Promise.all([start(), ingame?.minimize(), notification?.restore()]);
      } else {
        await Promise.all([stop(), ingame?.close(), notification?.close()]);
      }
    },
    [ingame,notification, start, stop]
  );

  useEffect(() => {
    startApp("on initial load");
    overwolf.settings.hotkeys.onPressed.addListener(async (result) => {
      if (result.name === "show_ingame") {
        const currentState = await getWindowState();
        if (currentState === 'minimized') {
          ingame.restore();
        } else {
          ingame.minimize();
        }
      }
    });
    overwolf.games.onGameInfoUpdated.addListener(async (event) => {
      if (
        event.runningChanged &&
        event.gameInfo?.classId === VALORANT_CLASS_ID
      ) {
        startApp("onGameInfoUpdated");
      }
    });
    overwolf.extensions.onAppLaunchTriggered.addListener(() => {
      startApp("onAppLaunchTriggered");
    });
    return () => {
      overwolf.settings.hotkeys.onPressed.removeListener(() => {});
      overwolf.games.onGameInfoUpdated.removeListener(() => {});
      overwolf.extensions.onAppLaunchTriggered.removeListener(() => {});
    };
  }, [startApp,ingame,getWindowState]);
  return <ValorantPresence />;
};

export default BackgroundWindow;
