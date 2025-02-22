import {
  REQUIRED_FEATURES,
  WINDOW_NAMES,
  RETRY_TIMES,
  DISPLAY_OVERWOLF_HOOKS_LOGS,
} from "app/shared/constants";
import { useGameEventProvider, useWindow } from "overwolf-hooks";
import { useCallback, useEffect } from "react";
import { VALORANT_CLASS_ID, getValorantGame } from "lib/games";
import { useSelector } from "react-redux";
import { RootReducer } from "app/shared/rootReducer";
import { setInfo, setEvent } from "../stores/background";
import store from "app/shared/store";
import { log } from "lib/log";
import { dispose, initialize, isReady } from "features/discordRichPresence";
import { setIngamePresence } from "./setPresence";

const { DESKTOP, INGAME } = WINDOW_NAMES;

const BackgroundWindow = () => {
  const [desktop] = useWindow(DESKTOP, DISPLAY_OVERWOLF_HOOKS_LOGS);
  const [ingame] = useWindow(INGAME, DISPLAY_OVERWOLF_HOOKS_LOGS);

  const { matchInfo, me ,gameInfo, kill } = useSelector(
    (state: RootReducer) => state.background,
  );

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


  const startPresence = useCallback(async () => {
    const valorant = await getValorantGame();
    if (valorant) {
      if (isReady()) return setIngamePresence(matchInfo,me,gameInfo,kill)
      initialize().then(() => {
        setIngamePresence(matchInfo,me,gameInfo,kill)
      });
    } else {
      dispose();
    }
  },[matchInfo,me,gameInfo,kill])

  useEffect(() => {
    startApp("on initial load");
    startPresence();
    overwolf.games.onGameInfoUpdated.addListener(async (event) => {
      if (
        event.runningChanged &&
        event.gameInfo?.classId === VALORANT_CLASS_ID
      ) {
        startApp("onGameInfoUpdated");
        startPresence()
      }
    });
    overwolf.extensions.onAppLaunchTriggered.addListener(() => {
      startApp("onAppLaunchTriggered");
      startPresence()
    });
    return () => {
      overwolf.games.onGameInfoUpdated.removeListener(() => {});
      overwolf.extensions.onAppLaunchTriggered.removeListener(() => {});
    };
  }, [startApp,startPresence]);

  return null;
};

export default BackgroundWindow;
