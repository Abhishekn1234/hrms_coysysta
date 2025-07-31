import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2,Search, X  } from "lucide-react";
import Echo from 'laravel-echo';   
import { ToastContainer, toast } from 'react-toastify';
import Pusher from 'pusher-js';
import NotificationBell from './NotificationBell';
import 'react-toastify/dist/ReactToastify.css';

// Initialize Pusher
window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: 'dd4a66b3ccfdbbd6e861',
  cluster: 'ap2',
  forceTLS: true
});

export default function Backlog(props) {
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const user_type = user?.user_type;

  // Initialize state with localStorage
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('backlogNotifications');
    return saved ? JSON.parse(saved) : [];
  });
  const unreadCount = notifications.filter(n => !n.read).length;

  const [formData, setFormData] = useState({
    project_id: "",
    assignedTo: "",
    task_id: "",
    name: "",
    description: "",
    dateTime: "",
    estimatedDuration: ""
  });

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [backlogs, setBacklogs] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editData, setEditData] = useState({
    id: null,
    backlog_name: "",
    backlog_description: "",
    estimated_time: "",
    ceo_approval: false,
    status: "",
    project_id: "",
    backlog_taken_user_id: ""
  });

  const [selectedBacklog, setSelectedBacklog] = useState(null);

  // Sync notifications to localStorage
  useEffect(() => {
    localStorage.setItem('backlogNotifications', JSON.stringify(notifications));
  }, [notifications]);

  // Clean up old notifications (older than 7 days)
  const cleanupOldNotifications = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    setNotifications(prev => {
      const filtered = prev.filter(n => new Date(n.timestamp) > oneWeekAgo);
      return filtered;
    });
  };

  // Add new notification
  const addNotification = (message, backlogId, type = 'info', creatorName = '') => {
    const notificationMessage = creatorName ? `${creatorName}: ${message}` : message;
    
    const newNotification = {
      id: Date.now(),
      message: notificationMessage,
      backlogId,
      type,
      read: false,
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast based on type
    const toastOptions = {
      onClick: () => handleNotificationClick(backlogId)
    };
    
    switch(type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'warning':
        toast.warning(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      default:
        toast.info(message, toastOptions);
    }
  };

  // Handle notification click
  const handleNotificationClick = (backlogId) => {
    setNotifications(prev =>
      prev.map(n => n.backlogId === backlogId ? { ...n, read: true } : n)
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  // Pusher setup
  useEffect(() => {
    cleanupOldNotifications();

    if (user && user.id) {
      const privateChannel = echo.private(`user.${user.id}`);
      
      privateChannel.listen('.backlog-approved', (data) => {
        const approverUser = users.find(u => u.id === data.approver_id) || user;
        const approverName = approverUser ? approverUser.name : 'System';
        addNotification(`${approverName}: ${data.message}`, data.backlogId, 'success');
      });
      
      privateChannel.listen('.backlog-updated', (data) => {
        const updaterUser = users.find(u => u.id === data.updater_id);
        const updaterName = updaterUser ? `${updaterUser.name} ` : '';
        addNotification(`${updaterName}${data.message}`, data.backlogId, 'info');
      });
    }

    const channel = echo.channel('backlogs');
    
    channel.listen('.backlog-approval-request', (data) => {
      if (user_type === "CEO") {
        const backlogCreator = users.find(u => u.id === data.user_id);
        const creatorName = backlogCreator ? backlogCreator.name : 'Unknown User';
        addNotification(
          `${creatorName} requested approval for backlog "${data.backlog_name}"`,
          data.id,
          'warning'
        );
      }
    });

    return () => {
      if (echo) {
        echo.leaveChannel('backlogs');
        if (user && user.id) {
          echo.leave(`user.${user.id}`);
        }
      }
    };
  }, [user, user_type, users]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [projectsRes, usersRes, tasksRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/v1/projects"),
          axios.get("http://127.0.0.1:8000/api/v1/users"),
          axios.get("http://127.0.0.1:8000/api/v1/get/tasks")
        ]);
        setProjects(projectsRes.data.data || projectsRes.data);
        setUsers(usersRes.data);
        setTasks(tasksRes.data);
        await fetchBacklogs();
      } catch (err) {
        console.error("Error fetching initial data:", err);
        addNotification("Failed to load initial data", null, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-refresh backlogs
  useEffect(() => {
    const interval = setInterval(fetchBacklogs, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchBacklogs = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/v1/backlogs");
      setBacklogs(res.data);
    } catch (err) {
      console.error("Error fetching backlogs:", err);
      addNotification("Failed to load backlogs", null, 'error');
    }
  };
   const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData };

    if (["project_id", "assignedTo", "task_id"].includes(name)) {
      updated[name] = parseInt(value);
    } else if (name === "dateTime") {
      updated.dateTime = value;
      const now = new Date();
      const selected = new Date(value);
      const diffMs = selected - now;
      const diffMin = Math.max(Math.round(diffMs / 60000), 0);
      updated.estimatedDuration = diffMin;
    } else {
      updated[name] = value;
    }

    setFormData(updated);
  };

  const handleEdit = (backlog) => {
    setEditData({
      id: backlog.id,
      backlog_name: backlog.backlog_name || "",
      backlog_description: backlog.backlog_description || "",
      estimated_time: backlog.estimated_time || "",
      ceo_approval: backlog.ceo_approval || false,
      status: backlog.status || "",
      project_id: backlog.project?.id || "",
      backlog_taken_user_id: backlog.user?.id || ""
    });
    setShowEditForm(true);
  };

  const handleUpdateBacklog = async () => {
    const ceoApprovalStatus =
      editData.ceo_approval === true || editData.ceo_approval === "Approved"
        ? "Approved"
        : "Not Approved";
    
    try {
      await axios.put(`http://127.0.0.1:8000/api/v1/backlogs/${editData.id}/update`, {
        backlog_name: editData.backlog_name,
        backlog_description: editData.backlog_description,
        estimated_time: editData.estimated_time,
        ceo_approval: ceoApprovalStatus,
        status: editData.status,
        project_id: editData.project_id,
        backlog_taken_user_id: editData.backlog_taken_user_id,
        assigned_task_id: editData.assigned_task_id
      });

      addNotification(
        `Backlog "${editData.backlog_name}" updated successfully`,
        editData.id,
        'success'
      );
      
      setShowEditForm(false);
      fetchBacklogs();
    } catch (error) {
      console.error("Error updating backlog:", error);
      addNotification(
        "Failed to update backlog!",
        editData.id,
        'error'
      );
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...editData };

    if (["project_id", "backlog_taken_user_id", "assigned_task_id"].includes(name)) {
      updated[name] = parseInt(value);
    } else if (name === "dateTime") {
      updated.dateTime = value;
      const now = new Date();
      const selected = new Date(value);
      const diffMs = selected - now;
      const diffMin = Math.max(Math.round(diffMs / 60000), 0);
      updated.estimated_time = diffMin;
      updated.estimatedDuration = diffMin;
    } else {
      updated[name] = value;
    }

    setEditData(updated);
  };

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userid = user?.id;

      const userId = parseInt(formData.assignedTo);
      const projectId = parseInt(formData.project_id);
      const assignedTaskId = parseInt(formData.task_id);

      const payload = {
        user_id: userId,
        project_id: projectId,
        backlog_assigned_user_id: userid,
        backlog_taken_user_id: userId,
        assigned_task_id: assignedTaskId,
        backlog_name: formData.name,
        backlog_description: formData.description,
        estimated_time: formData.estimatedDuration,
        status: 1
      };

      const response = await axios.post("http://127.0.0.1:8000/api/v1/backlogs/add", payload);
      
      addNotification(
        `Backlog "${formData.name}" created successfully`,
        response.data.id,
        'success'
      );

      setShowForm(false);
      setFormData({
        project_id: "",
        assignedTo: "",
        task_id: "",
        name: "",
        description: "",
        dateTime: "",
        estimatedDuration: ""
      });

      fetchBacklogs();
    } catch (error) {
      console.error(error);
      addNotification(
        error.response?.data?.message || "Failed to add backlog",
        null,
        'error'
      );
    }
  };

 const handleApprove = async (id) => {
  try {
    const response = await axios.post(`http://127.0.0.1:8000/api/v1/backlogs/${id}/approve`, {
      ceo_approval: 'Approved',
    });
    
    const approvedBacklog = backlogs.find(b => b.id === id);
    
    // Add notification for the CEO
    addNotification(
      `You approved backlog "${approvedBacklog.backlog_name}"`,
      id,
      'success'
    );
    
    // Notify the assigned user via Pusher
    if (approvedBacklog.backlog_taken_user_id) {
      const ceoUser = users.find(u => u.user_type === "CEO");
      const ceoName = ceoUser ? ceoUser.name : "CEO";
      
      echo.private(`user.${approvedBacklog.backlog_taken_user_id}`)
        .whisper('backlog-approved', {
          message: `${ceoName} approved your backlog "${approvedBacklog.backlog_name}"`,
          backlogId: id
        });
    }
    
    fetchBacklogs();
  } catch (error) {
    console.error(error);
    addNotification(
      "Failed to approve backlog",
      id,
      'error'
    );
  }
};
  const handleShowModal = (backlog) => {
    setSelectedBacklog(backlog);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBacklog(null);
  };

  const handleConfirmAddTask = async () => {
    if (!selectedBacklog) return;

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id;

      const payload = {
        backlog_id: selectedBacklog.id,
        user_id: selectedBacklog.user?.id || selectedBacklog.backlog_assigned_user_id,
        assigned_by: userId,
        task_name: selectedBacklog.task?.task_name || "Untitled Task",
        task_description: selectedBacklog.task?.task_description || '',
        deadline: selectedBacklog.task?.deadline || new Date().toISOString().split('T')[0],
        project_id: selectedBacklog.project?.id || selectedBacklog.project_id,
        customer_id: selectedBacklog.customer_id || null,
        project_value: selectedBacklog.project_value || 0,
        project_status: selectedBacklog.project_status || 'Pending',
        duration: selectedBacklog.duration || '',
      };

      const response = await axios.post('http://127.0.0.1:8000/api/v1/tasks', payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 201 || response.status === 200) {
        addNotification(
          `Task created from backlog "${selectedBacklog.backlog_name}"`,
          selectedBacklog.id,
          'success'
        );
        props.setActiveTab('Tasks');
      } else {
        addNotification(
          "Unexpected response when creating task",
          selectedBacklog.id,
          'error'
        );
      }
    } catch (error) {
      console.error('Error adding task:', error);
      addNotification(
        "Failed to create task from backlog",
        selectedBacklog.id,
        'error'
      );
    } finally {
      handleCloseModal();
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this backlog?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/backlogs/${id}/delete`);
      addNotification(
        "Backlog deleted successfully",
        id,
        'success'
      );
      fetchBacklogs();
    } catch (error) {
      console.error(error);
      addNotification(
        "Failed to delete backlog",
        id,
        'error'
      );
    }
  }; 
  const getRemainingTime = (createdAt, estimatedMinutes) => {
    if (!createdAt || !estimatedMinutes) return "N/A";
    
    const created = new Date(createdAt);
    const end = new Date(created.getTime() + estimatedMinutes * 60000);
    const now = new Date();
    const diffMs = end - now;

    if (diffMs <= 0) return "Expired";

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    let result = [];
    if (days > 0) result.push(`${days}d`);
    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutes}m`);
    
    return result.join(" ") || "Less than 1m";
  };
 const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Filter backlogs based on search term and date
  const filteredBacklogs = backlogs.filter(backlog => {
    const matchesSearch = 
      backlog.backlog_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      backlog.backlog_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      backlog.project?.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      backlog.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = 
      !dateFilter || 
      new Date(backlog.created_at).toLocaleDateString() === new Date(dateFilter).toLocaleDateString();

    const matchesStatus =
      !statusFilter ||
      (statusFilter === "Pending" && backlog.task?.project_status === "Pending") ||
      (statusFilter === "In Progress" && backlog.task?.project_status === "In Progress") ||
      (statusFilter === "Completed" && backlog.task?.project_status === "Completed");

    return matchesSearch && matchesDate && matchesStatus;
  });

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setDateFilter("");
    setStatusFilter("");
  };
  // Styles
  const tdStyle = {
    padding: "0.75rem",
    border: "1px solid #dee2e6",
    verticalAlign: "top",
  };

  const inputStyle = {
    padding: "0.4rem",
    fontSize: "0.85rem",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    width: "100%",
  };

  const labelStyle = {
    fontWeight: "500",
    fontSize: "0.9rem",
    marginBottom: "0.3rem",
  };

  const submitButtonStyle = {
    backgroundColor: "#198754",
    color: "#fff",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  };

  const cancelButtonStyle = {
    backgroundColor: "#6c757d",
    color: "#fff",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  };

  return (
    <div style={{ padding: "1.5rem", fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", width: "100%", boxSizing: "border-box" }}>
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Breadcrumb */}
      <div style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "#6c757d" }}>
        <a href="/dashboard" style={{ color: "#0d6efd", textDecoration: "none" }}>
          Dashboard
        </a>{" "}
        &gt; <span style={{ fontWeight: "bold", color: "#000" }}>Backlog</span>
      </div>
      
      {/* Notification Bell */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        <NotificationBell
          count={unreadCount}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
        />
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
      
      {/* Add Task Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "100vw",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            width: "300px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
          }}>
            <div style={{ fontSize: "18px", marginBottom: "15px", fontWeight: "bold" }}>
              Confirm Add Task
            </div>
            <div style={{ marginBottom: "20px" }}>
              Are you sure you want to add a task for this backlog?
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={handleCloseModal}
                style={{
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddTask}
                style={{
                  backgroundColor: "#0d6efd",
                  color: "#fff",
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Yes, Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Backlog Form */}
      {showEditForm && (
        <div style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "6px", marginBottom: "1.5rem", border: "1px solid #dee2e6" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {/* Project */}
            <div style={{ flex: "1 1 260px" }}>
              <label style={labelStyle}>Project</label>
              <select
                name="project_id"
                value={editData.project_id}
                onChange={handleEditChange}
                style={inputStyle}
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.project_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned To */}
            <div style={{ flex: "1 1 260px" }}>
              <label style={labelStyle}>Assigned To</label>
              <select
                name="backlog_taken_user_id"
                value={editData.backlog_taken_user_id}
                onChange={handleEditChange}
                style={inputStyle}
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name || `${user.first_name} ${user.last_name}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned Task */}
            <div style={{ flex: "1 1 260px" }}>
              <label style={labelStyle}>Assigned Task</label>
              <select
                name="assigned_task_id"
                value={editData.assigned_task_id || ""}
                onChange={handleEditChange}
                style={inputStyle}
              >
                <option value="">Select Task</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.task_name} — {task.project?.project_name || "No Project"}
                  </option>
                ))}
              </select>
            </div>

            {/* Backlog Name */}
            <div style={{ flex: "1 1 260px" }}>
              <label style={labelStyle}>Backlog Name</label>
              <input
                type="text"
                name="backlog_name"
                value={editData.backlog_name}
                onChange={handleEditChange}
                style={inputStyle}
              />
            </div>

            {/* Description */}
            <div style={{ flex: "1 1 260px" }}>
              <label style={labelStyle}>Description</label>
              <input
                type="text"
                name="backlog_description"
                value={editData.backlog_description}
                onChange={handleEditChange}
                style={inputStyle}
              />
            </div>

            {/* Date & Time */}
            <div style={{ flex: "1 1 260px" }}>
              <label style={labelStyle}>Date & Time</label>
              <input
                type="datetime-local"
                name="dateTime"
                value={editData.dateTime}
                onChange={handleEditChange}
                style={inputStyle}
              />
            </div>

            {/* Estimated Duration */}
            <div style={{ flex: "1 1 260px" }}>
              <label style={labelStyle}>Estimated Duration</label>
              <input
                type="text"
                readOnly
                value={editData.estimatedDuration ? `${editData.estimatedDuration} mins` : ""}
                style={{ ...inputStyle, backgroundColor: "#e9ecef" }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
            <button
              onClick={handleUpdateBacklog}
              style={submitButtonStyle}
            >
              Update Backlog
            </button>
            <button
              onClick={() => setShowEditForm(false)}
              style={cancelButtonStyle}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Backlog Form */}
      {showForm && (
        <div style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "6px", marginBottom: "1.5rem", border: "1px solid #dee2e6" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {/* Project */}
            <div style={{ flex: "1 1 260px" }}>
              <label style={labelStyle}>Project</label>
              <select
                name="project_id"
                value={formData.project_id}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.project_name}</option>
                ))}
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
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name || `${user.first_name} ${user.last_name}`}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Task */}
            <div style={{ flex: "1 1 260px" }}>
              <label style={labelStyle}>Task</label>
              <select
                name="task_id"
                value={formData.task_id}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Task</option>
                {tasks.map(task => (
                  <option key={task.id} value={task.id}>
                    {task.task_name} — {task.project?.project_name || "No Project"}
                  </option>
                ))}
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
                value={formData.estimatedDuration ? `${formData.estimatedDuration} mins` : ""}
                style={{ ...inputStyle, backgroundColor: "#e9ecef" }}
              />
            </div>
          </div>

          <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
            <button 
              onClick={handleSubmit} 
              style={{ 
                backgroundColor: "#0d6efd", 
                color: "#fff", 
                padding: "0.5rem 1rem", 
                border: "none", 
                borderRadius: "4px", 
                cursor: "pointer" 
              }}
            >
              Add Backlog
            </button>
            <button 
              onClick={() => setShowForm(false)} 
              style={{ 
                backgroundColor: "#6c757d", 
                color: "#fff", 
                padding: "0.5rem 1rem", 
                border: "none", 
                borderRadius: "4px", 
                cursor: "pointer" 
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
          <div style={{
        backgroundColor: "#fff",
        padding: "1rem",
        borderRadius: "6px",
        marginBottom: "1rem",
        border: "1px solid #dee2e6",
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        alignItems: "center"
      }}>
        {/* Search Filter */}
        <div style={{ position: "relative", flex: "1 1 300px" }}>
          <div style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#6c757d"
          }}>
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by name, project or assignee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "0.5rem 1rem 0.5rem 2rem",
              fontSize: "0.85rem",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              width: "100%",
              boxSizing: "border-box"
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6c757d"
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Date Filter */}
        <div style={{ flex: "1 1 200px" }}>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: "0.5rem",
              fontSize: "0.85rem",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              width: "100%",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ flex: "1 1 200px" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "0.5rem",
              fontSize: "0.85rem",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Reset Filters Button */}
        <div style={{ flex: "0 0 auto" }}>
          <button
            onClick={resetFilters}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            <X size={16} />
            Reset Filters
          </button>
        </div>
      </div>
      {/* Backlogs Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", fontSize: "0.9rem" }}>
          <thead style={{ backgroundColor: "#f8f9fa" }}>
            <tr>
              {["Si. No.", "Project", "Task", "Assigned To", "Status", "Date","Estimated Time","Remaining Time","Approved", "Action"].map((header) => (
                <th key={header} style={{ textAlign: "left", padding: "0.75rem", border: "1px solid #dee2e6", whiteSpace: "nowrap" }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredBacklogs.map((backlog, index) => (
              <tr key={backlog.id}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{backlog.project?.project_name || "N/A"}</td>
                <td style={tdStyle}>{backlog.task?.task_name || "N/A"}</td>
                <td style={tdStyle}>{backlog.user?.name || "N/A"}</td>
                 <td style={tdStyle}>
                  {backlog.task?.project_status === 'Pending'
                    ? 'Pending'
                    : backlog.task?.project_status === 'In Progress'
                    ? 'In Progress'
                    : 'Completed'}
                </td>

                <td style={tdStyle}>
                  {new Date(backlog.created_at).toLocaleDateString()}
                </td>
                <td style={tdStyle}>
                  {backlog.estimated_time} minutes
                </td>
                <td style={tdStyle}>
                  {getRemainingTime(backlog.created_at, backlog.estimated_time)}
                </td>
                <td style={{ padding: "8px" }}>
                  {backlog.ceo_approval === "Approved" ? (
                    <>
                      <span style={{ color: "green", fontWeight: "bold", marginRight: "8px" }}>
                        Approved
                      </span>
                      <button
                        onClick={() => handleShowModal(backlog)}
                        style={{
                          backgroundColor: "#0d6efd",
                          color: "#fff",
                          padding: "0.3rem 0.6rem",
                          fontSize: "0.75rem",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                      >
                        Add Task
                      </button>
                    </>
                  ) : user_type === "CEO" ? (
                    <button
                      onClick={() => handleApprove(backlog.id)}
                      style={{
                        backgroundColor: "#ffc107",
                        color: "#000",
                        padding: "0.3rem 0.6rem",
                        fontSize: "0.75rem",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Approve
                    </button>
                  ) : (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      Not Approved
                    </span>
                  )}
                </td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Edit2
                      size={16}
                      style={{ cursor: "pointer", marginRight: "0.5rem", color: "#0d6efd" }}
                      onClick={() => handleEdit(backlog)}
                    />
                    <Trash2
                      size={16}
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => handleDelete(backlog.id)}
                    />
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