import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Alert } from "react-bootstrap";
import { FiCalendar, FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

export default function ManageLeaves({ onClose, selectedEmployees }) {
  const [leaveData, setLeaveData] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
    isEmergency: false
  });

  const [leaveTypes, setLeaveTypes] = useState([]);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/leave-requests/enums");
        setLeaveTypes(response.data.leave_type || []);
      } catch (error) {
        console.error("Error fetching leave types:", error);
      }
    };

    fetchLeaveTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLeaveData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();

    for (const emp of selectedEmployees) {
      const payload = {
        employee_id: emp.id,
        leave_type: leaveData.leaveType,
        from_date: leaveData.fromDate,
        to_date: leaveData.toDate,
        reason: leaveData.reason,
        is_emergency: leaveData.isEmergency,
        status: "PENDING"
      };

      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/leave/apply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const error = await res.json();
          console.error(error);
          toast.error(`Leave submission failed for ${emp.first_name}.`);
        } else {
          toast.success(`Leave submitted for ${emp.first_name}.`);
        }
      } catch (err) {
        console.error("Error submitting leave:", err);
        toast.error("Something went wrong.");
      }
    }

    onClose();
  };

  const handleAutoApprove = async () => {
    if (!selectedEmployees || selectedEmployees.length !== 1) {
      toast.error("Auto-approve works only for one selected employee.");
      return;
    }

    const emp = selectedEmployees[0];

    const payload = {
      employee_id: emp.id,
      leave_type: leaveData.leaveType,
      from_date: leaveData.fromDate,
      to_date: leaveData.toDate,
      reason: leaveData.reason,
      is_emergency: leaveData.isEmergency,
      status: "APPROVED"
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/leave/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json();
        console.error(error);
        toast.error("Auto-approval failed.");
        return;
      }

      toast.success("Leave auto-approved!");
      onClose();
    } catch (err) {
      console.error("Error in auto-approval:", err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
     {selectedEmployees && selectedEmployees.length > 0 && (
  <Card className="mb-4 p-3 bg-light border">
    <strong>Selected Employee{selectedEmployees.length > 1 ? "s" : ""}:</strong>{" "}
    {selectedEmployees.map((emp, index) => (
      <span key={emp.id}>
        {emp.first_name} {emp.last_name}
        {index < selectedEmployees.length - 1 ? ", " : ""}
      </span>
    ))}
  </Card>
)}



      <Form onSubmit={handleSubmitLeave}>
        <Form.Group className="mb-4">
          <Form.Label>
            <strong>Leave Type</strong>
          </Form.Label>
          <Form.Select
            name="leaveType"
            value={leaveData.leaveType}
            onChange={handleChange}
            required
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>
                <strong>From Date</strong>
              </Form.Label>
              <div className="d-flex align-items-center">
                <FiCalendar className="me-2" style={{ color: "#2b90d9" }} />
                <Form.Control
                  type="date"
                  name="fromDate"
                  value={leaveData.fromDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>
                <strong>To Date</strong>
              </Form.Label>
              <div className="d-flex align-items-center">
                <FiCalendar className="me-2" style={{ color: "#2b90d9" }} />
                <Form.Control
                  type="date"
                  name="toDate"
                  value={leaveData.toDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-4">
          <Form.Label>
            <strong>Reason</strong>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter reason for leave"
            name="reason"
            value={leaveData.reason}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            label="Emergency Leave"
            name="isEmergency"
            checked={leaveData.isEmergency}
            onChange={handleChange}
          />
        </Form.Group>

        <Alert variant="info" className="d-flex align-items-center">
          <FiCheckCircle className="me-2" size={20} />
          <strong>AI Approval:</strong> Based on past patterns, 92% chance this leave will be approved.
        </Alert>

        <div className="d-flex justify-content-between mt-4">
          <Button variant="outline-secondary" onClick={onClose}>
            Cancel
          </Button>
         <div className="d-flex gap-2">
  <Button variant="primary" type="submit">
    Submit Request
  </Button>
  <Button variant="success" onClick={handleAutoApprove}>
    Auto-Approve
  </Button>
</div>

        </div>
      </Form>
    </>
  );
}
