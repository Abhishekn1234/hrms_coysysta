import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InvoiceModal = ({ show, onClose, customerId }) => {
  const [formData, setFormData] = useState({
    issue_date: '',
    due_date: '',
    amount: '',
    status: 'Pending',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/v1/customers/${customerId}/invoices`,
        formData
      );
      toast.success('✅ Invoice created successfully!');
      setFormData({
        issue_date: '',
        due_date: '',
        amount: '',
        status: 'Pending',
      });
      onClose();
    } catch (error) {
      toast.error('❌ Failed to create invoice.');
      console.error(error.response?.data || error.message);
    }
  };

  if (!show) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
      
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
      }}>
        <div style={{
          width: '400px',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>New Invoice</h4>
            <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: '18px' }}>&times;</button>
          </div>

          <div style={{ marginTop: '15px' }}>
            <label>Issue Date</label>
            <input
              type="date"
              name="issue_date"
              value={formData.issue_date}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
              required
            />

            <label>Due Date</label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
              required
            />

            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
              required
            />

            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={onClose} style={{
              padding: '8px 12px',
              backgroundColor: '#ccc',
              border: 'none',
              borderRadius: '4px'
            }}>
              Close
            </button>
            <button onClick={handleSubmit} style={{
              padding: '8px 12px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px'
            }}>
              Save Invoice
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceModal;
