import React, { useState } from 'react';
import axios from 'axios';

const CreateBillModal = ({ show, handleClose, vendor, purchaseOrders }) => {
  const [form, setForm] = useState({
    po_id: '',
    amount: '',
    date: '',
    status: 'Due',
  });

  const handleSubmit = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/v1/vendors/${vendor.id}/bills`, {
        ...form,
        vendor_id: vendor.id,
      });
      handleClose(); // Close modal after submission
    } catch (err) {
      console.error('Error creating bill:', err);
    }
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050,
    }}>
      <div style={{
        width: '500px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h4 style={{ margin: 0 }}>Create New Bill</h4>
          <button onClick={handleClose} style={{
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer'
          }}>&times;</button>
        </div>

        {/* Form Fields */}
        <div style={{ marginBottom: '15px' }}>
          <label>PO</label>
          <select
            value={form.po_id}
            onChange={(e) => setForm({ ...form, po_id: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            <option value="">Select PO</option>
            {purchaseOrders.map((po) => (
              <option key={po.id} value={po.id}>
                PO-{po.id} ({po.amount})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Amount</label>
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            <option value="Paid">Paid</option>
            <option value="Due">Due</option>
          </select>
        </div>

        {/* Footer Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button
            onClick={handleClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ccc',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBillModal;
