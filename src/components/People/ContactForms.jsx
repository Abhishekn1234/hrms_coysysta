import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

export default function ContactForms({ data, setData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Form>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Work Phone</Form.Label>
            <Form.Control
              type="text"
              name="workPhone"
              value={data.workPhone}
              onChange={handleChange}
              placeholder="Enter work phone"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Work Email <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="email"
              name="workEmail"
              value={data.workEmail}
              onChange={handleChange}
              placeholder="Enter work email"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Personal Email</Form.Label>
            <Form.Control
              type="email"
              name="personalEmail"
              value={data.personalEmail}
              onChange={handleChange}
              placeholder="Enter personal email"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Emergency Contact (1)</Form.Label>
            <Form.Control
              type="text"
              name="emergencyContact1"
              value={data.emergencyContact1}
              onChange={handleChange}
              placeholder="Enter emergency contact 1"
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Emergency Contact (2)</Form.Label>
            <Form.Control
              type="text"
              name="emergencyContact2"
              value={data.emergencyContact2}
              onChange={handleChange}
              placeholder="Enter emergency contact 2"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Mobile of Father/Mother</Form.Label>
            <Form.Control
              type="text"
              name="parentMobile"
              value={data.parentMobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="address"
              value={data.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
}