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

export type RaceDataUserStatus = {
    address: string,
    isReady: boolean,
    lastUpdate: number,
    position: number,
    speed: number,
}

export type RaceData = {
    id: string,
    betAmount: number,
    betPool: string,
    entryFee: number,
    loser: string,
    player1Address: string,
    player2Address: string,
    player1DisplayName: string,
    player1Car: string,
    player2Car: string,
    player2DisplayName: string,
    playerAddresses: string[],
    players: {0: RaceDataUserStatus, 1: RaceDataUserStatus},
    race: string,
    status: string,
    timeMatchmade: number,
    timeRaceStarted: number,
    timeRaceEnded: number,
    winner: string,
}
