import axios from "axios";
import React, { useState,useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import {toast} from "react-toastify";
export default function AddDepartmentForm({onClose}) {
  const [formData, setFormData] = useState({
    departmentName: "",
    description: "",
    departmentHead: "",
  });

    const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const API_URL = "http://127.0.0.1:8000/api/v1/employees";
 useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(API_URL);
        setEmployees(response.data.data); // Adjust this if response has a nested structure
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
   const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/v1/departments",
      formData, // plain JS object, no JSON.stringify needed
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    // Axios automatically parses JSON
    const data = response.data;

    toast.success("Department created successfully!");
    console.log(data);
    onClose();
  } catch (error) {
    if (error.response) {
      // Server responded with a status outside 2xx
      const errorMsg =
        error.response.data?.message || "Something went wrong while creating department.";
      toast.error(errorMsg);
      console.error("API Error:", error.response.data);
    } else {
      // Network or other error
      toast.error("Network error. Please try again.");
      console.error("Fetch error:", error);
    }
  }
};




  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="departmentName" className="mb-3">
        <Form.Label><strong>Department Name</strong></Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter department name"
          name="departmentName"
          value={formData.departmentName}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="description" className="mb-3">
        <Form.Label><strong>Description</strong></Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter department description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId="departmentHead" className="mb-4">
  <Form.Label><strong>Department Head</strong></Form.Label>
  <Form.Select
    name="departmentHead"
    value={formData.departmentHead}
    onChange={handleChange}
    required
  >
    <option value="">Select Employee</option>
    {employees.map((emp) => (
      <option key={emp.id} value={emp.id}>
        {emp.first_name} {emp.last_name}
      </option>
    ))}
  </Form.Select>
</Form.Group>


      <div className="d-flex justify-content-end">
        <Button variant="secondary" onClick={() => window.location.reload()} className="me-2">
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Create Department
        </Button>
      </div>
    </Form>
  );
}