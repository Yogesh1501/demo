import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Combined scroll and resize handlers in a single useEffect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Threshold for applying scroll effect
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      id="navbar-container"
      className={`container-fluid pt-3 pb-3 d-flex flex-row ${
        isScrolled ? "nav-background" : ""
      }`}
    >
     
     <div className="navbar-right">
        <Link to="/admin/login">
          <button className="admin-login-btn">Admin Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
