import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function NewProjectModal({ show, onHide, customer, id }) {
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({
    project_name: '',
    project_description: '',
    project_starting_date: '',
    expected_release_date: '',
    deadline: '',
    product_owner_id: '',
    choice_staffs: [],
    customer_id: id || '',
  });

  useEffect(() => {
    if (show) {
      axios
        .get('http://127.0.0.1:8000/api/v1/staff')
        .then((res) => setStaffList(res.data || []))
        .catch(console.error);
    }
  }, [show]);

  useEffect(() => {
    if (id) {
      setForm((prev) => ({ ...prev, customer_id: id }));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setForm((prev) => ({ ...prev, choice_staffs: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/v1/projects', form);
      toast.success('✅ Project created successfully!');
      setForm({
        project_name: '',
        project_description: '',
        project_starting_date: '',
        expected_release_date: '',
        deadline: '',
        product_owner_id: '',
        choice_staffs: [],
        customer_id: id || '',
      });
      onHide();
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to create project.');
    }
  };

  if (!show) return null;

  const inputStyle = {
    width: '100%',
    padding: '0.6rem',
    border: '1px solid #ced4da',
    borderRadius: '0.375rem',
    backgroundColor: '#f8f9fa',
    fontSize: '1rem',
    outlineColor: '#007bff',
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1050
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        width: '100%',
        maxWidth: '600px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>New Project for {customer || 'Customer'} EMP {id}</h3>
          <button onClick={onHide} style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#999'
          }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Project Name</label>
            <input name="project_name" value={form.project_name} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Description</label>
            <textarea
              name="project_description"
              value={form.project_description}
              onChange={handleChange}
              required
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>Start Date</label>
              <input type="date" name="project_starting_date" value={form.project_starting_date} onChange={handleChange} required style={inputStyle} />
            </div>

            <div style={{ flex: 1 }}>
              <label>Expected Release</label>
              <input type="date" name="expected_release_date" value={form.expected_release_date} onChange={handleChange} required style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Deadline</label>
            <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Product Owner</label>
            <select name="product_owner_id" value={form.product_owner_id} onChange={handleChange} required style={inputStyle}>
              <option value="">Select</option>
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>

         <div style={{ marginBottom: '1.5rem' }}>
  <label>Assign Staff</label>
  <select
    name="choice_staff"
    value={form.choice_staff}
    onChange={(e) => setForm({ ...form, choice_staff: e.target.value })}
    style={inputStyle}
  >
    <option value="">-- Select Staff --</option>
    {staffList.map((staff) => (
      <option key={staff.id} value={staff.id}>
        {staff.name}
      </option>
    ))}
  </select>
</div>


          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="button"
              onClick={onHide}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewProjectModal;

