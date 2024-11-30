import React from "react";
import Cards from "../Cards/Cards";  
import "./MainDash.css";
import SocietySummaryCard from "../SocietySummaryCard.js";

import AdminUpdateCard from "../AdminUpdateCard";
import MaintenanceSummaryCards from "../MaintenanceSummaryCards.js"


const MainDash = () => {
  return (
    
    <div className="MainDash">
      <h1>Society Management Dashboard</h1>
      {/* <Cards />   */}
      <SocietySummaryCard />
      <AdminUpdateCard />
      <MaintenanceSummaryCards />
      
      
     
    </div>
    
  );
};

export default MainDash;
