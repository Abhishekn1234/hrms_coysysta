import React from "react";
import { Button } from "react-bootstrap";

export default function ProcessPayroll() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "30px",
       
      }}
    >
      {/* Header */}
      <h1
        style={{
          fontWeight: "600",
          marginBottom: "30px",
          fontSize: "28px",
          color: "#333",
    
        }}
      >
        Payroll Details - John Doe (EMP001) - May 2024
      </h1>

      {/* Earnings and Deductions */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        {/* Earnings Card */}
        <div
          style={{
            flex: 1,
            minWidth: "300px",
            padding: "20px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              backgroundColor: "#f1f1f1",
              padding: "10px 15px",
              borderRadius: "6px",
              marginBottom: "15px",
            }}
          >
            <h2
              style={{
                color: "#000",
                fontSize: "20px",
                margin: 0,
              }}
            >
              Earnings
            </h2>
          </div>
          <hr/>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={cellStyle}>Basic Salary</td>
                <td style={valueStyle}>₹45,000.00</td>
              </tr>
              <tr>
                <td style={cellStyle}>House Rent Allowance</td>
                <td style={valueStyle}>₹5,000.00</td>
              </tr>
              <tr>
                <td style={cellStyle}>Transport Allowance</td>
                <td style={valueStyle}>₹2,000.00</td>
              </tr>
              <tr style={{ backgroundColor: "#e9f7ef" }}>
                <td style={totalLabelStyle}>Total Earnings</td>
                <td style={totalValueStyle}>₹52,000.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deductions Card */}
        <div
          style={{
            flex: 1,
            minWidth: "300px",
            padding: "20px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              backgroundColor: "#f1f1f1",
              padding: "10px 15px",
              borderRadius: "6px",
              marginBottom: "15px",
            }}
          >
            <h2
              style={{
                color: "#000",
                fontSize: "20px",
                margin: 0,
              }}
            >
              Deductions
            </h2>
          </div>
          <hr/>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={cellStyle}>Professional Tax</td>
                <td style={valueStyle}>₹2,500.00</td>
              </tr>
              <tr>
                <td style={cellStyle}>TDS</td>
                <td style={valueStyle}>₹1,200.00</td>
              </tr>
              <tr>
                <td style={cellStyle}>Loan Recovery</td>
                <td style={valueStyle}>₹800.00</td>
              </tr>
              <tr style={{ backgroundColor: "#e9f7ef" }}>
                <td style={totalLabelStyle}>Total Deductions</td>
                <td style={totalValueStyle}>₹4,500.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Net Pay */}
      <div
        style={{
          marginBottom: "30px",
          padding: "15px 0",
          textAlign: "center",
          
          borderRadius: "8px",
        }}
      >
        <h2
          style={{
            margin: "0",
            fontSize: "24px",
            fontWeight: "600",
            color: "#2d572c",
          }}
        >
          Net Pay: ₹47,500.00
        </h2>
      </div>

      <hr />

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "15px",
          paddingTop: "20px",
        }}
      >
        <Button variant="outline-secondary" style={{ padding: "8px 20px" }}>
          Close
        </Button>
        <Button variant="outline-primary" style={{ padding: "8px 20px" }}>
          Print Slip
        </Button>
        <Button variant="primary" style={{ padding: "8px 20px" }}>
          Process Payment
        </Button>
      </div>
    </div>
  );
}

// Reusable inline styles
const cellStyle = {
  padding: "8px 0",
  borderBottom: "1px solid #eee",
  color: "#555",
};

const valueStyle = {
  padding: "8px 0",
  borderBottom: "1px solid #eee",
  textAlign: "right",
  color: "#222",
};

const totalLabelStyle = {
  padding: "12px 0",
  fontWeight: "600",
  color: "#000",
};

const totalValueStyle = {
  padding: "12px 0",
  fontWeight: "600",
  textAlign: "right",
  color: "#000",
};
