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

const { DESKTOP, INGAME } = WINDOW_NAMES;

const BackgroundWindow = () => {
  const [desktop] = useWindow(DESKTOP, DISPLAY_OVERWOLF_HOOKS_LOGS);
  const [ingame] = useWindow(INGAME, DISPLAY_OVERWOLF_HOOKS_LOGS);

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

  const startApp = useCallback(
    async (reason: string) => {
      //if the desktop or ingame window is not ready we don't want to start the app
      if (!desktop || !ingame) return;
      log(reason, "src/screens/background/components/Screen.tsx", "startApp");
      const valorant = await getValorantGame();
      if (valorant) {
        await Promise.all([start(), ingame?.restore(), desktop?.minimize()]);

      } else {
        await Promise.all([stop(), desktop?.close(), ingame?.close()]);
      }
    },
    [desktop, ingame, start, stop]
  );

  useEffect(() => {
    startApp("on initial load");
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
      overwolf.games.onGameInfoUpdated.removeListener(() => {});
      overwolf.extensions.onAppLaunchTriggered.removeListener(() => {});
    };
  }, [startApp]);
  return <ValorantPresence />;
};

export default BackgroundWindow;
