import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./Table.css";

function createData(complaintType, flatNumber, dateSubmitted, status) {
  return { complaintType, flatNumber, dateSubmitted, status };
}

const rows = [
  createData("Water Leakage", "A-101", "1 October 2024", "Resolved"),
  createData("Noisy Neighbors", "B-202", "3 October 2024", "Pending"),
  createData("Lift Maintenance", "C-305", "2 October 2024", "In Progress"),
  createData("Security Issue", "D-102", "4 October 2024", "Resolved"),
];

const makeStyle = (status) => {
  if (status === "Resolved") {
    return {
      background: "rgb(145 254 159 / 47%)",
      color: "green",
    };
  } else if (status === "Pending") {
    return {
      background: "#ffadad8f",
      color: "red",
    };
  } else {
    return {
      background: "#59bfff",
      color: "white",
    };
  }
};

export default function SocietyReportsTable() {
  return (
    <div className="Table">
      <h3>Recent Reports</h3>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Complaint Type</TableCell>
              <TableCell align="left">Flat Number</TableCell>
              <TableCell align="left">Date Submitted</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{ color: "white" }}>
            {rows.map((row) => (
              <TableRow
                key={row.flatNumber}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.complaintType}
                </TableCell>
                <TableCell align="left">{row.flatNumber}</TableCell>
                <TableCell align="left">{row.dateSubmitted}</TableCell>
                <TableCell align="left">
                  <span className="status" style={makeStyle(row.status)}>
                    {row.status}
                  </span>
                </TableCell>
                <TableCell align="left" className="Details">Details</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
