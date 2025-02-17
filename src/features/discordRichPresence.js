import { OverwolfPlugin } from "lib/overwolfplugin";

let _discordRichPresence;

async function createPlugin() {
  return new Promise((resolve, reject) => {
    // Create a new instance of the plugin
    const plugin = new OverwolfPlugin('discordPlugin', true);

    // Initialize the plugin by the get method
    // and store the instance in the DRP variable
    plugin.initialize(async (status) => {
      if (status === true) {
        try {
          _discordRichPresence = await plugin.get();
          console.log('[discord] Plugin loaded!', status);
          console.log('[discord] Plugin loaded!');
          resolve();
        } catch (error) {
          console.log('[discord] Error loading plugin!');
          console.error(error);
        }
      }
    });
  });
}

export async function initialize() {
  try {
    await createPlugin();

    // Registering the event listeners
    _discordRichPresence.onReady.addListener(msg => console.log(JSON.stringify(msg)));
    _discordRichPresence.onError.addListener(msg => console.log(JSON.stringify(msg)));
    _discordRichPresence.onPresenceUpdate.addListener(msg => console.log(JSON.stringify(msg)));

    _discordRichPresence.initApp('1341151669777469550');
    console.log('[discord] Plugin initialized!');
  } catch (error) {
    console.log(`[discord] Error initializing plugin!\r\n${error}`);
    console.error(error);
  }
}

function dispose() {
  // Dispose connection to Discord
  _discordRichPresence.Dispose();
  console.log('[discord] Disposing plugin!');
}

function initializeFromButton() {
  try {
    _discordRichPresence.initialize('1341151669777469550');
    console.log('[discord] Plugin initialized!');
  } catch (e) {
    console.log('[discord] Failed to initialize plugin!');
  }
}

export function setPresence() {
  const withRunningTimestamp = false;
  const withImages = true;
  const withButtons = false;

  const details = 'Overwolf Rich Presence';
  const state = 'TU BĘDZIE MAPA';

  const presence = {
    details,
    state,
  };

  // timestamps
  if (withRunningTimestamp) {
    presence.timestamps = {
      start: Date.now(),
      end: null // This allows to limit the timer
    };
  }

  // images
  if (withImages) {
    presence.assets = {
      large_image: 'https://media.forgecdn.net/game-box-art/1_9b0a8ff4-90c0-4d72-967c-c2c60b8029f7.webp',
      large_text: 'sharmota',
      small_image: 'https://static-beta.curseforge.com/images/cf_legacy.png',
      small_text: 'slime'
    };
  }

  // buttons
  if (withButtons) {
    // Up to 2 buttons are allowed
    presence.buttons = [{
      label: 'Outplayed.tv',
      url: 'https://outplayed.tv'
    }, {
      label: 'CurseForge.com',
      url: 'https://www.curseforge.com'
    }]
  }

  try {
    _discordRichPresence.setPresence(presence);
  } catch (e) {
    console.log(e);
  }
}

function clearPresence() {
  _discordRichPresence.clearPresence();
}
