import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Users, PackageCheck, CheckCircle2 } from "lucide-react";
import axios from "axios";

export default function VendorCards() {
  const [counts, setCounts] = useState({
    total: 0,
    material: 0,
    service: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/vendor-count");
        setCounts({
          total: response.data?.total || 0,
          material: response.data?.material || 0,
          service: response.data?.service || 0,
        });
      } catch (error) {
        console.error("Error fetching vendor counts:", error);
        setError("Failed to load vendor data");
      }
    }

    fetchCounts();
  }, []);

  const cards = [
    {
      title: "Total Vendors",
      value: counts.total,
      icon: <Users size={22} color="#3b82f6" />,
      bg: "#eff6ff", // blue-100
    },
    {
      title: "Material",
      value: counts.material,
      icon: <PackageCheck size={22} color="#10b981" />,
      bg: "#ecfdf5", // green-100
    },
    {
      title: "Service",
      value: counts.service,
      icon: <CheckCircle2 size={22} color="#a855f7" />,
      bg: "#f5f3ff", // purple-100
    },
  ];

  const cardStyle = {
    borderRadius: "12px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
    padding: "24px",
    border: "none",
    backgroundColor: "#ffffff",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    minHeight: "120px",
  };

  const iconCircleStyle = (bg) => ({
    backgroundColor: bg || "#f1f5f9", // Fallback background
    borderRadius: "50%",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "20px",
    width: "50px",
    height: "50px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  });

  const valueTextStyle = {
    margin: 0,
    fontWeight: 700,
    color: "#111827",
    fontSize: "24px",
    lineHeight: "1.3",
    letterSpacing: "-0.025em",
  };

  const labelTextStyle = {
    margin: 0,
    color: "#4b5563",
    fontSize: "15px",
    fontWeight: 500,
    marginTop: "4px",
  };

  return (
    <>
      {error && <div style={{ color: "#dc2626", padding: "16px", textAlign: "center" }}>{error}</div>}
      <style>
        {`
          .vendor-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.08);
          }
        `}
      </style>
      <div className="mb-4" style={{ backgroundColor: "#f9fafb", padding: "8px" }}>
        <Row className="g-4">
          {cards.map((card, index) => (
            <Col md={3} key={index} style={{ minWidth: "240px" }}>
              <Card className="vendor-card" style={cardStyle}>
                <div className="d-flex align-items-center">
                  <div style={iconCircleStyle(card.bg)}>{card.icon}</div>
                  <div>
                    <h5 style={valueTextStyle}>{card.value}</h5>
                    <div style={labelTextStyle}>{card.title}</div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}