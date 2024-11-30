import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import "./Register.css";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');  // New success message state
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', {
                username,
                password,
            }, {
                withCredentials: true,
            });
    
            if (response.status === 200) {
                if (response.data.first_login) {
                    setShowPasswordChange(true);  // Show password change form
                } else {
                    sessionStorage.setItem('loggedin', true);
    
                    // Access the role from the response and store it in sessionStorage
                    const { role } = response.data;
                    sessionStorage.setItem('roles', JSON.stringify({ role }));
    
                    navigate('/maindash');
                }
            }
        } catch (error) {
            setError(error.response?.data.message || 'Login failed');
        }
    };
    

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/change-password', {
                username,
                new_password: newPassword,
            });

            if (response.status === 200) {
                setError('');
                setSuccessMessage('Your password has been changed successfully');  // Show success message
                setTimeout(() => {
                    sessionStorage.setItem('loggedin', true);
                    const { role } = response.data;
                    sessionStorage.setItem('roles', JSON.stringify({ role }));

                    navigate('/maindash');
                }, 3000); // Redirect after 2 seconds
            }
        } catch (error) {
            setError('Password update failed');
        }
    };

    return (
        <div className="login-container">
            {!showPasswordChange ? (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username" className='lbl'>Username</label>
                        <input
                            className='in-l'
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className='lbl'>Password</label>
                        <input
                             className='in-l'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='btnl-div'>
                        <button type="submit" className='btn-login'>Login</button>
                    </div>
                    {error && <p className="error">{error}</p>}
                </form>
            ) : (
                <form onSubmit={handleChangePassword} className='chng-pwd'>
                    <h5>You are logging in first time. Please change your password.</h5>
                    <div className="form-group">
                        <label htmlFor="newPassword" className='lbl'>New Password</label>
                        <input
                             className='in-l'
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmNewPassword" className='lbl'>Confirm New Password</label>
                        <input
                             className='in-l'
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='btnl-div'>
                        <button type="submit" className='btn-login btn-login-2'>Submit New Password</button>
                    </div>
                    {error && <p className="error">{error}</p>}
                    {successMessage && <p className="success">{successMessage}</p>} {/* Show success message */}
                </form>
            )}
        </div>
    );
};

export default Login;
