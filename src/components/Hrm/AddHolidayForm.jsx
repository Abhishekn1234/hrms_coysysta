import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddHolidayForm({ onClose }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("national");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/v1/admin/hrm/holidays", {
        title,
        date,
        type,
      });
      toast.success("Holiday added successfully.");
      onClose(); // Close the form/modal
    } catch (error) {
      console.error(error);
      toast.error("Failed to add holiday.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="holidayTitle">
        <Form.Label>Holiday Title</Form.Label>
        <Form.Control
          type="text"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter holiday name"
        />
      </Form.Group>

      <Form.Group controlId="holidayDate" className="mt-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          value={date}
          required
          onChange={(e) => setDate(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="holidayType" className="mt-3">
        <Form.Label>Type</Form.Label>
        <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="national">National</option>
          <option value="festive">Festive</option>
          <option value="labour_day">Labour Day</option>
          <option value="regional">Regional</option>
          <option value="optional">Optional</option>
          <option value="sunday">Sunday</option>
        </Form.Select>
      </Form.Group>

      <Row className="mt-4">
        <Col className="text-start">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Holiday"}
          </Button>
        </Col>
        <Col className="text-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
