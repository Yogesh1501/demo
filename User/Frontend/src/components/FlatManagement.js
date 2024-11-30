import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

// Include Bootstrap CSS in your App.js or index.js
import 'bootstrap/dist/css/bootstrap.min.css';

const FlatManagement = () => {
  const [flats, setFlats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentFlat, setCurrentFlat] = useState({
    flatNumber: '',
    ownerName: '',
    residents: '',
    status: '',
    rentOrOwn: '',
  });

  // Fetch Flats Data (simulate with sample data or use an API)
  useEffect(() => {
    fetchFlats();
  }, []);

  const fetchFlats = async () => {
    // Simulated fetch, replace this with API call
    const response = await axios.get('/api/flats');  // Replace with actual API
    setFlats(response.data);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredFlats = flats.filter(flat =>
    flat.flatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flat.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShowModal = (flat) => {
    setCurrentFlat(flat ? flat : {
      flatNumber: '',
      ownerName: '',
      residents: '',
      status: '',
      rentOrOwn: '',
    });
    setShowModal(true);
  };

  const handleSaveFlat = () => {
    if (currentFlat.id) {
      // Update flat logic here (e.g., axios.put)
    } else {
      // Add flat logic here (e.g., axios.post)
    }
    setShowModal(false);
    fetchFlats(); // Fetch updated flats data
  };

  const handleDeleteFlat = (flatId) => {
    // Delete flat logic (e.g., axios.delete)
    fetchFlats(); // Refresh flats list after deletion
  };

  return (
    <div className="container mt-5">
      <h2>Flats Management</h2>
      
      {/* Search Bar */}
      <Form.Control
        type="text"
        placeholder="Search by Flat Number or Owner Name"
        value={searchQuery}
        onChange={handleSearch}
        className="mb-3"
      />

      {/* Flats Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Flat Number</th>
            <th>Owner Name</th>
            <th>Residents</th>
            <th>Status</th>
            <th>Rent/Own</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFlats.length > 0 ? (
            filteredFlats.map((flat, index) => (
              <tr key={index}>
                <td>{flat.flatNumber}</td>
                <td>{flat.ownerName}</td>
                <td>{flat.residents}</td>
                <td>{flat.status}</td>
                <td>{flat.rentOrOwn}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShowModal(flat)}>Edit</Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteFlat(flat.id)}>Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No flats found</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Add Flat Button */}
      <Button variant="primary" onClick={() => handleShowModal(null)}>
        Add New Flat
      </Button>

      {/* Modal for Add/Edit Flat */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentFlat.id ? 'Edit Flat' : 'Add New Flat'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="flatNumber">
              <Form.Label>Flat Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Flat Number"
                value={currentFlat.flatNumber}
                onChange={(e) => setCurrentFlat({ ...currentFlat, flatNumber: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="ownerName" className="mt-3">
              <Form.Label>Owner Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Owner Name"
                value={currentFlat.ownerName}
                onChange={(e) => setCurrentFlat({ ...currentFlat, ownerName: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="residents" className="mt-3">
              <Form.Label>Number of Residents</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Number of Residents"
                value={currentFlat.residents}
                onChange={(e) => setCurrentFlat({ ...currentFlat, residents: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="status" className="mt-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={currentFlat.status}
                onChange={(e) => setCurrentFlat({ ...currentFlat, status: e.target.value })}
              >
                <option value="Occupied">Occupied</option>
                <option value="Vacant">Vacant</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="rentOrOwn" className="mt-3">
              <Form.Label>Rent/Own</Form.Label>
              <Form.Select
                value={currentFlat.rentOrOwn}
                onChange={(e) => setCurrentFlat({ ...currentFlat, rentOrOwn: e.target.value })}
              >
                <option value="Rent">Rent</option>
                <option value="Own">Own</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSaveFlat}>
            {currentFlat.id ? 'Update Flat' : 'Add Flat'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FlatManagement;
