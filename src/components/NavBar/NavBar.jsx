import { Link } from 'react-router-dom';

import { useState } from 'react';
import './NavBar.css';
import Hamburger from './Hamburger';

const NavBar = ({ searchProperties }) => {
  const [showNavbar, setShowNavbar] = useState(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };


  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="logo">
            <img src="https://raw.githubusercontent.com/tdha/project-three/main/assets/logo.png" alt="" />
          </div>
          <div className="menu-icon" onClick={handleShowNavbar}>
            {<Hamburger />}
          </div>
          <div className={`nav-elements  ${showNavbar && 'active-navbar'}`}>
            <ul>
              <li>
                <Link to="/" onClick={searchProperties}>
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
