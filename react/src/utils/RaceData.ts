import { createContext } from "react"
import { RaceData } from "./Types";

const nullRace: RaceData = {
    id: "",
    player1Address: "",
    player2Address: "",
    player1DisplayName: "",
    player1Car: "",
    player2Car: "",
    player2DisplayName: "",
    status: "",
    timeMatchmade: 0,
    timeRaceStarted: 0,
    timeRaceEnded: 0,
    race: "",
    betPool: "",
    entryFee: 0,
    betAmount: 0,
    winner: "",
    loser: "",
    players: [],
    playerReadyStatus: [],
}
  
export const RaceContext = createContext<RaceData | null>(null);
