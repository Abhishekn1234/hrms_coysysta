import React, { useState, useRef } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { FiUserPlus, FiBriefcase } from "react-icons/fi";
import { FaUmbrellaBeach, FaMoneyBillWave } from "react-icons/fa";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Network, Umbrella } from "lucide-react";

import AddEmployeeForm from "./AddEmployeeForm";
import AddDepartmentForm from "./AddDepartmentForm";
import ManageLeaves from "./ManageLeaves";
import ProcessPayroll from "./ProcessPayroll";
import Tables from "./Tables";
import Cards from "./Cards";
import Sidebar from "./Sidebar";
import AddOrganizationForm from "./AddOrganizationForm";
import AddHolidayForm from "./AddHolidayForm";
import AddDesignationForm from "./AddDesignationForm";

export default function AddEmployee() {
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const ICON_SIZE = 32;
  const tableRef = useRef();

  const handleExport = () => {
    const data = tableRef.current?.getExportData();
    if (!data || data.length === 0) {
      alert("No data to export.");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Employees.xlsx");
  };

  const handleCardClick = (id) => {
    if (id === 5) {
      handleExport();
    } else if (id === 4 && selectedEmployees.length === 0) {
      alert("Please select at least one employee to process payroll.");
      return;
    }
    else if (id === 3 && selectedEmployees.length === 0) {
      alert("Please select at least one employee to process leave request.");
      return;
    } else {
      setSelectedId(id);
      setShowModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  const options = [
    { id: 1, title: "Add Employee", icon: <FiUserPlus size={ICON_SIZE} />, bgColor: "#3b5998" },
    { id: 2, title: "Add Department", icon: <FiBriefcase size={ICON_SIZE} />, bgColor: "#007bff" },
    { id: 3, title: "Manage Leaves", icon: <FaUmbrellaBeach size={ICON_SIZE} />, bgColor: "#17a2b8" },
    { id: 4, title: "Process Payroll", icon: <FaMoneyBillWave size={ICON_SIZE} />, bgColor: "#28a745" },
    { id: 5, title: "Export Data", icon: <HiOutlineDocumentArrowDown size={ICON_SIZE} /> },
    { id: 6, title: "Add Organization", icon: <Network size={ICON_SIZE} />, bgColor: "#6f42c1" },
    { id: 7, title: "Add Holiday", icon: <Umbrella size={ICON_SIZE} />, bgColor: "#dc3545" },
    { id: 8, title: "Add Designation", icon: <FiBriefcase size={ICON_SIZE} />, bgColor: "#ffc107" },
  ];

  const renderModalContent = () => {
    switch (selectedId) {
      case 1: return <AddEmployeeForm onClose={handleClose} />;
      case 2: return <AddDepartmentForm onClose={handleClose} />;
      case 3: return <ManageLeaves onClose={handleClose} selectedEmployees={selectedEmployees} />;
      case 4: return <ProcessPayroll onClose={handleClose} selectedEmployees={selectedEmployees} />;
      case 6: return <AddOrganizationForm onClose={handleClose} />;
      case 7: return <AddHolidayForm onClose={handleClose} />;
      case 8: return <AddDesignationForm onClose={handleClose} />;
      default: return null;
    }
  };

  return (
   <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", overflowX: "hidden", backgroundColor: "#e9ecef" }}>
  <ToastContainer position="top-right" autoClose={3000} />

  {/* Option Cards - Full Width */}
 <div style={{ backgroundColor: "#f8f9fa", padding: "20px" }}>
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "12px",
      margin: "0 -6px" // Negative margin to compensate for gap
    }}
  >
    {options.map((item) => (
      <div
        key={item.id}
        style={{
          flex: "0 0 calc(12.5% - 12px)", // 100% / 8 = 12.5%
          minWidth: "120px", // Minimum width for each card
          display: "flex",
          justifyContent: "center",
          padding: "0 6px" // Horizontal padding
        }}
      >
        <div
          onClick={() => handleCardClick(item.id)}
          style={{
            width: "100%",
            height: "120px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            cursor: "pointer",
            transition: "transform 0.3s ease",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <div style={{ color: item.bgColor || "#3b5998", marginBottom: "10px" }}>
            {item.icon}
          </div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>
            {item.title}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


  {/* Sidebar + Cards + Table in a single row */}
  <Row className="g-0" style={{ flex: 1, width: "100%", margin: 0 }}>
    {/* Sidebar */}
    <Col lg={3} style={{  padding: "20px" }}>
      <Sidebar />
       <Cards />
    </Col>

    {/* Cards */}
    
     
    

    {/* Table */}
    <Col lg={9} style={{ backgroundColor: "#f8f9fa", padding: "20px" }}>
      <Tables
        ref={tableRef}
        setSelectedEmployees={setSelectedEmployees}
        selectedEmployees={selectedEmployees}
      />
    </Col>
  </Row>

  {/* Modal remains unchanged */}
  {showModal && selectedId !== 5 && (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1050,
    }}>
      <div style={{
        width: "90%",
        maxWidth: "900px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
        maxHeight: "90vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Modal Header */}
        <div style={{
          backgroundColor: options.find(opt => opt.id === selectedId)?.bgColor || "#3b5998",
          color: "#fff",
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  {selectedId === 4 ? (
    <>
      <FaMoneyBillWave size={20} />
      <span>
        Process Payroll –{" "}
        <strong>
          {selectedEmployees?.first_name} {selectedEmployees?.last_name}
        </strong>
      </span>
    </>
  ) : selectedId === 3 ? (
    <>
      <FaUmbrellaBeach size={20} />
      <span>Manage Leaves –{" "}
         <strong>
          {selectedEmployees?.first_name} {selectedEmployees?.last_name}
        </strong>
      </span>
    </>
  ) : (
    <>
      {options.find(opt => opt.id === selectedId)?.icon}
      <span>{options.find(opt => opt.id === selectedId)?.title}</span>
    </>
  )}
</div>

          <Button
            variant="link"
            onClick={handleClose}
            style={{ color: "white", fontSize: "1.5rem", padding: 0 }}
          >
            &times;
          </Button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
          {renderModalContent()}
        </div>
      </div>
    </div>
  )}
</div>

  );
}
