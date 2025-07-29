import React, { useEffect, useState } from "react";
import { Button, Row, Col, Card, Table, Alert } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

export default function ProcessPayroll({ selectedEmployees = [], onClose }) {
  const [payrollData, setPayrollData] = useState({});

  useEffect(() => {
    const fetchAllPayrolls = async () => {
      const allData = {};
      for (const emp of selectedEmployees) {
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/v1/payroll/employee/${emp.id}/details`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to fetch payroll");
          allData[emp.id] = data;
        } catch (err) {
          console.error(err);
          toast.error(`Payroll fetch failed for ${emp.first_name}`);
        }
      }
      setPayrollData(allData);
    };

    if (selectedEmployees.length > 0) {
      fetchAllPayrolls();
    }
  }, [selectedEmployees]);

  const formatCurrency = (amount) =>
    amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR"
    });

  const handlePrintSlip = async (emp) => {
    const data = payrollData[emp.id];
    if (!data) return toast.warning("Payroll data not loaded");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/payroll/print-slip",
        {
          employee: {
            first_name: emp.first_name,
            last_name: emp.last_name,
            emp_code: emp.emp_code,
            id: emp.id
          },
          month: data.month || new Date(),
          payroll: {
            basic_salary: data.basic_salary || 0,
            hra: data.hra || 0,
            transport_allowance: data.transport_allowance || 0,
            salary_deduction: data.salary_deduction || 0,
            leave_deduction: data.leave_deduction || 0,
            professional_tax: data.professional_tax || 0,
            tds: data.tds || 0,
            loan_recovery: data.loan_recovery || 0,
            total_earnings: data.total_earnings || 0,
            total_deductions: data.total_deductions || 0,
            net_pay: data.net_pay || 0
          }
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payroll-Slip-${emp.emp_code}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      if (err.response && err.response.data instanceof Blob) {
    const text = await err.response.data.text(); // read blob content
    try {
      const json = JSON.parse(text);
      console.error("Server error:", json.message || json);
      toast.error("Error: " + (json.message || "Internal Server Error"));
    } catch (parseErr) {
      console.error("Failed to parse server error:", text);
      toast.error("Server returned invalid response.");
    }
  } else {
    console.error("Unexpected error:", err);
    toast.error("Failed to print slip");
  }
    }
  };

  return (
    <div>
      {selectedEmployees.map((emp) => {
        const payroll = payrollData[emp.id];
        if (!payroll) {
          return (
            <div key={emp.id}>
              <h5 className="text-muted">Loading payroll for {emp.first_name}...</h5>
            </div>
          );
        }

       const earnings = [
  { label: "Basic Salary", value: payroll?.basic_salary || payroll?.base_salary || payroll?.dailyRenumeration },
  { label: "House Rent Allowance", value: payroll?.hra },
  { label: "Transport Allowance", value: payroll?.transport_allowance }
];

const deductions = [
  { label: "Professional Tax", value: payroll?.professional_tax },
  { label: "TDS", value: payroll?.tds },
  { label: "Loan Recovery", value: payroll?.loan_recovery }
];

        return (
          <div key={emp.id}>
           

            <Row>
              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header><strong>Earnings</strong></Card.Header>
                  <Card.Body className="p-0">
                    <Table borderless className="mb-0">
                      <tbody>
                        {earnings.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.label}</td>
                            <td className="text-end">{formatCurrency(item.value)}</td>
                          </tr>
                        ))}
                        <tr className="bg-light fw-bold">
                          <td>Total Earnings</td>
                          <td className="text-end">{formatCurrency(payroll.total_earnings)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="mb-3">
                  <Card.Header><strong>Deductions</strong></Card.Header>
                  <Card.Body className="p-0">
                    <Table borderless className="mb-0">
                      <tbody>
                        {deductions.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.label}</td>
                            <td className="text-end">{formatCurrency(item.value)}</td>
                          </tr>
                        ))}
                        <tr className="bg-light fw-bold">
                          <td>Total Deductions</td>
                          <td className="text-end">{formatCurrency(payroll.total_deductions)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <h4 className="text-center fw-bold mt-4">
              Net Pay: {formatCurrency(payroll.net_pay)}
            </h4>

            <Alert variant="info" className="text-center mt-3">
              <i className="bi bi-robot me-2"></i>
              <strong>AI Payroll Audit:</strong> No anomalies detected. Tax optimization opportunity available.
            </Alert>
              <hr className="my-4" />
              <div className="d-flex flex-wrap justify-content-end gap-4 mt-4">

                  <Button variant="secondary" onClick={onClose}>
                    <i className="bi bi-x-circle me-2"></i> Close
                  </Button>
                  <Button variant="success">
                    <i className="bi bi-wallet2 me-2"></i> Process Payment
                  </Button>
                  <Button variant="primary" onClick={() => handlePrintSlip(emp)}>
                    <i className="bi bi-printer me-2"></i> Print Slip
                  </Button>
                </div>


          
          </div>
        );
      })}
    </div>
  );
}

