import { WINDOW_NAMES } from "app/shared/constants";
import { isDev } from "./utils";
import { log } from "./log";

async function obtainDeclaredWindow(
  windowName: string,
): Promise<overwolf.windows.WindowInfo> {
  return new Promise((resolve, reject) => {
    overwolf.windows.obtainDeclaredWindow(windowName, (result) => {
      if (result.success) {
        resolve(result.window);
      } else {
        reject(result.error);
      }
    });
  });
}

async function getCurrentWindow(windowName: string | null): Promise<string> {
  if (isDev) {
    /* 
    settings, in_game, desktop, notification 
    */
    log(
      `Running in dev mode, returning ${windowName || WINDOW_NAMES.DESKTOP} window, you can change this in src/lib/overwolf-essentials.ts: getCurrent`,
      "src/lib/overwolf-essentials.ts",
      "getCurrentWindow",
    );
    return Promise.resolve(windowName || WINDOW_NAMES.DESKTOP);
  }
  return new Promise<string>((resolve, reject) => {
    overwolf.windows.getCurrentWindow((result) => {
      if (result.success) {
        resolve(result.window.name);
      } else {
        reject(result.error);
      }
    });
  });
}

function getMonitorsList(): Promise<overwolf.utils.Display[]> {
  return new Promise<overwolf.utils.Display[]>((resolve) => {
    overwolf.utils.getMonitorsList((result) => {
      resolve(result.displays);
    });
  });
}

export { obtainDeclaredWindow, getMonitorsList, getCurrentWindow };
