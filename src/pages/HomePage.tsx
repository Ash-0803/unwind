import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
    return (
        <div className="home-page">
            {/* Hero */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-orb orb-1" />
                    <div className="hero-orb orb-2" />
                    <div className="hero-orb orb-3" />
                    <div className="hero-grid" />
                </div>
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="pulse-dot" />
                        Team Activity Hub
                    </div>
                    <h1 className="hero-title">
                        Build Teams.
                        <br />
                        <span className="gradient-text">Play Together.</span>
                    </h1>
                    <p className="hero-subtitle">
                        Instantly generate balanced teams, run timers, and track
                        scores — all in one slick dashboard.
                    </p>
                    <div className="hero-cta">
                        <Link to="/teams" className="btn btn-primary">
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                width="20"
                                height="20"
                            >
                                <path
                                    d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                            </svg>
                            Generate Teams
                        </Link>
                        <Link to="/scoreboard" className="btn btn-secondary">
                            View Scoreboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature Cards */}
            <section className="features">
                <FeatureCard
                    icon={
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#0070FF"
                            strokeWidth="2"
                            width="32"
                            height="32"
                        >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    }
                    title="Smart Team Generator"
                    desc="Shuffle & distribute players into balanced teams instantly. Supports fixed number of teams or fixed team size."
                    color="#0070FF"
                    link="/teams"
                    linkLabel="Generate →"
                />
                <FeatureCard
                    icon={
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#FF4D00"
                            strokeWidth="2"
                            width="32"
                            height="32"
                        >
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                    }
                    title="Live Scoreboard"
                    desc="Track each team's score in real-time with intuitive +/- controls and direct editable inputs."
                    color="#FF4D00"
                    link="/scoreboard"
                    linkLabel="View Scores →"
                />
                {/* <FeatureCard
                    icon={
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#7000FF"
                            strokeWidth="2"
                            width="32"
                            height="32"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    }
                    title="Activity Timer"
                    desc="Set countdown timers for each activity round. Start, pause, and reset with visual ring progress."
                    color="#7000FF"
                    link="/timer"
                    linkLabel="Start Timer →"
                /> */}
            </section>

            {/* Players preview */}
            <section className="players-preview">
                <h2 className="section-title">
                    <span className="gradient-text">18 Players</span> Ready to
                    Compete
                </h2>
                <p className="section-subtitle">
                    Head over to Team Generator to randomly split them into
                    action.
                </p>
                <Link to="/teams" className="btn btn-primary btn-lg">
                    Shuffle & Generate Teams
                </Link>
            </section>
        </div>
    );
};

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
    color: string;
    link: string;
    linkLabel: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
    icon,
    title,
    desc,
    color,
    link,
    linkLabel,
}) => {
    return (
        <Link
            to={link}
            className="feature-card"
            style={{ "--accent": color } as React.CSSProperties}
        >
            <div className="feature-icon">{icon}</div>
            <h3 className="feature-title">{title}</h3>
            <p className="feature-desc">{desc}</p>
            <span className="feature-link" style={{ color }}>
                {linkLabel}
            </span>
            <div className="feature-glow" style={{ background: color }} />
        </Link>
    );
};

export default HomePage;
