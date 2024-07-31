import React from 'react'
import { Link, Outlet } from 'react-router-dom'

interface HeaderProps {
  isAuthenticated: boolean;
  role: "admin" | "member" | null;
}

const Header: React.FC<HeaderProps> = ({isAuthenticated, role}) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      {isAuthenticated && role === "admin" && (
      <Link className="navbar-brand" to="/admin/home">
        MCP
      </Link>)}
      {isAuthenticated && role === "member" && (
      <Link className="navbar-brand" to="/user/home">
        MCP
      </Link>)}
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          {isAuthenticated && role === 'admin' && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/dashboard">
                  Dashboard
                </Link>
              </li>
            </>
          )}
          {isAuthenticated && role === 'member' && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/scores">
                  Leaderboard
                </Link>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header