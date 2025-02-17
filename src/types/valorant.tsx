export const ValorantRanks = {
  0: "Unranked",
  3: "Iron 1",
  4: "Iron 2",
  5: "Iron 3",
  6: "Bronze 1",
  7: "Bronze 2",
  8: "Bronze 3",
  9: "Silver 1",
  10: "Silver 2",
  11: "Silver 3",
  12: "Gold 1",
  13: "Gold 2",
  14: "Gold 3",
  15: "Platinum 1",
  16: "Platinum 2",
  17: "Platinum 3",
  18: "Diamond 1",
  19: "Diamond 2",
  20: "Diamond 3",
  21: "Ascendant 1",
  22: "Ascendant 2",
  23: "Ascendant 3",
  24: "Immortal 01",
  25: "Immortal 02",
  26: "Immortal 03",
  27: "Radiant"
} as const;

export interface ValorantInfoUpdate extends overwolf.games.events.InfoUpdate2 {
  match_info?: {
    map?: string | null;
    roster_0?: any | null;
    roster_1?: any | null;
    roster_2?: any | null;
    roster_3?: any | null;
    roster_4?: any | null;
    roster_5?: any | null;
    roster_6?: any | null;
    roster_7?: any | null;
    roster_8?: any | null;
    roster_9?: any | null;
    roster_10?: any | null;
    roster_11?: any | null;
    roster_12?: any | null;
    roster_13?: any | null;
    roster_14?: any | null;
    roster_15?: any | null;
    roster_16?: any | null;
    roster_17?: any | null;
    roster_18?: any | null;
    roster_19?: any | null;
    roster_20?: any | null;
    roster_21?: any | null;
    roster_22?: any | null;
    roster_23?: any | null;
    roster_24?: any | null;
    roster_25?: any | null;
    roster_26?: any | null;
    roster_27?: any | null;
    round_number?: string | null;
    score?: {
      won: number;
      lost: number;
    } | null;
    game_mode?: {
      mode: string;
      custom: boolean;
      ranked: string
    } | null;
    [key: string]: any;
  };
}