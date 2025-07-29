import React, { useState } from "react";
import { Plus } from "lucide-react";

export default function AddBacklog() {
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

    // Auto-calculate estimatedDuration when dateTime is updated
    if (name === "dateTime") {
      const now = new Date();
      const selected = new Date(value);
      const diffMs = selected - now;
      const diffMin = Math.max(Math.round(diffMs / 60000), 0); // prevent negative
      updated.estimatedDuration = diffMin;
    }

    setFormData(updated);
  };

  return (
    <div style={{ padding: "1.5rem", fontFamily: "Arial, sans-serif" }}>
    

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

      {/* Backlog Form */}
      {showForm && (
        <div style={{ background: "#f8f9fa", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <select
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="form-select"
              style={{ flex: 1 }}
            >
              <option>Select Project</option>
            </select>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="form-select"
              style={{ flex: 1 }}
            >
              <option>Assigned To</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <input
              type="text"
              name="name"
              placeholder="Backlog Name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              style={{ flex: 1 }}
            />
            <textarea
              name="description"
              placeholder="Description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <input
              type="datetime-local"
              name="dateTime"
              className="form-control"
              value={formData.dateTime}
              onChange={handleChange}
              style={{ flex: 1 }}
            />
            <input
              type="text"
              readOnly
              className="form-control"
              value={formData.estimatedDuration ? `${formData.estimatedDuration} mins` : ""}
              placeholder="Estimated Duration"
              style={{ flex: 1 }}
            />
          </div>
          <button
            className="btn btn-success"
            onClick={() => console.log("Submit form", formData)}
          >
            Submit Backlog
          </button>
        </div>
      )}

     
    </div>
  );
}
