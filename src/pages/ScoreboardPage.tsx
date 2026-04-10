import React, { useState, useEffect, useRef, useCallback } from "react";
import type { GameState, TimerState } from "../types";
import ScoreController from "../components/ScoreController";
import Timer from "../components/Timer";
import { useNavigate } from "react-router-dom";

interface ScoreboardPageProps {
    gameState: GameState;
    onUpdateScore: (roundNumber: number, teamId: string, score: number) => void;
    onUpdateTime: (roundNumber: number, teamId: string, time: number) => void;
    onNextRound: () => void;
    onReset: () => void;
}

function makeTimer(duration = 60): TimerState {
    return { duration, remaining: duration, isRunning: false };
}

function formatLoggedTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
}

const ScoreboardPage: React.FC<ScoreboardPageProps> = ({
    gameState,
    onUpdateScore,
    onUpdateTime,
    onNextRound,
    onReset,
}) => {
    const navigate = useNavigate();
    const { teams, currentRound, totalRounds, roundResults, isStarted } =
        gameState;

    // Local timer state for the current round
    const [timer, setTimer] = useState<TimerState>(makeTimer(60));
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearTick = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const handleTimerStart = useCallback(() => {
        if (timer.remaining === 0) return;
        setTimer((t) => ({ ...t, isRunning: true }));
    }, [timer.remaining]);

    const handleTimerPause = useCallback(() => {
        setTimer((t) => ({ ...t, isRunning: false }));
    }, []);

    const handleTimerReset = useCallback(() => {
        clearTick();
        setTimer((t) => ({ ...t, remaining: t.duration, isRunning: false }));
    }, []);

    const handleDurationChange = useCallback((duration: number) => {
        clearTick();
        setTimer({ duration, remaining: duration, isRunning: false });
    }, []);

    useEffect(() => {
        if (timer.isRunning) {
            intervalRef.current = setInterval(() => {
                setTimer((t) => {
                    if (t.remaining <= 1) {
                        clearInterval(intervalRef.current!);
                        intervalRef.current = null;
                        return { ...t, remaining: 0, isRunning: false };
                    }
                    return { ...t, remaining: t.remaining - 1 };
                });
            }, 1000);
        } else {
            clearTick();
        }
        return clearTick;
    }, [timer.isRunning]);

    useEffect(() => {
        handleTimerReset();
    }, [currentRound, handleTimerReset]);

    if (!isStarted || teams.length === 0) {
        return (
            <div className="page center-empty">
                <div className="empty-state">
                    <div className="empty-icon">🎮</div>
                    <h2>No Active Match</h2>
                    <p>
                        Generate teams and start a match to see the scoreboard.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/teams")}
                    >
                        Go to Teams
                    </button>
                </div>
            </div>
        );
    }

    const currentRoundResults = roundResults.find(
        (r) => r.roundNumber === currentRound,
    );

    return (
        <div className="page scoreboard-flow">
            <div className="page-header duel-page-header">
                <div className="header-round-info">
                    <div
                        className="shuffler-top-actions"
                        style={{ marginBottom: "12px" }}
                    >
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={onReset}
                        >
                            Reset Match
                        </button>
                    </div>
                    <div className="round-indicator">
                        Round{" "}
                        <span className="round-current">{currentRound}</span>
                        <span className="round-total">/ {totalRounds}</span>
                    </div>
                    <h1 className="page-title">
                        Live <span className="gradient-text">Match</span>
                    </h1>
                </div>

                <div className="scoreboard-timer-section">
                    <Timer
                        timer={timer}
                        onStart={handleTimerStart}
                        onPause={handleTimerPause}
                        onReset={handleTimerReset}
                        onDurationChange={handleDurationChange}
                    />
                </div>
            </div>

            <div
                className={`duel-container ${teams.length === 2 ? "two-teams" : "multi-teams"}`}
            >
                {teams.map((team) => (
                    <div
                        key={team.id}
                        className="duel-team-card"
                        style={
                            { "--accent": team.color } as React.CSSProperties
                        }
                    >
                        <div className="duel-header">
                            <h2 className="duel-team-name">{team.name}</h2>
                            <div
                                className="duel-total-score"
                                style={{ color: team.color }}
                            >
                                {team.score}
                            </div>
                        </div>

                        <div className="round-controls-grid">
                            <div className="round-score-box glass-card">
                                <div className="box-label">Round Score</div>
                                <ScoreController
                                    score={
                                        currentRoundResults?.scores[team.id] ||
                                        0
                                    }
                                    onScoreChange={(score) =>
                                        onUpdateScore(
                                            currentRound,
                                            team.id,
                                            score,
                                        )
                                    }
                                    accentColor={team.color}
                                />
                            </div>

                            <div className="round-time-box glass-card">
                                <div className="box-label">Round Time</div>
                                <div className="time-log-container">
                                    <span className="logged-time">
                                        {currentRoundResults?.times[team.id] !==
                                        undefined
                                            ? formatLoggedTime(
                                                  currentRoundResults.times[
                                                      team.id
                                                  ],
                                              )
                                            : "--"}
                                    </span>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() =>
                                            onUpdateTime(
                                                currentRound,
                                                team.id,
                                                timer.duration -
                                                    timer.remaining,
                                            )
                                        }
                                    >
                                        Log Time
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="team-players-minimal">
                            {team.players.map((p) => (
                                <div key={p.id} className="player-chip">
                                    <img
                                        src={p.image}
                                        alt=""
                                        className="chip-img"
                                    />
                                    <span>{p.name.split(" ")[0]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="match-history glass-card">
                <h3>Match History & Logs</h3>
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Round</th>
                            {teams.map((t) => (
                                <th key={t.id} style={{ color: t.color }}>
                                    {t.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from(
                            { length: totalRounds },
                            (_, i) => i + 1,
                        ).map((rNum) => {
                            const rRes = roundResults.find(
                                (r) => r.roundNumber === rNum,
                            );
                            return (
                                <tr
                                    key={rNum}
                                    className={
                                        rNum === currentRound
                                            ? "current-row"
                                            : ""
                                    }
                                >
                                    <td className="round-cell">R{rNum}</td>
                                    {teams.map((t) => (
                                        <td key={t.id}>
                                            <div className="history-cell-content">
                                                <span className="cell-score">
                                                    {rRes?.scores[t.id] ?? "-"}
                                                </span>
                                                <span className="cell-time">
                                                    {rRes?.times[t.id] !==
                                                    undefined
                                                        ? formatLoggedTime(
                                                              rRes.times[t.id],
                                                          )
                                                        : ""}
                                                </span>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="match-actions">
                {currentRound === totalRounds ? (
                    <button
                        className="btn btn-primary btn-lg pulse"
                        onClick={() => navigate("/")}
                    >
                        Finish Match 🎉
                    </button>
                ) : (
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={onNextRound}
                    >
                        Next Round →
                    </button>
                )}
            </div>
        </div>
    );
};

export default ScoreboardPage;
