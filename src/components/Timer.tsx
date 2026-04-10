import React from "react";
import type { TimerState } from "../types";

interface TimerProps {
    timer: TimerState;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onDurationChange: (duration: number) => void;
    teamName?: string;
    accentColor?: string;
}

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

const Timer: React.FC<TimerProps> = ({
    timer,
    onStart,
    onPause,
    onReset,
    onDurationChange,
    teamName,
    accentColor = "#0070FF",
}) => {
    const progress = timer.duration > 0 ? timer.remaining / timer.duration : 0;
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    const isFinished = timer.remaining === 0 && timer.duration > 0;

    const PRESETS = [
        { label: "1m", value: 60 },
        { label: "2m", value: 120 },
        { label: "5m", value: 300 },
        { label: "10m", value: 600 },
        { label: "15m", value: 900 },
    ];

    return (
        <div
            className={`timer-widget ${isFinished ? "timer-finished" : ""}`}
            style={{ "--accent": accentColor } as React.CSSProperties}
        >
            {teamName && <div className="timer-team-label">{teamName}</div>}

            <div className="timer-ring-container">
                <svg className="timer-ring" viewBox="0 0 120 120">
                    <circle
                        className="timer-ring-bg"
                        cx="60"
                        cy="60"
                        r={radius}
                        strokeWidth="6"
                    />
                    <circle
                        className="timer-ring-progress"
                        cx="60"
                        cy="60"
                        r={radius}
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        stroke={isFinished ? "#ff4d00" : accentColor}
                        style={{
                            transition:
                                "stroke-dashoffset 0.9s linear, stroke 0.3s",
                        }}
                    />
                </svg>
                <div
                    className={`timer-display ${isFinished ? "timer-blink" : ""}`}
                >
                    {isFinished ? "TIME!" : formatTime(timer.remaining)}
                </div>
            </div>

            <div className="timer-presets">
                {PRESETS.map((p) => (
                    <button
                        key={p.value}
                        className={`preset-btn ${timer.duration === p.value ? "active" : ""}`}
                        onClick={() => onDurationChange(p.value)}
                        disabled={timer.isRunning}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            <div className="timer-controls">
                {!timer.isRunning ? (
                    <button
                        className="timer-btn start"
                        onClick={onStart}
                        disabled={timer.remaining === 0}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            width="20"
                            height="20"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        {timer.remaining < timer.duration && timer.remaining > 0
                            ? "Resume"
                            : "Start"}
                    </button>
                ) : (
                    <button className="timer-btn pause" onClick={onPause}>
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            width="20"
                            height="20"
                        >
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                        Pause
                    </button>
                )}
                <button className="timer-btn reset" onClick={onReset}>
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        width="20"
                        height="20"
                    >
                        <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                    </svg>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Timer;
