import React from "react";
import type { GameState } from "../types";
import ScoreController from "../components/ScoreController";
import { useNavigate } from "react-router-dom";

interface ScoreboardPageProps {
    gameState: GameState;
    onUpdateScore: (roundNumber: number, teamId: string, score: number) => void;
    onNextRound: () => void;
}

const ScoreboardPage: React.FC<ScoreboardPageProps> = ({
    gameState,
    onUpdateScore,
    onNextRound,
}) => {
    const navigate = useNavigate();
    const { teams, currentRound, totalRounds, roundResults, isStarted } =
        gameState;

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

    const isLastRound = currentRound === totalRounds;
    const currentRoundResults = roundResults.find(
        (r) => r.roundNumber === currentRound,
    );

    return (
        <div className="page scoreboard-flow">
            <div className="page-header">
                <div className="round-indicator">
                    Round <span className="round-current">{currentRound}</span>
                    <span className="round-total">/ {totalRounds}</span>
                </div>
                <h1 className="page-title">
                    Live <span className="gradient-text">Match</span>
                </h1>
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

                        <div className="round-score-box glass-card">
                            <div className="box-label">
                                Round {currentRound} Score
                            </div>
                            <ScoreController
                                score={
                                    currentRoundResults?.scores[team.id] || 0
                                }
                                onScoreChange={(score) =>
                                    onUpdateScore(currentRound, team.id, score)
                                }
                                accentColor={team.color}
                            />
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
                <h3>Match History</h3>
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
                        ).map((rNum) => (
                            <tr
                                key={rNum}
                                className={
                                    rNum === currentRound ? "current-row" : ""
                                }
                            >
                                <td className="round-cell">R{rNum}</td>
                                {teams.map((t) => (
                                    <td key={t.id}>
                                        {roundResults.find(
                                            (r) => r.roundNumber === rNum,
                                        )?.scores[t.id] ?? "-"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="match-actions">
                {isLastRound ? (
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
