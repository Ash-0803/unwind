import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import TeamsPage from "./pages/TeamsPage";
import ScoreboardPage from "./pages/ScoreboardPage";
import TimerPage from "./pages/TimerPage";
import EndScreenPage from "./pages/EndScreenPage";
import TestLoadingPage from "./pages/TestLoadingPage";
import LoadingAnimation from "./components/LoadingAnimation";
import ErrorBoundary from "./components/ErrorBoundary";
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

const AppContent: React.FC = () => {
    const navigate = useNavigate();
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

    const [showLoading, setShowLoading] = useState(true); // Show loading on initial page load

    // Persist state on change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }, [gameState]);

    const handleUpdateTeams = (teams: Team[]) => {
        setShowLoading(true);
        setGameState((prev) => ({ ...prev, teams, isStarted: false }));
        setTimeout(() => setShowLoading(false), 800);
    };

    const handleStartGame = (totalRounds: number) => {
        setShowLoading(true);
        setGameState((prev) => ({
            ...prev,
            totalRounds,
            currentRound: 1,
            roundResults: [],
            isStarted: true,
        }));
        setTimeout(() => setShowLoading(false), 800);
    };

    const handleUpdateScore = (
        roundNumber: number,
        teamId: string,
        score: number,
    ) => {
        setShowLoading(true);
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
        setTimeout(() => setShowLoading(false), 500);
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
        setTimeout(() => setShowLoading(false), 500);
    };

    const handleNextRound = () => {
        setShowLoading(true);
        setGameState((prev) => ({
            ...prev,
            currentRound: Math.min(prev.currentRound + 1, prev.totalRounds),
        }));
        setTimeout(() => setShowLoading(false), 800);
    };

    const handleResetGame = () => {
        if (
            window.confirm(
                "Are you sure you want to reset the current game? Teams and scores will be cleared.",
            )
        ) {
            setGameState(initialGameState);
            localStorage.removeItem(STORAGE_KEY);
            navigate('/teams');
        }
    };

    return (
        <div className="app">
            <Navbar />
            <main className="main-content">
                {showLoading && (
                    <LoadingAnimation 
                        message="Loading game..."
                        duration={2000}
                        onComplete={() => setShowLoading(false)}
                    />
                )}
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
                    <Route 
                        path="/end" 
                        element={
                            <ErrorBoundary>
                                <EndScreenPage 
                                    teams={gameState.teams}
                                    onNewGame={handleResetGame}
                                />
                            </ErrorBoundary>
                        } 
                        />
                    <Route path="/test-loading" element={<TestLoadingPage />} />
                    <Route path="/timer" element={<TimerPage />} />
                </Routes>
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
};

export default App;
