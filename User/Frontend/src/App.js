// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Import components
import Home from "./components/Home.js"; 
import Navbar from "./components/Navbar.js";
import Login from './components/Login.js';
import Register from './components/Register.js';
import MainDash from './components/MainDash/MainDash.jsx';
import FlatsList from './components/Flats/FlatsList.js';
import AdFlatsList from './components/Flats/AdFlatlist.js';
import FlatForm from './components/Flats/FlatForm.js';
import RegisterCompForm from './components/RegisterCompForm.js';
import RegisterComplaints from './components/RegisterComplaints.js';
import DashboardLayout from './components/DashboardLayout.js'; // Layout for dashboard pages
import AddNotice from './components/AddNotice.js';
import AddMaintenance from './components/AddMaintenance.js';
import AdminMaintenanceTable from './components/AdminMaintenanceTable.js';
import NoticesList from './components/NoticesList.js';
import NoticeDetail from './components/NoticeDetail.js';
import NoticesPage from './components/NoticesPage.js';


// Import Admin components
import AdminLogin from './components/AdminLogin.js';
import AdminRegister from './components/AdminRegister.js';
import AddEvent from './components/AddEvent.js';
import EventsPage from './components/EventsPage.js';


function App() {
  const location = useLocation();
  
  // Define the routes where you want to show the Navbar
  const showNavbar = ["/", "/login", "/register", "/admin-login", "/admin-register"].includes(location.pathname);

  

      

  return (
    <div className="App-1">
      {/* Conditionally render the Navbar and its CSS */}
      {showNavbar && <Navbar />}
      
      <Routes>
        {/* Non-dashboard routes */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Dashboard routes wrapped in DashboardLayout */}
        <Route 
          path="/maindash" 
          element={
            <DashboardLayout isDashboard={true}>
              <MainDash />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/flats" 
          element={
            <DashboardLayout isDashboard={false}>
              <FlatsList />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/adflats" 
          element={
            <DashboardLayout isDashboard={false}>
              <AdFlatsList />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/flatForm" 
          element={
            <DashboardLayout isDashboard={false}>
              <FlatForm />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/registercomplaintform" 
          element={
            <DashboardLayout isDashboard={false}>
              <RegisterCompForm />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/registercomplaints" 
          element={
            <DashboardLayout isDashboard={false}>
              <RegisterComplaints />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/register" 
          element={
            <DashboardLayout isDashboard={false}>
              <Register />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/addnotice" 
          element={
            <DashboardLayout isDashboard={false}>
              <AddNotice />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/addmaintainance" 
          element={
            <DashboardLayout isDashboard={false}>
              <AddMaintenance />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/viewmaintenance" 
          element={
            <DashboardLayout isDashboard={false}>
              <AdminMaintenanceTable />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/notice/:id" 
          element={
            <DashboardLayout isDashboard={false}>
              <NoticeDetail />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/notices" 
          element={
            <DashboardLayout isDashboard={false}>
              <NoticesList />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/noticespage" 
          element={
            <DashboardLayout isDashboard={false}>
              <NoticesPage />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/addevent" 
          element={
            <DashboardLayout isDashboard={false}>
              <AddEvent />
            </DashboardLayout>
          } 
        />
        <Route 
          path="/eventspage" 
          element={
            <DashboardLayout isDashboard={false}>
              <EventsPage />
            </DashboardLayout>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;