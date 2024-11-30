import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './flatForm.css';

const AdFlatsList = () => {
  const [flats, setFlats] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFlats = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/flats?page=${page}&search=${search}`);
      const data = await response.json();
      setFlats(data.flats || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching flats:', error);
    }
  }, [page, search]);

  useEffect(() => {
    fetchFlats();
  }, [fetchFlats]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async (flatNumber) => {
    if (window.confirm(`Are you sure you want to delete flat ${flatNumber}?`)) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/flats/${flatNumber}`, {
          method: 'DELETE',
        });
        const data = await response.json();

        if (data.success) {
          alert(data.message);
          fetchFlats();
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error deleting flat:', error);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Flats List</h1>

      <input
        type="text"
        placeholder="Search by Flat Number, Owner Name, or Status"
        value={search}
        onChange={handleSearch}
        className="flSearch"
      />

      <table className="fl-tbl">
        <thead>
          <tr>
            <th>Flat Number</th>
            <th>Block Number</th>
            <th>Owner Name</th>
            <th>Owner Contact</th>
            <th>Number of Residents</th>
            <th>Status</th>
            <th>Flat Type</th>
            <th>Rent/Ownership Type</th>
            <th>Start Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flats.map((flat) => (
            <tr key={flat.flatNumber} className="flatlist-tbl-tr">
              <td>{flat.flatNumber}</td>
              <td>{flat.blockNumber}</td>
              <td>{flat.ownerName}</td>
              <td>{flat.ownerContact}</td>
              <td>{flat.residents}</td>
              <td>{flat.status}</td>
              <td>{flat.flatType}</td>
              <td>{flat.rentType}</td>
              <td>{flat.startDate}</td>
              <td>
                <Link to={`/editFlat/${flat.flatNumber}`}>
                  <button className="btn-s btn-e_d">Edit</button>
                </Link>
                <button
                  className="btn-s btn-e_d"
                  onClick={() => handleDelete(flat.flatNumber)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span>
          {' '}
          Page {page} of {totalPages}{' '}
        </span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>

      <Link to="/flatForm">
        <button className="btn-s" style={{ marginTop: '20px' }}>
          Add Flats
        </button>
      </Link>
    </div>
  );
};

export default AdFlatsList;
