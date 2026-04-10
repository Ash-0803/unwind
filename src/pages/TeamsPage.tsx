import React, { useState, useCallback } from "react";
import type { Team, TeamGenerationMode } from "../types";
import { initialPlayers, TEAM_COLORS, TEAM_NAMES } from "../data/players";
import TeamCard from "../components/TeamCard";
import { useNavigate } from "react-router-dom";

interface TeamsPageProps {
    teams: Team[];
    onUpdateTeams: (teams: Team[]) => void;
    onStartGame: (rounds: number) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function generateTeams(
    numTeams: number,
    colors: string[],
    names: string[],
): Team[] {
    const shuffled = shuffleArray(initialPlayers);
    const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
        id: `team-${i}`,
        name: names[i] ?? `Team ${String.fromCharCode(65 + i)}`,
        players: [],
        score: 0,
        color: colors[i % colors.length],
    }));

    shuffled.forEach((player, idx) => {
        teams[idx % numTeams].players.push(player);
    });

    return teams;
}

const TeamsPage: React.FC<TeamsPageProps> = ({
    teams,
    onUpdateTeams,
    onStartGame,
}) => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<TeamGenerationMode>("numTeams");
    const [numTeams, setNumTeams] = useState(2);
    const [teamSize, setTeamSize] = useState(9);
    const [isFullView, setIsFullView] = useState(false);
    const [rounds, setRounds] = useState(3);

    const totalPlayers = initialPlayers.length;

    const computedNumTeams =
        mode === "numTeams" ? numTeams : Math.ceil(totalPlayers / teamSize);

    const handleGenerate = useCallback(() => {
        const count = Math.max(1, Math.min(computedNumTeams, 8));
        const newTeams = generateTeams(count, TEAM_COLORS, TEAM_NAMES);
        onUpdateTeams(newTeams);
        setIsFullView(false);
    }, [computedNumTeams, onUpdateTeams]);

    const handleConfirmTeams = () => {
        setIsFullView(true);
    };

    const handleStart = () => {
        onStartGame(rounds);
        navigate("/scoreboard");
    };

    if (isFullView) {
        return (
            <div className="page full-teams-view">
                <div className="page-header">
                    <h1 className="page-title">
                        The <span className="gradient-text">Lineup</span>
                    </h1>
                    <p className="page-subtitle">Teams are ready for action</p>
                </div>

                <div className="full-teams-layout">
                    {teams.map((team, i) => (
                        <div
                            key={team.id}
                            className="full-team-column"
                            style={
                                {
                                    "--accent": team.color,
                                    "--delay": `${i * 100}ms`,
                                } as React.CSSProperties
                            }
                        >
                            <div className="full-team-header">
                                <div
                                    className="full-team-badge"
                                    style={{ background: team.color }}
                                >
                                    {team.name[0]}
                                </div>
                                <h2>{team.name}</h2>
                            </div>
                            <div className="full-team-players">
                                {team.players.map((p) => (
                                    <div key={p.id} className="full-player-row">
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="mini-avatar"
                                        />
                                        <span>{p.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="game-setup-panel glass-card">
                    <div className="rounds-config">
                        <label>Number of Rounds:</label>
                        <div className="rounds-buttons">
                            {[1, 3, 5, 7].map((r) => (
                                <button
                                    key={r}
                                    className={`round-btn ${rounds === r ? "active" : ""}`}
                                    onClick={() => setRounds(r)}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="setup-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setIsFullView(false)}
                        >
                            Re-generate
                        </button>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleStart}
                        >
                            Start Match ⚡
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">
                    Team <span className="gradient-text">Generator</span>
                </h1>
                <p className="page-subtitle">
                    Randomly distribute {totalPlayers} players into balanced
                    teams
                </p>
            </div>

            <div className="config-panel">
                <div className="mode-tabs">
                    <button
                        className={`mode-tab ${mode === "numTeams" ? "active" : ""}`}
                        onClick={() => setMode("numTeams")}
                    >
                        Number of Teams
                    </button>
                    <button
                        className={`mode-tab ${mode === "teamSize" ? "active" : ""}`}
                        onClick={() => setMode("teamSize")}
                    >
                        Players per Team
                    </button>
                </div>

                <div className="config-control">
                    {mode === "numTeams" ? (
                        <div className="slider-group">
                            <label>
                                Teams: <strong>{numTeams}</strong>
                                <span className="label-hint">
                                    (~{Math.ceil(totalPlayers / numTeams)}{" "}
                                    players each)
                                </span>
                            </label>
                            <div className="slider-row">
                                {[2, 3, 4, 6].map((n) => (
                                    <button
                                        key={n}
                                        className={`num-btn ${numTeams === n ? "active" : ""}`}
                                        onClick={() => setNumTeams(n)}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="slider-group">
                            <label>
                                Players per team: <strong>{teamSize}</strong>
                                <span className="label-hint">
                                    (→ {Math.ceil(totalPlayers / teamSize)}{" "}
                                    teams)
                                </span>
                            </label>
                            <div className="slider-row">
                                {[3, 4, 6, 9].map((n) => (
                                    <button
                                        key={n}
                                        className={`num-btn ${teamSize === n ? "active" : ""}`}
                                        onClick={() => setTeamSize(n)}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button
                    className="btn btn-primary btn-generate"
                    onClick={handleGenerate}
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        width="20"
                        height="20"
                    >
                        <polyline points="1 4 1 10 7 10" />
                        <polyline points="23 20 23 14 17 14" />
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                    </svg>
                    {teams.length > 0 ? "Regenerate Teams" : "Generate Teams"}
                </button>
            </div>

            {teams.length > 0 && (
                <>
                    <div className="teams-grid">
                        {teams.map((team, i) => (
                            <TeamCard
                                key={team.id}
                                team={team}
                                onScoreChange={() => {}}
                                showScore={false}
                                animationDelay={i * 80}
                            />
                        ))}
                    </div>
                    <div className="generator-footer">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleConfirmTeams}
                        >
                            Confirm Teams & Continue →
                        </button>
                    </div>
                </>
            )}

            {teams.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">⚡</div>
                    <h2>Ready to shuffle?</h2>
                    <p>Configure your teams above and hit Generate!</p>
                </div>
            )}
        </div>
    );
};

export default TeamsPage;
