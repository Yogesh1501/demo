import "./Home.css";
import React, { useState } from 'react'; 
import Navbar from "./Navbar";

import Login from './Login';
import Register from './Register';
import MainDash from './MainDash/MainDash';
// import buildingImage from './public/building_image1_converted.jpeg'; // Adjusted path and variable name


const Home = () => {
  const [view, setView] = useState('login'); // State to manage the current view

    const handleLoginSuccess = () => {
        setView('dashboard'); // Change view to dashboard on successful login
    };

    // const handleRegisterSuccess = () => {
    //     setView('dashboard'); // Handle registration success
    // };

    const toggleView = () => {
        if (view === 'login') {
            setView('register');
        } else if (view === 'register') {
            setView('login');
        } else {
            setView('login'); // Log out from dashboard
        }
    };
  return (<>
    {/* <Navbar /> */}
    <div className="h-container">
    <div className="container">
                <div className="image-container">
                    <img src="/building_image1_converted.jpeg" className="side-image" alt="Building" />
                    

                </div>
                <div className="content-container">
                    <h1 className="page-heading">Society Management</h1>
                    {view === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
                    {/* {view === 'register' && <Register onRegisterSuccess={handleRegisterSuccess} />} */}
                    {view === 'dashboard' && <MainDash onLogout={toggleView} />}
                    
                    {/* Buttons for toggling views */}
                    {/* { <button className="toggle-button" onClick={toggleView}>
                        {view === 'login' ? <strong>Go to Register</strong> : view === 'register' ? <strong>Go to Login</strong> : <strong>Log Out</strong>}
                    </button> } */}
                </div>
            </div>
    </div>
    </>
  );
};

export default Home;
