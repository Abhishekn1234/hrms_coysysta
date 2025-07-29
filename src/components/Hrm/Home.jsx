import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import AddEmployee from "./AddEmployee";
import HRDashboardHeader from "./Navbar";
import Sidebar from "./Sidebar";
import Tables from "./Tables";
import Cards from "./Cards";
import axios from "axios";

export default function Home() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/v1/dashboard/employee-metrics")
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error("Failed to fetch employee stats", err);
      });
  }, []);

  const cardData = stats
    ? [
        {
          id: 1,
          title: "Total Employees",
          count: stats.total_users,
          growth:
            stats.user_growth >= 0
              ? `+${stats.user_growth} this month`
              : `${stats.user_growth} decline`,
          countColor: "#2c7be5",
        },
        {
          id: 2,
          title: "Active Employees",
          count: stats.active_users,
          growth: `${stats.active_users} active (${Math.round(
            (stats.active_users / stats.total_users) * 100
          )}%)`,
          countColor: "#00d97e",
        },
        {
          id: 3,
          title: "On Leave",
          count: stats.total_leaves_this_month,
          growth: `${stats.users_returning_this_week} returning this week`,
          countColor: "#f6c343",
        },
        {
          id: 4,
          title: "Open Positions",
          count: stats.available_positions,
          growth: `${stats.open_positions} urgent hires`,
          countColor: "#e63757",
        },
      ]
    : [];

  return (
    <>
      <HRDashboardHeader />

      {/* Metrics Cards */}
      <div
        style={{
          padding: "20px 30px",
          backgroundColor: "#f5f7fb",
        }}
      >
        <Container fluid>
          <Row className="g-3">
            {cardData.map((item) => (
              <Col
                key={item.id}
                xs={12}
                sm={6}
                md={3}
                lg={3}
                style={{ minWidth: "200px" }}
              >
                <Card
                  style={{
                    borderRadius: "12px",
                    height: "130px",
                    width: "100%",
                    boxShadow:
                      "0 3px 6px rgba(50, 50, 93, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)",
                    border: "1px solid #e3e6ef",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#fff",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      padding: "10px 14px",
                      borderBottom: "1px solid #f1f1f1",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <Card.Title
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#3b3f5c",
                        marginBottom: 0,
                      }}
                    >
                      {item.title}
                    </Card.Title>
                  </div>

                  {/* Body */}
                  <div
                    style={{
                      flex: 1,
                      padding: "12px 14px",
                      backgroundColor: "#f9fafc",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: item.countColor,
                      }}
                    >
                      {item.count}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: "500",
                        color: "#a1aab7",
                      }}
                    >
                      {item.growth}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Main Content Area */}
      <AddEmployee />
      
    </>
  );
}
