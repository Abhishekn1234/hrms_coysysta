// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import CandidateRegistration from "./pages/CandidateRegistration";
// import Layout from './layouts/Layout';
// import DashboardPage from './pages/Dashboard/BusinessDashboard';
// import HelpdeskPage from './pages/helpdesk/HelpdeskPage';
// import LogisticPage from './pages/Logistics/LogisticPage';
// import LoginPage from './pages/Login/LoginPage';
// import SecondPage from './pages/Login/SecondPage';

// import DashboardLayout from "./components/Layout/DashboardLayout";
// import FutureBusiness from "./components/Future-business/FutureBusiness";
// import TaxSection from "./components/Tax-Section/TaxSection";
// import FinancialDashboard from "./components/Cash-banks/FinancialDashboard";
// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Route outside Layout */}
//         <Route path="/" element={<LoginPage />} />
//         <Route path="login" element={<SecondPage />} />

//         {/* All other routes wrapped inside Layout */}
//         <Route path="/" element={<Layout />}>
//           <Route path="dashboard" element={<DashboardPage />} />
//           <Route path="helpdesk" element={<HelpdeskPage />} />
//           <Route path="logistics" element={<LogisticPage />} />

//           <Route path="/future-business" element={<DashboardLayout />}>
//             <Route path="future-business-dashboard" element={<FutureBusiness />} />
//             <Route path="tax" element={<TaxSection />} />
//             <Route path="cash-banks" element={<FinancialDashboard />} />
//          </Route>

//           {/*  */}
//            <Route path="/candidate-registration" element={<CandidateRegistration />} />

//         </Route>
        
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import CandidateRegistration from "./pages/CandidateRegistration";
import DashboardPage from './pages/Dashboard/BusinessDashboard';
import HelpdeskPage from './pages/helpdesk/HelpdeskPage';
import LogisticPage from './pages/Logistics/LogisticPage';
import LoginPage from './pages/Login/LoginPage';
import SecondPage from './pages/Login/SecondPage';
import ProfilePage from './components/Profile/ProfilePage';
import Vendordetail from "./components/People/Vendordetail";
// Layouts
import Layout from './layouts/Layout';
import DashboardLayout from "./components/Layout/DashboardLayout";

// Modules (features/components)
import FutureBusiness from "./components/Future-business/FutureBusiness";
import TaxSection from "./components/Tax-Section/TaxSection";
import FinancialDashboard from "./components/Cash-banks/FinancialDashboard";
import CRMMyModule from "./components/crm/MyModule";
import InventoryMyModule from "./components/Inventory-management/MyModule";
import InventoryownMyModule from "./components/Inventory/MyModule";
import ProjectPlanningMyModule from "./components/ProjectPlanning/MyModule";
import QuotationManagementMyModule from "./components/quotation-management/MyModule";
import HRMManagementMyModule from "./components/Hrm/MyModule";
import PeopleManagementMyModule from "./components/People/MyModule";

// Route protection
import PrivateRoute from './PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

// Styles
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Staffdetail from "./components/People/Staffdetail";
import Customerdetail from "./components/People/Customerdetail";
import TaskMyModule from "./components/Task-Manager/MyModule";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<SecondPage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="helpdesk" element={<HelpdeskPage />} />
            <Route path="logistics" element={<LogisticPage />} />
            <Route path="candidate-registration" element={<CandidateRegistration />} />
            <Route path="crm" element={<CRMMyModule />} />
            <Route path="inventory-grouping" element={<InventoryMyModule />} />
            <Route path="inventory-management" element={<InventoryownMyModule />} />
            <Route path="project-planning" element={<ProjectPlanningMyModule />} />
            <Route path="quotation-management" element={<QuotationManagementMyModule />} />
            <Route path="hrm" element={<HRMManagementMyModule />} />
            <Route path="people" element={<PeopleManagementMyModule />} />
            <Route path="admin/people/vendors/:id" element={<Vendordetail />} />
             <Route path="staff/:id" element={<Staffdetail/>}/>
            <Route path="profile" element={<ProfilePage />} />
             <Route path="admin/people/customers/:id" element={<Customerdetail/>}/>
             <Route path="task-manager" element={<TaskMyModule/>}/>
            {/* Nested dashboard layout */}
            <Route path="future-business" element={<DashboardLayout />}>
              <Route path="future-business-dashboard" element={<FutureBusiness />} />
              <Route path="tax" element={<TaxSection />} />
              <Route path="cash-banks" element={<FinancialDashboard />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
