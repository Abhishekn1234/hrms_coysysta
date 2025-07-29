import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LeadList({ onLeadSelect, onAllLeads, refresh, onRefresh }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState(''); // 'success' or 'error'

    useEffect(() => {
    async function fetchLeads() {
        setLoading(true);
        setError(null);
        try {
        // const res = await axios.get('/api/v1/crm/leads');
        const res = await axios.get('http://localhost:8000/api/v1/crm/leads');

        console.log("crm data",res);
        console.log("crm lead data", res.data);
        
        // Ensure we always work with an array
        const leadsData = Array.isArray(res.data) ? res.data : [];
        
        setLeads(leadsData);
        if (typeof onAllLeads === 'function') {
            onAllLeads(leadsData);
        }
        } catch (err) {
        setError('Failed to load leads.');
        // Pass empty array on error
        if (typeof onAllLeads === 'function') {
            onAllLeads([]);
        }
        } finally {
        setLoading(false);
        }
    }
    fetchLeads();
    }, [refresh]);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage('');
        setStatusType('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

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

  function handleClick(lead) {
    setSelectedLead(lead);
    if (onLeadSelect) {
      onLeadSelect(lead);
    }
  }

  async function handleDelete(leadId) {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    try {
      await axios.delete(`/api/v1/crm/leads/${leadId}`);
      setStatusMessage('Lead deleted successfully.');
      setStatusType('success');
      if (typeof onRefresh === 'function') {
        onRefresh(); // trigger parent refresh
      }
    } catch (err) {
      setStatusMessage('Failed to delete lead.');
      setStatusType('error');
      console.error(err);
    }
  }

  return (
    <div className="d-flex gap-3">
      <div
        className="card border-0 rounded-3"
        style={{ boxShadow: '0 0.5rem 1.5rem rgba(0,0,0,0.3)', flex: 1 }}
      >
        <div
          className="card-header text-white py-2 px-2 d-flex justify-content-between align-items-center"
          style={{ backgroundColor: 'rgb(43 129 129)' }}
        >
          <h6 className="mb-0" style={{ fontSize: '0.9rem' }}>
            Leads ({leads.length})
          </h6>
        </div>

        <div className="card-body p-0" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {loading && <div className="p-2 text-center">Loading leads...</div>}
          {error && <div className="alert alert-danger m-2">{error}</div>}
          {!loading && !error && leads.length === 0 && (
            <div className="p-2 text-center text-muted">No leads found.</div>
          )}

          {!loading && !error && leads.map((lead, idx) => (
            <div
              key={lead.id || idx}
              className={`lead-item px-2 py-2 border-bottom ${selectedLead?.id === lead.id ? 'bg-light' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div onClick={() => handleClick(lead)} style={{ flex: 1 }}>
                  <strong className="text-dark" style={{ fontSize: '0.9rem' }}>
                    {lead.name || 'Unnamed Lead'}
                  </strong>
                  <br />
                  <small className="text-muted">
                    {lead.company || 'No company'} {lead.time && `• ${lead.time}`}
                  </small>
                </div>
                <div className="d-flex flex-column align-items-end ms-2">
                  <span className={`badge bg-${getBadgeColor(lead.status || '')}`} style={{ fontSize: '0.7rem' }}>
                    {lead.status || 'Unknown'}
                  </span>
                  <button
                    className="btn btn-sm btn-outline-danger mt-1"
                    title="Delete Lead"
                    onClick={() => handleDelete(lead.id)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card-footer text-center py-1 px-2 bg-light">
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
            Showing {leads.length} leads
          </small>
        </div>

        {/* Status message */}
        {statusMessage && (
          <div
            className={`text-center py-2 small ${statusType === 'success' ? 'text-success' : 'text-danger'}`}
          >
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
}
