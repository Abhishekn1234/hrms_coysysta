import axios from "axios";
import React from "react";
import { Modal, Button, Table, Badge, Alert } from "react-bootstrap";

const AttendanceHistory = ({ show, onClose, data }) => {
  const handleExportPDF = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/v1/users/export-attendance",
        { records: data },
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance-history.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("PDF export failed:", err.response?.data || err.message);
    }
  };

  return (
   <div style={{
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: show ? "flex" : "none",
  justifyContent: "center",
  alignItems: "center",
  zIndex: "1050"
}}>
  <div style={{
    backgroundColor: "white",
    borderRadius: "0.3rem",
    width: "80%",
    maxWidth: "900px",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.15)"
  }}>
    {/* Header */}
    <div style={{
      backgroundColor: "#007bff",
      color: "#fff",
      borderBottom: "1px solid #0056b3",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px",
      borderTopLeftRadius: "calc(0.3rem - 1px)",
      borderTopRightRadius: "calc(0.3rem - 1px)"
    }}>
      <div style={{
        color: "#fff",
        fontWeight: "600",
        fontSize: "18px",
        textAlign: "center",
        width: "100%"
      }}>
        Attendance History - {data.length > 0 ? data[0].user_name : "N/A"}
      </div>
      <button type="button" onClick={onClose} style={{
        background: "transparent",
        border: "none",
        color: "#fff",
        fontSize: "1.5rem",
        fontWeight: "700",
        lineHeight: "1",
        cursor: "pointer"
      }}>
        ×
      </button>
    </div>

    {/* Body */}
    <div style={{
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflowY: "auto"
    }}>
      <div style={{ 
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <div style={{ 
          width: "100%", 
          overflowX: "auto",
          display: "flex",
          justifyContent: "center"
        }}>
          <table style={{ 
            fontSize: "14px",
            margin: "0 auto",
            width: "auto",
            minWidth: "70%",
            borderCollapse: "collapse",
            borderSpacing: "0"
          }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #dee2e6" }}>
                <th style={{ textAlign: "center", padding: "12px", border: "1px solid #dee2e6" }}>Date</th>
                <th style={{ textAlign: "center", padding: "12px", border: "1px solid #dee2e6" }}>Check-In</th>
                <th style={{ textAlign: "center", padding: "12px", border: "1px solid #dee2e6" }}>Check-Out</th>
                <th style={{ textAlign: "center", padding: "12px", border: "1px solid #dee2e6" }}>Total Hours</th>
                <th style={{ textAlign: "center", padding: "12px", border: "1px solid #dee2e6" }}>Working Hours</th>
                <th style={{ textAlign: "center", padding: "12px", border: "1px solid #dee2e6" }}>Daily %</th>
                <th style={{ textAlign: "center", padding: "12px", border: "1px solid #dee2e6" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#f8f9fa" : "white" }}>
                  <td style={{ textAlign: "center", padding: "12px", border: "1px solid #dee2e6" }}>{record.date}</td>
                  <td style={{ textAlign: "center", padding: "12px", border: "1px solid #dee2e6" }}>{record.check_in || "--"}</td>
                  <td style={{ textAlign: "center", padding: "12px", border: "1px solid #dee2e6" }}>{record.check_out || "--"}</td>
                  <td style={{ textAlign: "center", padding: "12px", border: "1px solid #dee2e6" }}>{record.total_hours >= 0 ? record.total_hours : "0"}</td>
                  <td style={{ textAlign: "center", padding: "12px", border: "1px solid #dee2e6" }}>{record.working_hours || "0"}</td>
                  <td style={{ textAlign: "center", padding: "12px", border: "1px solid #dee2e6" }}>{record.daily_percentage || "0%"}</td>
                  <td style={{ textAlign: "center", padding: "12px", border: "1px solid #dee2e6" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "0.35em 0.65em",
                      fontSize: "0.75em",
                      fontWeight: "700",
                      lineHeight: "1",
                      color: "#fff",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      verticalAlign: "baseline",
                      borderRadius: "0.25rem",
                      backgroundColor: record.status === "Present"
                        ? "#28a745"
                        : record.status === "Late"
                        ? "#ffc107"
                        : "#dc3545"
                    }}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          fontSize: "13px",
          marginTop: "20px",
          textAlign: "center",
          width: "90%",
          maxWidth: "800px",
          padding: "15px",
          backgroundColor: "#d1ecf1",
          borderColor: "#bee5eb",
          color: "#0c5460",
          borderRadius: "0.25rem",
          border: "1px solid transparent"
        }}>
          🤖 <strong>AI Analysis:</strong> Employee shows good attendance pattern with occasional late arrivals on Wednesdays.
        </div>
      </div>
    </div>

    {/* Footer */}
    <div style={{
      display: "flex",
      justifyContent: "center",
      padding: "15px",
      borderTop: "1px solid #dee2e6",
      borderBottomRightRadius: "calc(0.3rem - 1px)",
      borderBottomLeftRadius: "calc(0.3rem - 1px)"
    }}>
      <button onClick={onClose} style={{
        marginRight: "10px",
        color: "#fff",
        backgroundColor: "#6c757d",
        borderColor: "#6c757d",
        padding: "5px 10px",
        borderRadius: "0.25rem",
        border: "1px solid transparent",
        cursor: "pointer",
        transition: "background-color 0.15s ease-in-out"
      }}>
        Close
      </button>
      <button onClick={handleExportPDF} style={{
        color: "#fff",
        backgroundColor: "#007bff",
        borderColor: "#007bff",
        padding: "5px 10px",
        borderRadius: "0.25rem",
        border: "1px solid transparent",
        cursor: "pointer",
        transition: "background-color 0.15s ease-in-out"
      }}>
        Export Data
      </button>
    </div>
  </div>
</div>
  );
};

export default AttendanceHistory;