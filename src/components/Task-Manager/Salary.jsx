import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { FaFileExport } from "react-icons/fa";

export default function Salary() {
  const [filters, setFilters] = useState({
    date: "",
    employee: "",
    month: "",
  });

  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Fetch employee list
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/v1/users");
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/v1/salaries", {
        params: {
          date: filters.date,
          employee: filters.employee,
          month: filters.month,
        },
      });
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch salary data", err);
    }
  };
  const getFilteredData = () => {
  return data.filter((emp) => {
    const createdAt = new Date(emp.created_at);
    const empDate = createdAt.toISOString().split("T")[0]; // "2025-07-29"
    const empMonth = createdAt.toLocaleString("default", { month: "long" }); // "July"

    const matchEmployee = filters.employee ? emp.id == filters.employee : true;
    const matchDate = filters.date ? empDate === filters.date : true;
    const matchMonth = filters.month ? empMonth === filters.month : true;

    return matchEmployee && matchDate && matchMonth;
  });
};


  useEffect(() => {
    fetchEmployees();
    fetchData(); 
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    fetchData();
  };

  const handleResetFilters = () => {
    setFilters({ date: "", employee: "", month: "" });
    fetchData();
  };

  const handleExportSingle = (emp) => {
    const exportData = [
      {
        ID: emp.id,
        Name: emp.name,
        Month: filters.month || new Date().toLocaleString("default", { month: "long" }),
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

  return (
    <div style={pageStyle}>
      <h2 style={{ marginBottom: "1.5rem", color: "#333" }}>Salary Report</h2>

      {/* Filters */}
    <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-end",
    gap: "1rem",
    marginBottom: "1rem",
  }}
>
  {/* Date */}
  <div style={{ display: "flex", flexDirection: "column", width: "350px" }}>
    <label style={labelStyle}>Select Date</label>
    <input
      type="date"
      name="date"
      value={filters.date}
      onChange={handleFilterChange}
      style={inputStyle}
    />
  </div>

  {/* Employee */}
  <div style={{ display: "flex", flexDirection: "column", width: "350px" }}>
    <label style={labelStyle}>Employee</label>
    <select
      name="employee"
      value={filters.employee}
      onChange={handleFilterChange}
      style={inputStyle}
    >
      <option value="">All</option>
      {employees.map((emp) => (
        <option key={emp.id} value={emp.id}>
          {emp.name}
        </option>
      ))}
    </select>
  </div>

  {/* Month */}
  <div style={{ display: "flex", flexDirection: "column", width: "350px" }}>
    <label style={labelStyle}>Month</label>
    <select
      name="month"
      value={filters.month}
      onChange={handleFilterChange}
      style={inputStyle}
    >
      <option value="">All</option>
      {[
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ].map((month) => (
        <option key={month} value={month}>
          {month}
        </option>
      ))}
    </select>
  </div>

  {/* Buttons */}
  {/* Buttons */}
<div
  style={{
    display: "flex",
    alignItems: "flex-end",
    gap: "0.3rem", // tighter gap
    marginLeft: "auto", // pushes buttons to the right end only if needed
  }}
>
  <button
    onClick={handleApplyFilters}
    style={{
      padding: "6px 12px",
      backgroundColor: "#0d6efd",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    Apply Filters
  </button>
  <button
    onClick={handleResetFilters}
    style={{
      padding: "6px 12px",
      backgroundColor: "#6c757d",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    Reset
  </button>
</div>

</div>


      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: "#dee2e6" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Month</th>
              <th style={thStyle}>Days Leave</th>
              <th style={thStyle}>Days Attended</th>
              <th style={thStyle}>Monthly Hours</th>
              <th style={thStyle}>Daily Hours</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
              <tbody> 
                {getFilteredData().length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ ...tdStyle, textAlign: "center", color: "#999" }}>
                      No records found.
                    </td>
                  </tr>
                ) : (
                     getFilteredData().map((emp, index) => (
                      <tr key={emp.id} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
                        <td style={tdStyle}>{emp.id}</td>
                        <td style={tdStyle}>{emp.name}</td>
                      <td style={tdStyle}>
                          {emp.created_at
                            ? new Date(emp.created_at.split(" ")[0]).toLocaleString("default", { month: "long" })
                            : ""}
                        </td>


                        <td style={tdStyle}>{emp.leaveDays}</td>
                        <td style={tdStyle}>{emp.attendedDays}</td>
                        <td style={tdStyle}>{emp.monthlyHours}</td>
                        <td style={tdStyle}>{emp.dailyHours}</td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>
                          <button onClick={() => handleExportSingle(emp)} style={exportBtnStyle}>
                            <FaFileExport style={{ marginRight: "6px" }} />
                            Export
                          </button>
                        </td>
                      </tr>
                  ))
                    )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
const applyBtnStyle = {
  padding: "0.5rem",
  borderRadius: "6px",
  backgroundColor: "#0d6efd",
  color: "#fff",
  width:"300px",
  border: "none",
  cursor: "pointer",
  objectFit:"cover"
};

const resetBtnStyle = {
  padding: "0.5rem 1rem",
  marginTop: "1.3rem",
  borderRadius: "6px",
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const pageStyle = {
  padding: "2rem",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: "#f8f9fa",
  minHeight: "100vh",
};

const filterRowStyle = {
  display: "flex",
  // flexWrap: "wrap",
  gap: "10px",
  marginBottom: "2rem",
};

const labelStyle = {
  marginBottom: "6px",
  fontWeight: 600,
  color: "#555",
};

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
