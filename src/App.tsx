import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import TeamsPage from "./pages/TeamsPage";
import ScoreboardPage from "./pages/ScoreboardPage";
import TimerPage from "./pages/TimerPage";
import type { GameState, Team } from "./types";
import "./App.css";

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        teams: [],
        totalRounds: 3,
        currentRound: 1,
        roundResults: [],
        isStarted: false,
    });

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

            if (roundIdx > -1) {
                results[roundIdx] = {
                    ...results[roundIdx],
                    scores: { ...results[roundIdx].scores, [teamId]: score },
                };
            } else {
                results.push({
                    roundNumber,
                    scores: { [teamId]: score },
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

    const handleNextRound = () => {
        setGameState((prev) => ({
            ...prev,
            currentRound: Math.min(prev.currentRound + 1, prev.totalRounds),
        }));
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
                                />
                            }
                        />
                        <Route
                            path="/scoreboard"
                            element={
                                <ScoreboardPage
                                    gameState={gameState}
                                    onUpdateScore={handleUpdateScore}
                                    onNextRound={handleNextRound}
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
