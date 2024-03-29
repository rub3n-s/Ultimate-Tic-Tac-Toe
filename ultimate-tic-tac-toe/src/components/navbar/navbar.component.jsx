import React from "react";
import { useRef } from "react";
import "./navbar.css";

/* Navigation Bar Component */
const Navbar = () => {
  const nav = useRef(null);
  const showHide = () => nav.current.classList.toggle("show");
  return (
    <header>
      <div className="wrapper">
        <div className="logo">
          <a href="index.html">
            <img src="assets/images/logo.png" alt="Ultimate Tic-Tac-Toe" />
          </a>
        </div>
        <div className="navbar" ref={nav}>
          <div className="close-nav">
            <button onClick={showHide}>×</button>
          </div>
          <nav>
            <ul>
              <li>
                <a href="index.html">Home</a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="menu-bar">
          <button onClick={showHide}>
            <i></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
