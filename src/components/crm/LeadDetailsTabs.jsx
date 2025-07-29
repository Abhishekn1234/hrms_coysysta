import React, { useState } from 'react';
import LeadDetails from './tabs/LeadDetails';
import Communications from './tabs/Communications';
import Activity from './tabs/Activity';
import Tasks from './tabs/Tasks';

export default function LeadDetailsTabs({ lead, refresh, onLeadUpdated }) {
  const [activeTab, setActiveTab] = useState('details');

  if (!lead || !lead.id) {
    return (
      <div
        className="text-center text-muted"
        style={{ marginTop: '2rem', fontSize: '1.1rem' }}
      >
        Select a lead to see details
      </div>
    );
  }

  function handleLeadUpdated(updatedLead) {
    console.log("Lead updated in LeadDetailsTabs:", updatedLead);

    if (typeof onLeadUpdated === 'function') {
      onLeadUpdated(updatedLead);
    }

    if (typeof refresh === 'function') {
      refresh();
    }
  }

  return (
    <div
      className="card compact-card"
      style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.25)', borderRadius: '0.5rem' }}
    >
      <div
        className="card-header p-2 d-flex justify-content-center"
        style={{ boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)', zIndex: 1 }}
      >
        <ul className="nav nav-tabs card-header-tabs">
          {['details', 'tasks', 'communications', 'activity'].map(tab => (
            <li className="nav-item" key={tab}>
              <button
                type="button"
                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card-body">
        {activeTab === 'details' && lead && (
          <LeadDetails lead={lead} onLeadUpdated={handleLeadUpdated} />
        )}

        {activeTab === 'communications' && lead && (
          <Communications
            lead={{
              ...lead,
              details: Array.isArray(lead.details)
                ? lead.details.filter((d) => d.type === 'tab_actions')
                : [],
            }}
          />
        )}

        {activeTab === 'activity' && Array.isArray(lead?.details) && (
          <Activity lead={lead.details} />
        )}

        {activeTab === 'tasks' && lead && (
          <Tasks
            lead={{
              ...lead,
              details: Array.isArray(lead.details)
                ? lead.details.filter((d) => d.type === 'task')
                : [],
            }}
            onLeadUpdated={handleLeadUpdated}
          />
        )}
      </div>
    </div>
  );
}
