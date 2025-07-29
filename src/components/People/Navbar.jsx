import React, { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';
import { FaUsers, FaUserFriends, FaUserTie } from 'react-icons/fa';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
  const getActiveTab = () => {
    if (location.pathname === "/admin/people" || location.pathname.startsWith("/staff/"))
      return "staff";
    if (location.pathname === "/customer" || location.pathname.startsWith("/admin/people/customers/"))
      return "customers";
    if (location.pathname === "/vendor" || location.pathname.startsWith("/admin/people/vendors/"))
      return "vendors";
    return "";
  };

  const activeTab = getActiveTab();

  const handleAddClick = () => {
    if (activeTab === "staff") setShowStaffModal(true);
    else if (activeTab === "customers") setShowCustomerModal(true);
    else if (activeTab === "vendors") setShowVendorModal(true);
  };

  return (
    <>
      {/* Header */}
      <Row className="align-items-center mb-4">
        <Col>
          <h2 style={{ fontWeight: '700', marginBottom: '0.3rem' }}>People</h2>
          <p style={{ color: '#6c757d', marginBottom: 0 }}>
            Manage all your staff, customers, and vendors in one place.
          </p>
        </Col>
        <Col className="text-end">
          <Button
            className="text-white"
            style={{
              backgroundColor: "#0d6efd",
              border: "none",
              padding: "0.5rem 1.2rem",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "15px",
              boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
            }}
            onClick={handleAddClick}
          >
            <i className="bi bi-plus-lg me-2"></i>
            {activeTab === "staff"
              ? "Add New Staff"
              : activeTab === "customers"
              ? "Add New Customer"
              : activeTab === "vendors"
              ? "Add New Vendor"
              : "Add New"}
          </Button>
        </Col>
      </Row>

      {/* Sticky Tabs */}
      {!showStaffModal && !showCustomerModal && !showVendorModal  && (
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '1rem',
          }}
        >
          <div
            style={{
              position: "sticky",
              top: 60,
              zIndex: 1055,
              backgroundColor: '#fff',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #dee2e6',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                maxWidth: "600px",
                paddingRight: "2rem",
              }}
            >
              <Tabs
                id="people-tabs"
                activeKey={activeTab}
                onSelect={(k) => {
                  if (k === "staff") navigate("/admin/people");
                  else if (k === "customers") navigate("/customer");
                  else if (k === "vendors") navigate("/vendor");
                }}
                className="custom-tabs"
                style={{ width: "100%" }}
              >
                <Tab
                  eventKey="staff"
                  title={<><FaUsers className="tab-icon" /> Staff</>}
                  tabClassName="me-3"
                />
                <Tab
                  eventKey="customers"
                  title={<><FaUserFriends className="tab-icon" /> Customers</>}
                  tabClassName="me-3"
                />
                <Tab
                  eventKey="vendors"
                  title={<><FaUserTie className="tab-icon" /> Vendors</>}
                  tabClassName="me-3"
                />
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </>
  );
}