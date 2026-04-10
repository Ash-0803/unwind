import React from "react";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <NavLink to="/" className="navbar-brand">
                    <div className="brand-icon">
                        <svg
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <polygon
                                points="16,2 30,12 25,28 7,28 2,12"
                                fill="url(#brand-grad)"
                                opacity="0.9"
                            />
                            <defs>
                                <linearGradient
                                    id="brand-grad"
                                    x1="0"
                                    y1="0"
                                    x2="32"
                                    y2="32"
                                >
                                    <stop offset="0%" stopColor="#0070FF" />
                                    <stop offset="100%" stopColor="#7000FF" />
                                </linearGradient>
                            </defs>
                            <polyline
                                points="10,17 14,21 22,13"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        </svg>
                    </div>
                    <span className="brand-name">Unwind</span>
                </NavLink>

                <div className="navbar-links">
                    <NavLink
                        to="/teams"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "nav-link-active" : ""}`
                        }
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            width="18"
                            height="18"
                        >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Teams
                    </NavLink>
                    <NavLink
                        to="/scoreboard"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "nav-link-active" : ""}`
                        }
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            width="18"
                            height="18"
                        >
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                        Scoreboard
                    </NavLink>
                    <NavLink
                        to="/timer"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? "nav-link-active" : ""}`
                        }
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            width="18"
                            height="18"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        Timer
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
