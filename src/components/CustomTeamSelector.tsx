import React, { useState } from "react";
import type { Player, Team } from "../types";
import { TEAM_COLORS, TEAM_NAMES } from "../data/players";

interface CustomTeamSelectorProps {
  players: Player[];
  onTeamsCreated: (teams: Team[]) => void;
  onCancel: () => void;
}

const CustomTeamSelector: React.FC<CustomTeamSelectorProps> = ({
  players,
  onTeamsCreated,
  onCancel,
}) => {
  const [numTeams, setNumTeams] = useState(2);
  const [selectedTeams, setSelectedTeams] = useState<Record<string, Player[]>>(
    {},
  );
  const [teamNames, setTeamNames] = useState<Record<string, string>>({});

  // Initialize team names and colors when numTeams changes
  React.useEffect(() => {
    const newSelectedTeams: Record<string, Player[]> = {};
    const newTeamNames: Record<string, string> = {};

    for (let i = 0; i < numTeams; i++) {
      const teamId = `team-${i}`;
      newSelectedTeams[teamId] = [];
      newTeamNames[teamId] =
        TEAM_NAMES[i] || `Team ${String.fromCharCode(65 + i)}`;
    }

    setSelectedTeams(newSelectedTeams);
    setTeamNames(newTeamNames);
  }, [numTeams]);

  const handlePlayerSelect = (player: Player, teamId: string) => {
    // Remove player from all teams first
    const newTeams = { ...selectedTeams };
    Object.keys(newTeams).forEach((key) => {
      newTeams[key] = newTeams[key].filter((p) => p.id !== player.id);
    });

    // Add player to selected team
    newTeams[teamId] = [...newTeams[teamId], player];
    setSelectedTeams(newTeams);
  };

  const handleTeamNameChange = (teamId: string, name: string) => {
    setTeamNames((prev) => ({ ...prev, [teamId]: name }));
  };

  const handleCreateTeams = () => {
    const teams: Team[] = Object.keys(selectedTeams).map((teamId, index) => ({
      id: teamId,
      name: teamNames[teamId],
      players: selectedTeams[teamId],
      score: 0,
      color: TEAM_COLORS[index % TEAM_COLORS.length],
    }));

    onTeamsCreated(teams);
  };

  const getUnassignedPlayers = () => {
    const assignedPlayerIds = new Set<number>();
    Object.values(selectedTeams).forEach((teamPlayers) => {
      teamPlayers.forEach((player) => assignedPlayerIds.add(player.id));
    });
    return players.filter((player) => !assignedPlayerIds.has(player.id));
  };

  const isFormValid = () => {
    return Object.values(selectedTeams).every((team) => team.length > 0);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Create Custom Teams</h1>
        <p>Select players to create your own teams</p>
      </div>

      <div className="setup-controls">
        <div className="control-group">
          <label>Number of Teams:</label>
          <select
            value={numTeams}
            onChange={(e) => setNumTeams(Number(e.target.value))}
            className="select"
          >
            {[2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n} Teams
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="custom-teams-container">
        <div className="teams-section">
          <h2>Teams</h2>
          <div className="custom-teams-grid">
            {Object.keys(selectedTeams).map((teamId, index) => (
              <div
                key={teamId}
                className="custom-team-card"
                style={{ borderColor: TEAM_COLORS[index % TEAM_COLORS.length] }}
              >
                <div className="team-header">
                  <input
                    type="text"
                    value={teamNames[teamId]}
                    onChange={(e) =>
                      handleTeamNameChange(teamId, e.target.value)
                    }
                    className="team-name-input"
                    placeholder="Team name"
                    style={{ color: TEAM_COLORS[index % TEAM_COLORS.length] }}
                  />
                  <div className="team-count">
                    {selectedTeams[teamId].length} players
                  </div>
                </div>
                <div className="team-players">
                  {selectedTeams[teamId].map((player) => (
                    <div key={player.id} className="player-chip">
                      <img
                        src={player.image}
                        alt={player.name}
                        className="player-avatar"
                      />
                      <span>{player.name}</span>
                      <button
                        onClick={() => handlePlayerSelect(player, "")}
                        className="remove-player"
                        title="Remove from team"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {selectedTeams[teamId].length === 0 && (
                    <div className="empty-team">
                      <span>Click players below to add</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="players-section">
          <h2>Available Players</h2>
          <div className="players-grid">
            {getUnassignedPlayers().map((player) => (
              <div key={player.id} className="player-card">
                <img
                  src={player.image}
                  alt={player.name}
                  className="player-avatar"
                />
                <div className="player-info">
                  <div className="player-name">{player.name}</div>
                </div>
                <div className="team-selector">
                  <select
                    onChange={(e) => handlePlayerSelect(player, e.target.value)}
                    value=""
                    className="team-select"
                  >
                    <option value="">Add to team...</option>
                    {Object.keys(selectedTeams).map((teamId) => (
                      <option key={teamId} value={teamId}>
                        {teamNames[teamId]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="setup-actions">
        <button onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button
          onClick={handleCreateTeams}
          className="btn btn-primary"
          disabled={!isFormValid()}
        >
          Create Teams & Start Game
        </button>
      </div>
    </div>
  );
};

export default CustomTeamSelector;
