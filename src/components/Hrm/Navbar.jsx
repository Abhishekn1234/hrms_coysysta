import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaUsersCog } from "react-icons/fa";

export default function HRDashboardHeader() {
  
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        background: "linear-gradient(135deg, #2c7be5 0%, #0066cc 100%)",
        color: "white",
        padding: "14px 0",
        boxSizing: "border-box",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        zIndex: 100
      }}
    >
      <Container>
        <Row className="align-items-center">
          {/* Left Side - Dashboard Title */}
          <Col xs={7} md={8}>
            <div style={{ 
              display: "flex", 
              alignItems: "center",
              gap: "12px"
            }}>
              <div style={{
                background: "rgba(255, 255, 255, 0.15)",
                borderRadius: "10px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
              }}>
                <FaUsersCog style={{ fontSize: "28px", color: "white" }} />
              </div>
              <div>
                <h4 style={{ 
                  margin: 0, 
                  fontWeight: "700",
                  fontSize: "20px",
                  color: "white",
                  textShadow: "0 1px 2px rgba(0,0,0,0.2)"
                }}>
                  HR Management Dashboard
                </h4>
                <p style={{ 
                  margin: "4px 0 0", 
                  fontSize: "13px",
                  opacity: 0.9,
                  lineHeight: "1.3",
                  fontWeight: 300
                }}>
                  Manage your workforce efficiently
                </p>
              </div>
            </div>
          </Col>

          {/* Right Side - User Profile */}
          <Col xs={5} md={4}>
            <div style={{ 
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "10px",
              paddingRight: "10px"
            }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ 
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  justifyContent: "flex-end"
                }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ffffff 0%, #e6f0ff 100%)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#2c7be5",
                      fontWeight: "bold",
                      fontSize: "14px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
                    }}
                  >
                    AN
                  </div>
                  <div style={{ 
                    fontWeight: "600", 
                    fontSize: "15px",
                    textShadow: "0 1px 1px rgba(0,0,0,0.1)"
                  }}>
                    Abhishek N
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    marginTop: "2px",
                    opacity: 0.9,
                    fontWeight: 400
                  }}
                >
                  HR Manager
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}