import React, { useState } from 'react';
import {
  Modal, Button, Form, Card, Row, Col
} from 'react-bootstrap';
import {
  FaCalendarAlt, FaFilePdf, FaSave, FaTimes, FaEdit,
  FaFileMedical, FaUserShield, FaBalanceScale, FaBriefcase,
  FaWallet, FaMoneyBill, FaPercentage, FaGift, FaPassport,
  FaTicketAlt, FaComment, FaEllipsisH
} from 'react-icons/fa';

const EmployeeBenefits = ({ show, onHide }) => {
  const [activeItem, setActiveItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [formData, setFormData] = useState({});

  const benefitItems = [
    { id: 'esi', label: 'ESI', icon: <FaFileMedical size={16} /> },
    { id: 'insurance', label: 'Insurance Details', icon: <FaUserShield size={16} /> },
    { id: 'leave', label: 'Leave Balances', icon: <FaBalanceScale size={16} /> },
    { id: 'stock', label: 'Stock Options', icon: <FaBriefcase size={16} /> },
    { id: 'loan', label: 'Loan Information', icon: <FaWallet size={16} /> },
    { id: 'pf', label: 'Provident Fund', icon: <FaMoneyBill size={16} /> },
    { id: 'gratuity', label: 'Gratuity', icon: <FaPercentage size={16} /> },
    { id: 'bonus', label: 'Bonus', icon: <FaGift size={16} /> },
    { id: 'incentives', label: 'Incentives', icon: <FaPercentage size={16} /> },
    { id: 'visa', label: 'Visa', icon: <FaPassport size={16} /> },
    { id: 'travel', label: 'Travel Tickets', icon: <FaTicketAlt size={16} /> },
    { id: 'feedback', label: 'Feedback', icon: <FaComment size={16} /> },
    { id: 'other', label: 'Other Benefits', icon: <FaEllipsisH size={16} /> }
  ];

  const handleClose = () => {
    setActiveItem(null);
    setViewItem(null);
    onHide();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Submitting: ${JSON.stringify(formData)}`);
    setActiveItem(null);
  };

  return (
    <>
     
          <Modal
              show={show}
              onHide={handleClose}
              size="lg"
              centered
              scrollable
              dialogClassName="custom-rectangular-modal"
              backdropClassName="light-modal-backdrop" // Add this
            >
        <Modal.Header closeButton onHide={handleClose} className="border-0 pb-0" />

        {/* Header with Date */}
        <div className="px-4 pt-4 d-flex justify-content-end">
          <div className="d-inline-flex align-items-center bg-white p-2 rounded-3 text-secondary">
            <FaCalendarAlt className="text-primary me-2" size={12} />
            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Summary */}
        <div className="px-4 pt-3">
          <Card className="shadow-sm" style={{ borderRadius: '15px', padding: '1.5rem', backgroundColor: '#f9f9f9' }}>
            <Row className="text-center">
              <Col md={3}><strong style={{ fontSize: '1.5rem', color: '#28a745' }}>₹852,500</strong><p className="text-muted">Total Benefits Value</p></Col>
              <Col md={3}><strong>9</strong><p className="text-muted">Active Benefits</p></Col>
              <Col md={3}><strong>2025-12-31</strong><p className="text-muted">Next Renewal</p></Col>
              <Col md={3}><strong>4.2/5</strong><p className="text-muted">Satisfaction</p></Col>
            </Row>
          </Card>
        </div>

        {/* Benefits Grid */}
        <Modal.Body className="px-4 py-3">
          <Row className="g-3">
            {benefitItems.map(item => (
              <Col md={3} key={item.id}>
                <Card className="benefit-card shadow-sm h-100" style={{ borderRadius: '12px' }}>
                  <Card.Body>
                    {/* Top row with icon + label + edit */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div
                        className="d-flex align-items-center gap-2 cursor-pointer"
                        onClick={() => {
                          setViewItem(viewItem === item.id ? null : item.id);
                          setActiveItem(null);
                        }}
                      >
                        <div className="d-flex justify-content-center align-items-center" style={{ backgroundColor: '#eaf0f6', borderRadius: '50%', width: '30px', height: '30px', color: '#3a5ea8' }}>
                          {item.icon}
                        </div>
                        <span className="fw-semibold">{item.label}</span>
                      </div>
                      <FaEdit
                        title="Edit"
                        className="text-muted"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setActiveItem(item.id);
                          setViewItem(null);
                        }}
                      />
                    </div>

                    <hr className="my-2" />

                    {/* View Mode */}
                    {viewItem === item.id && (
                      <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                        <p className="mb-1">View content for <strong>{item.label}</strong>...</p>
                      </div>
                    )}

                    {/* Edit Mode */}
                    {activeItem === item.id && (
                      <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-2">
                          <Form.Label>{item.label} Detail</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            name={item.id}
                            value={formData[item.id] || ''}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Button type="submit" size="sm" variant="primary">
                          <FaSave className="me-1" /> Save
                        </Button>
                      </Form>
                    )}

                    {/* Placeholder when nothing is open */}
                    {!viewItem && activeItem !== item.id && (
                      <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>Click to view details</div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>

        {/* Footer */}
        <Modal.Footer className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={handleClose} className="d-flex align-items-center">
            <FaTimes className="me-1" /> Close
          </Button>
          <Button variant="secondary" className="d-flex align-items-center">
            <FaFilePdf className="me-1" /> Export to PDF
          </Button>
          <Button variant="primary" className="d-flex align-items-center">
            <FaSave className="me-1" /> Save All Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EmployeeBenefits;