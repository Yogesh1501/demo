import React, { useState } from 'react';
import './RegisterCompForm.css'; // Import the CSS file

const RegisterCompForm = () => {
    const [complaint, setComplaint] = useState({
        name: '',
        flatNumber: '',
        dateOfRegistration: '',
        complaintType: '',
        subject: '',
        description: '',
        status: 'Pending',
    });

    const handleChange = (e) => {
        setComplaint({
            ...complaint,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://127.0.0.1:5000/complaints', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(complaint),
        });

        if (response.ok) {
            alert('Complaint registered successfully!');
            setComplaint({
                name: '',
                flatNumber: '',
                dateOfRegistration: '',
                complaintType: '',
                subject: '',
                description: '',
                status: 'Pending',
            });
        } else {
            alert('Error registering complaint');
        }
    };

    return (
        <>
        <h2 className='fhstyle'>Register Your Complaints ...!</h2>
        <form className="complaint-form" onSubmit={handleSubmit}>
            <div className="form-group_RC">
               
                <label className="form-label">Name:</label>
                <input
                    className="form-input"
                    type="text"
                    name="name"
                    value={complaint.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group_RC">
                <label className="form-label">Flat Number:</label>
                <input
                    className="form-input"
                    type="text"
                    name="flatNumber"
                    value={complaint.flatNumber}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group_RC">
                <label className="form-label">Date of Registration:</label>
                <input
                    className="form-input"
                    type="date"
                    name="dateOfRegistration"
                    value={complaint.dateOfRegistration}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group_RC">
                <label className="form-label">Type of Complaint:</label>
                <input
                    className="form-input"
                    type="text"
                    name="complaintType"
                    value={complaint.complaintType}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group_RC">
                <label className="form-label">Subject:</label>
                <input
                    className="form-input"
                    type="text"
                    name="subject"
                    value={complaint.subject}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group_RC">
                <label className="form-label">Description:</label>
                <textarea
                    className="form-textarea"
                    name="description"
                    value={complaint.description}
                    onChange={handleChange}
                    required
                />
            </div>
            <button className="form-button" type="submit">Submit Complaint</button>
        </form>
        </>
    );
};

export default RegisterCompForm;
