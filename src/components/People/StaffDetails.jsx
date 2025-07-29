import React, { useEffect, useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

export default function StaffDetails({ data, setData }) {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/v1/positions')
      .then((response) => setPositions(response.data.positions || []))
      .catch((error) => console.error("Error fetching positions:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!data) return null;

  return (
    <Form>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Salutation <span className="text-danger">*</span></Form.Label>
            <Form.Select name="salutation" value={data.salutation || ''} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
            <Form.Control type="text" name="first_name" value={data.first_name || ''} onChange={handleChange} />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
            <Form.Control type="text" name="last_name" value={data.last_name || ''} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Staff ID</Form.Label>
            <Form.Control type="text" name="id" value={data.id || ''} readOnly />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Monthly/Daily Staff <span className="text-danger">*</span></Form.Label>
            <Form.Select name="staff_type" value={data.staff_type || ''} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Monthly">Monthly</option>
              <option value="Daily">Daily</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Designation <span className="text-danger">*</span></Form.Label>
            <Form.Select name="designation" value={data.designation || ''} onChange={handleChange}>
              <option value="">Select Designation</option>
              {positions.map((pos, index) => (
                <option key={index} value={pos}>{pos}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Status <span className="text-danger">*</span></Form.Label>
            <Form.Select name="status" value={data.status || ''} onChange={handleChange}>
              <option value="">Select</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="date_of_birth"
              value={data.date_of_birth || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Blood Group</Form.Label>
            <Form.Control type="text" name="blood_group" value={data.blood_group || ''} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Date of Joining</Form.Label>
            <Form.Control
              type="date"
              name="join_date"
              value={data.join_date || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Nature of Staff</Form.Label>
            <Form.Select name="nature_of_staff" value={data.nature_of_staff || ''} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Probation">Probation</option>
              <option value="Permanent">Permanent</option>
              <option value="Contract">Contract</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Experience</Form.Label>
            <Form.Control type="text" name="experience" value={data.experience || ''} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={12}>
          <Form.Group>
            <Form.Label>Educational Qualification</Form.Label>
            <Form.Control type="text" name="qualification" value={data.qualification || ''} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
}