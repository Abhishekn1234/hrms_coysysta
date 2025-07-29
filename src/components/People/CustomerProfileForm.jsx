import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { FaUpload } from 'react-icons/fa';

function CustomerProfileForm() {
  return (
    <Form style={{ background: '#fff', padding: '2rem', borderRadius: '12px' }}>
      {/* Profile Picture Section */}
      <Row className="mb-4">
        <div style={{ marginTop: '8px', fontSize: '14px', color: 'black' }}>
              Profile Logo
            </div>
        <Col md={12}>
          <div
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
            <FaUpload size={30} color="#888" style={{ marginBottom: '10px' }} />
            <strong style={{ color: 'grey' }}>Click to upload or drag and drop</strong>
            
          </div>
        </Col>
      </Row>


      {/* First Row: Customer Type, Company Name, Display Name */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Customer Type*</Form.Label>
            <Form.Select>
              <option value="">Select type</option>
              <option value="business">Business</option>
              <option value="individual">Individual</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Company Name</Form.Label>
            <Form.Control type="text" placeholder="Enter company name" />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Customer Display Name*</Form.Label>
            <Form.Control type="text" placeholder="Enter display name" />
          </Form.Group>
        </Col>
      </Row>

      {/* Second Row: Owner Name, Primary Contact Name, Phone */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Owner Name</Form.Label>
            <Form.Control type="text" placeholder="Enter owner name" />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Primary Contact Name*</Form.Label>
            <Form.Control type="text" placeholder="Enter contact name" />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Primary Contact Phone*</Form.Label>
            <Form.Control type="text" placeholder="Enter phone number" />
          </Form.Group>
        </Col>
      </Row>

      {/* Third Row: Email, PAN */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Email*</Form.Label>
            <Form.Control type="email" placeholder="Enter email address" />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>PAN No.</Form.Label>
            <Form.Control type="text" placeholder="Enter PAN number" />
          </Form.Group>
        </Col>
      </Row>

      {/* Final Row: Address */}
      <Row>
        <Col md={12}>
          <Form.Group>
            <Form.Label>Registered Address</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter full address" />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
}

export default CustomerProfileForm;