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