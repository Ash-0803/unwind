import React, { useState, useCallback, useMemo } from "react";
import type { Team, TeamGenerationMode, Player } from "../types";
import { initialPlayers, TEAM_COLORS, TEAM_NAMES } from "../data/players";
import TeamCard from "../components/TeamCard";
import CustomTeamSelector from "../components/CustomTeamSelector";
import { useNavigate } from "react-router-dom";

interface TeamsPageProps {
    teams: Team[];
    onUpdateTeams: (teams: Team[]) => void;
    onStartGame: (rounds: number) => void;
    onReset: () => void;
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
    players: Player[],
    numTeams: number,
    colors: string[],
    names: string[],
): Team[] {
    const shuffled = shuffleArray(players);
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

type Step = "select" | "shuffle" | "lineup";

const TeamsPage: React.FC<TeamsPageProps> = ({
    teams,
    onUpdateTeams,
    onStartGame,
    onReset,
}) => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>(
        teams.length > 0 ? "shuffle" : "select",
    );
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [mode, setMode] = useState<TeamGenerationMode>("numTeams");
    const [numTeams, setNumTeams] = useState(2);
    const [teamSize, setTeamSize] = useState(4);
    const [rounds, setRounds] = useState(3);
    const [showCustomSelector, setShowCustomSelector] = useState(false);

    const selectedPlayers = useMemo(
        () => initialPlayers.filter((p) => selectedIds.includes(p.id)),
        [selectedIds],
    );

    const togglePlayer = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const selectAll = () => setSelectedIds(initialPlayers.map((p) => p.id));
    const deselectAll = () => setSelectedIds([]);

    const computedNumTeams =
        mode === "numTeams"
            ? numTeams
            : Math.ceil(selectedPlayers.length / teamSize);

    const handleGenerate = useCallback(() => {
        if (selectedPlayers.length === 0) {
            alert("Please select at least one player first!");
            return;
        }
        const count = Math.max(1, Math.min(computedNumTeams, 8));
        const newTeams = generateTeams(
            selectedPlayers,
            count,
            TEAM_COLORS,
            TEAM_NAMES,
        );
        onUpdateTeams(newTeams);
        setStep("shuffle");
    }, [computedNumTeams, onUpdateTeams, selectedPlayers]);

    const handleRemovePlayer = useCallback(
        (teamId: string, playerId: number) => {
            const updatedTeams = teams.map((t) => {
                if (t.id === teamId) {
                    return {
                        ...t,
                        players: t.players.filter((p) => p.id !== playerId),
                    };
                }
                return t;
            });
            onUpdateTeams(updatedTeams);
        },
        [teams, onUpdateTeams],
    );

    const handleStart = () => {
        onStartGame(rounds);
        navigate("/scoreboard");
    };

    // Selection View
    if (step === "select") {
        return (
            <div className="page selection-view">
                <div className="page-header">
                    <h1 className="page-title">
                        Select <span className="gradient-text">Players</span>
                    </h1>
                    <p className="page-subtitle">
                        Who's playing today? ({selectedIds.length} selected)
                    </p>
                    <div className="selection-actions">
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={selectAll}
                        >
                            Select All
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={deselectAll}
                        >
                            Deselect All
                        </button>
                    </div>
                </div>

                <div className="players-selection-grid">
                    {initialPlayers.map((p) => (
                        <div
                            key={p.id}
                            className={`player-select-card ${selectedIds.includes(p.id) ? "selected" : ""}`}
                            onClick={() => togglePlayer(p.id)}
                        >
                            <div className="select-check">
                                {selectedIds.includes(p.id) && (
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>
                            <img
                                src={p.image}
                                alt=""
                                className="player-select-img"
                            />
                            <span className="player-select-name">{p.name}</span>
                        </div>
                    ))}
                </div>

                <div className="selection-footer">
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => setStep("shuffle")}
                        disabled={selectedIds.length === 0}
                    >
                        Continue to Shuffling →
                    </button>
                </div>
            </div>
        );
    }

    // Lineup View
    if (step === "lineup") {
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
                                        <button
                                            className="remove-player-btn"
                                            onClick={() =>
                                                handleRemovePlayer(
                                                    team.id,
                                                    p.id,
                                                )
                                            }
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="game-setup-panel glass-card">
                    <div className="rounds-config">
                        <label>Rounds for Match:</label>
                        <div className="custom-rounds-input">
                            <button
                                className="round-adj-btn"
                                onClick={() =>
                                    setRounds(Math.max(1, rounds - 1))
                                }
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={rounds}
                                onChange={(e) =>
                                    setRounds(
                                        Math.max(
                                            1,
                                            parseInt(e.target.value) || 1,
                                        ),
                                    )
                                }
                                className="rounds-number-input"
                            />
                            <button
                                className="round-adj-btn"
                                onClick={() => setRounds(rounds + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="setup-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setStep("shuffle")}
                        >
                            Back to Shuffler
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

    // Shuffle View
    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">
                    Team <span className="gradient-text">Generator</span>
                </h1>
                <p className="page-subtitle">
                    Randomly distribute {selectedPlayers.length} selected
                    players
                </p>
                <div className="shuffler-top-actions">
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setStep("select")}
                    >
                        ← Change Players
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={onReset}>
                        Reset All
                    </button>
                </div>
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
                    <button
                        className={`mode-tab ${mode === "custom" ? "active" : ""}`}
                        onClick={() => setMode("custom")}
                    >
                        Custom Teams
                    </button>
                </div>

                <div className="config-control">
                    {mode === "numTeams" ? (
                        <div className="slider-group">
                            <label>
                                Teams: <strong>{numTeams}</strong>
                            </label>
                            <div className="slider-row">
                                {[2, 3, 4, 6, 8].map((n) => (
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
                    ) : mode === "teamSize" ? (
                        <div className="slider-group">
                            <label>
                                Players per team: <strong>{teamSize}</strong>
                            </label>
                            <div className="slider-row">
                                {[2, 3, 4, 5, 8].map((n) => (
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
                    ) : mode === "custom" ? (
                        <div className="custom-mode-info">
                            <p>Create custom teams by manually selecting players for each team.</p>
                            <small>Current mode: {mode}</small>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    console.log('Custom teams button clicked');
                                    setShowCustomSelector(true);
                                }}
                            >
                                Create Custom Teams
                            </button>
                        </div>
                    ) : null}
                </div>

                {mode !== "custom" && (
                    <button
                        className="btn btn-primary btn-generate"
                        onClick={handleGenerate}
                    >
                        {teams.length > 0 ? "Regenerate Teams" : "Generate Teams"}
                    </button>
                )}
            </div>

            {teams.length > 0 && (
                <>
                    <div className="teams-grid">
                        {teams.map((team, i) => (
                            <div
                                key={team.id}
                                className="team-container-with-edit"
                            >
                                <TeamCard
                                    team={team}
                                    onScoreChange={() => {}}
                                    showScore={false}
                                    animationDelay={i * 80}
                                />
                                <div className="team-inline-edit">
                                    {team.players.map((p) => (
                                        <div key={p.id} className="player-tag">
                                            <span>{p.name.split(" ")[0]}</span>
                                            <button
                                                onClick={() =>
                                                    handleRemovePlayer(
                                                        team.id,
                                                        p.id,
                                                    )
                                                }
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="generator-footer">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => setStep("lineup")}
                        >
                            Confirm Teams & Continue →
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    // Custom team selector overlay
    console.log('showCustomSelector:', showCustomSelector);
    if (showCustomSelector) {
        console.log('Rendering CustomTeamSelector');
        return (
            <CustomTeamSelector
                players={initialPlayers}
                onTeamsCreated={(customTeams) => {
                    onUpdateTeams(customTeams);
                    setShowCustomSelector(false);
                    setStep("shuffle");
                }}
                onCancel={() => setShowCustomSelector(false)}
            />
        );
    }
};

export default TeamsPage;
