import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TaskForm({ onClose }) {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    project_id: "",
    user_id: "",
    task_name: "",
    task_description: "",
    deadline: "",
    duration: ""
  });

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/v1/users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/v1/projects");
      setProjects(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch projects");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    if (name === "deadline") {
      const today = dayjs();
      const deadline = dayjs(value);
      const diff = deadline.diff(today, "day");
      updatedForm.duration = diff >= 0 ? `${diff} day(s)` : "Invalid deadline";
    }

    setFormData(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/v1/tasks", formData);
      toast.success("Task created successfully!");
      
      // Reset form and close
      setFormData({
        project_id: "",
        user_id: "",
        task_name: "",
        task_description: "",
        deadline: "",
        duration: ""
      });
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast.error("Failed to create task");
      console.error("Error creating task:", error);
    }
  };

  return (
    <div style={{ 
      marginTop: "16px", 
      padding: "16px", 
      background: "#f8f9fa", 
      borderRadius: "6px",
      border: "1px solid #dee2e6"
    }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Project</label>
          <select
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ced4da"
            }}
          >
            <option value="">Select project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.project_name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Assigned To</label>
          <select
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ced4da"
            }}
          >
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Task Name</label>
          <input
            type="text"
            name="task_name"
            value={formData.task_name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ced4da"
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Description</label>
          <textarea
            name="task_description"
            value={formData.task_description}
            onChange={handleChange}
            rows={3}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ced4da"
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ced4da"
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            readOnly
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ced4da",
              backgroundColor: "#e9ecef"
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "16px"
            }}
          >
            Submit
          </button>
          
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "16px"
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}