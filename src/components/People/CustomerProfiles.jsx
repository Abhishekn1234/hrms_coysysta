import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { FaUpload } from 'react-icons/fa';

function CustomerProfiles({ customer, setCustomer }) {
  // Handle file upload for logo
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomer({ ...customer, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setCustomer({ ...customer, [field]: value });
  };

  return (
    <Form style={{ background: '#fff', padding: '2rem', borderRadius: '12px' }}>
      {/* Profile Logo Upload */}
      <Row className="mb-4">
        <Form.Label>Profile Logo</Form.Label>
        <Col md={12}>
          <label
            htmlFor="logo-upload"
            style={{
              border: '2px dotted #ccc',
              borderRadius: '8px',
              height: '180px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: '#f8f9fc',
              marginBottom: '1rem',
              flexDirection: 'column',
            }}
          >
            {customer?.logo ? (
              <img 
                src={customer.logo} 
                alt="Company Logo" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  objectFit: 'contain'
                }} 
              />
            ) : (
              <>
                <FaUpload size={30} color="#888" style={{ marginBottom: '10px' }} />
                <strong style={{ color: 'grey' }}>Click to upload or drag and drop</strong>
                <small style={{ color: '#666', marginTop: '5px' }}>
                  SVG, PNG, JPG (max. 2MB)
                </small>
              </>
            )}
          </label>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </Col>
      </Row>

      {/* Customer Information */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Customer Type*</Form.Label>
            <Form.Select
              value={customer?.customer_type || ''}
              onChange={(e) => handleInputChange('customer_type', e.target.value)}
              required
            >
              <option value="">Select type</option>
              <option>Business</option>
              <option>Individual</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="text"
              value={customer?.company_name || ''}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              placeholder="Enter company name"
              
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Display Name*</Form.Label>
            <Form.Control
              type="text"
              value={customer?.display_name || ''}
              onChange={(e) => handleInputChange('display_name', e.target.value)}
              placeholder="Enter display name"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Owner Name</Form.Label>
            <Form.Control
              type="text"
              value={customer?.owner_name || ''}
              onChange={(e) => handleInputChange('owner_name', e.target.value)}
              placeholder="Enter owner name"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Primary Contact Name*</Form.Label>
            <Form.Control
              type="text"
              value={customer?.primary_contact_name || ''}
              onChange={(e) => handleInputChange('primary_contact_name', e.target.value)}
              placeholder="Enter contact name"
              required
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Primary Contact Phone*</Form.Label>
            <Form.Control
              type="tel"
              value={customer?.primary_contact_phone || ''}
              onChange={(e) => handleInputChange('primary_contact_phone', e.target.value)}
              placeholder="Enter phone number"
              pattern="[0-9]{10}"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Email*</Form.Label>
            <Form.Control
              type="email"
              value={customer?.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>PAN No.</Form.Label>
            <Form.Control
              type="text"
              value={customer?.pan_no || ''}
              onChange={(e) => handleInputChange('pan_no', e.target.value)}
              placeholder="Enter PAN number"
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
              title="Enter valid PAN (e.g. ABCDE1234F)"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Form.Group>
            <Form.Label>Registered Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={customer?.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter full address"
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
}

export default CustomerProfiles;