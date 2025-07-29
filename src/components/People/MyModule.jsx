import React, { useEffect,useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import './my.css';
import Dashboard from "./Dashboard";
import StaffTable from "./StaffTable";
import CustomerCards from "./CustomerCards";
import CustomerTable from "./CustomerTable";
import VendorCards from "./VendorCards";
import VendorTable from "./VendorTable";
import Staffdetail from "./Staffdetail";
import Customerdetail from "./Customerdetail";
import Vendordetail from "./Vendordetail";
import PeopleTabs from "./PeopleTabs";
import Navbar from "./Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery"; // Make sure jQuery is installed and imported

function AppRoutes() {
  const [activeTab, setActiveTab] = useState("staff");

  // useEffect(() => {
  //   // Sidebar toggle behavior (optional)
  //   $('.js-navbar-vertical-aside-menu-link')
  //     .off('click')
  //     .on('click', function (e) {
  //       e.preventDefault();
  //       const $li = $(this).closest('li');
  //       const $submenu = $(this).next('.js-navbar-vertical-aside-submenu');
  //       $li.toggleClass('active');
  //       $submenu.slideToggle(200);
  //     });

  //   $('.js-navbar-vertical-aside-toggle-invoker')
  //     .off('click')
  //     .on('click', function (e) {
  //       e.preventDefault();
  //       $('.js-navbar-vertical-aside').toggleClass('collapsed');
  //     });
  // }, []);

  return (
    <div style={{ backgroundColor: "#f8f9fa", padding: "1.5rem" }}>
      {/* Pass activeTab and setter to control tab switching */}
      <PeopleTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Render based on selected tab */}
      {activeTab === "staff" && (
        <>
          <Dashboard />
       
          <StaffTable />
        </>
      )}

      {activeTab === "customers" && (
        <>
          <CustomerCards />
          <CustomerTable />
        </>
      )}

      {activeTab === "vendors" && (
        <>
          <br />
          <VendorCards />
          <VendorTable />
        </>
      )}

      <ToastContainer />
    </div>
  );
}

export default function MyModule() {
  return (

      <AppRoutes />

  );
}
