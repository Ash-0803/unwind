import React, { useState, useRef, useEffect } from "react";

interface ScoreControllerProps {
    score: number;
    onScoreChange: (score: number) => void;
    accentColor?: string;
}

const ScoreController: React.FC<ScoreControllerProps> = ({
    score,
    onScoreChange,
    accentColor = "#0070FF",
}) => {
    const [editing, setEditing] = useState(false);
    const [inputVal, setInputVal] = useState(score.toString());
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editing]);

    const handleIncrement = () => onScoreChange(score + 1);
    const handleDecrement = () => onScoreChange(Math.max(0, score - 1));

    const handleEditConfirm = () => {
        const parsed = parseInt(inputVal, 10);
        if (!isNaN(parsed) && parsed >= 0) onScoreChange(parsed);
        else setInputVal(score.toString());
        setEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleEditConfirm();
        if (e.key === "Escape") {
            setInputVal(score.toString());
            setEditing(false);
        }
    };

    return (
        <div
            className="score-controller"
            style={{ "--accent": accentColor } as React.CSSProperties}
        >
            <button
                className="score-btn decrement"
                onClick={handleDecrement}
                aria-label="Decrement score"
            >
                −
            </button>

            {editing ? (
                <input
                    ref={inputRef}
                    className="score-input"
                    type="number"
                    min="0"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onBlur={handleEditConfirm}
                    onKeyDown={handleKeyDown}
                />
            ) : (
                <button
                    className="score-display"
                    onClick={() => {
                        setInputVal(score.toString());
                        setEditing(true);
                    }}
                    title="Click to edit score"
                >
                    {score}
                </button>
            )}

            <button
                className="score-btn increment"
                onClick={handleIncrement}
                aria-label="Increment score"
            >
                +
            </button>
        </div>
    );
};

export default ScoreController;
