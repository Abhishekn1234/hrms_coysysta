
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Main.css';

const projectTabs = [
  { id: 'overview', label: 'Quotation Overview', icon: 'fas fa-globe' },
  { id: 'details', label: 'Quotation Details', icon: 'fas fa-info-circle' },
  { id: 'items', label: 'Items', icon: 'fas fa-list' },
  { id: 'attachments', label: 'Attachments', icon: 'fas fa-paperclip' },
  { id: 'cost', label: 'Financials', icon: 'fas fa-dollar-sign' },
  { id: 'advance', label: 'Advance Payment', icon: 'fas fa-money-check-alt' },
];

const ProjectPlanningPanel = ({
  selectedProject,
  activeTab,
  onTabChange,
  isCreatingNew,
  onApprove,
  onReject,
}) => {
  const [projectData, setProjectData] = useState({
    ...selectedProject,
    rawData: selectedProject?.rawData || {},
  });
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State for Advance Payment tab
  const [advanceType, setAdvanceType] = useState('');
  const [foodExpense, setFoodExpense] = useState('');
  const [transportExpense, setTransportExpense] = useState('');
  const [frequency, setFrequency] = useState('');
  const [advanceNote, setAdvanceNote] = useState('');

  useEffect(() => {
    // Parse items if they are a JSON string
    const parsedData = {
      ...selectedProject,
      rawData: {
        ...selectedProject?.rawData,
        items: typeof selectedProject?.rawData?.items === 'string'
          ? JSON.parse(selectedProject.rawData.items || '[]')
          : selectedProject?.rawData?.items || [],
      },
    };
    setProjectData(parsedData);
  }, [selectedProject]);

  const handleNextTab = () => {
    const currentIndex = projectTabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < projectTabs.length - 1) {
      onTabChange(projectTabs[currentIndex + 1].id);
    }
  };

  const handlePrevTab = () => {
    const currentIndex = projectTabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      onTabChange(projectTabs[currentIndex - 1].id);
    }
  };

  const handleActionClick = (type) => {
    setActionType(type);
    setShowActionModal(true);
  };

  const submitAction = async () => {
    if (actionType === 'reject' && !note.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/v1/quotations/${projectData.id}/status`,
        {
          status: actionType === 'approve' ? 'approved' : 'rejected',
          note: note.trim(),
        }
      );

      if (response.data.success) {
        setProjectData(prev => ({
          ...prev,
          status: actionType === 'approve' ? 'Approved' : 'Rejected',
          rawData: {
            ...prev.rawData,
            note: note.trim(),
          },
        }));

        if (actionType === 'approve') {
          onApprove && onApprove();
        } else {
          onReject && onReject();
        }
      }
    } catch (error) {
      console.error('Error updating quotation status:', error);
      alert('Failed to update quotation status');
    } finally {
      setIsSubmitting(false);
      setShowActionModal(false);
      setNote('');
    }
  };

  // Handle Advance Payment form submission (mocked)
  const handleAdvanceSubmit = () => {
    if (!advanceType || !foodExpense || !transportExpense || !frequency) {
      alert('Please fill in all required fields');
      return;
    }
    alert(`Advance Payment Submitted:
Type: ${advanceType}
Food Expense: $${foodExpense}
Transport Expense: $${transportExpense}
Frequency: ${frequency}
Note: ${advanceNote || 'None'}`);
    // Reset form
    setAdvanceType('');
    setFoodExpense('');
    setTransportExpense('');
    setFrequency('');
    setAdvanceNote('');
  };

  const isFirstTab = activeTab === projectTabs[0].id;
  const isLastTab = activeTab === projectTabs[projectTabs.length - 1].id;

  return (
    <div className="planning-panel">
      {/* Action Modal */}
      {showActionModal && (
        <div className="modal-backdrop">
          <div className="action-modal">
            <h3>
              {actionType === 'approve' ? 'Approve Quotation' : 'Reject Quotation'}
            </h3>
            <div className="form-group">
              <label>
                {actionType === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason*'}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  actionType === 'approve'
                    ? 'Add any notes about this approval...'
                    : 'Please specify the reason for rejection...'
                }
                required={actionType === 'reject'}
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-cancel"
                onClick={() => setShowActionModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className={`btn ${actionType === 'approve' ? 'btn-approve' : 'btn-reject'}`}
                onClick={submitAction}
                disabled={isSubmitting || (actionType === 'reject' && !note.trim())}
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : actionType === 'approve' ? (
                  <span>Confirm Approval</span>
                ) : (
                  <span>Confirm Rejection</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Header */}
      <div className="event-detail-header">
        <div className="event-title-container">
          <h2>{projectData.project_name || projectData.title || 'Untitled Project'}</h2>
          <div className={`event-status ${projectData.status?.toLowerCase()}-status`}>
            {projectData.status || 'Unknown'}
          </div>
        </div>
        <div className="event-meta">
          <div className="meta-item">
            <i className="fas fa-building"></i>
            <span>Client: {projectData.customer_name || projectData.client || 'Not set'}</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-user"></i>
            <span>Manager: {projectData.manager || 'Not set'}</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-calendar"></i>
            <span>Date: {projectData.date || 'N/A'}</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-clock"></i>
            <span>Setup Date: {projectData.setupDate || 'N/A'}</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-clock"></i>
            <span>Packup Date: {projectData.packupDate || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs">
        {projectTabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            data-tab={tab.id}
          >
            <i className={tab.icon}></i>
            <span className="tab-label">{tab.label}</span>
          </div>
        ))}
      </div>

      {/* Tab Content Panels */}
      <div className="tab-content-container">
        {/* Quotation Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content active" id="overview-tab">
            <div className="overview-stats">
              <div className="overview-stat">
                <div className="stat-label">Quotation Number</div>
                <div className="stat-value">{projectData.quotation_number || projectData.rawData.quotation_number || 'N/A'}</div>
              </div>
              <div className="overview-stat">
                <div className="stat-label">Total Amount</div>
                <div className="stat-value">${projectData.total_amount || projectData.rawData.total_amount || '0.00'}</div>
              </div>
              <div className="overview-stat">
                <div className="stat-label">Client</div>
                <div className="stat-value">{projectData.customer_name || projectData.client || 'Not set'}</div>
              </div>
              <div className="overview-stat">
                <div className="stat-label">Items</div>
                <div className="stat-value">{projectData.rawData.items?.length || 0}</div>
              </div>
              <div className="overview-stat">
                <div className="stat-label">Event ID</div>
                <div className="stat-value">{projectData.event_id || 'N/A'}</div>
              </div>
              <div className="overview-stat">
                <div className="stat-label">Resubmission</div>
                <div className="stat-value">{projectData.is_resubmission ? 'Yes' : 'No'}</div>
              </div>
            </div>
            <div className="overview-grid">
              <div className="overview-card">
                <h4>Quotation Details</h4>
                <p>Status: {projectData.status || 'Unknown'}</p>
                <p>Subtotal: ${projectData.rawData?.subtotal || '0.00'}</p>
                <p>Discount: ${projectData.rawData?.discount || '0.00'}</p>
                <p>Tax: ${projectData.rawData?.tax || '0.00'}</p>
                <p>Setup Included: {projectData.rawData?.include_setup ? 'Yes' : 'No'}</p>
                <p>Express Shipping: {projectData.rawData?.express_shipping ? 'Yes' : 'No'}</p>
                <p>Setup Date: {projectData.setupDate || 'N/A'}</p>
                <p>Packup Date: {projectData.packupDate || 'N/A'}</p>
                <p>Parent Quotation: {projectData.parent_quotation_number || 'N/A'}</p>
              </div>
              <div className="overview-card">
                <h4>Attachments</h4>
                {projectData.rawData?.pdfPath && (
                  <div style={{ marginBottom: '10px' }}>
                    <a
                      href={`http://127.0.0.1:8000/storage/${projectData.rawData.pdfPath}`}
                      download={projectData.rawData.pdfPath.split('/').pop()}
                      rel="nofollow noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Download Quotation PDF
                    </a>
                  </div>
                )}
                <ul className="attachment-list">
                  {projectData.rawData?.attachments?.length > 0 ? (
                    projectData.rawData.attachments.map((attachment, index) => (
                      <li key={index}>
                        <i className="fas fa-file"></i>
                        <a
                          href={`http://127.0.0.1:8000/storage/${attachment.path}`}
                          download={attachment.name}
                          rel="nofollow noopener noreferrer"
                          title={`Download ${attachment.name}`}
                        >
                          <span>{attachment.name} ({attachment.size})</span>
                        </a>
                        {(attachment.width || attachment.height) && (
                          <span> ({attachment.width}x{attachment.height}px)</span>
                        )}
                      </li>
                    ))
                  ) : (
                    <li>No attachments</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="tab-navigation">
              <button
                className="nav-button prev-button"
                onClick={handlePrevTab}
                disabled={isFirstTab}
              >
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button
                className="nav-button next-button"
                onClick={handleNextTab}
                disabled={isLastTab}
              >
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Quotation Details Tab */}
        {activeTab === 'details' && (
          <div className="tab-content active" id="details-tab">
            <div className="event-details-form">
              <div className="form-section">
                <div className="form-group">
                  <label>Quotation Number</label>
                  <div className="form-control-static">
                    {projectData.quotation_number || projectData.rawData.quotation_number || 'N/A'}
                  </div>
                </div>
                <div className="form-group">
                  <label>Project Title</label>
                  <div className="form-control-static">{projectData.project_name || projectData.title || 'Untitled'}</div>
                </div>
                <div className="form-group">
                  <label>Client</label>
                  <div className="form-control-static">{projectData.customer_name || projectData.client || 'Not set'}</div>
                </div>
                <div className="form-group">
                  <label>Event ID</label>
                  <div className="form-control-static">{projectData.event_id || 'N/A'}</div>
                </div>
              </div>
              <div className="form-section">
                <div className="form-group">
                  <label>Status</label>
                  <div className="form-control-static">{projectData.status || 'Unknown'}</div>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <div className="form-control-static">{projectData.date || 'N/A'}</div>
                </div>
                <div className="form-group">
                  <label>Sales Manager</label>
                  <div className="form-control-static">{projectData.manager || 'Not set'}</div>
                </div>
                <div className="form-group">
                  <label>Resubmission</label>
                  <div className="form-control-static">
                    {projectData.is_resubmission ? `Yes (Parent: ${projectData.parent_quotation_number || 'N/A'})` : 'No'}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="form-group">
                  <label>Setup Date</label>
                  <div className="form-control-static">{projectData.setupDate || 'N/A'}</div>
                </div>
                <div className="form-group">
                  <label>Packup Date</label>
                  <div className="form-control-static">{projectData.packupDate || 'N/A'}</div>
                </div>
                <label>Front Page Content</label>
                <div className="form-control-static">
                  {projectData.rawData.front_page?.content || 'No content'}
                </div>
              </div>
              <div className="form-group">
                <label>Terms & Conditions</label>
                <div className="form-control-static">
                  {projectData.rawData.back_page?.content || 'No terms specified'}
                </div>
              </div>
            </div>
            <div className="tab-navigation">
              <button
                className="nav-button prev-button"
                onClick={handlePrevTab}
                disabled={isFirstTab}
              >
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button
                className="nav-button next-button"
                onClick={handleNextTab}
                disabled={isLastTab}
              >
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div className="tab-content active" id="items-tab">
            <h3>Quotation Items</h3>
            {projectData?.rawData?.items?.length > 0 ? (
              <div className="items-list">
                {projectData.rawData.items.map((item, index) => {
                  const safeItem = {
                    id: item?.id || `temp-${index}`,
                    name: item?.name || 'Unnamed Item',
                    qty: typeof item?.qty === 'number' ? item.qty : 0,
                    days: typeof item?.days === 'number' ? item.days : 0,
                    price: typeof item?.price === 'number' ? item.price : 0,
                    description: item?.description || 'No description available',
                    vendor: item?.vendor || 'N/A',
                    available: typeof item?.available === 'number' ? item.available : 0,
                  };

                  return (
                    <div key={safeItem.id} className="item-card">
                      <div className="form-group">
                        <label>Item Name</label>
                        <div className="form-control-static">{safeItem.name}</div>
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <div className="form-control-static">{safeItem.description}</div>
                      </div>
                      <div className="form-group">
                        <label>Quantity</label>
                        <div className="form-control-static">{safeItem.qty}</div>
                      </div>
                      <div className="form-group">
                        <label>Days</label>
                        <div className="form-control-static">{safeItem.days}</div>
                      </div>
                      <div className="form-group">
                        <label>Unit Price</label>
                        <div className="form-control-static">${safeItem.price.toFixed(2)}</div>
                      </div>
                      <div className="form-group">
                        <label>Total</label>
                        <div className="form-control-static">${(safeItem.qty * safeItem.price).toFixed(2)}</div>
                      </div>
                      <div className="form-group">
                        <label>Vendor</label>
                        <div className="form-control-static">{safeItem.vendor}</div>
                      </div>
                      <div className="form-group">
                        <label>Available</label>
                        <div className="form-control-static">{safeItem.available}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-items-message">
                <i className="fas fa-box-open"></i>
                <p>No items have been added to this quotation</p>
              </div>
            )}
            <div className="tab-navigation">
              <button
                className="nav-button prev-button"
                onClick={handlePrevTab}
                disabled={isFirstTab}
              >
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button
                className="nav-button next-button"
                onClick={handleNextTab}
                disabled={isLastTab}
              >
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Attachments Tab */}
        {activeTab === 'attachments' && (
          <div className="tab-content active" id="attachments-tab">
            <h3>Attachments</h3>
            {projectData.rawData.attachments?.length > 0 ? (
              <ul className="attachment-list">
                {projectData.rawData.attachments.map((attachment, index) => (
                  <li key={index} className="attachment-item">
                    <i className="fas fa-file"></i>
                    <span>{attachment.name} ({attachment.size})</span>
                    <span>Type: {attachment.type}</span>
                    {(attachment.width || attachment.height) && (
                      <span> ({attachment.width}x{attachment.height}px)</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No attachments available.</p>
            )}
            <div className="tab-navigation">
              <button
                className="nav-button prev-button"
                onClick={handlePrevTab}
                disabled={isFirstTab}
              >
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button
                className="nav-button next-button"
                onClick={handleNextTab}
                disabled={isLastTab}
              >
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Financials Tab */}
        {activeTab === 'cost' && (
          <div className="tab-content active" id="cost-tab">
            <h3>Financials</h3>
            <div className="form-section">
              <div className="form-group">
                <label>Subtotal</label>
                <div className="form-control-static">${projectData.rawData.subtotal || '0.00'}</div>
              </div>
              <div className="form-group">
                <label>Discount</label>
                <div className="form-control-static">${projectData.rawData.discount || '0.00'}</div>
              </div>
              <div className="form-group">
                <label>Tax</label>
                <div className="form-control-static">${projectData.rawData.tax || '0.00'}</div>
              </div>
              <div className="form-group">
                <label>Total Amount</label>
                <div className="form-control-static">${projectData.rawData.total_amount || '0.00'}</div>
              </div>
              <div className="form-group">
                <label>Setup Date</label>
                <div className="form-control-static">{projectData.setupDate || 'N/A'}</div>
              </div>
              <div className="form-group">
                <label>Packup Date</label>
                <div className="form-control-static">{projectData.packupDate || 'N/A'}</div>
              </div>
            </div>
            <div className="form-group">
              <label>Include Setup</label>
              <div className="form-control-static">{projectData.rawData.include_setup ? 'Yes' : 'No'}</div>
            </div>
            <div className="form-group">
              <label>Express Shipping</label>
              <div className="form-control-static">{projectData.rawData.express_shipping ? 'Yes' : 'No'}</div>
            </div>
            <div className="approval-actions">
              <button
                className="btn btn-approve"
                onClick={() => handleActionClick('approve')}
                disabled={projectData.status !== 'Pending'}
              >
                <i className="fas fa-check-circle"></i> Approve Quotation
                <span className="btn-icon-right"></span>
              </button>
              <button
                className="btn btn-reject"
                onClick={() => handleActionClick('reject')}
                disabled={projectData.status !== 'Pending'}
              >
                <i className="fas fa-times-circle"></i> Reject Quotation
                <span className="btn-icon-right"></span>
              </button>
            </div>
            <div className="tab-navigation">
              <button
                className="nav-button prev-button"
                onClick={handlePrevTab}
                disabled={isFirstTab}
              >
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button
                className="nav-button next-button"
                onClick={handleNextTab}
                disabled={isLastTab}
              >
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Advance Payment Tab */}
        {activeTab === 'advance' && (
          <div className="tab-content active" id="advance-tab">
            <h3>Advance Payment Request</h3>
            <div className="form-section">
              <div className="form-group">
                <label>Advance Type*</label>
                <select
                  className="form-control-static"
                  value={advanceType}
                  onChange={(e) => setAdvanceType(e.target.value)}
                >
                  <option value="">Select Advance Type</option>
                  <option value="project_expense">Project Advance Expense</option>
                  <option value="salary_advance">Salary Advance</option>
                  <option value="inventory_add">Inventory Add</option>
                </select>
              </div>
              <div className="form-group">
                <label>Food Expense ($)*</label>
                <input
                  type="number"
                  className="form-control-static"
                  value={foodExpense}
                  onChange={(e) => setFoodExpense(e.target.value)}
                  placeholder="Enter food expense amount"
                />
              </div>
              <div className="form-group">
                <label>Transport Expense ($)*</label>
                <input
                  type="number"
                  className="form-control-static"
                  value={transportExpense}
                  onChange={(e) => setTransportExpense(e.target.value)}
                  placeholder="Enter transport expense amount"
                />
              </div>
              <div className="form-group">
                <label>Frequency*</label>
                <select
                  className="form-control-static"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <option value="">Select Frequency</option>
                  <option value="one_by_one">One-by-One</option>
                  <option value="project_based">Project-Based</option>
                  <option value="two_times">2 Times</option>
                  <option value="three_times">3 Times</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  className="form-control-static"
                  value={advanceNote}
                  onChange={(e) => setAdvanceNote(e.target.value)}
                  placeholder="Add any notes about this advance request..."
                />
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleAdvanceSubmit}
            >
              Submit Advance Request
            </button>
            <div className="tab-navigation">
              <button
                className="nav-button prev-button"
                onClick={handlePrevTab}
                disabled={isFirstTab}
              >
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button
                className="nav-button next-button"
                onClick={handleNextTab}
                disabled={isLastTab}
              >
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPlanningPanel;
