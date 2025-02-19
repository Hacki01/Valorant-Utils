import { OverwolfPlugin } from "lib/overwolfplugin";

let _discordRichPresence: any;
let isDiscordReady = false

export interface Presence {
  details: string;
  state: string;
  assets: {
    large_image: string;
    large_text: string;
    small_image?: string;
    small_text?: string;
  }
}

export function isReady() {
  return isDiscordReady || false
}

export function dispose() {
  // Dispose connection to Discord
  _discordRichPresence.dispose();
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
          _discordRichPresence = await plugin.get();
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
    await createPlugin();

    // Registering the event listeners
    /* _discordRichPresence.onReady.addListener(msg => {
    }); */
    /* _discordRichPresence.onError.addListener(msg => console.log(JSON.stringify(msg)));
    _discordRichPresence.onPresenceUpdate.addListener(msg => console.log(JSON.stringify(msg))); */

    _discordRichPresence.initApp('1341151669777469550');
    isDiscordReady = true
    console.log('[discord] Plugin initialized!');
  } catch (error) {
    console.log(`[discord] Error initializing plugin!\r\n${error}`);
    console.error(error);
  }
}

export function setPresence(presence: any) {
  try {
    _discordRichPresence.setPresence(presence);
  } catch (e) {
    console.log(e);
  }
}

export function clearPresence() {
  if (!isReady()) return
  try {
    //_discordRichPresence.clearPresence([]);
  } catch (e) {
    console.log(e);
  }
}
