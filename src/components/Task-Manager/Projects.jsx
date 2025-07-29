import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function Tasks() {
  const [projects, setProjects] = useState([]);
  const [editForm, setEditForm] = useState(false);
  const [addForm, setAddForm] = useState(false);

  const [editData, setEditData] = useState({
    id: "",
    project_name: "",
    project_starting_date: "",
    expected_release_date: "",
    deadline: "",
    status: "",
    project_description: ""
  });

 const [formData, setFormData] = useState({
  project_name: "",
  project_starting_date: "",
  expected_release_date: "",
  deadline: "",
  status: 0, // 0 = In Progress, 1 = Completed
  project_description: ""
});


  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/v1/projects");
    setProjects(response.data.data);
  };

  const fetchById = async (id) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/v1/projects/${id}`);
    const data = response.data;
    setEditData({
      id: data.id,
      project_name: data.project_name ?? "",
      project_starting_date: data.project_starting_date ?? "",
      expected_release_date: data.expected_release_date ?? "",
      deadline: data.deadline ?? "",
      status: data.status ?? "",
      project_description: data.project_description ?? ""
    });
    setEditForm(true);
    setAddForm(false);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };




  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/v1/project/${editData.id}`, editData);
      toast.success("Project updated");
      setEditForm(false);
      fetchProjects();
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Update failed");
    }
  };
  
  const AddProjects = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/v1/projects", formData);
      toast.success("Project added");
      setFormData({
        project_name: "",
        project_starting_date: "",
        expected_release_date: "",
        deadline: "",
        status: "",
        project_description: ""
      });
      setAddForm(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error("Add project failed");
    }
  };

  const handleCancel = () => {
    setEditForm(false);
    setEditData({
      id: "",
      project_name: "",
      project_starting_date: "",
      expected_release_date: "",
      deadline: "",
      status: "",
      project_description: ""
    });
  };

  const handleDelete = async (id) => {
    if (!id) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/project/${id}`);
      toast.success("Deleted successfully");
      fetchProjects();
      setEditForm(false);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "1rem"
  };

  const buttonStyle = {
    padding: "0.5rem 1.5rem",
    borderRadius: "4px",
    border: "none",
    color: "#fff",
    cursor: "pointer"
  };

  return (
    <div style={{ padding: "1.5rem", backgroundColor: "#f9f9f9", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <h2>Project List</h2>
        <button
          onClick={() => {
            setAddForm(true);
            setEditForm(false);
          }}
          style={{
            ...buttonStyle,
            backgroundColor: "#0d6efd",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <PlusCircle size={18} /> Add Project
        </button>
      </div>

      {/* Add Form */}
      {addForm && (
        <form onSubmit={AddProjects} style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "8px", marginBottom: "2rem" }}>
          <h4>Add Project</h4>
          <input type="text" name="project_name" placeholder="Project Name" value={formData.project_name} onChange={handleFormChange} style={inputStyle} />
          <input type="date" name="project_starting_date" value={formData.project_starting_date} onChange={handleFormChange} style={inputStyle} />
          <input type="date" name="expected_release_date" value={formData.expected_release_date} onChange={handleFormChange} style={inputStyle} />
          <input type="date" name="deadline" value={formData.deadline} onChange={handleFormChange} style={inputStyle} />
                    <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                style={inputStyle}
                >
                <option value="">Select Status</option>
                <option value="0">In Progress</option>
                <option value="1">Completed</option>
                </select>


          <textarea name="project_description" placeholder="Description" rows="3" value={formData.project_description} onChange={handleFormChange} style={inputStyle}></textarea>
          <div className="d-flex gap-1">
          <button type="submit" style={{ ...buttonStyle, backgroundColor: "#198754" }}>Add</button><button className="btn btn-success" onClick={() => setAddForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {/* Edit Form */}
      {editForm && (
        <form onSubmit={handleUpdate} style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "8px", marginBottom: "2rem" }}>
          <h4>Edit Project</h4>
          <input type="text" name="project_name" value={editData.project_name} onChange={handleChange} style={inputStyle} />
          <input type="date" name="project_starting_date" value={editData.project_starting_date?.slice(0, 10)} onChange={handleChange} style={inputStyle} />
          <input type="date" name="expected_release_date" value={editData.expected_release_date?.slice(0, 10)} onChange={handleChange} style={inputStyle} />
          <input type="date" name="deadline" value={editData.deadline?.slice(0, 10)} onChange={handleChange} style={inputStyle} />
          <select name="status" value={editData.status} onChange={handleChange} style={inputStyle}>
            <option value="">Select</option>
            <option value="0">In Progress</option>
            <option value="1">Completed</option>
          </select>
          <textarea name="project_description" rows="3" value={editData.project_description} onChange={handleChange} style={inputStyle}></textarea>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="submit" style={{ ...buttonStyle, backgroundColor: "#0d6efd" }}>Update</button>
            <button type="button" onClick={handleCancel} style={{ ...buttonStyle, backgroundColor: "#6c757d" }}>Cancel</button>
          </div>
        </form>
      )}

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", border: "1px solid #ddd" }}>
        <thead>
          <tr style={{ backgroundColor: "lightgray", color: "black" }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Start Date</th>
            <th style={thStyle}>Release Date</th>
            <th style={thStyle}>Deadline</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Duration of Project</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((row, index) => (
            <tr key={row.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{row.project_name}</td>
              <td style={tdStyle}>{row.project_starting_date?.slice(0, 10)}</td>
              <td style={tdStyle}>{row.expected_release_date?.slice(0, 10)}</td>
              <td style={tdStyle}>{row.deadline?.slice(0, 10)}</td>
                            <td style={{ ...tdStyle, color: row.status === 1 ? 'green' : 'orange', fontWeight: 'bold' }}>
                    {row.status === 1 ? 'Completed' : 'In Progress'}
                    </td>


              <td style={tdStyle}>{row.project_description}</td>
              <td style={tdStyle}>
                {Math.ceil(
                    (new Date(row.deadline).getTime() - new Date(row.project_starting_date).getTime()) / (1000 * 60 * 60 * 24)
                )} days
                </td>

              <td style={{ ...tdStyle, display: "flex", gap: "1rem" }}>
                <Edit size={18} style={{ color: "#0d6efd", cursor: "pointer" }} onClick={() => fetchById(row.id)} />
                <Trash2 size={18} style={{ color: "red", cursor: "pointer" }} onClick={() => handleDelete(row.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "0.75rem",
  textAlign: "left",
  fontWeight: "600",
  borderBottom: "1px solid #ccc"
};

const tdStyle = {
  padding: "0.75rem",
  textAlign: "left",
  verticalAlign: "top"
};
