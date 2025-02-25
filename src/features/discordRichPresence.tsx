import { OverwolfPlugin } from "lib/overwolfplugin";

let discordRichPresence: any;
let isDiscordReady = false

export interface Presence {
  details: string;
  state: string;
  timestamps?: {
    start: number
    end: number | null
  }
  assets: {
    large_image: string;
    large_text: string;
    small_image?: string;
    small_text?: string;
  }
}

export function isReady() {
  return isDiscordReady
}

export function dispose() {
  if (!isReady()) return
  isDiscordReady = false
  // Dispose connection to Discord
  discordRichPresence.dispose();
}

async function createPlugin() {
  return new Promise((resolve, reject) => {
    // Create a new instance of the plugin
    const plugin = new OverwolfPlugin('discordPlugin', true);

    // Initialize the plugin by the get method
    // and store the instance in the DRP variable
    plugin.initialize(async (status: any) => {
      if (status === true) {
        try {
          discordRichPresence = await plugin.get();
          isDiscordReady = true
          console.log('[discord] Plugin loaded!', status);
          resolve(true);
        } catch (error) {
          console.log('[discord] Error loading plugin!');
          console.error(error);
        }
      }
    });
  });
}

export async function initialize() {
  if (isReady()) return
  try {
    await createPlugin().then(() => {
      discordRichPresence.initApp('1341151669777469550');
      console.log('[discord] Plugin initialized!');
    });

    // Registering the event listeners
    /* discordRichPresence.onReady.addListener(msg => {
    }); */
    /* discordRichPresence.onError.addListener(msg => console.log(JSON.stringify(msg)));
    discordRichPresence.onPresenceUpdate.addListener(msg => console.log(JSON.stringify(msg))); */

  } catch (error) {
    console.log(`[discord] Error initializing plugin!\r\n${error}`);
    console.error(error);
  }
}

export function setPresence(presence: any) {
  if (!isReady()) return
  try {
    discordRichPresence.setPresence(presence);
  } catch (e) {
    console.log(e);
  }
}

export function clearPresence() {
  if (!isReady()) return
  try {
    //discordRichPresence.clearPresence([]);
  } catch (e) {
    console.log(e);
  }
}
