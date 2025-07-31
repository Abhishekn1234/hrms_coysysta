import React, { useState, useEffect } from "react";
import axios from "axios";
import { Save } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Punching() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPunchingData();
  }, [search, date]);

  const fetchPunchingData = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/v1/punching-report", {
        params: {
          search,
          date,
        },
      });
      setData(res.data);
    } catch (err) {
      console.error("Error fetching punching report", err);
    }
  };
const handleResetFilters = () => {
  setDate("");
  setSearch("");
};


  const formatTime = (timeStr, label = "Check-in") => {
  if (!timeStr || timeStr === '00:00:00') {
    return `No ${label.toLowerCase()} found`;
  }

  const [hours, minutes, seconds] = timeStr.split(':');
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), Number(seconds || 0));
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const formatDuration = (timeStr) => {
  if (!timeStr) return '0';

  const [h, m, s] = timeStr.split(':').map(Number);

  const parts = [];
  if (h > 0) parts.push(`${h} hr`);
  if (m > 0) parts.push(`${m} min`);
  if (s > 0) parts.push(`${s} sec`);

  return parts.length > 0 ? parts.join(' ') : '0';
};

const exportToExcel = () => {
  const exportData = data.map((row) => ({
    ID: row.id,
    Name: row.name
      ? row.name
      : row.first_name && row.last_name
      ? `${row.first_name} ${row.last_name}`
      : "No user name found",
    "Check-In": row.checkIn
      ? formatTime(row.checkIn)
      : "No check-in found",
    "Check-Out": row.checkOut
      ? formatTime(row.checkOut)
      : "No check-out found",
    "Daily Working Hours": formatDuration(row.hours),
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Punching Report");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(dataBlob, "Punching_Report.xlsx");
};
  return (
    <div style={{ padding: "1.5rem", fontFamily: "Arial, sans-serif" }}>
      {/* Filters */}
     <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    marginBottom: "1rem",
    maxWidth: "100%",
  }}
>
  {/* Date & Search Inputs */}
  <div
    style={{
      display: "flex",
      gap: "1rem",
      flex: "1",
      minWidth: "0",
    }}
  >
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      style={{
        flex: "1",
        minWidth: "200px",
        padding: "0.4rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
      }}
    />
    <input
      type="text"
      placeholder="Search by name"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        flex: "2",
        minWidth: "250px",
        padding: "0.4rem",
        borderRadius: "4px",
        border: "1px solid #ccc",
      }}
    />
  </div>

  {/* Buttons */}
  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
    <button
      onClick={exportToExcel}
      style={{
        backgroundColor: "#0d6efd",
        color: "#fff",
        padding: "0.5rem 1rem",
        border: "none",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        whiteSpace: "nowrap",
        fontSize: "0.875rem",
      }}
    >
      <Save size={16} /> <span>Download XLSX</span>
    </button>

    <button
      onClick={handleResetFilters}
      style={{
        backgroundColor: "#6c757d",
        color: "#fff",
        padding: "0.5rem 1rem",
        border: "none",
        borderRadius: "4px",
        whiteSpace: "nowrap",
        fontSize: "0.875rem",
      }}
    >
      Reset Filters
    </button>
  </div>
</div>


      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          border: "1px solid #dee2e6",
        }}
      >
        <thead style={{ backgroundColor: "#f8f9fa" }}>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Check-In</th>
            <th style={thStyle}>Check-Out</th>
            <th style={thStyle}>Daily Working Hours</th>
          </tr>
        </thead>
       <tbody>
  {data.length > 0 ? (
    data.map((row, index) => (
      <tr key={index}>
        <td style={tdStyle}>{row.id}</td>
        <td style={tdStyle}>
  {row.name
    ? row.name
    : row.first_name && row.last_name
    ? `${row.first_name} ${row.last_name}`
    : "No user name found"}
</td>

        <td style={tdStyle}>{formatTime(row.checkIn)}</td>
        <td style={tdStyle}>{formatTime(row.checkOut)}</td>
        <td style={tdStyle}>{formatDuration(row.hours)}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" style={{ textAlign: "center", padding: "1rem", color: "#888" }}>
        No records found.
      </td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
}

const thStyle = {
  padding: "0.75rem",
  border: "1px solid #dee2e6",
  textAlign: "left",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "0.75rem",
  border: "1px solid #dee2e6",
  textAlign: "left",
};
