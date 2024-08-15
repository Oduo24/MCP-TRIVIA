import React, { useEffect } from 'react'
import { IconContext } from 'react-icons';
import { IoHome } from 'react-icons/io5';
import { MdDashboardCustomize, MdLeaderboard, MdOutlineLogin, MdSwitchAccount } from 'react-icons/md';
import { Link, Outlet } from 'react-router-dom'
import { Tooltip, TooltipRefProps } from 'react-tooltip';
import { useRef } from 'react';
import { Toaster } from 'react-hot-toast';

interface HeaderProps {
  isAuthenticated: boolean;
  role: "admin" | "member" | null;
  username: string;
}

const Header: React.FC<HeaderProps> = ({isAuthenticated, role, username}) => {

  const accountTooltipRef = useRef<TooltipRefProps>(null);
  
  useEffect(() => {
    if (username?.startsWith('user_')) {
      accountTooltipRef.current?.open({
        anchorSelect: '.account',
        content: 'Change your username here',
      })
    }
  }, [username])
  

  return (
    <>
    <IconContext.Provider value={{ color: "yellow", className: "global-class-name" }}>
    <div className="row flex-fill justify-content-center text-center">
      <div className="col-md-8 mt-5">
        <Toaster/>
        <nav className="d-flex justify-content-center">
          <ul className="nav">
            {isAuthenticated && role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/admin/dashboard">
                    <MdDashboardCustomize /> Dashboard
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated && role === 'member' && (
              <> 
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/user/home">
                    <IoHome /> Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/scores">
                    <MdLeaderboard /> Scores
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white account" to="/user/account">
                    <MdSwitchAccount /> Account
                  </Link>
                  <Tooltip ref={accountTooltipRef} place='bottom' style={{ backgroundColor: "rgb(185, 182, 182)", color: "#222" }}/>
                </li>
              </>
            )}
            {!isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/login">
                  <MdOutlineLogin />Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
    </IconContext.Provider>
    <Outlet />
    </>
  );
}

export default Header