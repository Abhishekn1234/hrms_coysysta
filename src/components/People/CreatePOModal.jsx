import React, { useState } from 'react';
import axios from 'axios';

export default function CreatePOModal({ show, handleClose, vendor }) {
  const [poId, setPoId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Ordered');

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success'); // 'success' | 'danger'

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/v1/vendors/${vendor.id}/purchase-orders`,
        { date, amount, status }
      );

      setPoId(res.data.po_id);
      setToastVariant('success');
      setToastMessage(`Purchase Order Created: ${res.data.po_id}`);
      setShowToast(true);
      handleClose();
    } catch (error) {
      console.error('Error creating PO:', error);
      setToastVariant('danger');
      setToastMessage('Failed to create Purchase Order.');
      setShowToast(true);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050
      }}>
        <div style={{
          width: '500px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          position: 'relative'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h4 style={{ margin: 0 }}>Create New Purchase Order</h4>
            <button onClick={handleClose} style={{
              background: 'transparent',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}>&times;</button>
          </div>

          {/* Body */}
          <div>
            <div style={{ marginBottom: '15px' }}>
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              >
                <option value="Ordered">Ordered</option>
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px'
          }}>
            <button onClick={handleClose} style={{
              padding: '8px 16px',
              backgroundColor: '#ccc',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Cancel
            </button>
            <button onClick={handleSubmit} style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Create PO
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: toastVariant === 'success' ? '#28a745' : '#dc3545',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '6px',
          zIndex: 1100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          minWidth: '250px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '5px'
          }}>
            <strong>Purchase Order</strong>
            <button onClick={() => setShowToast(false)} style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer'
            }}>&times;</button>
          </div>
          <div>{toastMessage}</div>
        </div>
      )}
    </>
  );
}
