import React, { useState } from "react";
import type { Player } from "../types";

interface PlayerCardProps {
    player: Player;
    compact?: boolean;
    accentColor?: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
    player,
    compact = false,
    accentColor = "#0070FF",
}) => {
    const [imgError, setImgError] = useState(false);

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    if (compact) {
        return (
            <div className="player-card-compact">
                <div
                    className="player-avatar-compact"
                    style={{ "--accent": accentColor } as React.CSSProperties}
                >
                    {!imgError ? (
                        <img
                            src={player.image}
                            alt={player.name}
                            onError={() => setImgError(true)}
                            loading="lazy"
                        />
                    ) : (
                        <span className="avatar-initials">
                            {getInitials(player.name)}
                        </span>
                    )}
                </div>
                <span className="player-name-compact">{player.name}</span>
            </div>
        );
    }

    return (
        <div className="player-card">
            <div
                className="player-avatar"
                style={{ "--accent": accentColor } as React.CSSProperties}
            >
                {!imgError ? (
                    <img
                        src={player.image}
                        alt={player.name}
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                ) : (
                    <span className="avatar-initials-lg">
                        {getInitials(player.name)}
                    </span>
                )}
                <div className="avatar-glow" />
            </div>
            <span className="player-name">{player.name}</span>
        </div>
    );
};

export default PlayerCard;
