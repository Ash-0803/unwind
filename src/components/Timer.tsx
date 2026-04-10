import React from "react";
import type { TimerState } from "../types";

interface TimerProps {
    timer: TimerState;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onDurationChange: (duration: number) => void;
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
    accentColor = "#0070FF",
}) => {
    const progress = timer.duration > 0 ? timer.remaining / timer.duration : 0;
    const radius = 42; // Made smaller
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    const isFinished = timer.remaining === 0 && timer.duration > 0;

    const PRESETS = [
        { label: "30s", value: 30 },
        { label: "1m", value: 60 },
        { label: "2m", value: 120 },
        { label: "5m", value: 300 },
    ];

    return (
        <div
            className={`timer-widget-compact ${isFinished ? "timer-finished" : ""}`}
            style={{ "--accent": accentColor } as React.CSSProperties}
        >
            <div className="timer-main-row">
                <div className="timer-ring-wrapper">
                    <svg className="timer-ring-svg" viewBox="0 0 100 100">
                        <circle
                            className="timer-ring-bg"
                            cx="50"
                            cy="50"
                            r={radius}
                            strokeWidth="6"
                        />
                        <circle
                            className="timer-ring-progress"
                            cx="50"
                            cy="50"
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
                        className={`timer-time-text ${isFinished ? "timer-blink" : ""}`}
                    >
                        {formatTime(timer.remaining)}
                    </div>
                </div>

                <div className="timer-actions-column">
                    <div className="timer-controls-row">
                        {!timer.isRunning ? (
                            <button
                                className="timer-action-btn start-pulse"
                                onClick={onStart}
                                disabled={timer.remaining === 0}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    width="18"
                                    height="18"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                className="timer-action-btn pause-btn"
                                onClick={onPause}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    width="18"
                                    height="18"
                                >
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                            </button>
                        )}
                        <button
                            className="timer-action-btn reset-btn"
                            onClick={onReset}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                width="18"
                                height="18"
                            >
                                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                            </svg>
                        </button>
                    </div>

                    <div className="timer-presets-row">
                        {PRESETS.map((p) => (
                            <button
                                key={p.value}
                                className={`mini-preset ${timer.duration === p.value ? "active" : ""}`}
                                onClick={() => onDurationChange(p.value)}
                                disabled={timer.isRunning}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timer;
