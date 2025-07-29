import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function TasksTab({ lead, onLeadUpdated }) {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskNotes, setNewTaskNotes] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const titleInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (Array.isArray(lead?.details)) {
      const taskDetails = lead.details.filter((d) => d.type === 'task');
      setTasks(
        taskDetails.map(detail => ({
          id: detail.id,
          title: detail.task_title,
          dueDate: detail.due_date,
          completed: detail.completed || false,
        }))
      );
    } else {
      setTasks([]);
    }
  }, [lead]);

  const toggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updated = { ...task, completed: !task.completed };
    setTasks(tasks.map(t => t.id === id ? updated : t));

    try {
      await axios.post(`/api/v1/crm/leads/${lead.id}/tasks/change`, {
        type: "task",               // REQUIRED by backend validation
        task_title: task.title,     // REQUIRED by backend validation
        action: updated.completed ? "completed" : "pending",
      });

      // Update parent lead details
      if (typeof onLeadUpdated === 'function') {
        const updatedDetails = (lead.details || []).map(detail =>
          detail.id === id ? { ...detail, completed: updated.completed } : detail
        );
        onLeadUpdated({ ...lead, details: updatedDetails });
      }
    } catch (err) {
      console.error("Failed to update task status", err);
      // Optionally revert UI change on error
      setTasks(tasks);
    }
  };

  const showModal = () => setIsModalOpen(true);

  const hideModal = () => {
    setIsModalOpen(false);
    setNewTaskTitle("");
    setNewTaskDate("");
    setNewTaskNotes("");
    setError(null);
  };

  const addTask = async () => {
    if (!newTaskTitle || !newTaskDate) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`/api/v1/crm/leads/${lead.id}/tasks`, {
        task_title: newTaskTitle,
        due_date: newTaskDate,
        notes: newTaskNotes,
      });

      const savedTask = {
        id: response.data.id,
        type: 'task',
        task_title: response.data.task_title,
        due_date: response.data.due_date,
        notes: response.data.notes,
        completed: response.data.completed || false,
      };

      if (typeof onLeadUpdated === 'function') {
        onLeadUpdated({
          ...lead,
          details: [...(lead.details || []), savedTask],
        });
      }

      setTasks(prev => [...prev, {
        id: savedTask.id,
        title: savedTask.task_title,
        dueDate: savedTask.due_date,
        completed: savedTask.completed,
      }]);

      hideModal();
    } catch (err) {
      setError("Failed to save task. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [isModalOpen]);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("modal")) {
      hideModal();
    }
  };

  return (
    <div className="tab-pane" id="tasks">
      <div className="card compact-card">
        <div className="card-header bg-success p-2 text-white d-flex justify-content-between align-items-center">
          <h6 className="card-title mb-0">Tasks & Follow-ups</h6>
          <button className="btn btn-light btn-sm" onClick={showModal}>
            <i className="fas fa-plus me-1"></i> Add Task
          </button>
        </div>

        <div className="card-body p-2 card-body-scroll">
          {tasks.length === 0 ? (
            <p className="text-muted mb-0">No tasks available.</p>
          ) : (
            <ul className="list-group">
              {tasks.map(({ id, title, dueDate, completed }) => {
                const isPastDue = new Date(dueDate) < new Date(new Date().toDateString());
                const dueClass = isPastDue ? "text-danger" : "text-success";

                return (
                  <li
                    key={id}
                    className={`list-group-item d-flex justify-content-between align-items-center ${completed ? "list-group-item-success" : ""}`}
                  >
                    <div>
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={completed}
                        onChange={() => toggleComplete(id)}
                        id={`task-${id}`}
                      />
                      <label
                        htmlFor={`task-${id}`}
                        style={{
                          textDecoration: completed ? "line-through" : "none",
                          cursor: "pointer",
                        }}
                      >
                        {title}
                      </label>
                    </div>
                    <small className={dueClass}>
                      {isPastDue ? "Past Due: " : "Due: "} {dueDate}
                    </small>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Modal */}
      <div
        className={`modal fade ${isModalOpen ? "show" : ""}`}
        tabIndex="-1"
        aria-labelledby="addTaskModalLabel"
        aria-hidden={!isModalOpen}
        style={{ display: isModalOpen ? "block" : "none" }}
        onClick={handleBackdropClick}
      >
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h6 className="modal-title" id="addTaskModalLabel">Add Task</h6>
              <button type="button" className="btn-close" aria-label="Close" onClick={hideModal} />
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter title"
                  ref={titleInputRef}
                  disabled={loading}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={newTaskNotes}
                  onChange={(e) => setNewTaskNotes(e.target.value)}
                  placeholder="Enter notes (optional)"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-success" onClick={addTask} disabled={loading}>
                {loading ? "Saving..." : "Save Task"}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={hideModal} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal backdrop */}
      {isModalOpen && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}
