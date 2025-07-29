import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Toast, ToastContainer } from "react-bootstrap";


export default function AddDesignationForm({ onClose }) {
  const [name, setName] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", variant: "success" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setToast({ show: true, message: "Designation name is required.", variant: "danger" });
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/hrm/v1/designation/add", { name });
      setToast({ show: true, message: "Designation added successfully!", variant: "success" });
      setName("");

      setTimeout(() => {
        setToast({ ...toast, show: false });
        onClose();
      }, 1500);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Failed to add designation.",
        variant: "danger",
      });
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="designationName">
          <Form.Label>Designation Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter designation name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <div className="mt-3 d-flex justify-content-end">
          <Button variant="secondary" className="me-3" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Designation
          </Button>
        </div>
      </Form>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          bg={toast.variant}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
