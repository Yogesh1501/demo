import React, { useState } from 'react';
import axios from 'axios';
// import './Register.css';
import './AdminAuth.css';
const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }
    
        // Prepare data as JSON
        const userData = {
            username: username,
            email: email,
            password: password,
        };
    
        try {
            setLoading(true); // Start loading
            const response = await axios.post('http://127.0.0.1:5000/register', userData, {
                headers: {
                    'Content-Type': 'application/json',  // Set Content-Type to application/json
                },
            });
            setSuccess(true);
            setError('');
            console.log(response.data.message);
            // Reset fields
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            setLoading(false); // Stop loading
            if (error.response && error.response.data.errors) {
                setError(error.response.data.errors[0]); // Display first error from backend
            } else if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false); // Stop loading regardless of the result
        }
    };
    
    

    return (
        <div className="register-container auth-container">
            <h2 className='head2'>Register</h2>
            {success ? (
                <div className="success-message">Registration successful! Please log in.</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-group-1">
                        <label htmlFor="username" className='ADLlabel'>Username</label>
                        <input
                            className='input'
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group-1">
                        <label htmlFor="email" className='ADLlabel'>Email</label>
                        <input
                             className='input'
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group-1">
                        <label htmlFor="password" className='ADLlabel'>Password</label>
                        <input
                            className='input'
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group-1">
                        <label htmlFor="confirmPassword" className='ADLlabel'>Confirm Password</label>
                        <input
                            className='input'
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Register;
