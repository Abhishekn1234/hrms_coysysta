import React, { useState } from "react";
import { Save } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Punching() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  const data = [
    { id: 1, name: "John Doe", checkIn: "09:00 AM", checkOut: "05:00 PM", hours: 8 },
    { id: 2, name: "Jane Smith", checkIn: "09:30 AM", checkOut: "06:00 PM", hours: 8.5 },
    { id: 3, name: "Mike Johnson", checkIn: "10:00 AM", checkOut: "04:30 PM", hours: 6.5 }
  ];

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Punching Report");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "Punching_Report.xlsx");
  };

  return (
    <div style={{ padding: "1.5rem", fontFamily: "Arial, sans-serif" }}>
      {/* Filters */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
       <div style={{ display: "flex", gap: "1rem", width: "100%", maxWidth: "500px", marginBottom: "1rem" }}>
  <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    style={{
      flex: "1",
      minWidth: "140px",
      padding: "0.4rem",
      borderRadius: "4px",
      border: "1px solid #ccc"
    }}
  />
  <input
    type="text"
    placeholder="Search by name"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{
      flex: "2",
      minWidth: "200px",
      padding: "0.4rem",
      borderRadius: "4px",
      border: "1px solid #ccc"
    }}
  />
</div>

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
            cursor: "pointer"
          }}
        >
          <Save size={16} /> Download XLSX
        </button>
      </div>

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          border: "1px solid #dee2e6"
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
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <tr key={index}>
                <td style={tdStyle}>{row.id}</td>
                <td style={tdStyle}>{row.name}</td>
                <td style={tdStyle}>{row.checkIn}</td>
                <td style={tdStyle}>{row.checkOut}</td>
                <td style={tdStyle}>{row.hours}</td>
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
  fontWeight: "bold"
};

const tdStyle = {
  padding: "0.75rem",
  border: "1px solid #dee2e6",
  textAlign: "left"
};
