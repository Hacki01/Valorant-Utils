import { Presence, setPresence } from "features/discordRichPresence";
import { GameInfo, Kill, MatchInfo, Me } from "screens/background/stores/background";
import { ValorantAgents, ValorantMaps, ValorantModes } from "types/valorant";

let gameStartTime : number | null = null

function setMainMenuPresence() {
  let presence : Presence = {
    details: "Main Menu",
    state: "Idle",
    assets: {
      large_image: "menu",
      large_text: "In main menu",
    }
  }
  setPresence(presence)
}


export function setIngamePresence(matchInfo: MatchInfo, me: Me, gameInfo: GameInfo, kill:Kill) {
  if (!matchInfo.map || !matchInfo.game_mode) return setMainMenuPresence()
  let map = ValorantMaps[matchInfo.map as keyof typeof ValorantMaps] as string
  let gamemode = matchInfo.game_mode.mode
  let gameScene = gameInfo.scene
  let custom = matchInfo.game_mode.custom === true ? "Custom game - " : ""
  if (gamemode === 'range') custom = ""

  let state = ''

  if (gameScene === "CharacterSelectPersistentLevel") {
    state = "Agent Select"
    gameStartTime = null
  } else {
    if (gameStartTime === null) gameStartTime = Date.now()
    switch (gamemode) {
      case "bomb":
      case "swift":
      case "quick_bomb":
        state = `${matchInfo?.score?.won  || 0}-${matchInfo?.score?.lost || 0}`
        break;
      case "deathmatch":
        state = `${kill.kills || 0} Kills`
        break;
      case "range":
        state = "Training"
        break;
      case "escalation":
        if (matchInfo.team === 'attack') {
          state = `Team stage: ${matchInfo.escalationStage?.attacker || 0} Enemy stage: ${matchInfo.escalationStage?.defender || 0}`
        } else {
          state = `Team stage: ${matchInfo.escalationStage?.defender || 0} Enemy stage: ${matchInfo.escalationStage?.attacker || 0}`
        }
        break;
      case "team_deathmatch":
        /* Add a sum of team and enemiesw kills */
        state = `${kill.kills || 0} Kills`
        break;
    }
  }

  if (gamemode === "bomb") {
    gamemode = matchInfo.game_mode.ranked === "1" ? "Competitive" : "Unrated"
  } else {
    gamemode = ValorantModes[gamemode as keyof typeof ValorantModes]
  }




  let presence : Presence = {
    details: custom + gamemode,
    state: state,
    assets: {
      large_image: map.toLowerCase(),
      large_text: map,
    }
  }

  if (gameStartTime) {
    presence.timestamps = {
      start: gameStartTime,
      end: null
    }
  }

  if (me.agent) {
    presence.assets= {
      ...presence.assets,
      small_image: ValorantAgents[me.agent as keyof typeof ValorantAgents].toLowerCase(),
      small_text: ValorantAgents[me.agent as keyof typeof ValorantAgents]
    }
  }

  setPresence(presence)
}