import React, { useState } from "react";
import * as XLSX from "xlsx";
import { FaFileExport } from "react-icons/fa";

export default function Salary() {
  const [filters, setFilters] = useState({
    date: "",
    employee: "",
    month: "",
  });

  const [data] = useState([
    {
      id: 1,
      name: "John Doe",
      leaveDays: 2,
      attendedDays: 20,
      monthlyHours: 160,
      dailyHours: 8,
    },
    {
      id: 2,
      name: "Jane Smith",
      leaveDays: 1,
      attendedDays: 21,
      monthlyHours: 168,
      dailyHours: 8,
    },
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleExportSingle = (emp) => {
    const exportData = [
      {
        ID: emp.id,
        Name: emp.name,
        "Days Leave": emp.leaveDays,
        "Days Attended": emp.attendedDays,
        "Monthly Hours": emp.monthlyHours,
        "Daily Hours": emp.dailyHours,
      },
    ];
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Salary Report");
    XLSX.writeFile(wb, `${emp.name.replace(" ", "_")}_salary.xlsx`);
  };

  const filteredData = data.filter((emp) => {
    return (
      (filters.employee === "" || emp.name === filters.employee) &&
      (filters.month === "" || true)
    );
  });

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>Salary Report</h2>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "2rem",
        }}
      >
        {["date", "employee", "month"].map((filterKey) => {
          const labelMap = {
            date: "Select Date",
            employee: "Employee Name",
            month: "Select Month",
          };
          return (
            <div
              key={filterKey}
              style={{ display: "flex", flexDirection: "column", width: "450px" }}
            >
              <label
                style={{
                  marginBottom: "6px",
                  fontWeight: 600,
                  color: "#555",
                }}
              >
                {labelMap[filterKey]}
              </label>
              {filterKey === "date" ? (
                <input
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  style={inputStyle}
                />
              ) : (
                <select
                  name={filterKey}
                  value={filters[filterKey]}
                  onChange={handleFilterChange}
                  style={inputStyle}
                >
                  <option value="">All</option>
                  {filterKey === "employee"
                    ? data.map((emp) => (
                        <option key={emp.id} value={emp.name}>
                          {emp.name}
                        </option>
                      ))
                    : [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                </select>
              )}
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: "#dee2e6" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Days Leave</th>
              <th style={thStyle}>Days Attended</th>
              <th style={thStyle}>Monthly Hours</th>
              <th style={thStyle}>Daily Hours</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((emp, index) => (
              <tr
                key={emp.id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                }}
              >
                <td style={tdStyle}>{emp.id}</td>
                <td style={tdStyle}>{emp.name}</td>
                <td style={tdStyle}>{emp.leaveDays}</td>
                <td style={tdStyle}>{emp.attendedDays}</td>
                <td style={tdStyle}>{emp.monthlyHours}</td>
                <td style={tdStyle}>{emp.dailyHours}</td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  <button
                    onClick={() => handleExportSingle(emp)}
                    style={exportBtnStyle}
                  >
                    <FaFileExport style={{ marginRight: "6px" }} />
                    Export
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "0.5rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "0.95rem",
  backgroundColor: "#fff",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.95rem",
  boxShadow: "0 0 8px rgba(0,0,0,0.05)",
};

const thStyle = {
  textAlign: "left",
  padding: "0.75rem",
  border: "1px solid #dee2e6",
  fontWeight: 600,
  color: "#333",
};

const tdStyle = {
  padding: "0.75rem",
  border: "1px solid #dee2e6",
  color: "#333",
};

const exportBtnStyle = {
  padding: "0.4rem 0.8rem",
  backgroundColor: "#198754",
  color: "white",
  fontSize: "0.85rem",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
};
