import React from "react";
import type { Team } from "../types";
import PlayerCard from "./PlayerCard";
import ScoreController from "./ScoreController";

interface TeamCardProps {
    team: Team;
    onScoreChange: (teamId: string, score: number) => void;
    showScore?: boolean;
    animationDelay?: number;
}

const TeamCard: React.FC<TeamCardProps> = ({
    team,
    onScoreChange,
    showScore = true,
    animationDelay = 0,
}) => {
    return (
        <div
            className="team-card"
            style={
                {
                    "--accent": team.color,
                    "--delay": `${animationDelay}ms`,
                } as React.CSSProperties
            }
        >
            <div className="team-card-header">
                <div className="team-badge" style={{ background: team.color }}>
                    {team.name.split(" ")[1]?.[0] ?? "T"}
                </div>
                <div className="team-header-info">
                    <h3 className="team-name">{team.name}</h3>
                    <span className="team-count">
                        {team.players.length} members
                    </span>
                </div>
                {showScore && (
                    <ScoreController
                        score={team.score}
                        onScoreChange={(score) => onScoreChange(team.id, score)}
                        accentColor={team.color}
                    />
                )}
            </div>

            <div className="team-divider" style={{ background: team.color }} />

            <div className="team-players-grid">
                {team.players.map((player) => (
                    <PlayerCard
                        key={player.id}
                        player={player}
                        compact
                        accentColor={team.color}
                    />
                ))}
            </div>
        </div>
    );
};

export default TeamCard;
