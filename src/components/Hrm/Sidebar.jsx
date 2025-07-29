import React, { useState, useEffect } from "react";
import { Card, Button,Modal } from "react-bootstrap";
import { FaSitemap, FaProjectDiagram, FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";
import { Tree, TreeNode } from "react-organizational-chart";
import './Sidebar.css';
export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
const [organizationData, setOrganizationData] = useState([]); // All orgs
  const [ceoData, setCeoData] = useState([]); // Global CEO list
    const [loading, setLoading] = useState(true);
    const [showOrgChart, setShowOrgChart] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/v1/admin/organization-data").then((res) => {
      setOrganizationData(res.data.organizations || []);
      setCeoData(res.data.ceos || []);
      setLoading(false);
    });
  }, []);
  const sidebarWidth = isMobile ? "min(80vw, 200px)" : "250px";
  const sidebarLeft = isMobile ? "0px" : "259px";
  const toggleLeft = isMobile
    ? isSidebarOpen
      ? "calc(min(80vw, 200px) + 15px)"
      : "15px"
    : isSidebarOpen
    ? "calc(259px + 250px + 15px)"
    : "calc(259px + 15px)";

  return (
    <>
      <Button
        style={{
          position: "fixed",
          bottom: "15px", // changed from top to bottom
          left: toggleLeft,
          zIndex: 1001,
          backgroundColor: "#1a73e8",
          color: "#fff",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          transition: "left 0.3s ease-in-out, background-color 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1557b0")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1a73e8")}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
      </Button>

      {isSidebarOpen && (
        <Card
          style={{
            position: "fixed",
            top: "0px",
            left: sidebarLeft,
            height: "100vh",
            width: sidebarWidth,
            transform: isSidebarOpen ? "translateX(0)" : `translateX(-${sidebarWidth})`,
            transition: "transform 0.3s ease-in-out",
            zIndex: 1000,
            backgroundColor: "#ffffff",
            boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
            overflowY: "auto",
          }}
        >
          <Card.Body
            style={{
              padding: isMobile ? "15px" : "20px",
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? "10px" : "12px",
            }}
          >
            <Header isMobile={isMobile} />
           <CEO ceoData={ceoData} isMobile={isMobile} />

           <Departments isMobile={isMobile} organizationData={organizationData} />

                        <FullOrgChartButton 
                isMobile={isMobile} 
                onClick={() => setShowOrgChart(true)} 
              />

          </Card.Body>
        </Card>
      )}
      <OrgChartModal 
        show={showOrgChart} 
        onHide={() => setShowOrgChart(false)} 
        ceoData={ceoData}
        organizationData={organizationData}
      />
    </>
  );
}


const OrgChartModal = ({ show, onHide, ceoData, organizationData }) => {
  const ceo = ceoData?.[0];

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="square-modal"
      contentClassName="square-modal-content"
    >
      <Modal.Header closeButton>
      <Modal.Title>
          <span style={{ display: "flex", alignItems: "center" }}>
            <FaSitemap style={{ marginRight: "10px", color: "#1a73e8" }} />
            <span>Organization Chart</span>
          </span>
        </Modal.Title>

      </Modal.Header>

      <Modal.Body style={{ overflowX: "auto", overflowY: "auto", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {ceo && (
            <Tree
              lineWidth={"2px"}
              lineColor={"#ccc"}
              lineBorderRadius={"10px"}
              label={
                <div
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#1a73e8",
                    color: "white",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    textAlign: "center",
                  }}
                >
                  {ceo.name} (CEO)
                </div>
              }
            >
              {organizationData.map((org) => (
                <TreeNode
                  key={org.organization_id}
                  label={
                    <div
                      style={{
                        padding: "8px 12px",
                        backgroundColor:
                          org.organization_name === "Technology"
                            ? "#e8f0fe"
                            : org.organization_name === "Sales & Marketing"
                            ? "#fce8e6"
                            : "#e6f4ea",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {org.organization_name}
                    </div>
                  }
                >
                  {org.users.map((user, index) => (
                    <TreeNode
                      key={index}
                      label={
                        <div
                          style={{
                            padding: "6px 10px",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "4px",
                            fontSize: "0.9rem",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          }}
                        >
                          {user.position}
                        </div>
                      }
                    />
                  ))}
                </TreeNode>
              ))}
            </Tree>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};




const Header = ({ isMobile }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      paddingBottom: "10px",
      borderBottom: "1px solid #e8ecef",
    }}
  >
    <FaSitemap style={{ fontSize: isMobile ? "1.2rem" : "1.4rem", color: "#1a73e8" }} />
    <Card.Title
      style={{
        fontSize: isMobile ? "1rem" : "1.1rem",
        fontWeight: 600,
        color: "#202124",
      }}
    >
      Organization Structure
    </Card.Title>
  </div>
);

const CEO = ({ ceoData, isMobile }) => {
  const ceo = ceoData?.[0];
  console.log(ceo);
  if (!ceo) return null; // Optional fallback

  return (
    <div
      style={{
        fontSize: isMobile ? "0.9rem" : "1rem",
        fontWeight: 500,
        padding: isMobile ? "6px 10px" : "8px 12px",
        backgroundColor: "#f5f6fa",
        borderRadius: "4px",
        color: "#202124",
      }}
    >
      CEO: {ceo.name}
    </div>
  );
};



const Departments = ({ isMobile,organizationData  }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? "6px" : "8px",
    }}
  >
   {organizationData.map((org) => (
  <Department
    key={org.organization_id}
    name={org.organization_name}
    teams={org.users.map(user => user.position)} // Get array of all positions
    isMobile={isMobile}
  />
))}
  </div>
);

const Department = ({ name, teams, isMobile }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <div
        style={{
          padding: isMobile ? "6px 10px" : "8px 12px",
          backgroundColor:
            name === "Technology"
              ? "#e8f0fe"
              : name === "Sales & Marketing"
              ? "#fce8e6"
              : "#e6f4ea",
          borderRadius: "4px",
          fontWeight: 500,
          color: "#202124",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor =
            name === "Technology"
              ? "#d2e3fc"
              : name === "Sales & Marketing"
              ? "#fad2cf"
              : "#d7e8dc")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor =
            name === "Technology"
              ? "#e8f0fe"
              : name === "Sales & Marketing"
              ? "#fce8e6"
              : "#e6f4ea")
        }
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {name} {isExpanded ? "−" : "+"}
      </div>
      {isExpanded && (
        <div
          style={{
            marginLeft: isMobile ? "12px" : "16px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {teams.map((team, index) => (
            <div
              key={index}
              style={{
                padding: isMobile ? "4px 8px" : "6px 10px",
                backgroundColor: "#f8f9fa",
                borderRadius: "3px",
                fontSize: isMobile ? "0.8rem" : "0.85rem",
                color: "#4a4a4a",
              }}
            >
              {team}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FullOrgChartButton = ({ isMobile,onClick }) => (
  <Button
    variant="outline-primary"
    style={{
      marginTop: isMobile ? "10px" : "12px",
      padding: isMobile ? "6px" : "8px",
      fontSize: isMobile ? "0.85rem" : "0.9rem",
      borderColor: "#1a73e8",
      color: "#1a73e8",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.2s, color 0.2s",
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = "#1a73e8";
      e.currentTarget.style.color = "#fff";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.color = "#1a73e8";
    }}
    onClick={onClick}
  >
    <FaProjectDiagram style={{ marginRight: "6px", fontSize: isMobile ? "0.9rem" : "1rem" }} />
    Full Organization Chart
  </Button>
);

