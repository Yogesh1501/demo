import React, { useState, useEffect } from "react";
import "./AdminUpdateCard.css";
//import AddMaintenance from "./AddMaintenance";
import MaintenanceForm from "./MaintenanceForm";

const AdminUpdateCard = ({ societyData }) => {
  // State hooks for managing society data
  const [totalWings, setTotalWings] = useState(societyData?.wings || 0);
  const [flatsPerFloor, setFlatsPerFloor] = useState(societyData?.flatsPerFloor || 0);
  const [floorsPerWing, setFloorsPerWing] = useState(societyData?.floorsPerWing || 0);
  const [maintenancePerFlat, setMaintenancePerFlat] = useState(societyData?.maintenancePerFlat || 0);
  
  // State hooks for flats data and maintenance modal
  const [flatsData, setFlatsData] = useState([]);
  const [selectedWing, setSelectedWing] = useState(null);
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [month, setMonth] = useState("");
  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = useState(false);

  // State hook for summary data
  const [summary, setSummary] = useState({
    totalMaintenance: 0,
    totalPaid: 0,
    totalPending: 0,
  });

  // Fetch society summary on component load
  useEffect(() => {
    const fetchSummary = async () => {
      const response = await fetch("http://127.0.0.1:5000/summary");
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    };
    fetchSummary();
  }, []);

  // Update state values when societyData prop changes
  useEffect(() => {
    if (societyData) {
      setTotalWings(societyData.wings);
      setFlatsPerFloor(societyData.flatsPerFloor);
      setFloorsPerWing(societyData.floorsPerWing);
      setMaintenancePerFlat(societyData.maintenancePerFlat);
    }
  }, [societyData]);

  // Calculate the total maintenance, paid, and pending amounts
  const calculateSummary = () => {
    let totalMaintenance = 0;
    let totalPaid = 0;
    let totalPending = 0;

    flatsData.forEach((wing) => {
      wing.flats.forEach((flat) => {
        totalMaintenance += flat.paidMaintenance + flat.pendingMaintenance;
        totalPaid += flat.paidMaintenance;
        totalPending += flat.pendingMaintenance;
      });
    });

    setSummary({ totalMaintenance, totalPaid, totalPending });
  };

  useEffect(() => {
    calculateSummary();
  }, [flatsData]);

  // Handle form submission for updating society data
  const handleSubmit = async (e) => {
    e.preventDefault();

    const wingNames = Array.from({ length: totalWings }, (_, i) => `Wing ${String.fromCharCode(65 + i)}`);
    const wingData = wingNames.map((wing, wingIndex) => ({
      name: wing,
      flats: generateFlatsData(wingIndex),
    }));

    setFlatsData(wingData);

    // Update society details in the backend
    await updateSociety();
  };

  const generateFlatsData = (wingIndex) => {
    const flats = [];
    for (let floor = 1; floor <= floorsPerWing; floor++) {
      for (let flatPosition = 1; flatPosition <= flatsPerFloor; flatPosition++) {
        const flatNumber = `${String.fromCharCode(65 + wingIndex)}${floor}${flatPosition.toString().padStart(2, "0")}`;
        flats.push({
          flatNumber,
          paidMaintenance: 0,
          pendingMaintenance: maintenancePerFlat,
          maintenanceHistory: [],
        });
      }
    }
    return flats;
  };

  // Update society data in the backend
  const updateSociety = async () => {
    const response = await fetch("http://127.0.0.1:5000/update_society", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totalWings,
        flatsPerFloor,
        floorsPerWing,
        maintenancePerFlat,
      }),
    });

    if (response.ok) {
      console.log("Society updated successfully");
    }
  };

  // Toggle the maintenance history visibility
  const toggleHistory = (wingIndex, flatIndex) => {
    setFlatsData((prevData) =>
      prevData.map((wing, i) =>
        i === wingIndex
          ? {
              ...wing,
              flats: wing.flats.map((flat, j) =>
                j === flatIndex
                  ? {
                      ...flat,
                      maintenanceHistory: flat.maintenanceHistory.length
                        ? []
                        : [{ date: "2024-01-01", amount: maintenancePerFlat, month }],
                    }
                  : flat
              ),
            }
          : wing
      )
    );
  };

  // Add maintenance to a flat
  const addMaintenance = async (flatId, date, amount, month) => {
    const response = await fetch("http://127.0.0.1:5000/maintenance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ flatId, date, amount, month }),
    });

    if (response.ok) {
      console.log("Maintenance added successfully");
    }
  };

  return (
    <div>
      {/* Society Summary */}
      <div className="summary-container">
        <div className="summary-card total-maintenance">
          <h4>Total Maintenance</h4>
          <p>₹{summary.totalMaintenance}</p>
        </div>
        <div className="summary-card total-paid">
          <h4>Total Paid</h4>
          <p>₹{summary.totalPaid}</p>
        </div>
        <div className="summary-card total-pending">
          <h4>Total Pending</h4>
          <p>₹{summary.totalPending}</p>
        </div>
      </div>

      {/* Update Society Form */}
      <form onSubmit={handleSubmit} className="updateCard-form">
        <h3>Update Society Summary</h3>
        <label>Total Wings:</label>
        <input
          type="number"
          value={totalWings}
          onChange={(e) => setTotalWings(Number(e.target.value))}
          required
          min="1"
        />
        <label>Flats per Floor:</label>
        <input
          type="number"
          value={flatsPerFloor}
          onChange={(e) => setFlatsPerFloor(Number(e.target.value))}
          required
        />
        <label>Floors per Wing:</label>
        <input
          type="number"
          value={floorsPerWing}
          onChange={(e) => setFloorsPerWing(Number(e.target.value))}
          required
        />
        <label>Maintenance per Flat:</label>
        <input
          type="number"
          value={maintenancePerFlat}
          onChange={(e) => setMaintenancePerFlat(Number(e.target.value))}
          required
        />
        <label>Month:</label>
        <select value={month} onChange={(e) => setMonth(e.target.value)} required>
          <option value="" disabled>Select Month</option>
          {[
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
          ].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <button type="submit">Update Summary</button>
      </form>

      {/* Wings List */}
      <div className="wings-container">
        {flatsData.map((wing, wingIndex) => (
          <div
            key={wing.name}
            className="wing-card"
            onClick={() => setSelectedWing(wingIndex)}
          >
            <h4>{wing.name}</h4>
          </div>
        ))}
      </div>

      {/* Flats List for Selected Wing */}
      {selectedWing !== null && (
        <div className="flats-container">
          {flatsData[selectedWing].flats.map((flat, flatIndex) => (
            <div key={flat.flatNumber} className="flat-card">
              {flat.pendingMaintenance > 0 && <span className="pending-indicator"></span>}
              <h5>Flat {flat.flatNumber}</h5>
              <p><strong>Total Maintenance:</strong> ₹{flat.paidMaintenance + flat.pendingMaintenance}</p>
              <p><strong>Total Maintenance Paid:</strong> ₹{flat.paidMaintenance}</p>
              <p><strong>Total Maintenance Pending:</strong> ₹{flat.pendingMaintenance}</p>
              <button
                onClick={() => {
                  setSelectedFlat({ wingIndex: selectedWing, flatIndex });
                  setShowAddMaintenanceModal(true);
                }}
              >
                Pay Maintenance
              </button>
              <button onClick={() => toggleHistory(selectedWing, flatIndex)}>
                {flat.maintenanceHistory.length ? "Hide History" : "Show History"}
              </button>
              {flat.maintenanceHistory.length > 0 && (
                <div className="maintenance-history">
                  <h6>Maintenance History</h6>
                  <ul>
                    {flat.maintenanceHistory.map((history, index) => (
                      <li key={index}>
                        {history.date} - ₹{history.amount} (Month: {history.month})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Maintenance Modal */}
      {showAddMaintenanceModal && (
        <MaintenanceForm
          flat={flatsData[selectedFlat.wingIndex].flats[selectedFlat.flatIndex]}
          onClose={() => setShowAddMaintenanceModal(false)}
          onAddMaintenance={addMaintenance}
        />
      )}
    </div>
  );
};

export default AdminUpdateCard;
