import React, { useState, useEffect,useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ViewPayslipModal from './ViewPayslipModal';
import {
  Tabs,
  Tab,
  Card,
  Row,
  Col,
  Modal,
  Form,
  Button,
  Accordion,
  useAccordionButton,
  AccordionContext
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import './g.css';
import {
  FaEdit,
  FaTrash,
  FaUser,
  FaIdBadge,
  FaFileAlt,
  FaMoneyBillAlt,
  FaMoneyBillWave,
  FaUmbrellaBeach,
  FaCalendarCheck,
  FaFileInvoice,
  FaUsers,
  FaUserFriends,
  FaUserTie,
  FaPhone,
  FaDollarSign,
  FaCertificate,
  FaBuilding,
  FaTasks,
  FaStore,
  FaDownload,
  FaArrowLeft,
  FaPlane,FaUpload
} from 'react-icons/fa';

import { BsChevronRight, BsChevronDown } from 'react-icons/bs';
import axios from 'axios';
// Custom components
import Dashboard from './Dashboard';
import StaffTable from './StaffTable';
import CustomerCards from './CustomerCards';
import CustomerTable from './CustomerTable';
import VendorCards from './VendorCards';
import VendorTable from './VendorTable';
import PeopleTabs from './PeopleTabs';
import StaffDetails from './StaffDetails';
import ContactForm from './ContactForm';
import FinancialHR from './FinancialHr';
import Skills from './Skills';
import CustomerProfileForm from './CustomerProfileForm';
import { Download } from 'lucide-react';

function CustomAccordionToggle({ children, eventKey, icon }) {
  const { activeEventKey } = useContext(AccordionContext);
  const decoratedOnClick = useAccordionButton(eventKey);

  // Check if eventKey is currently active (for alwaysOpen mode)
  const isOpen = Array.isArray(activeEventKey)
    ? activeEventKey.includes(eventKey)
    : activeEventKey === eventKey;
 
  return (
    <div
      onClick={decoratedOnClick}
      className="d-flex justify-content-between align-items-center p-3 mb-2"
      style={{
        backgroundColor: "#f8f9fc",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: 500,
        transition: "background 0.2s",
      }}
    >
      <div className="d-flex align-items-center text-dark">
        <span className="me-2 text-primary">{icon}</span>
        {children}
      </div>

      {/* Show ↓ when open, → when closed */}
      {isOpen ? (
        <BsChevronDown className="accordion-chevron" />
      ) : (
        <BsChevronRight className="accordion-chevron" />
      )}
    </div>
  );
}
export default function Staffdetail() {
 const [loginEnabled, setLoginEnabled] = useState(false);
const [organization, setOrganization] = useState('');
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');

  const [contactPersons, setContactPersons] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [gstDetails, setGstDetails] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tabKey, setTabKey] = useState('general');
  const [peopleTabKey, setPeopleTabKey] = useState(null);
  const [activeKey, setActiveKey] = useState('0');
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
const [attendanceStatus, setAttendanceStatus] = useState('');
const [attendanceHistory, setAttendanceHistory] = useState([]);
const [loadingHistory, setLoadingHistory] = useState(false);
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

const [leaveForm, setLeaveForm] = useState({
  employee_id: '', // filled from staff.id
  leave_type: '',
  from_date: '',
  to_date: '',
  reason: '',
  is_emergency: false,
  status: 'PENDING',
});
const [activeAccordion, setActiveAccordion] = useState(null);
  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

 const [tasks, setTasks] = useState([]);
const [leaves, setLeaves] = useState([]);

useEffect(() => {
  if (id) {
    axios
      .get(`127.0.0.1:8000/api/v1/leave/leave/${id}`)
      .then((res) => {
        setLeaves([res.data]); // wrap in array to match list usage
      })
      .catch((err) => console.error('Failed to fetch leaves:', err));
  }
}, [id]);

const handleLeaveSubmit = async () => {
  try {
    const payload = {
      ...leaveForm,
      employee_id: staff?.id || id, // Ensure it's filled
      is_emergency: leaveForm.is_emergency ? 1 : 0,
      status: 'PENDING',
    };

    const res = await axios.post('http://127.0.0.1:8000/api/v1/leave/apply', payload);

    toast.success("✅ Leave requested successfully");
    setShowLeaveModal(false);
    setLeaveForm({
      employee_id: '',
      leave_type: '',
      from_date: '',
      to_date: '',
      reason: '',
      is_emergency: false,
      status: 'PENDING',
    });
  } catch (err) {
    console.error(err);
    toast.error("❌ Failed to submit leave request");
  }
};

 useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/v1/customers/${id}/tasks`);
        setTasks(res.data.tasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [id]);
  const handleAddContact = () => {
    setContactPersons([
      ...contactPersons,
      {
        name: '',
        designation: '',
        workEmail: '',
        workPhone: '',
        personalEmail: '',
        personalPhone: '',
      },
    ]);
  };
  const userTasks = tasks.filter(task => String(task.user_id) === String(id));
  const handleAddClicks = () => {
    setShowForm(true);
  };

  const handleAddGst = () => {
    setGstDetails([...gstDetails, { gstNo: '', placeOfSupply: '' }]);
  };

  const handleRemoveGst = (index) => {
    const newGstDetails = [...gstDetails];
    newGstDetails.splice(index, 1);
    setGstDetails(newGstDetails);
  };
const headerStyle = {
  padding: '0.75rem',
  textAlign: 'left',
  borderBottom: '1px solid #dee2e6',
  fontWeight: '500'
};

const cellStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #dee2e6',
  verticalAlign: 'middle'
};

  const handleGstInputChange = (index, field, value) => {
    const newGstDetails = [...gstDetails];
    newGstDetails[index][field] = value;
    setGstDetails(newGstDetails);
  };
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [formData, setFormData] = useState({
    user_id: '',
    task_name: '',
    task_description: '',
    deadline: '',
    project_value: '',
    project_status: '',
  });

 const handleClick = (label) => {
  setModalAction(label);

  // Reset form data to default empty strings before opening the modal
  setFormData({
    user_id: staff?.id || '',  // auto-assign if needed
    task_name: '',
    task_description: '',
    deadline: '',
    project_value: '',
    project_status: '',
  });

  setShowModal(true);
};


  const handleChanges = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleSubmit = async () => {
  try {
    if (!id) {
      toast.error("❌ Cannot find user ID.");
      return;
    }

    const payload = {
      ...formData,
      user_id: id, // ✅ Ensure user_id is set
    };

    const response = await axios.post(
      `http://127.0.0.1:8000/api/v1/customers/${id}/assign-task`,
      payload
    );

    toast.success("✅ Task assigned successfully");

    // ✅ Reset the form fields
    setFormData({
      user_id: '',
      task_name: '',
      task_description: '',
      deadline: '',
      project_value: '',
      project_status: '',
    });

    setShowModal(false);
  } catch (error) {
    console.error(error);
    toast.error("❌ Failed to assign task");
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Present": return "success";
    case "Absent": return "danger";
    case "Late": return "warning";
    default: return "secondary";
  }
};
const handleSubmitAttendance = async () => {
  if (!attendanceStatus) return toast.error("Please select an attendance status");

  try {
    await axios.post(`http://127.0.0.1:8000/api/v1/users/${id}/attendance`, { status: attendanceStatus.toLowerCase() });
    toast.success("✅ Attendance marked!");
    setShowAttendanceModal(false);
  } catch (err) {
    console.error(err);
    toast.error("❌ Failed to mark attendance");
  }
};



  const generateDocuments = (staffData) => {
    const docs = [
      { name: 'CV', uploaded: !!staffData.resume, link: staffData.resume || '#' },
      { name: 'Photo', uploaded: !!staffData.photo, link: staffData.photo || '#' },
      { name: 'Passport Photo', uploaded: !!staffData.passport_size_photo, link: staffData.passport_size_photo || '#' },
      { name: 'Aadhar (Front)', uploaded: !!staffData.aadhar_front, link: staffData.aadhar_front || '#' },
      { name: 'Aadhar (Back)', uploaded: !!staffData.aadhar_back, link: staffData.aadhar_back || '#' },
      { name: 'PAN Card', uploaded: !!staffData.pan_card, link: staffData.pan_card || '#' },
      { name: 'Driving License (F)', uploaded: !!staffData.driving_license_front, link: staffData.driving_license_front || '#' },
      { name: 'Driving License (B)', uploaded: !!staffData.driving_license_back, link: staffData.driving_license_back || '#' },
      { name: 'Passport (F)', uploaded: !!staffData.passport_front, link: staffData.passport_front || '#' },
      { name: 'Passport (B)', uploaded: !!staffData.passport_back, link: staffData.passport_back || '#' },
      { name: 'Employee Contract', uploaded: !!staffData.employment_contract, link: staffData.employment_contract || '#' },
      { name: 'ESI Document', uploaded: !!staffData.esi_document, link: staffData.esi_document || '#' },
      { name: 'PF Document', uploaded: !!staffData.pf_document, link: staffData.pf_document || '#' },
    ];
    setDocuments(docs);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  setStaff((prev) => ({ ...prev, bank_document_file: file.name, bank_document: file }));
};


const [selectedSkills, setSelectedSkills] = useState([]);
const [showPayslipModal, setShowPayslipModal] = useState(false);

// On icon click
const handlePayslipView = () => setShowPayslipModal(true);
const populateLoginFields = (staffData) => {
  setLoginEnabled(!!staffData?.isLogin);
  setOrganization(staffData?.organization || '');
  setUsername(staffData?.email || ''); // assuming username = email
  setPassword(''); // keep blank for security (you usually don't fetch password)
};

 useEffect(() => {
  if (state?.staff) {
    setStaff(state.staff);
    populateLoginFields(state.staff);
    generateDocuments(state.staff);
    setLoading(false);
  } else {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/v1/staff/${id}`);
        setStaff(res.data);
        console.log(res.data);
        populateLoginFields(res.data);
        generateDocuments(res.data);
      } catch (error) {
        console.error('Failed to fetch staff:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }
}, [id, state]);
const getCurrentMonthYear = () => {
  const now = new Date();
  return now.toLocaleString('default', { month: 'long', year: 'numeric' }); // e.g. "July 2025"
};
const currentMonthPayslip = staff && {
  month: getCurrentMonthYear(),
  gross_salary: staff.salary || 0,
  deductions: parseFloat(staff.daily_remuneration || 0),
  net_salary: staff.net_salary || 0,
};


  useEffect(() => {
    if (peopleTabKey === 'staff') {
      navigate('/admin/people');
    } else if (peopleTabKey === 'customers') {
      navigate('/customer');
    } else if (peopleTabKey === 'vendors') {
      navigate('/vendor');
    }
  }, [peopleTabKey, navigate]);
const handleUpdateStaff = async () => {
  try {
    const response = await axios.put(
      `http://127.0.0.1:8000/api/v1/staff/${staff.id}`,
      staff
    );
    toast.success("✅ Staff updated successfully!");
    setShowEditModal(false);
  } catch (error) {
    console.error("Failed to update staff:", error.response?.data || error.message);
    toast.error("❌ Failed to update staff. Please check your input.");
  }
};
const handleDownload = (leave, staffName, idx) => {
  const data = [
    {
      'Employee': staffName,
      'Leave Type': leave.leave_type,
      'From Date': leave.from_date,
      'To Date': leave.to_date,
      'Reason': leave.reason || '—',
      'Emergency': leave.is_emergency ? 'Yes' : 'No',
      'Status': leave.status
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leave');

  const fileName = `Leave-${staffName.replace(/\s+/g, '_')}-${idx + 1}.xlsx`;
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, fileName);
};

  // Loading or error state UI
  if (loading) return <p>Loading...</p>;
  if (!staff) return <p className="text-danger">Staff not found</p>;
  if (!documents.length) return <div>Loading documents...</div>;
 const handleDownloadPayslip = (slip) => {
  console.log(`Downloading payslip for ${slip.month}`);

  // Ensure `staff` object is available in this scope
  if (!staff) {
    console.error('Staff data not available');
    return;
  }

  // Prepare data for XLSX
  const data = [
    { Field: 'Employee Name', Value: staff.name },
    { Field: 'Month', Value: slip.month },
    { Field: 'Amount', Value: staff.daily_renumeration || staff.gross_salary ||0 },
    { Field: 'Department', Value: staff.department || staff.designation },
    { Field: 'Date Generated', Value: new Date().toLocaleDateString() }
  ];

  // Convert to worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Payslip');

  // Create blob and download
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  const fileName = `Payslip_${slip.month}_${staff.name.replace(/\s+/g, '_')}.xlsx`;
  saveAs(blob, fileName);
};

const handleDeleteStaff = async () => {
  if (!staff?.id) {
    toast.error("Invalid staff ID");
    return;
  }

  const confirmDelete = window.confirm("Are you sure you want to delete this staff?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://127.0.0.1:8000/api/v1/staff/${staff.id}`);
    toast.success("Staff deleted successfully");
    navigate(-1);
  } catch (error) {
    console.error("Delete failed:", error);
    toast.error("Failed to delete staff");
  }
};
  return (
    <>
    <div className="p-4 bg-light">
      {/* Tabs for People Type */}
  

      
                

    
    
      <>
      <div className="p-4 bg-white rounded shadow-sm mb-4">
  {/* Header with Back & Action Buttons */}
  <div className="d-flex align-items-center mb-3">
    <div className="mb-3">
    <span
      className="text-primary d-inline-flex align-items-center"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(-1)}
    >
      <FaArrowLeft className="me-2" />
      <strong>Back to Staffs</strong>
    </span>
  </div>
    <div className="d-flex gap-2 ms-auto">
      <button
        className="btn btn-outline-secondary d-flex align-items-center"
        onClick={() => setShowEditModal(true)}
      >
        <FaEdit className="me-1" />
        Edit
      </button>
     <button
  className="btn btn-outline-danger d-flex align-items-center"
  onClick={handleDeleteStaff}
>
  <FaTrash className="me-1" />
  Delete
</button>

    </div>
  </div>

  {/* Staff Info Section */}
  <div className="d-flex align-items-center">
    <div
      className="rounded-circle text-white d-flex align-items-center justify-content-center me-3"
      style={{
        width: '60px',
        height: '60px',
        backgroundColor: 'skyblue',
        fontSize: '1.5rem',
      }}
    >
      {staff.name?.split(' ').map((n) => n[0]).join('').toUpperCase()}
    </div>
    <div className="flex-grow-1">
      <h2 className="mb-0">{staff.name}</h2>
      <h5 className="text-muted mb-1">{staff.designation}</h5>
      <div className="d-flex align-items-center gap-3 mt-1">
        <span className={`badge ${staff.status === 1 ? 'bg-success' : 'bg-danger'}`}>
          {staff.status === 1 ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  </div>
</div>

    <br/>

      {/* Quick Actions: Always Visible */}
      <Card className="mb-4 p-4 shadow-sm rounded-4">
  <h6 className="mb-3 text-dark fw-semibold">Quick Actions</h6>
 <Row className="gx-3 gy-3">
  {[
   { icon: <FaCalendarCheck />, label: "Mark Attendance", onClick: () => setShowAttendanceModal(true) },
    { icon: <FaPlane />, label: "Request Leave" ,onClick: () => setShowLeaveModal(true)},
    { icon: <FaFileInvoice />, label: "View Payslip", onClick:handlePayslipView },
    { icon: <FaTasks />, label: "Assign Task", onClick: () => setShowModal(true) },
  ].map((action, index) => (
    <Col key={index} xs={6} sm={4} md={3}>
      <div
        className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 me-3"
        style={{
          backgroundColor: '#f8f9fa',
          fontWeight: 500,
          fontSize: '14px',
          color: '#2f3542',
          border: '1px solid #e3e6ea',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onClick={action.onClick || null} // Only assign if it exists
      >
        <span style={{ fontSize: '16px' }}>{action.icon}</span>
        <span>{action.label}</span>
      </div>
    </Col>
  ))}
</Row>

</Card>


      {/* Staff Details Tabs: Always Visible */}
     <div className="card" style={{
  borderRadius: '0.5rem',
  boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
  overflow: 'hidden',
  marginBottom: '1.5rem'
}}>
  {/* Tabs Navigation */}
  <div style={{
    display: 'flex',
    borderBottom: '1px solid #dee2e6',
    backgroundColor: '#f8f9fa',
    paddingLeft: '1rem'
  }}>
    {/* General Tab */}
    <div 
      style={{
        padding: '0.75rem 1rem',
        cursor: 'pointer',
        borderBottom: tabKey === 'general' ? '2px solid #0d6efd' : 'none',
        color: tabKey === 'general' ? '#0d6efd' : '#495057',
        fontWeight: tabKey === 'general' ? '600' : '400',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      onClick={() => setTabKey('general')}
    >
      <i className="fas fa-user" style={{ fontSize: '0.875rem' }}></i>
      <span>General</span>
    </div>

    {/* Profile Tab */}
    <div 
      style={{
        padding: '0.75rem 1rem',
        cursor: 'pointer',
        borderBottom: tabKey === 'profile' ? '2px solid #0d6efd' : 'none',
        color: tabKey === 'profile' ? '#0d6efd' : '#495057',
        fontWeight: tabKey === 'profile' ? '600' : '400',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      onClick={() => setTabKey('profile')}
    >
      <i className="fas fa-id-badge" style={{ fontSize: '0.875rem' }}></i>
      <span>Profile</span>
    </div>

    {/* Documents Tab */}
    <div 
      style={{
        padding: '0.75rem 1rem',
        cursor: 'pointer',
        borderBottom: tabKey === 'documents' ? '2px solid #0d6efd' : 'none',
        color: tabKey === 'documents' ? '#0d6efd' : '#495057',
        fontWeight: tabKey === 'documents' ? '600' : '400',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      onClick={() => setTabKey('documents')}
    >
      <i className="fas fa-file-alt" style={{ fontSize: '0.875rem' }}></i>
      <span>Documents</span>
    </div>

    {/* Salary Tab */}
    <div 
      style={{
        padding: '0.75rem 1rem',
        cursor: 'pointer',
        borderBottom: tabKey === 'salary' ? '2px solid #0d6efd' : 'none',
        color: tabKey === 'salary' ? '#0d6efd' : '#495057',
        fontWeight: tabKey === 'salary' ? '600' : '400',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      onClick={() => setTabKey('salary')}
    >
      <i className="fas fa-money-bill-alt" style={{ fontSize: '0.875rem' }}></i>
      <span>Salary</span>
    </div>

    {/* Leave Tab */}
    <div 
      style={{
        padding: '0.75rem 1rem',
        cursor: 'pointer',
        borderBottom: tabKey === 'leave' ? '2px solid #0d6efd' : 'none',
        color: tabKey === 'leave' ? '#0d6efd' : '#495057',
        fontWeight: tabKey === 'leave' ? '600' : '400',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      onClick={() => setTabKey('leave')}
    >
      <i className="fas fa-umbrella-beach" style={{ fontSize: '0.875rem' }}></i>
      <span>Leave</span>
    </div>

    {/* Project Tab */}
    <div 
      style={{
        padding: '0.75rem 1rem',
        cursor: 'pointer',
        borderBottom: tabKey === 'project' ? '2px solid #0d6efd' : 'none',
        color: tabKey === 'project' ? '#0d6efd' : '#495057',
        fontWeight: tabKey === 'project' ? '600' : '400',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      onClick={() => setTabKey('project')}
    >
      <i className="fas fa-tasks" style={{ fontSize: '0.875rem' }}></i>
      <span>Projects</span>
    </div>

    {/* Payslip Tab */}
    <div 
      style={{
        padding: '0.75rem 1rem',
        cursor: 'pointer',
        borderBottom: tabKey === 'payslip' ? '2px solid #0d6efd' : 'none',
        color: tabKey === 'payslip' ? '#0d6efd' : '#495057',
        fontWeight: tabKey === 'payslip' ? '600' : '400',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      onClick={() => setTabKey('payslip')}
    >
      <i className="fas fa-file-invoice" style={{ fontSize: '0.875rem' }}></i>
      <span>Payslip</span>
    </div>
  </div>

  {/* Tab Content */}
  <div style={{ padding: '1.5rem' }}>
    {/* General Tab Content */}
    {tabKey === 'general' && (
      <div>
        {/* Personal & Role Information */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h5 style={{ 
            marginBottom: '1rem', 
            fontSize: '1.25rem', 
            fontWeight: '500',
            color: '#212529'
          }}>Personal & Role Information</h5>
          <hr style={{ 
            margin: '0.5rem 0', 
            border: '0', 
            borderTop: '1px solid #dee2e6' 
          }} />
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Organization:</strong><br />
              <span>{staff.organization || 'N/A'}</span></div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Salutation:</strong><br />
              <span>{staff.salutation || 'Mr./Ms.'}</span></div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Full Name:</strong><br />
              <span>{staff.name}</span></div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Staff ID:</strong><br />
              <span>{staff.id || 'N/A'}</span></div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Designation:</strong><br />
              <span>{staff.designation || 'N/A'}</span></div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Staff Type:</strong><br />
              <span>{staff.user_type || 'N/A'}</span></div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Date of Birth:</strong><br />
              <span>{staff.date_of_birth || 'N/A'}</span></div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Blood Group:</strong><br />
              <span>{staff.blood_group || 'N/A'}</span></div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Date of Joining:</strong><br />
              <span>{staff.join_date || 'N/A'}</span></div>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h5 style={{ 
            marginBottom: '1rem', 
            fontSize: '1.25rem', 
            fontWeight: '500',
            color: '#212529'
          }}>Contact Details</h5>
          <hr style={{ 
            margin: '0.5rem 0', 
            border: '0', 
            borderTop: '1px solid #dee2e6' 
          }} />
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Work Email:</strong><br />
              <span>{staff.email || 'N/A'}</span></div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Personal Email:</strong><br />
              <span>{staff.personal_email || 'N/A'}</span></div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Primary Phone:</strong><br />
              <span>{staff.phone || 'N/A'}</span></div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Work Phone:</strong><br />
              <span>{staff.work_phone || 'N/A'}</span></div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Emergency Contact 1:</strong><br />
              <span>{staff.emergency_contact_1 || 'N/A'}</span></div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Emergency Contact 2:</strong><br />
              <span>{staff.emergency_contact_2 || 'N/A'}</span></div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Parent's Mobile:</strong><br />
              <span>{staff.parent_mobile || 'N/A'}</span></div>
            </div>
            <div style={{ 
              flex: '0 0 66.666667%',
              maxWidth: '66.666667%',
              padding: '0 0.75rem',
              marginBottom: '0.75rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Address:</strong><br />
              <span>{staff.address || 'N/A'}</span></div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Profile Tab Content */}
    {tabKey === 'profile' && (
      <div>
        <h5 style={{ 
          marginBottom: '1rem', 
          fontSize: '1.25rem', 
          fontWeight: '500',
          color: '#212529'
        }}>Professional Details</h5>
        <hr style={{ 
          margin: '0.5rem 0', 
          border: '0', 
          borderTop: '1px solid #dee2e6' 
        }} />
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          marginBottom: '1rem'
        }}>
          <div style={{ 
            flex: '0 0 33.333333%',
            maxWidth: '33.333333%',
            padding: '0 0.75rem',
            marginBottom: '0.75rem'
          }}>
            <div><strong style={{ fontWeight: '600' }}>Qualification:</strong><br />
            <span style={{ fontWeight: '500' }}>{staff.qualification}</span></div>
          </div>
          <div style={{ 
            flex: '0 0 33.333333%',
            maxWidth: '33.333333%',
            padding: '0 0.75rem',
            marginBottom: '0.75rem'
          }}>
            <div><strong style={{ fontWeight: '600' }}>Experience:</strong><br />
            <span style={{ fontWeight: '500' }}>{staff.experience}</span></div>
          </div>
          <div style={{ 
            flex: '0 0 33.333333%',
            maxWidth: '33.333333%',
            padding: '0 0.75rem',
            marginBottom: '0.75rem'
          }}>
            <div><strong style={{ fontWeight: '600' }}>Nature of Staff:</strong><br />
            <span style={{ fontWeight: '500' }}>{staff.nature_of_staff}</span></div>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          marginBottom: '1rem'
        }}>
          <div style={{ 
            flex: '0 0 33.333333%',
            maxWidth: '33.333333%',
            padding: '0 0.75rem',
            marginBottom: '0.75rem'
          }}>
            <div><strong style={{ fontWeight: '600' }}>COVID-19 Vaccinated:</strong><br />
            <span>{staff.covid_vaccinated === 1 ? 'Yes' : 'No'}</span></div>
          </div>
        </div>

        <div style={{ 
          marginBottom: '1rem'
        }}>
          <div><strong style={{ fontWeight: '600' }}>Skills:</strong><br />
          <span style={{ fontWeight: '500' }}>
            {(Array.isArray(staff.skills)
              ? staff.skills
              : JSON.parse(staff.skills || '[]')
            ).join(', ')}
          </span></div>
        </div>
      </div>
    )}

    {/* Documents Tab Content */}
    {tabKey === 'documents' && (
      <div>
        <h5 style={{ 
          marginBottom: '1rem', 
          fontSize: '1.25rem', 
          fontWeight: '500',
          color: '#212529'
        }}>Uploaded Documents</h5>
        <hr style={{ 
          margin: '0.5rem 0', 
          border: '0', 
          borderTop: '1px solid #dee2e6' 
        }} />
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          margin: '0 -0.5rem'
        }}>
          {documents.map((doc, idx) => (
            <div key={idx} style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                border: '1px solid #dee2e6',
                borderRadius: '0.25rem',
                backgroundColor: '#f8f9fa',
                borderLeft: `4px solid ${doc.uploaded ? '#28a745' : '#dc3545'}`,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${doc.uploaded ? '#28a745' : '#dc3545'}`,
                    color: doc.uploaded ? '#28a745' : '#dc3545',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}>
                    {doc.uploaded ? '✔' : '✖'}
                  </div>
                  <span>{doc.name}</span>
                </div>
                <div>
                  {doc.uploaded ? (
                    <a href={doc.link} style={{ 
                      color: '#0d6efd', 
                      textDecoration: 'none', 
                      fontWeight: '500' 
                    }} target="_blank" rel="noreferrer">View</a>
                  ) : (
                    <span style={{ color: '#6c757d' }}>Missing</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Salary Tab Content */}
    {tabKey === 'salary' && (
      <div>
        <div className="card" style={{ 
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
          marginBottom: '1.5rem'
        }}>
          <h5 style={{ 
            marginBottom: '1rem', 
            fontSize: '1.25rem', 
            fontWeight: '500',
            color: '#212529',
            borderBottom: '1px solid #dee2e6',
            paddingBottom: '0.5rem'
          }}>Salary Structure</h5>
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            margin: '0 -1rem'
          }}>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>Gross Salary / Month</div>
                <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#212529', marginTop: '4px' }}>
                  ₹{staff?.daily_remuneration || '0.00'}
                </div>
              </div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>Rent Allowance</div>
                <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#212529', marginTop: '4px' }}>
                  {staff?.rent_allowance_percent ? `${staff.rent_allowance_percent}%` : 'N/A'}
                </div>
              </div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>ESI Number</div>
                <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#212529', marginTop: '4px' }}>
                  {staff?.esi_card_no || 'N/A'}
                </div>
              </div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>PF Number</div>
                <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#212529', marginTop: '4px' }}>
                  {staff?.pf_no || 'N/A'}
                </div>
              </div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>Daily Remuneration</div>
                <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#212529', marginTop: '4px' }}>
                  ₹{staff?.daily_remuneration || '0.00'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Leave Tab Content */}
    {tabKey === 'leave' && (
      <div>
        <h5 style={{ 
          marginBottom: '1rem', 
          fontSize: '1.25rem', 
          fontWeight: '500',
          color: '#212529'
        }}>Leave History</h5>
        <hr style={{ 
          margin: '0.5rem 0', 
          border: '0', 
          borderTop: '1px solid #dee2e6' 
        }} />
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            marginBottom: '1rem'
          }}>
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Type</th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>From</th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>To</th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Reason</th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Emergency</th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Status</th>
                <th style={{ 
                padding: '0.75rem', 
                textAlign: 'left', 
                borderBottom: '1px solid #dee2e6',
                fontWeight: '500'
              }}>Download</th>

              </tr>
            </thead>
            <tbody>
      {staff?.leave_requests?.length > 0 ? (
        staff.leave_requests.map((leave, idx) => (
          <tr key={idx}>
            <td>{leave.leave_type}</td>
            <td>{leave.from_date}</td>
            <td>{leave.to_date}</td>
            <td>{leave.reason || '—'}</td>
            <td>
              <span className={`badge ${leave.is_emergency ? 'bg-danger' : 'bg-secondary'}`}>
                {leave.is_emergency ? 'Yes' : 'No'}
              </span>
            </td>
            <td>
              <span className={`badge ${
                leave.status === 'APPROVED' ? 'bg-success' :
                leave.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'
              }`}>
                {leave.status}
              </span>
            </td>
            <td>
          <button 
            onClick={() => handleDownload(leave, staff.name, idx)}
            style={{ 
              padding: '4px 8px', 
              fontSize: '4px', 
              backgroundColor: '#0d6efd', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              
            }}
          >
           <Download />
          </button>
        </td>

          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="7" className="text-center text-muted">No leave requests found.</td>
        </tr>
      )}
    </tbody>
          </table>
        </div>
      </div>
    )}

    {/* Project Tab Content */}
    {tabKey === 'project' && (
  <div>
    <h5 style={{ 
      marginBottom: '1rem', 
      fontSize: '1.25rem', 
      fontWeight: '500',
      color: '#212529'
    }}>Assigned Projects</h5>

    {loading ? (
      <p>Loading tasks...</p>
    ) : (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          marginBottom: '1rem'
        }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={headerStyle}>Project Name</th>
              <th style={headerStyle}>Deadline</th>
              <th style={headerStyle}>Duration</th>
              <th style={headerStyle}>Value</th>
              <th style={headerStyle}>Status</th>
            </tr>
          </thead>
         <tbody>
      {staff?.tasks?.length > 0 ? (
        staff.tasks.map((task, index) => (
          <tr key={index}>
            <td>{task.project_name || task.task_name}</td>
            <td>{new Date(task.deadline).toLocaleDateString()}</td>
            <td>{task.duration || '—'}</td>
            <td>{task.project_value ? `₹${parseFloat(task.project_value).toLocaleString()}` : '—'}</td>
            <td>{task.project_status || '—'}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5">No tasks found</td>
        </tr>
      )}
    </tbody>
        </table>
      </div>
    )}
  </div>
)}


    {/* Payslip Tab Content */}
    {tabKey === 'payslip' && (
      <div>
        <h5 style={{ 
          marginBottom: '1rem', 
          fontSize: '1.25rem', 
          fontWeight: '500',
          color: '#212529'
        }}>Payslip History</h5>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            marginBottom: '1rem'
          }}>
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Month</th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Gross Salary</th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Deductions</th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Net Salary</th>
                <th style={{ 
                  padding: '0.75rem', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentMonthPayslip && (
                <tr>
                  <td style={{ 
                    padding: '0.75rem', 
                    borderBottom: '1px solid #dee2e6',
                    verticalAlign: 'middle'
                  }}>{currentMonthPayslip.month}</td>
                  <td style={{ 
                    padding: '0.75rem', 
                    borderBottom: '1px solid #dee2e6',
                    verticalAlign: 'middle'
                  }}>₹{currentMonthPayslip.gross_salary}</td>
                  <td style={{ 
                    padding: '0.75rem', 
                    borderBottom: '1px solid #dee2e6',
                    verticalAlign: 'middle'
                  }}>₹{currentMonthPayslip.deductions}</td>
                  <td style={{ 
                    padding: '0.75rem', 
                    borderBottom: '1px solid #dee2e6',
                    verticalAlign: 'middle'
                  }}>₹{currentMonthPayslip.net_salary}</td>
                  <td style={{ 
                    padding: '0.75rem', 
                    borderBottom: '1px solid #dee2e6',
                    verticalAlign: 'middle'
                  }}>
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        borderRadius: '0.2rem',
                        color: '#0d6efd',
                        backgroundColor: 'transparent',
                        border: '1px solid #0d6efd',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease-in-out'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.backgroundColor = '#0d6efd';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = '#0d6efd';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      onClick={() => handleDownloadPayslip(currentMonthPayslip)}
                    >
                      <i className="fas fa-download" style={{ fontSize: '0.875rem' }}></i> Download
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
</div>
</>

<ViewPayslipModal
  show={showPayslipModal}
  onHide={() => setShowPayslipModal(false)}
  staff={staff}
/>



{showEditModal && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1050,
    overflow: 'auto',
    padding: '20px'
  }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '900px',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
    }}>
      {/* Modal Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ 
          margin: 0,
          fontWeight: 'bold',
          fontSize: '1.25rem'
        }}>
          Edit Staff
        </h2>
        <button 
          onClick={() => setShowEditModal(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#6c757d',
            lineHeight: 1
          }}
        >
          &times;
        </button>
      </div>

      {/* Modal Body */}
      <div style={{
        padding: '20px',
        overflowY: 'auto',
        flex: 1
      }}>
        {/* Login and Organization Card */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          border: '1px solid #dee2e6',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '16px'
          }}>
            {/* Login Toggle */}
            <div style={{
              flex: 1,
              minWidth: '200px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{
                fontWeight: 600,
                marginRight: '12px',
                whiteSpace: 'nowrap'
              }}>
                Login is enabled
              </span>
              <div 
                style={{
                  width: '40px',
                  height: '20px',
                  backgroundColor: loginEnabled ? '#0d6efd' : '#ced4da',
                  borderRadius: '10px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => setLoginEnabled(!loginEnabled)}
              >
                <div style={{
                  position: 'absolute',
                  top: '2px',
                  left: loginEnabled ? '22px' : '2px',
                  width: '16px',
                  height: '16px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: 'left 0.2s'
                }} />
              </div>
            </div>

            {/* Organization Dropdown */}
            <div style={{
              flex: 1,
              minWidth: '200px'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600
              }}>
                Organization <span style={{ color: 'red' }}>*</span>
              </label>
              <select
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                  fontSize: '14px'
                }}
              >
                <option value="">Select Organization</option>
                <option>Bangalore Organization</option>
                <option>Kochi Organization</option>
                <option>Calicut Organization</option>
              </select>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            {/* Username */}
            <div style={{
              flex: 1,
              minWidth: '200px'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600
              }}>
                Username <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Password */}
            <div style={{
              flex: 1,
              minWidth: '200px'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600
              }}>
                Password <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div style={{ marginBottom: '20px' }}>
          {/* Staff Details */}
          <div style={{
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            marginBottom: '12px',
            overflow: 'hidden'
          }}>
            <div
              onClick={() => setActiveAccordion(activeAccordion === '0' ? null : '0')}
              style={{
                backgroundColor: '#f8f9fa',
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: activeAccordion === '0' ? '1px solid #dee2e6' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaUser style={{ marginRight: '8px', color: '#6c757d' }} />
                <span style={{ fontWeight: 500 }}>Staff Details</span>
              </div>
              {activeAccordion === '0' ? <BsChevronDown /> : <BsChevronRight />}
            </div>
            
            {activeAccordion === '0' && (
              <div style={{ padding: '16px' }}>
                <StaffDetails data={staff} setData={setStaff} />
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div style={{
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            marginBottom: '12px',
            overflow: 'hidden'
          }}>
            <div
              onClick={() => setActiveAccordion(activeAccordion === '1' ? null : '1')}
              style={{
                backgroundColor: '#f8f9fa',
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: activeAccordion === '1' ? '1px solid #dee2e6' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaPhone style={{ marginRight: '8px', color: '#6c757d' }} />
                <span style={{ fontWeight: 500 }}>Contact Information</span>
              </div>
              {activeAccordion === '1' ? <BsChevronDown /> : <BsChevronRight />}
            </div>
            
            {activeAccordion === '1' && (
              <div style={{ padding: '16px' }}>
                <ContactForm data={staff} setData={setStaff} />
              </div>
            )}
          </div>

          {/* Financial & HR Details */}
          <div style={{
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            marginBottom: '12px',
            overflow: 'hidden'
          }}>
            <div
              onClick={() => setActiveAccordion(activeAccordion === '2' ? null : '2')}
              style={{
                backgroundColor: '#f8f9fa',
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: activeAccordion === '2' ? '1px solid #dee2e6' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaDollarSign style={{ marginRight: '8px', color: '#6c757d' }} />
                <span style={{ fontWeight: 500 }}>Financial & HR Details</span>
              </div>
              {activeAccordion === '2' ? <BsChevronDown /> : <BsChevronRight />}
            </div>
            
            {activeAccordion === '2' && (
              <div style={{ padding: '16px' }}>
                <FinancialHR data={staff} setData={setStaff} />
              </div>
            )}
          </div>

          {/* Skills */}
          <div style={{
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            marginBottom: '12px',
            overflow: 'hidden'
          }}>
            <div
              onClick={() => setActiveAccordion(activeAccordion === '3' ? null : '3')}
              style={{
                backgroundColor: '#f8f9fa',
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: activeAccordion === '3' ? '1px solid #dee2e6' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaCertificate style={{ marginRight: '8px', color: '#6c757d' }} />
                <span style={{ fontWeight: 500 }}>Skills</span>
              </div>
              {activeAccordion === '3' ? <BsChevronDown /> : <BsChevronRight />}
            </div>
            
            {activeAccordion === '3' && (
              <div style={{ padding: '16px' }}>
                <Skills data={selectedSkills} setData={setSelectedSkills} />
              </div>
            )}
          </div>

          {/* Documents */}
          <div style={{
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            marginBottom: '12px',
            overflow: 'hidden'
          }}>
            <div
              onClick={() => setActiveAccordion(activeAccordion === '4' ? null : '4')}
              style={{
                backgroundColor: '#f8f9fa',
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: activeAccordion === '4' ? '1px solid #dee2e6' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaFileAlt style={{ marginRight: '8px', color: '#6c757d' }} />
                <span style={{ fontWeight: 500 }}>Documents</span>
              </div>
              {activeAccordion === '4' ? <BsChevronDown /> : <BsChevronRight />}
            </div>
            
            {activeAccordion === '4' && (
              <div style={{ padding: '16px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  {[
                    { id: "cv-upload", label: "CV" },
                    { id: "padhar-front-upload", label: "Padhar Card (Front)" },
                    { id: "dl-front-upload", label: "Driving License (Front)" },
                    { id: "photo-upload", label: "Photo" },
                    { id: "padhar-back-upload", label: "Padhar Card (Back)" },
                    { id: "dl-back-upload", label: "Driving License (Back)" },
                    { id: "passport-photo-upload", label: "Passport Size Photo" },
                    { id: "pan-upload", label: "PAN Card" },
                    { id: "passport-front-upload", label: "Passport (Front)" },
                    { id: "passport-back-upload", label: "Passport (Back)" },
                    { id: "pf-upload", label: "PF Document" },
                    { id: "contract-upload", label: "Employee Contract" },
                    { id: "esi-upload", label: "ESI Document" },
                  ].map(({ id, label }) => (
                    <div key={id} style={{ marginBottom: '16px' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 500
                      }}>
                        {label}
                      </label>
                      <div style={{
                        border: '2px dashed #ced4da',
                        borderRadius: '8px',
                        padding: '16px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        backgroundColor: '#f8f9fa'
                      }}>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#e9ecef',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '8px'
                          }}>
                            <FaUpload size={16} color="#6c757d" />
                          </div>
                          <span style={{
                            fontSize: '12px',
                            color: '#6c757d',
                            marginBottom: '4px',
                            fontWeight: 500
                          }}>
                            Click to upload
                          </span>
                          <span style={{
                            fontSize: '11px',
                            color: '#adb5bd'
                          }}>
                            or drag and drop
                          </span>
                        </div>
                        <input
                          type="file"
                          id={id}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bank Details */}
          <div style={{
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            marginBottom: '12px',
            overflow: 'hidden'
          }}>
            <div
              onClick={() => setActiveAccordion(activeAccordion === '5' ? null : '5')}
              style={{
                backgroundColor: '#f8f9fa',
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: activeAccordion === '5' ? '1px solid #dee2e6' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaBuilding style={{ marginRight: '8px', color: '#6c757d' }} />
                <span style={{ fontWeight: 500 }}>Bank Details</span>
              </div>
              {activeAccordion === '5' ? <BsChevronDown /> : <BsChevronRight />}
            </div>
            
            {activeAccordion === '5' && (
              <div style={{ padding: '16px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  {/* Date */}
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: 500
                    }}>
                      Date
                    </label>
                    <input
                      type="date"
                      name="bank_document_date"
                      value={staff.bank_document_date}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #ced4da',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: 500
                    }}>
                      Title
                    </label>
                    <input
                      type="text"
                      name="bank_document_title"
                      placeholder="Enter title"
                      value={staff.bank_document_title}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #ced4da',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 500
                  }}>
                    Description
                  </label>
                  <textarea
                    name="bank_document_description"
                    rows="3"
                    placeholder="Enter description"
                    value={staff.bank_document_description}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: 500
                  }}>
                    Bank Document
                  </label>
                  <div style={{
                    border: '2px dashed #ced4da',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px'
                      }}>
                        <FaUpload size={16} color="#6c757d" />
                      </div>
                      <span style={{
                        fontSize: '12px',
                        color: '#6c757d',
                        marginBottom: '4px',
                        fontWeight: 500
                      }}>
                        Click to upload
                      </span>
                      <span style={{
                        fontSize: '11px',
                        color: '#adb5bd'
                      }}>
                        or drag and drop
                      </span>
                    </div>
                    <input
                      type="file"
                      id="bank-doc-upload"
                      onChange={handleFileChange}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                  {staff.bank_document_file && (
                    <div style={{
                      marginTop: '8px',
                      fontSize: '12px',
                      color: '#28a745',
                      textAlign: 'center'
                    }}>
                      {staff.bank_document_file}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #dee2e6',
        backgroundColor: 'lightcyan',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        borderRadius: '0 0 8px 8px'
      }}>
        <button
          onClick={() => setShowEditModal(false)}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #6c757d',
            backgroundColor: 'transparent',
            color: '#6c757d',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleUpdateStaff}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #0d6efd',
            backgroundColor: '#0d6efd',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Edit Staff
        </button>
      </div>
    </div>
  </div>
)}




{showModal && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1050
  }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '600px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }}>
      {/* Modal Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.25rem' }}>
          Assign Task to {staff?.name}
        </h3>
        <button 
          onClick={() => setShowModal(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#6c757d',
            lineHeight: 1
          }}
        >
          &times;
        </button>
      </div>

      {/* Modal Body */}
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 500,
            fontSize: '14px'
          }}>Task Name</label>
          <input
            type="text"
            name="task_name"
            value={formData.task_name}
            onChange={handleChanges}
            required
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 500,
            fontSize: '14px'
          }}>Task Description</label>
          <textarea
            name="task_description"
            value={formData.task_description}
            onChange={handleChanges}
            rows={3}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 500,
            fontSize: '14px'
          }}>Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChanges}
            required
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 500,
            fontSize: '14px'
          }}>Project Name</label>
          <input
            type="text"
            name="project_name"
            value={formData.project_name}
            onChange={handleChanges}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 500,
            fontSize: '14px'
          }}>Project Value</label>
          <input
            type="number"
            name="project_value"
            value={formData.project_value}
            onChange={handleChanges}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 500,
            fontSize: '14px'
          }}>Project Status</label>
          <select
            name="project_status"
            value={formData.project_status}
            onChange={handleChanges}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              fontSize: '14px',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              backgroundSize: '16px'
            }}
          >
            <option value="">Select status</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Modal Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px'
      }}>
        <button
          onClick={() => setShowModal(false)}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #6c757d',
            backgroundColor: 'transparent',
            color: '#6c757d',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #0d6efd',
            backgroundColor: '#0d6efd',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Assign Task
        </button>
      </div>
    </div>
  </div>
)}



       {showLeaveModal && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1050
  }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '500px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }}>
      {/* Modal Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.25rem' }}>Request Leave</h3>
        <button 
          onClick={() => setShowLeaveModal(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#6c757d',
            lineHeight: 1
          }}
        >
          &times;
        </button>
      </div>

      {/* Modal Body */}
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 500,
            fontSize: '14px'
          }}>Leave Type</label>
          <select
            name="leave_type"
            value={leaveForm.leave_type}
            onChange={(e) => setLeaveForm(prev => ({ ...prev, leave_type: e.target.value }))}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              fontSize: '14px'
            }}
          >
            <option value="">-- Select Leave Type --</option>
            <option>Annual Leave</option>
            <option>Sick Leave</option>
            <option>Maternity/Paternity Leave</option>
            <option>Bereavement Leave</option>
            <option>Casual Leave</option>
            <option>Paid Leave</option>
            <option>Unpaid Leave</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 500,
            fontSize: '14px'
          }}>From Date</label>
          <input
            type="date"
            name="from_date"
            value={leaveForm.from_date}
            onChange={(e) => setLeaveForm(prev => ({ ...prev, from_date: e.target.value }))}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 500,
            fontSize: '14px'
          }}>To Date</label>
          <input
            type="date"
            name="to_date"
            value={leaveForm.to_date}
            onChange={(e) => setLeaveForm(prev => ({ ...prev, to_date: e.target.value }))}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 500,
            fontSize: '14px'
          }}>Reason</label>
          <textarea
            name="reason"
            value={leaveForm.reason}
            onChange={(e) => setLeaveForm(prev => ({ ...prev, reason: e.target.value }))}
            rows={2}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <input
            type="checkbox"
            id="emergency-leave"
            checked={leaveForm.is_emergency}
            onChange={(e) => setLeaveForm(prev => ({ ...prev, is_emergency: e.target.checked }))}
            style={{
              marginRight: '8px',
              width: '16px',
              height: '16px'
            }}
          />
          <label htmlFor="emergency-leave" style={{
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            Emergency Leave
          </label>
        </div>
      </div>

      {/* Modal Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px'
      }}>
        <button
          onClick={() => setShowLeaveModal(false)}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #6c757d',
            backgroundColor: 'transparent',
            color: '#6c757d',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleLeaveSubmit}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #0d6efd',
            backgroundColor: '#0d6efd',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Submit Request
        </button>
      </div>
    </div>
  </div>
)}




{showAttendanceModal && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1050
  }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '500px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }}>
      {/* Modal Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h5 style={{ margin: 0, fontWeight: 600 }}>Mark Attendance</h5>
        <button 
          onClick={() => setShowAttendanceModal(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#6c757d',
            lineHeight: 1
          }}
        >
          &times;
        </button>
      </div>

      {/* Modal Body */}
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: 600,
            fontSize: '14px'
          }}>Select Status:</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {["Present", "Absent", "Late"].map((status) => (
              <button
                key={status}
                onClick={() => setAttendanceStatus(status)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: `1px solid ${attendanceStatus === status ? '#0d6efd' : '#dee2e6'}`,
                  backgroundColor: attendanceStatus === status ? '#0d6efd' : 'white',
                  color: attendanceStatus === status ? 'white' : '#212529',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: 500
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <hr style={{ margin: '20px 0', borderColor: '#dee2e6' }} />

        <h6 style={{ fontWeight: 700, marginBottom: '12px', fontSize: '15px' }}>
          This Month's Attendance
        </h6>
        
        {loadingHistory ? (
          <p style={{ margin: 0 }}>Loading...</p>
        ) : attendanceHistory.length === 0 ? (
          <p style={{ margin: 0, color: '#6c757d' }}>No attendance records yet.</p>
        ) : (
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            fontSize: '14px'
          }}>
            {attendanceHistory.map((entry, i) => (
              <li key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: '1px solid #f1f1f1'
              }}>
                <span>{entry.date}</span>
                <span style={{
                  backgroundColor: getStatusColor(entry.status) === 'success' ? '#d1e7dd' : 
                                  getStatusColor(entry.status) === 'danger' ? '#f8d7da' : 
                                  '#fff3cd',
                  color: getStatusColor(entry.status) === 'success' ? '#0f5132' : 
                         getStatusColor(entry.status) === 'danger' ? '#842029' : 
                         '#664d03',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 500
                }}>
                  {entry.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px'
      }}>
        <button
          onClick={() => setShowAttendanceModal(false)}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #6c757d',
            backgroundColor: 'transparent',
            color: '#6c757d',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Close
        </button>
        <button
          onClick={handleSubmitAttendance}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #198754',
            backgroundColor: '#198754',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}

            </div>
    </>
  );
}