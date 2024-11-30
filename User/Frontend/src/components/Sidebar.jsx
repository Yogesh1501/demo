import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UilSignOutAlt, UilBars } from "@iconscout/react-unicons";
import { SidebarData } from "../Data/Data";
import { motion } from "framer-motion";
import "./Sidebar.css";

const Sidebar = ({ userRole }) => {
  const filteredData = SidebarData.filter(item =>
    Array.isArray(item.roles) && item.roles.includes(userRole)
  );

  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
      navigate("/"); 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const sidebarVariants = {
    true: { left: "0" },
    false: { left: "-60%" }
  };

  return (
    <>
      <div
        className="sidebar__bars"
        style={expanded ? { left: "60%" } : { left: "5%" }}
        onClick={() => setExpanded(!expanded)}
      >
        <UilBars />
      </div>
      <motion.div
        className="sidebar__container"
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ""}
      >
        <div className="sidebar__menu">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div
                className={selected === index ? "sidebar__menuItem active" : "sidebar__menuItem"}
                key={index}
                onClick={() => setSelected(index)}
              >
                <Link to={item.path}>
                  <item.icon />
                  <span>{item.heading}</span>
                </Link>
              </div>
            ))
          ) : (
            <p>No menu items available for your role</p> // Debugging message
          )}
          <div className="sidebar__menuItem" onClick={handleSignOut}>
            <UilSignOutAlt />
            <span>Sign Out</span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
