export enum ValorantModes {
  quick_bomb = "Spike Rush",
  deathmatch = "Deathmatch",
  escalation = "Escalation",
  swift = "Swiftplay",
  range = "Range",
  team_deathmatch = "Team Deathmatch"
}

export enum ValorantMaps {
  Infinity = "Abyss",
  Triad = "Haven",
  Duality = "Bind",
  Bonsai = "Split",
  Ascent = "Ascent",
  Port = "Icebox",
  Foxtrot = "Breeze",
  Canyon = "Fracture",
  Pitt = "Pearl",
  Jam = "Lotus",
  Juliett = "Sunset",
  Range = "Range",
  HURM_Alley = "District",
  HURM_Yard = "Piazza",
  HURM_Bowl = "Kasbah",
  HURM_Helix = "Drift",
  HURM_HighTide = "Glitch",
}

export enum ValorantAgents {
  Clay_PC_C = "Raze",
  Pandemic_PC_C = "Viper",
  Wraith_PC_C = "Omen",
  Hunter_PC_C = "Sova",
  Thorne_PC_C = "Sage",
  Phoenix_PC_C = "Phoenix",
  Wushu_PC_C = "Jett",
  Gumshoe_PC_C = "Cypher",
  Sarge_PC_C = "Brimstone",
  Breach_PC_C = "Breach",
  Vampire_PC_C = "Reyna",
  Killjoy_PC_C = "Killjoy",
  Guide_PC_C = "Skye",
  Stealth_PC_C = "Yoru",
  Rift_PC_C = "Astra",
  Grenadie_PC_C = 'KAY/O',
  Deadeye_PC_C = "Chamber",
  Sprinter_PC_C = "Neon",
  BountyHunter_PC_C = "Fade",
  Mage_PC_C = "Harbor",
  AggroBot_PC_C = "Gekko",
  Cable_PC_C = "Deadlock",
  Sequoia_PC_C = "Iso",
  Smonk_PC_C = "Clove",
  Nox_PC_C = "Vyse",
  Cashew_PC_C = "Tejo",
}

export interface ValorantInfoUpdate extends overwolf.games.events.InfoUpdate2 {
  match_info?: {
    map?: string | null;
    roundNumber?: string | null;
    score?: string | null;
    game_mode?: string | null;
    escalationStage?: {
      attacker: string | null;
      defender: string | null;
    } | null;
    team?: string | null;
    [key: string]: any;
  };
  me?: {
    agent?: string | null;
  };
  game_info?: {
    scene?: string | null;
  };
  kill?: {
    kills: string | null;
    headshots: string | null;
    assists: string | null;
  }
  death?: {
    deaths: string | null;
  }
}