import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import TeamsPage from "./pages/TeamsPage";
import ScoreboardPage from "./pages/ScoreboardPage";
import TimerPage from "./pages/TimerPage";
import type { GameState, Team } from "./types";
import "./App.css";

const STORAGE_KEY = "unwind_game_state";

const initialGameState: GameState = {
    teams: [],
    totalRounds: 3,
    currentRound: 1,
    roundResults: [],
    isStarted: false,
};

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Failed to load state", e);
            }
        }
        return initialGameState;
    });

    // Persist state on change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }, [gameState]);

    const handleUpdateTeams = (teams: Team[]) => {
        setGameState((prev) => ({ ...prev, teams, isStarted: false }));
    };

    const handleStartGame = (totalRounds: number) => {
        setGameState((prev) => ({
            ...prev,
            totalRounds,
            currentRound: 1,
            roundResults: [],
            isStarted: true,
        }));
    };

    const handleUpdateScore = (
        roundNumber: number,
        teamId: string,
        score: number,
    ) => {
        setGameState((prev) => {
            const results = [...prev.roundResults];
            const roundIdx = results.findIndex(
                (r) => r.roundNumber === roundNumber,
            );

            const updatedScores =
                roundIdx > -1
                    ? { ...results[roundIdx].scores, [teamId]: score }
                    : { [teamId]: score };

            const updatedTimes = roundIdx > -1 ? results[roundIdx].times : {};

            if (roundIdx > -1) {
                results[roundIdx] = {
                    ...results[roundIdx],
                    scores: updatedScores,
                };
            } else {
                results.push({
                    roundNumber,
                    scores: updatedScores,
                    times: updatedTimes,
                });
            }

            // Sync total team scores
            const updatedTeams = prev.teams.map((team) => {
                const totalScore = results.reduce(
                    (acc, r) => acc + (r.scores[team.id] || 0),
                    0,
                );
                return { ...team, score: totalScore };
            });

            return { ...prev, roundResults: results, teams: updatedTeams };
        });
    };

    const handleUpdateTime = (
        roundNumber: number,
        teamId: string,
        time: number,
    ) => {
        setGameState((prev) => {
            const results = [...prev.roundResults];
            const roundIdx = results.findIndex(
                (r) => r.roundNumber === roundNumber,
            );

            const updatedTimes =
                roundIdx > -1
                    ? { ...results[roundIdx].times, [teamId]: time }
                    : { [teamId]: time };

            const updatedScores = roundIdx > -1 ? results[roundIdx].scores : {};

            if (roundIdx > -1) {
                results[roundIdx] = {
                    ...results[roundIdx],
                    times: updatedTimes,
                };
            } else {
                results.push({
                    roundNumber,
                    scores: updatedScores,
                    times: updatedTimes,
                });
            }
            return { ...prev, roundResults: results };
        });
    };

    const handleNextRound = () => {
        setGameState((prev) => ({
            ...prev,
            currentRound: Math.min(prev.currentRound + 1, prev.totalRounds),
        }));
    };

    const handleResetGame = () => {
        if (
            window.confirm(
                "Are you sure you want to reset the current game? Teams and scores will be cleared.",
            )
        ) {
            setGameState(initialGameState);
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    return (
        <BrowserRouter>
            <div className="app">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route
                            path="/teams"
                            element={
                                <TeamsPage
                                    teams={gameState.teams}
                                    onUpdateTeams={handleUpdateTeams}
                                    onStartGame={handleStartGame}
                                    onReset={handleResetGame}
                                />
                            }
                        />
                        <Route
                            path="/scoreboard"
                            element={
                                <ScoreboardPage
                                    gameState={gameState}
                                    onUpdateScore={handleUpdateScore}
                                    onUpdateTime={handleUpdateTime}
                                    onNextRound={handleNextRound}
                                    onReset={handleResetGame}
                                />
                            }
                        />
                        <Route path="/timer" element={<TimerPage />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
};

export default App;
