import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Edit2, Trash2 } from "lucide-react"
export default function Backlog() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    project: "",
    assignedTo: "",
    name: "",
    description: "",
    dateTime: "",
    estimatedDuration: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    if (name === "dateTime") {
      const now = new Date();
      const selected = new Date(value);
      const diffMs = selected - now;
      const diffMin = Math.max(Math.round(diffMs / 60000), 0);
      updated.estimatedDuration = diffMin;
    }

    setFormData(updated);
  };

  const handleSubmit=async()=>{

  }
  return (
    <div
      style={{
        padding: "1.5rem",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      {/* Breadcrumb */}
      <div style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "#6c757d" }}>
        <a href="/dashboard" style={{ color: "#0d6efd", textDecoration: "none" }}>
          Dashboard
        </a>{" "}
        &gt; <span style={{ fontWeight: "bold", color: "#000" }}>Backlog</span>
      </div>

      {/* Add Backlog Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            fontSize: "0.85rem",
            backgroundColor: "#0d6efd",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          <Plus size={16} />
          Add Backlog
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "flex-end",
          marginBottom: "1.5rem"
        }}
      >
        {["Select Project", "Select Task", "Assigned To"].map((label) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", width: "260px" }}>
            <label style={labelStyle}>{label}</label>
            <select style={inputStyle}>
              <option>{label} A</option>
              <option>{label} B</option>
            </select>
          </div>
        ))}

        {/* Search */}
        <div style={{ display: "flex", flexDirection: "column", width: "260px" }}>
          <label style={labelStyle}>Search</label>
          <input type="text" placeholder="Search backlog..." style={inputStyle} />
        </div>

        {/* Date */}
        <div style={{ display: "flex", flexDirection: "column", width: "260px" }}>
          <label style={labelStyle}>Select Date</label>
          <input type="date" style={inputStyle} />
        </div>
      </div>

      {/* Backlog Form */}
      {showForm && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "1rem",
            borderRadius: "6px",
            marginBottom: "1.5rem",
            border: "1px solid #dee2e6"
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {/* Project */}
            <div style={{ flex: "1 1 260px" }}>
              <label style={labelStyle}>Project</label>
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Project</option>
                <option value="A">Project A</option>
                <option value="B">Project B</option>
              </select>
            </div>

            {/* Assigned To */}
            <div style={{ flex: "1 1 260px" }}>
              <label style={labelStyle}>Assigned To</label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">User A</option>
                <option value="B">User B</option>
              </select>
            </div>

            {/* Backlog Name */}
            <div style={{ flex: "1 1 260px" }}>
              <label style={labelStyle}>Backlog Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                style={inputStyle}
              />
            </div>

            {/* Description */}
            <div style={{ flex: "1 1 260px" }}>
              <label style={labelStyle}>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                style={inputStyle}
              />
            </div>

            {/* Date & Time */}
            <div style={{ flex: "1 1 260px" }}>
              <label style={labelStyle}>Date & Time</label>
              <input
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Estimated Duration */}
            <div style={{ flex: "1 1 260px" }}>
              <label style={labelStyle}>Estimated Duration</label>
              <input
                type="text"
                readOnly
                value={
                  formData.estimatedDuration
                    ? `${formData.estimatedDuration} mins`
                    : ""
                }
                style={{ ...inputStyle, backgroundColor: "#e9ecef" }}
              />
            </div>
          </div>
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
      <button
        type="button"
        onClick={handleSubmit} // Replace with your actual submit handler
        style={{
          backgroundColor: "#0d6efd",
          color: "#fff",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Add Backlog
      </button>

      <button
        type="button"
        onClick={() => setShowForm(false)} // Cancel action
        style={{
          backgroundColor: "#6c757d",
          color: "#fff",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Cancel
      </button>
    </div>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            fontSize: "0.9rem"
          }}
        >
          <thead style={{ backgroundColor: "#f8f9fa" }}>
            <tr>
              {["Si. No.", "Project", "Task", "Assigned To", "Status", "Date", "Action"].map(
                (header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: "left",
                      padding: "0.75rem",
                      border: "1px solid #dee2e6",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {[1, 2].map((id) => (
              <tr key={id}>
                <td style={tdStyle}>{id}</td>
                <td style={tdStyle}>Project A</td>
                <td style={tdStyle}>Design Page</td>
                <td style={tdStyle}>User A</td>
                <td style={tdStyle}>In Progress</td>
                <td style={tdStyle}>2025-07-28</td>
                <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Edit2 size={16} style={{ cursor: "pointer", marginRight: "0.5rem", color: "#0d6efd" }} />
                            <Trash2 size={16} style={{ cursor: "pointer", color: "red" }} />
                        </div>
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
  padding: "0.4rem",
  fontSize: "0.85rem",
  border: "1px solid #ced4da",
  borderRadius: "4px",
  width: "100%"
};

const labelStyle = {
  fontWeight: "500",
  fontSize: "0.9rem",
  marginBottom: "0.3rem"
};

const tdStyle = {
  padding: "0.75rem",
  border: "1px solid #dee2e6",
  verticalAlign: "top"
};
