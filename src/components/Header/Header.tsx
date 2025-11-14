import "./Header.css";
import React from "react";
import { useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();

  const isLandingPage = location.pathname === "/";

  const logoSrc = isLandingPage
    ? "/public/papyr-logo-light.png"
    : "/public/papyr-logo-dark.png";

  return (
    <header className="header">
      <a href="/">
        <>
          <img
            className={
              "header__logo" + (isLandingPage ? " header__logo--landing" : "")
            }
            src={logoSrc}
            alt="Papyr Logo"
          />
          <span
            className={
              `header__title` +
              (isLandingPage ? " header__title--landing-white" : "")
            }
          >
            Papyr.io
          </span>
        </>
      </a>
    </header>
  );
};

export default Header;
