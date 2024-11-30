import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./Registercomplaints.css";
const RegisterComplaints = () => {
    const [complaints, setComplaints] = useState([]);

    // Fetch complaints from backend when component mounts
    useEffect(() => {
        fetch('http://127.0.0.1:5000/complaints')
            .then((response) => response.json())
            .then((data) => {
                setComplaints(data);
            })
            .catch((error) => {
                console.error('Error fetching complaints:', error);
            });
    }, []);

    // Function to update the status of a complaint
    const updateStatus = async (id, newStatus) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/complaints/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                // Update the complaint status in the state
                setComplaints(complaints.map(complaint => 
                    complaint.id === id ? { ...complaint, status: newStatus } : complaint
                ));
            } else {
                alert('Error updating complaint status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="complaints-container">
            <h2 className="complaints-title">Registered Complaints</h2>
            <table className="complaints-table">
                <thead className="complaints-header">
                    <tr>
                        <th className="complaints-header-item">Name</th>
                        <th className="complaints-header-item">Flat Number</th>
                        <th className="complaints-header-item">Date of Registration</th>
                        <th className="complaints-header-item">Type of Complaint</th>
                        <th className="complaints-header-item">Subject</th>
                        <th className="complaints-header-item">Description</th>
                        <th className="complaints-header-item">Status</th>
                        <th className="complaints-header-item">Actions</th>
                    </tr>
                </thead>
                <tbody className="complaints-body">
                    {complaints.map((complaint) => (
                        <tr key={complaint.id} className="complaints-row">
                            <td className="complaints-data">{complaint.name}</td>
                            <td className="complaints-data">{complaint.flatNumber}</td>
                            <td className="complaints-data">{complaint.dateOfRegistration}</td>
                            <td className="complaints-data">{complaint.complaintType}</td>
                            <td className="complaints-data">{complaint.subject}</td>
                            <td className="complaints-data">{complaint.description}</td>
                            <td className="complaints-data">{complaint.status}</td>
                            <td className="complaints-actions complaints-data">
                                {complaint.status === 'Pending' && (
                                    <>
                                        <button 
                                            className="action-btn in-progress-btn" 
                                            onClick={() => updateStatus(complaint.id, 'In Progress')}
                                        >
                                            In Progress
                                        </button>
                                        <button 
                                            className="action-btn resolve-btn" 
                                            onClick={() => updateStatus(complaint.id, 'Resolved')}
                                        >
                                            Resolve
                                        </button>
                                    </>
                                )}
                                {complaint.status === 'In Progress' && (
                                    <button 
                                        className="action-btn resolve-btn" 
                                        onClick={() => updateStatus(complaint.id, 'Resolved')}
                                    >
                                        Resolve
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* <div className="register-complaint">
                <Link to="/registercomplaintform">
                    <button className="btn register-btn" style={{ marginTop: '20px' }}>
                        Register Your Complaint
                    </button>
                </Link>
            </div> */}
        </div>
    );
};

export default RegisterComplaints;
