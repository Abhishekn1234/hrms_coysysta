import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import axios from 'axios';

export default function AddLeadModal({ onLeadAdded }) {
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    referredBy: '',
    referralMethod: 'email',
    referralContact: '',
    leadSource: '',
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const modalEl = modalRef.current;
    const modalInstance = new Modal(modalEl, { backdrop: 'static', keyboard: false });

    // Adjust backdrop styles when modal is shown
    const handleShow = () => {
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.style.zIndex = '1050';
        backdrop.style.pointerEvents = 'auto';
      }
    };

    modalEl.addEventListener('show.bs.modal', handleShow);

    return () => {
      previews.forEach(preview => {
        if (preview.url) URL.revokeObjectURL(preview.url);
      });
      modalEl.removeEventListener('show.bs.modal', handleShow);
      modalInstance.dispose();
    };
  }, [previews]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReferralMethodChange = (method) => {
    setFormData((prev) => ({
      ...prev,
      referralMethod: method,
      referralContact: '',
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);

    const newPreviews = selectedFiles.map(file => {
      if (file.type.startsWith('image/')) {
        return { 
          url: URL.createObjectURL(file), 
          type: 'image',
          name: file.name,
          fileObject: file
        };
      } else if (file.type.startsWith('video/')) {
        return { 
          url: URL.createObjectURL(file), 
          type: 'video',
          name: file.name,
          fileObject: file
        };
      } else {
        return { 
          url: null, 
          type: 'file',
          name: file.name,
          fileObject: file
        };
      }
    });

    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    
    if (newPreviews[index].url) {
      URL.revokeObjectURL(newPreviews[index].url);
    }
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // const closeModal = () => {
  //   const modalEl = modalRef.current;
  //   const modalInstance = Modal.getInstance(modalEl);
  //   modalInstance.hide();
  //   setFiles([]);
  //   setPreviews([]);
  // };
  const closeModal = () => {
    const modalEl = modalRef.current;
    
    // Use Bootstrap's method to get existing instance
    const modal = Modal.getInstance(modalEl);
    
    if (modal) {
      modal.hide();  // Properly hide the modal
    }
    
    // Reset form state
    setFiles([]);
    setPreviews([]);
    setFormData({ /* initial state */ });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formPayload = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });
      
      files.forEach(file => {
        formPayload.append('attachments[]', file);
      });

      const response = await axios.post('http://localhost:8000/api/v1/crm/leads', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);

      if (onLeadAdded) {
        const responseWithFiles = {
          ...response.data,
          files: previews.map(preview => ({
            name: preview.name,
            type: preview.type,
            size: preview.fileObject.size,
          }))
        };
        onLeadAdded(responseWithFiles);
      }

      setFormData({
        name: '',
        phone: '',
        email: '',
        company: '',
        referredBy: '',
        referralMethod: 'email',
        referralContact: '',
        leadSource: '',
      });

      setTimeout(() => {
        setSuccess(false);
        closeModal();
      }, 1500);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
  className="modal fade"
  id="addLeadModal"
  tabIndex="-1"
  aria-labelledby="addLeadModalLabel"
  aria-hidden="true"
  ref={modalRef}
  style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1055
  }}
>
      <div className="modal-dialog modal-dialog-centered modal-lg" 
      style={{ zIndex: 1060, pointerEvents: 'auto' }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addLeadModalLabel">
              Add New Lead
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Lead Name"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Lead Email"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Company</label>
              <input
                type="text"
                className="form-control"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name"
              />
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Referred By</label>
                <select
                  className="form-select"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleChange}
                >
                  <option value="">Select Member</option>
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                  <option>Michael Brown</option>
                  <option>Emily Johnson</option>
                  <option>William Davis</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label d-block mb-2">Referral Method</label>
                <div className="btn-group" role="group" aria-label="Referral method">
                  <input
                    type="radio"
                    className="btn-check"
                    name="referralMethod"
                    id="referralEmail"
                    autoComplete="off"
                    checked={formData.referralMethod === 'email'}
                    onChange={() => handleReferralMethodChange('email')}
                  />
                  <label
                    className="btn btn-outline-primary"
                    htmlFor="referralEmail"
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: formData.referralMethod === 'email' ? '#007bff' : '#e7f1ff',
                      borderColor: formData.referralMethod === 'email' ? '#0056b3' : '#7abaff',
                      color: formData.referralMethod === 'email' ? 'white' : '#007bff',
                      marginRight: '0.5rem',
                      marginLeft: '0.25rem',
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="radio"
                    className="btn-check"
                    name="referralMethod"
                    id="referralPhone"
                    autoComplete="off"
                    checked={formData.referralMethod === 'phone'}
                    onChange={() => handleReferralMethodChange('phone')}
                  />
                  <label
                    className="btn btn-outline-primary"
                    htmlFor="referralPhone"
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.25rem 0.75rem',
                      backgroundColor: formData.referralMethod === 'phone' ? '#007bff' : '#e7f1ff',
                      borderColor: formData.referralMethod === 'phone' ? '#0056b3' : '#7abaff',
                      color: formData.referralMethod === 'phone' ? 'white' : '#007bff',
                      marginLeft: '0.25rem',
                    }}
                  >
                    Phone
                  </label>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">
                {formData.referralMethod === 'email' ? 'Referral Email' : 'Referral Phone'}
              </label>
              <input
                type={formData.referralMethod === 'email' ? 'email' : 'tel'}
                className="form-control"
                name="referralContact"
                value={formData.referralContact}
                onChange={handleChange}
                placeholder={
                  formData.referralMethod === 'email'
                    ? 'Referral Email'
                    : 'Referral Phone'
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Lead Source</label>
              <select
                className="form-select"
                name="leadSource"
                value={formData.leadSource}
                onChange={handleChange}
              >
                <option value="">Select Lead Source</option>
                <option>Website</option>
                <option>Referral</option>
                <option>Social Media</option>
                <option>Advertisement</option>
                <option>Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label">Attachments</label>
              <div className="d-flex flex-column">
                <button
                  type="button"
                  className="btn btn-outline-primary mb-2"
                  onClick={triggerFileInput}
                  disabled={loading}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Files
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="d-none"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx"
                />
                <small className="text-muted">
                  Supported files: images, videos, documents (max 10MB each)
                </small>
              </div>
              {previews.length > 0 && (
                <div className="mt-3">
                  <label className="form-label">File Previews</label>
                  <div className="d-flex flex-wrap gap-3">
                    {previews.map((preview, index) => (
                      <div 
                        key={index} 
                        className="position-relative border rounded p-2"
                        style={{ width: '120px', height: '120px' }}
                      >
                        {preview.type === 'image' && (
                          <img
                            src={preview.url}
                            alt={`Preview ${index}`}
                            className="img-fluid h-100 w-100 object-fit-cover"
                          />
                        )}
                        {preview.type === 'video' && (
                          <video
                            src={preview.url}
                            className="h-100 w-100 object-fit-cover"
                            muted
                            controls
                          />
                        )}
                        {preview.type === 'file' && (
                          <div className="d-flex flex-column align-items-center justify-content-center h-100">
                            <i className="bi bi-file-earmark-text fs-1"></i>
                            <small className="text-truncate w-100 text-center mt-1">
                              {preview.name}
                            </small>
                          </div>
                        )}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                          onClick={() => removeFile(index)}
                          style={{ borderRadius: '50%', width: '24px', height: '24px', padding: 0 }}
                        >
                          ×
                        </button>
                        <div className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-50 text-white p-1">
                          <small className="d-block text-truncate">
                            {preview.name}
                          </small>
                          <small className="d-block">
                            {(preview.fileObject.size / 1024 / 1024).toFixed(2)}MB
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success" role="alert">
                Lead saved successfully!
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading || files.some(f => f.size > 10 * 1024 * 1024)}
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </span>
              ) : (
                'Save Lead'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}