export type Track = {
    name: string;
    description: string;
    image: string;
    currentPlayers: number;
    avgWaitTime: number;
}

export type BettingPoolCardProps = {
    trackName: string;
    bettingPoolName: string;
    bettingPoolEntryFee: number;
    bettingPoolBet: number;
    onClick: () => void;
}

export type RaceData = {
    id: string,
    player1Address: string,
    player2Address: string,
    player1DisplayName: string,
    player1Car: string,
    player2Car: string,
    player2DisplayName: string,
    status: string,
    timeMatchmade: number,
    timeRaceStarted: number,
    timeRaceEnded: number,
    race: string,
    betPool: string,
    entryFee: number,
    betAmount: number,
    winner: string,
    loser: string,
    players: string[],
    playerReadyStatus: boolean[],
}
