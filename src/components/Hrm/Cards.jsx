import React, { useEffect, useState } from "react";
import { Card, ProgressBar, Spinner } from "react-bootstrap";

export default function Cards() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartmentData();
  }, []);

 const fetchDepartmentData = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/v1/department-distribution");
    const data = await res.json();

    const formatted = data.map((dept) => ({
  name: dept.department_name, // use the correct key
  value: dept.percentage,
  count: dept.count,
  variant: getVariant(dept.department_name),
}));


    setDepartments(formatted);
  } catch (err) {
    console.error("Failed to load department data:", err);
  } finally {
    setLoading(false);
  }
};


  // Assign colors based on department
  const getVariant = (name) => {
  const variants = {
    Technology: "info",
    "Sales & Marketing": "warning",
    Operations: "success",
    "Human Resources": "secondary",
    "Finance": "dark",
    "Customer Support": "danger",
    "Product": "primary",
    "Design": "primary",
    "Legal": "dark",
    "Administration": "light",
    "IT Support": "info",
    "QA": "success",
    "Business Development": "warning",
    "Marketing": "warning",
    "Engineering": "info",
    "Data Science": "primary",
    "Procurement": "dark",
    "Other": "secondary"
  };

  return variants[name] || "primary";
};


  return (
    <Card style={{ width: "100%", maxWidth: "500px", margin: "20px auto" }} className="shadow">
      <Card.Header style={{ backgroundColor:"white", fontWeight: "bold", fontSize: "16px" }}>
        Department Distribution
      </Card.Header>
      <Card.Body style={{backgroundColor:"#f8f9fa"}}>
       
                  {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : (
            departments.map((dept, index) => (
              <div key={index} className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <strong>{dept.name}</strong>
                  <span>{dept.value}%</span>
                </div>
                <ProgressBar
                  now={parseFloat(dept.value)}
                  variant={dept.variant}
                  animated
                  style={{ height: "10px", borderRadius: "6px" }}
                />
              </div>
            ))
          )}

      
      </Card.Body>
    </Card>
  );
}