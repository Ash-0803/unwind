export interface Player {
    id: number;
    name: string;
    image: string;
}

export interface Team {
    id: string;
    name: string;
    players: Player[];
    score: number;
    color: string;
}

export type TeamGenerationMode = "numTeams" | "teamSize" | "custom";

export interface TimerState {
    duration: number; // in seconds
    remaining: number;
    isRunning: boolean;
}

export interface RoundResult {
    roundNumber: number;
    scores: Record<string, number>; // teamId -> score in this round
    times: Record<string, number>; // teamId -> time taken (in seconds) in this round
}

export interface GameState {
    teams: Team[];
    totalRounds: number;
    currentRound: number; // 1-indexed
    roundResults: RoundResult[];
    isStarted: boolean;
}
