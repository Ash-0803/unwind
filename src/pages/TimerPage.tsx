import React, { useState, useEffect, useRef, useCallback } from "react";
import type { TimerState } from "../types";
import Timer from "../components/Timer";

function makeTimer(duration = 300): TimerState {
    return { duration, remaining: duration, isRunning: false };
}

const TimerPage: React.FC = () => {
    const [timer, setTimer] = useState<TimerState>(makeTimer(300));
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [finished, setFinished] = useState(false);

    const clearTick = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const handleStart = useCallback(() => {
        if (timer.remaining === 0) return;
        setFinished(false);
        setTimer((t) => ({ ...t, isRunning: true }));
    }, [timer.remaining]);

    const handlePause = useCallback(() => {
        setTimer((t) => ({ ...t, isRunning: false }));
    }, []);

    const handleReset = useCallback(() => {
        clearTick();
        setFinished(false);
        setTimer((t) => ({ ...t, remaining: t.duration, isRunning: false }));
    }, []);

    const handleDurationChange = useCallback((duration: number) => {
        clearTick();
        setFinished(false);
        setTimer({ duration, remaining: duration, isRunning: false });
    }, []);

    useEffect(() => {
        if (timer.isRunning) {
            intervalRef.current = setInterval(() => {
                setTimer((t) => {
                    if (t.remaining <= 1) {
                        clearInterval(intervalRef.current!);
                        intervalRef.current = null;
                        setFinished(true);
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

    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">
                    Activity <span className="gradient-text">Timer</span>
                </h1>
                <p className="page-subtitle">
                    Set a round timer for your team activities
                </p>
            </div>

            <div className="timer-page-layout">
                <Timer
                    timer={timer}
                    onStart={handleStart}
                    onPause={handlePause}
                    onReset={handleReset}
                    onDurationChange={handleDurationChange}
                    accentColor="#0070FF"
                />

                {finished && (
                    <div className="timer-finished-banner">
                        <span>🎉 Time's up! Great work, team!</span>
                    </div>
                )}

                <div className="timer-tips glass-card">
                    <h3 className="tips-title">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FFB700"
                            strokeWidth="2"
                            width="20"
                            height="20"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Quick Guide
                    </h3>
                    <ul className="tips-list">
                        <li>
                            Select a preset duration or click a preset button
                        </li>
                        <li>
                            Hit <strong>Start</strong> to begin the countdown
                        </li>
                        <li>
                            Use <strong>Pause</strong> mid-activity if needed
                        </li>
                        <li>
                            Click <strong>Reset</strong> to restart the full
                            duration
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TimerPage;
