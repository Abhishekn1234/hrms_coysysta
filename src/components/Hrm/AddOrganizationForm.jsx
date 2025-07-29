import React, { useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddOrganizationForm({ onClose }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/api/v1/admin/organizations", {
        name,
      });
      toast.success("Organization created successfully.");
      setName("");
      if (onClose) onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create organization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Container style={{
        maxWidth: "600px",
        padding: "2rem",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "1.5rem",
          color: "#333"
        }}>Add Organization</h2>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="orgName" style={{ marginBottom: "1.5rem" }}>
            <Form.Label style={{
              fontWeight: "500",
              marginBottom: "0.5rem"
            }}>Organization Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter organization name"
              style={{
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid #ced4da"
              }}
            />
          </Form.Group>

          <Row style={{ 
            marginTop: "2rem",
            borderTop: "1px solid #eee",
            paddingTop: "1.5rem"
          }}>
            <Col className="text-start">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
                style={{
                  padding: "0.5rem 1.5rem",
                  fontWeight: "500",
                  minWidth: "150px"
                }}
              >
                {loading ? "Saving..." : "Save Organization"}
              </Button>
            </Col>
            <Col className="text-end">
              <Button 
                variant="outline-secondary" 
                onClick={onClose}
                style={{
                  padding: "0.5rem 1.5rem",
                  fontWeight: "500",
                  minWidth: "100px"
                }}
              >
                Close
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}