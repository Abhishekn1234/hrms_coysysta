import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LeadDetailsTabs({ lead, onLeadUpdated }) {
  console.log("leads details NEW", lead);
  const [localLead, setLocalLead] = useState(lead || {});
  const [selectedStatus, setSelectedStatus] = useState((lead?.status || 'hot').toLowerCase());
  const [updating, setUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState({});
  const [newAttachments, setNewAttachments] = useState([]);
  const [attachmentsToDelete, setAttachmentsToDelete] = useState([]);

  // Initialize states when lead prop changes
  useEffect(() => {
    setLocalLead(lead || {});
    setSelectedStatus((lead?.status || 'hot').toLowerCase());
    setStatusMessage('');
    setStatusType('');
    setIsEditing(false);
    setEditedFields({});
    setNewAttachments([]);
    setAttachmentsToDelete([]);
  }, [lead]);

  // Auto-clear status messages
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage('');
        setStatusType('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  if (!localLead || Object.keys(localLead).length === 0 || !localLead.id) {
    return (
      <div className="text-center text-muted" style={{ marginTop: '2rem' }}>
        Select a lead to see details
      </div>
    );
  }

  function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  function handleCall(phone) {
    if (!phone) return;
    recordAction('call');
    window.location.href = `tel:${phone}`;
  }

  function handleWhatsApp(phone) {
    if (!phone) return;
    recordAction('whatsapp');
    const link = isMobileDevice()
      ? `https://wa.me/${phone}`
      : `https://web.whatsapp.com/send?phone=${phone}`;
    window.open(link, '_blank');
  }

  function handleEmail(email) {
    if (!email) return;
    recordAction('email');
    window.location.href = `mailto:${email}`;
  }

  function handleSMS(phone) {
    if (!phone) return;
    recordAction('sms');
    const link = isMobileDevice()
      ? `sms:${phone}`
      : `https://websms.site/?to=${phone}`;
    window.location.href = link;
  }

  function recordAction(actionType) {
    fetch('/api/v1/crm/leads/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: actionType, leadId: localLead.id, timestamp: new Date() }),
    }).catch((err) => console.error("Failed to record action:", err));
  }

  // Handle field changes in edit mode
  const handleFieldChange = (field, value) => {
    setEditedFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Cancel edit mode and reset changes
      setEditedFields({});
      setNewAttachments([]);
      setAttachmentsToDelete([]);
    } else {
      // Initialize editedFields with current values
      const fields = ['name', 'email', 'phone', 'company', 'leadSource'];
      const initialFields = {};
      fields.forEach(field => {
        initialFields[field] = localLead[field] || '';
      });
      setEditedFields(initialFields);
    }
    setIsEditing(!isEditing);
  };

  // Handle file selection for attachments
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setNewAttachments(prev => [...prev, ...files]);
    }
  };

  // Mark attachment for deletion
  const markAttachmentForDeletion = (attachmentId) => {
    setAttachmentsToDelete(prev => [...prev, attachmentId]);
  };

  // Unmark attachment for deletion
  const unmarkAttachmentForDeletion = (attachmentId) => {
    setAttachmentsToDelete(prev => prev.filter(id => id !== attachmentId));
  };

  // Unified save function
  const saveAllChanges = async () => {
    setUpdating(true);
    setStatusMessage('');
    setStatusType('');
    
    try {
      const formData = new FormData();

      // Add all updates except attachmentsToDelete
      const allUpdates = {
        ...editedFields,
        status: selectedStatus,
      };
      
      Object.entries(allUpdates).forEach(([key, value]) => {
        formData.append(`lead[${key}]`, value);
      });

      // Add attachmentsToDelete as an array
      attachmentsToDelete.forEach(id => {
        formData.append(`lead[attachmentsToDelete][]`, id);
      });

      // Add new attachments
      newAttachments.forEach(file => {
        formData.append('lead[attachments][]', file);
      });

      // Send unified request
      formData.append('_method', 'PUT');
      const response = await axios.post(`/api/v1/crm/leads/${localLead.id}/update-full`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log("Response from API", response?.data);
      
      // Update local state with response data
      const updatedLead = response.data;
      console.log("response from api", updatedLead);
      setLocalLead(updatedLead);
      setIsEditing(false);
      setEditedFields({});
      setNewAttachments([]);
      setAttachmentsToDelete([]);
      
      setStatusMessage("All changes saved successfully!");
      setStatusType('success');
      
      // Notify parent component
      if (typeof onLeadUpdated === 'function') {
        onLeadUpdated(updatedLead);
      }
    } catch (error) {
      setStatusMessage("Failed to save changes. Please try again.");
      setStatusType('error');
      console.error("Update error:", error);
    } finally {
      setUpdating(false);
    }
  };

  // Field definitions for editable fields
  const editableFields = [
    { label: "Name", key: "name", type: "text" },
    { label: "Email", key: "email", type: "email" },
    { label: "Phone", key: "phone", type: "tel" },
    { label: "Company", key: "company", type: "text" },
    { 
      label: "Source", 
      key: "leadSource", 
      type: "select",
      options: ['Website', 'Referral', 'Social Media', 'Email', 'Other']
    }
  ];

  // Combine existing and new attachments for display
  const displayedAttachments = [
    ...(localLead.attachments || []).filter(a => !attachmentsToDelete.includes(a.id)),
    ...newAttachments.map(file => ({
      id: `new-${file.name}-${file.size}`,
      original_name: file.name,
      size: file.size,
      mime_type: file.type,
      isNew: true
    }))
  ];

  return (
    <div className="card shadow-lg border-0 rounded-3">
      <div className="card-body shadow">
        <div className="row">
          {/* Lead Information */}
          <div className="col-md-6">
            <div
              className="card mb-3"
              style={{
                fontSize: '0.875rem',
                boxShadow: '0 -4px 8px rgba(0, 0, 0.3, 0.2)',
                borderRadius: '0.5rem'
              }}
            >
              {/* <div className="card-header bg-secondary p-2 text-white d-flex justify-content-between align-items-center">
                <h6 className="card-title mb-0">Lead Information</h6>
                <button 
                  className={`btn btn-sm ${isEditing ? 'btn-outline-light' : 'btn-light'}`}
                  onClick={toggleEditMode}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div> */}
              <div
                className="card-header p-2 text-white d-flex justify-content-between align-items-center"
                style={{ backgroundColor: 'rgb(96, 169, 169)' }}
              >
                <h6 className="card-title mb-0">Lead Information</h6>
                <button
                  className={`btn btn-sm ${isEditing ? 'btn-outline-light' : 'btn-light'}`}
                  onClick={toggleEditMode}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="card-body py-2 px-3">
                {editableFields.map((field, idx) => (
                  <div className="row mb-1" key={idx}>
                    <div className="col-5 text-end">
                      <small><strong>{field.label}:</strong></small>
                    </div>
                    <div className="col-7">
                      {isEditing ? (
                        field.type === 'select' ? (
                          <select
                            className="form-control form-control-sm"
                            value={editedFields[field.key] || ''}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          >
                            {field.options.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            className="form-control form-control-sm"
                            value={editedFields[field.key] || ''}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          />
                        )
                      ) : (
                        localLead[field.key] || '—'
                      )}
                    </div>
                  </div>
                ))}

                {/* Non-editable fields */}
                <div className="row mb-1">
                  <div className="col-5 text-end">
                    <small><strong>Status:</strong></small>
                  </div>
                  <div className="col-7">
                    <span className={`badge bg-${getBadgeColor(localLead.status)}`}>
                      {localLead.status || 'Unknown'}
                    </span>
                  </div>
                </div>
                <div className="row mb-1">
                  <div className="col-5 text-end">
                    <small><strong>Assigned:</strong></small>
                  </div>
                  <div className="col-7">
                    {localLead.assigned || '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions and Status Update */}
          <div className="col-md-6">
            <div className="card mb-3 shadow">
              <div
                    className="card-header p-2 text-white"
                    style={{ backgroundColor: 'rgb(113, 142, 190)' }}
                  >
                <h6 className="card-title mb-0">Quick Actions</h6>
              </div>
              <div className="card-body p-2">
                <div className="row g-2">
                  <div className="col-6">
                    <button 
                      className="btn btn-outline-primary w-100 btn-sm" 
                      onClick={() => handleCall(localLead.phone)}
                      disabled={isEditing}
                    >
                      <i className="fas fa-phone-alt"></i> Call
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      className="btn btn-outline-success w-100 btn-sm" 
                      onClick={() => handleWhatsApp(localLead.phone)}
                      disabled={isEditing}
                    >
                      <i className="fab fa-whatsapp"></i> WhatsApp
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      className="btn btn-outline-danger w-100 btn-sm" 
                      onClick={() => handleEmail(localLead.email)}
                      disabled={isEditing}
                    >
                      <i className="fas fa-envelope"></i> Email
                    </button>
                  </div>
                  <div className="col-6">
                    <button 
                      className="btn btn-outline-secondary w-100 btn-sm" 
                      onClick={() => handleSMS(localLead.phone)}
                      disabled={isEditing}
                    >
                      <i className="fas fa-comment"></i> SMS
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow">
              <div
                    className="card-header p-2"
                    style={{ backgroundColor: 'rgba(113 142 190)', color: '#fff' }}
                  >
                <h6 className="card-title mb-0">Update Status</h6>
              </div>
              <div className="card-body p-2">
                <div className="form-group mb-2">
                  <select
                    className="form-control form-control-sm"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    disabled={updating || isEditing}
                  >
                    <option value="warm">Warm</option>
                    <option value="hot">Hot</option>
                    <option value="cold">Cold</option>
                    <option value="lost">Lost</option>
                    <option value="client">Client</option>
                  </select>
                </div>
                <div className="form-group mb-2">
                  <select className="form-control form-control-sm" value={localLead.assigned || ''} disabled>
                    <option>Sales Team</option>
                  </select>
                </div>
                <button
                  className="btn btn-dark w-100 btn-sm"
                  onClick={saveAllChanges}
                  disabled={updating || !isEditing}
                >
                  <i className="fas fa-save"></i> Save All Changes
                </button>
                {statusMessage && (
                  <div
                    className={`mt-2 small ${statusType === 'success' ? 'text-success' : 'text-danger'}`}
                    role="alert"
                  >
                    {statusMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Attachments Section */}
        {/* <div
          className="card mb-3"
          style={{ fontSize: "0.875rem", boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "0.5rem" }}
        >
          <div className="card-header bg-warning p-2 d-flex justify-content-between align-items-center">
            <h6 className="card-title mb-0"><i className="fas fa-paperclip me-1"></i>Attachments</h6>
            {isEditing && (
              <div className="d-flex align-items-center">
                <input 
                  id="file-input"
                  type="file" 
                  className="form-control form-control-sm me-2" 
                  style={{ width: 'auto' }}
                  onChange={handleFileChange}
                  multiple
                />
              </div>
            )}
          </div>
          <div className="card-body py-2 px-3">
            {displayedAttachments.length > 0 ? (
              <div className="row g-2">
                {displayedAttachments.map((file) => (
                  <div key={file.id} className="col-6 col-md-4 position-relative">
                    {isEditing && (
                      <button 
                        className={`position-absolute top-0 end-0 btn btn-sm p-0 px-1 ${
                          attachmentsToDelete.includes(file.id) 
                            ? 'btn-success' 
                            : 'btn-danger'
                        }`}
                        style={{ zIndex: 1 }}
                        onClick={() => {
                          if (file.isNew) {
                            setNewAttachments(prev => 
                              prev.filter(f => 
                                f.name !== file.original_name || 
                                f.size !== file.size
                              )
                            );
                          } else if (attachmentsToDelete.includes(file.id)) {
                            unmarkAttachmentForDeletion(file.id);
                          } else {
                            markAttachmentForDeletion(file.id);
                          }
                        }}
                      >
                        {attachmentsToDelete.includes(file.id) ? (
                          <i className="fas fa-undo"></i>
                        ) : (
                          <i className="fas fa-trash"></i>
                        )}
                      </button>
                    )}
                    
                    {file.isNew ? (
                      <div className="d-block p-2 border rounded text-center">
                        <i className="fas fa-file-upload me-1"></i> 
                        {file.original_name}
                        <small className="text-muted d-block">
                          {Math.round(file.size / 1024)} KB (New)
                        </small>
                      </div>
                    ) : file.mime_type?.startsWith("image/") ? (
                      <img
                        src={`/storage/${file.path}`}
                        alt={file.original_name}
                        className="img-fluid rounded shadow-sm mb-1"
                        style={{ maxHeight:'100px', objectFit:'cover' }}
                      />
                    ) : (
                      <a
                        href={`/storage/${file.path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="d-block p-2 border rounded text-center"
                      >
                        <i className="fas fa-file-alt me-1"></i> {file.original_name}
                      </a>
                    )}
                    
                    {!file.isNew && (
                      <small className="text-muted d-block">
                        {Math.round(file.size / 1024)} KB
                        {attachmentsToDelete.includes(file.id) && (
                          <span className="text-danger"> (Marked for deletion)</span>
                        )}
                      </small>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted small">No attachments</div>
            )}
          </div>
        </div> */}
        <div
          className="card mb-3 shadow-lg"
          style={{
            fontSize: "0.875rem",
            borderRadius: "0.5rem"
          }}
        >
          <div
            className="card-header py-2 px-3 d-flex justify-content-between align-items-center text-white"
            style={{ backgroundColor: 'rgb(96 169 169)' }}
          >
            <h6 className="card-title mb-0">
              <i className="fas fa-paperclip me-1"></i>Attachments
            </h6>
            {isEditing && (
              <div className="d-flex align-items-center">
                <input 
                  id="file-input"
                  type="file" 
                  className="form-control form-control-sm me-2" 
                  style={{ width: 'auto' }}
                  onChange={handleFileChange}
                  multiple
                />
              </div>
            )}
          </div>

          <div className="card-body py-2 px-3">
            {displayedAttachments.length > 0 ? (
              <div className="row g-2">
                {displayedAttachments.map((file) => (
                  <div key={file.id} className="col-6 col-md-4 position-relative">
                    {isEditing && (
                      <button 
                        className={`position-absolute top-0 end-0 btn btn-sm p-0 px-1 ${
                          attachmentsToDelete.includes(file.id) 
                            ? 'btn-success' 
                            : 'btn-danger'
                        }`}
                        style={{ zIndex: 1 }}
                        onClick={() => {
                          if (file.isNew) {
                            setNewAttachments(prev => 
                              prev.filter(f => 
                                f.name !== file.original_name || 
                                f.size !== file.size
                              )
                            );
                          } else if (attachmentsToDelete.includes(file.id)) {
                            unmarkAttachmentForDeletion(file.id);
                          } else {
                            markAttachmentForDeletion(file.id);
                          }
                        }}
                      >
                        {attachmentsToDelete.includes(file.id) ? (
                          <i className="fas fa-undo"></i>
                        ) : (
                          <i className="fas fa-trash"></i>
                        )}
                      </button>
                    )}

                    {file.isNew ? (
                      <div className="d-block p-2 border rounded text-center">
                        <i className="fas fa-file-upload me-1"></i> 
                        {file.original_name}
                        <small className="text-muted d-block">
                          {Math.round(file.size / 1024)} KB (New)
                        </small>
                      </div>
                    ) : file.mime_type?.startsWith("image/") ? (
                      <img
                        src={`/storage/${file.path}`}
                        alt={file.original_name}
                        className="img-fluid rounded shadow-sm mb-1"
                        style={{ maxHeight:'100px', objectFit:'cover' }}
                      />
                    ) : (
                      <a
                        href={`/storage/${file.path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="d-block p-2 border rounded text-center"
                      >
                        <i className="fas fa-file-alt me-1"></i> {file.original_name}
                      </a>
                    )}

                    {!file.isNew && (
                      <small className="text-muted d-block">
                        {Math.round(file.size / 1024)} KB
                        {attachmentsToDelete.includes(file.id) && (
                          <span className="text-danger"> (Marked for deletion)</span>
                        )}
                      </small>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted small">No attachments</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function getBadgeColor(status) {
  switch ((status || '').toLowerCase()) {
    case 'hot': return 'danger';
    case 'warm': return 'warning';
    case 'cold': return 'info';
    case 'lost': return 'secondary';
    case 'client': return 'success';
    default: return 'dark';
  }
}