    import React, { useState } from 'react';

    const EditEventModal = ({ isOpen, onClose, event, onSave }) => {
    const [formData, setFormData] = useState(event);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`}>
        <div className="modal">
            <div className="modal-header">
            <h3>Edit Event Details</h3>
            <button className="close-modal" onClick={onClose}>
                <i className="fas fa-times"></i>
            </button>
            </div>
            <form className="modal-body" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="event-name">Event Name</label>
                <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
                />
            </div>
            {/* Add other form fields */}
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                Save Changes
                </button>
            </div>
            </form>
        </div>
        </div>
    );
    };

    export default EditEventModal;