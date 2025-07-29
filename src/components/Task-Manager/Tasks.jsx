import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Eye, Trash2, Pause, Play, CheckCircle, Edit2, PlusIcon,FileDown,X } from "lucide-react";
import TaskForm from "./TaskForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { fas } from "@fortawesome/free-solid-svg-icons";
export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
const [selectedTask, setSelectedTask] = useState(null);
const [showModal, setShowModal] = useState(false);
const [projectList, setProjectList] = useState([]);
  const [userList, setUserList] = useState([]);

const [editModal,setEditModal]=useState(false);
  const [search, setSearch] = useState("");
  const[editTasks,setEditTasks]=useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [actionModal, setActionModal] = useState({ show: false, task: null, type: "" });
  const tasksRef = useRef([]);
  tasksRef.current = tasks;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/get/tasks");
      setTasks(response.data);
    } catch (error) {
      toast.error("Failed to load tasks.");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      tasksRef.current.forEach((task) => updateDuration(task.id));
    }, 60000);
    return () => clearInterval(interval);
  }, []);
useEffect(() => {
  const fetchData = async () => {
    try {
      const [projectsRes, usersRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/v1/projects'),
        axios.get('http://127.0.0.1:8000/api/v1/users'),
      ]);
      setProjectList(projectsRes.data.data);
      setUserList(usersRes.data);
    } catch (error) {
      console.error('Failed to fetch dropdown data', error);
    }
  };

  fetchData();
}, []);

  const updateDuration = async (id) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/v1/task/${id}/duration`);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, duration: res.data.duration } : task
        )
      );
    } catch (err) {
      toast.error("Failed to update duration");
    }
  };
  const handleDownloadXLSX = () => {
  const task = selectedTask;

  // Prepare structured rows with section headers
  const rows = [
    ["Task"],
    ["Task Details"],
    ["Task Name", task.task_name],
    ["Description", task.task_description],
    ["Status", task.project_status],
    ["Deadline", task.deadline],
    ["Duration", task.duration],
    [],

    ["Project"],
    ["Project Details"],
    ["Project Name", task.project?.project_name],
    ["Description", task.project?.project_description],
    ["Start Date", task.project?.project_starting_date],
    ["Expected Release Date", task.project?.expected_release_date],
    ["Deadline", task.project?.deadline],
    [],

    ["User"],
    ["User Details"],
    ["Name", task.user?.name],
    ["Email", task.user?.email],
    ["Phone", task.user?.phone],
    ["Position", task.user?.designation],
    ["Department", task.user?.department],
    ["Join Date", task.user?.join_date],
    ["Work Location", task.user?.work_location],
    ["Reporting Manager", task.user?.reporting_manager],
  ];

  // Convert to worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  // Create workbook and add the sheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Task Details");

  // Convert workbook to binary and trigger download
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "Task_Details.xlsx");
};


const handleDelete = async (taskId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://127.0.0.1:8000/api/v1/task/${taskId}`);
    toast.success("Task deleted successfully.");
   
       setTimeout(() => {
        fetchTasks();
      }, 1000); // wait 1 second before reload
  } catch (error) {
    console.error("Delete failed", error);
    toast.error("Failed to delete the task.");
  }
};

  const handleActionConfirmed = async () => {
    const { task, type } = actionModal;
    if (!task || !type) return;
    try {
      await axios.post(`http://127.0.0.1:8000/api/v1/task/${task.id}/${type}/${task.user?.id}`);
          toast.success(`Task ${type}d successfully`);
      setTimeout(() => {
        fetchTasks();
      }, 1000); // wait 1 second before reload

    } catch (err) {
      toast.error(`Failed to ${type} task`);
    } finally {
      setActionModal({ show: false, task: null, type: "" });
    }
  };

 const filteredTasks = tasks.filter((task) => {
  const searchLower = search.toLowerCase();
  const matchesSearch =
    !search ||
    (task.project_name || "").toLowerCase().includes(searchLower) ||
    (task.task_name || "").toLowerCase().includes(searchLower) ||
    (task.user?.name || "").toLowerCase().includes(searchLower);

  const matchesStatus = statusFilter === "All" || task.project_status === statusFilter;

  const matchesDate =
    !selectedDate || (task.deadline && task.deadline.startsWith(selectedDate));

  return matchesSearch && matchesStatus && matchesDate;
});
const handleView = async (taskId) => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/v1/task/${taskId}`);
    setSelectedTask(res.data);
    setEditTasks(res.data);
    setEditModal(true);
  } catch (error) {
    console.error("Failed to fetch task", error);
  }
};
const handleViews = async (taskId) => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/v1/task/${taskId}`);
    setSelectedTask(res.data);
    // setEditTasks(res.data);
    setShowModal(true);
  } catch (error) {
    console.error("Failed to fetch task", error);
  }
};
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.put(`http://127.0.0.1:8000/api/v1/task/${editTasks.id}`, editTasks);
    toast.success("Task updated successfully");
    setEditModal(false);
    setInterval(()=>{
      fetchTasks();
    },1000);
  } catch (err) {
    console.error("Error updating task:", err);
    toast.error("Update failed");
  }
};


  return (
    <div style={containerStyle}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={breadcrumbStyle}>
        <a href="/dashboard" style={linkStyle}>Dashboard</a> &gt; <span style={boldText}>Tasks</span>
      </div>

       <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    alignItems: "flex-end",
    marginBottom: "1rem",
  }}
>
  <div style={{ flex: "1 1 250px", minWidth: "220px" }}>
    <Dropdown
      label="Task Status"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      options={["All", "Pending", "In Progress", "Paused", "Completed", "Rejected"]}
    />
  </div>

  <div style={{ flex: "1 1 250px", minWidth: "220px" }}>
    <Input
      label="Search"
      placeholder="Search tasks..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  <div style={{ flex: "1 1 250px", minWidth: "220px" }}>
    <Input
      label="Select Date"
      type="date"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
    />
  </div>

  <div style={{ flex: "1 1 120px", minWidth: "120px", marginTop: "0.5rem" }}>
    <span
      style={{
        color: "#007bff",
        cursor: "pointer",
        fontWeight: "500",
        textDecoration: "none",
        display: "inline-block",
        paddingTop: "0.5rem",
      }}
      onClick={() => {
        setStatusFilter("All");
        setSearch("");
        setSelectedDate("");
      }}
    >
      Reset Filters
    </span>
  </div>
</div>
{showModal && selectedTask && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1050
    }}
  >
    <div
      style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}
    >
      <h4 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Task Details</h4>

      {/* Task Info Table */}
      <h5>Task</h5>
      <table style={{ width: '100%', marginBottom: '1.5rem', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={tdLabel}>Name:</td>
            <td style={tdValue}>{selectedTask.task_name}</td>
          </tr>
          <tr>
            <td style={tdLabel}>Description:</td>
            <td style={tdValue}>{selectedTask.task_description}</td>
          </tr>
          <tr>
            <td style={tdLabel}>Deadline:</td>
            <td style={tdValue}>{selectedTask.deadline}</td>
          </tr>
          <tr>
            <td style={tdLabel}>Status:</td>
            <td style={tdValue}>{selectedTask.project_status}</td>
          </tr>
        </tbody>
      </table>

      {/* Project Info Table */}
      {selectedTask.project && (
        <>
          <h5>Project</h5>
          <table style={{ width: '100%', marginBottom: '1.5rem', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={tdLabel}>Name:</td>
                <td style={tdValue}>{selectedTask.project.project_name}</td>
              </tr>
              <tr>
                <td style={tdLabel}>Description:</td>
                <td style={tdValue}>{selectedTask.project.project_description}</td>
              </tr>
              <tr>
                <td style={tdLabel}>Value:</td>
                <td style={tdValue}>{selectedTask.project.project_value}</td>
              </tr>
              <tr>
                <td style={tdLabel}>Status:</td>
                <td style={tdValue}>{selectedTask.project.project_status}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}

      {/* User Info Table */}
      {selectedTask.user && (
        <>
          <h5>User</h5>
          <table style={{ width: '100%', marginBottom: '1.5rem', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={tdLabel}>Name:</td>
                <td style={tdValue}>{selectedTask.user.name}</td>
              </tr>
              <tr>
                <td style={tdLabel}>Email:</td>
                <td style={tdValue}>{selectedTask.user.email}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}

      {/* Buttons */}
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem'
        }}
      >
        <button
          onClick={handleDownloadXLSX}
          title="Download as XLSX"
          style={{
            border: 'none',
            background: '#198754',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <FileDown size={16} /> Download
        </button>

        <button
          onClick={() => setShowModal(false)}
          title="Close"
          style={{
            border: 'none',
            background: '#dc3545',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <X size={16} /> Close
        </button>
      </div>
    </div>
  </div>
)}



{editModal && (
  <form onSubmit={handleSubmit} style={{ padding: "1rem", backgroundColor: "#f9f9f9", border: "1px solid #ddd", borderRadius: "8px", maxWidth: "500px", margin: "0 auto" }}>
    
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>Task Name:</label>
      <input
        type="text"
        name="task_name"
        value={editTasks?.task_name || ""}
        onChange={(e) =>
          setEditTasks({ ...editTasks, task_name: e.target.value })
        }
        style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
      />
    </div>

    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>Assign User:</label>
      <select
        name="user_id"
        value={editTasks?.user_id || ""}
        onChange={(e) =>
          setEditTasks({ ...editTasks, user_id: parseInt(e.target.value) })
        }
        style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
      >
        <option value="">Select User</option>
        {userList.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.designation})
          </option>
        ))}
      </select>
    </div>

    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>Project:</label>
      <select
        name="project_id"
        value={editTasks?.project_id || ""}
        onChange={(e) =>
          setEditTasks({ ...editTasks, project_id: parseInt(e.target.value) })
        }
        style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
      >
        <option value="">Select Project</option>
        {projectList.map((proj) => (
          <option key={proj.id} value={proj.id}>
            {proj.project_name}
          </option>
        ))}
      </select>
    </div>

    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>Deadline:</label>
      <input
        type="date"
        name="deadline"
        value={editTasks?.deadline || ""}
        onChange={(e) => {
          const deadline = e.target.value;
          const today = new Date();
          const end = new Date(deadline);
          const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
          const duration = diff >= 0 ? `${diff} day(s)` : "Overdue";

          setEditTasks({
            ...editTasks,
            deadline,
            duration,
          });
        }}
        style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
      />
    </div>

    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>Duration:</label>
      <input
        type="text"
        value={editTasks?.duration || ""}
        disabled
        style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "#eee" }}
      />
    </div>

    <button
      type="submit"
      style={{ padding: "0.6rem 1.2rem", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
    >
      Update Task
    </button>
  </form>
)}




      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            backgroundColor: "#0d6efd",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            fontSize: "0.9rem",
            cursor: "pointer"
          }}
        >
          <PlusIcon size={16} /> Add Task
        </button>
      </div>

      {showForm && <TaskForm onClose={() => setShowForm(false)} />}

      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead style={{ backgroundColor: "#f8f9fa" }}>
            <tr>
              {["Si. No.", "Project", "Task", "Assigned To", "Status", "Deadline Date", "Duration", "Actions"].map(header => (
                <th key={header} style={thStyle}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, index) => (
              <tr key={task.id}>
                <td style={tdStyle}>{index + 1}</td>
               <td style={tdStyle}>
                    {projectList.find((proj) => proj.id === task.project_id)?.project_name || "-"}
                  </td>

                <td style={tdStyle}>{task.task_name || "N/A"}</td>
                <td style={tdStyle}>{task.user?.name || "Unassigned"}</td>
                <td style={tdStyle}>{task.project_status}</td>
                <td style={tdStyle}>{task.deadline}</td>
                <td style={tdStyle}>
                  {(() => {
                    let totalSeconds = 0;
                    task.logs?.forEach(log => {
                      const matchHr = /(\d+)\s*hr/.exec(log.duration);
                      const matchMin = /(\d+)\s*minutes?/.exec(log.duration);
                      const matchSec = /(\d+)\s*seconds?/.exec(log.duration);
                      const hours = matchHr ? parseInt(matchHr[1]) : 0;
                      const minutes = matchMin ? parseInt(matchMin[1]) : 0;
                      const seconds = matchSec ? parseInt(matchSec[1]) : 0;
                      totalSeconds += hours * 3600 + minutes * 60 + seconds;
                    });
                    const hrs = Math.floor(totalSeconds / 3600);
                    const mins = Math.floor((totalSeconds % 3600) / 60);
                    const secs = totalSeconds % 60;
                    return `${hrs} hr ${mins} min ${secs} sec`;
                  })()}
                </td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                                          <ActionBtn
                          icon={<Eye size={14} />}
                          label="View"
                          color="#0d6efd"
                          onClick={() => handleViews(task.id)}
                        />

                    <ActionBtn icon={<Edit2 size={14} />} label="Edit" color="#0d6efd" onClick={()=>{setEditModal(true); handleView(task.id);}} />
                  <ActionBtn
                              icon={<Trash2 size={14} />}
                              label="Delete"
                              color="#dc3545"
                              onClick={() => handleDelete(task.id)}
                            />

                    <ActionBtn icon={<Play size={14} />} label="Resume" color="#198754" onClick={() => setActionModal({ show: true, task, type: "resume" })} />
                    <ActionBtn icon={<Pause size={14} />} label="Pause" color="#ffc107" onClick={() => setActionModal({ show: true, task, type: "pause" })} />
                    <ActionBtn icon={<CheckCircle size={14} />} label="End" color="#0dcaf0" onClick={() => setActionModal({ show: true, task, type: "end" })} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTasks.length === 0 && (
          <div style={{ padding: "1rem", color: "#888" }}>No tasks found.</div>
        )}
      </div>

      {/* Confirmation Modal */}
      {actionModal.show && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "2rem",
            borderRadius: "8px", maxWidth: "400px", textAlign: "center"
          }}>
            <h5>Confirm {actionModal.type.charAt(0).toUpperCase() + actionModal.type.slice(1)} Task</h5>
            <p>Are you sure you want to <strong>{actionModal.type}</strong> the task "<strong>{actionModal.task?.task_name}</strong>"?</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
              <button onClick={() => setActionModal({ show: false, task: null, type: "" })} style={{ padding: "0.5rem 1rem", backgroundColor: "#6c757d", color: "#fff", border: "none", borderRadius: "4px" }}>Cancel</button>
              <button onClick={handleActionConfirmed} style={{ padding: "0.5rem 1rem", backgroundColor: "#198754", color: "#fff", border: "none", borderRadius: "4px" }}>Yes, {actionModal.type}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// Reusable Input
function Input({ label, type = "text", placeholder = "", value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "300px" }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={inputStyle} />
    </div>
  );
}

// Reusable Dropdown
function Dropdown({ label, options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "200px" }}>
      <label style={labelStyle}>{label}</label>
      <select style={inputStyle} value={value} onChange={onChange}>
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

// Reusable Action Button
function ActionBtn({ icon, label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.3rem",
        padding: "0.25rem 0.5rem",
        fontSize: "0.8rem",
        border: `1px solid ${color}`,
        color,
        backgroundColor: "transparent",
        borderRadius: "4px",
        cursor: "pointer"
      }}
    >
      {icon} {label}
    </button>
  );
}

// Styles
const containerStyle = {
  padding: "1.5rem",
  fontFamily: "Arial, sans-serif",
  backgroundColor: "#f9f9f9",
  width: "100%",
  boxSizing: "border-box"
};

const breadcrumbStyle = {
  marginBottom: "1rem",
  fontSize: "0.9rem",
  color: "#6c757d"
};

const linkStyle = {
  color: "#0d6efd",
  textDecoration: "none"
};

const boldText = {
  fontWeight: "bold",
  color: "#000"
};

const filtersContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "25px",
  marginBottom: "1.5rem",
  alignItems: "flex-end",
  maxWidth: "3580px"
};

const labelStyle = {
  fontWeight: "500",
  fontSize: "0.9rem",
  marginBottom: "0.3rem"
};

const inputStyle = {
  fontSize: "0.85rem",
  padding: "0.4rem",
  border: "1px solid #ced4da",
  borderRadius: "4px",
  width: "100%"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#fff",
  fontSize: "0.9rem"
};

const thStyle = {
  textAlign: "left",
  padding: "0.75rem",
  border: "1px solid #dee2e6",
  whiteSpace: "nowrap"
};

const tdStyle = {
  padding: "0.75rem",
  border: "1px solid #dee2e6",
  verticalAlign: "top"
};
const tdLabel = {
  fontWeight: 'bold',
  padding: '8px',
  borderBottom: '1px solid #ccc',
  width: '30%',
  verticalAlign: 'top'
};

const tdValue = {
  padding: '8px',
  borderBottom: '1px solid #ccc'
};
