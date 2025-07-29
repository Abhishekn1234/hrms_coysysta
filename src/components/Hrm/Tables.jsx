import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react";
import BenefitsModal from "./BenefitsModal";
import {
  Table, Badge, Tabs, Tab, Button, Pagination, ButtonGroup,
  Modal, Dropdown, Form, Row, Col, Alert, Spinner,Card
} from "react-bootstrap";
import AttendanceHistory from './AttandanceHistory'; // adjust path as needed
import GenerateDocumentModal from "./GenerateDocumentModal";
import {
  FaEnvelope, FaEdit, FaTrash, FaBan, FaFileAlt,FaRegCalendar,FaRegCalendarAlt,
  FaFilePdf, FaFileWord, FaFileImage, FaDownload, FaCheckCircle,
  FaUser, FaBriefcase, FaMoneyBill, FaGift, FaClock, FaCalendarAlt,
  FaUserCheck, FaUserTimes, FaUserClock, FaHistory, FaEye,
  FaPlus, FaFileContract, FaPaperclip, FaUpload, FaIdCard, FaRobot,
  FaFileMedical, FaUserShield, FaBalanceScale, FaWallet,
  FaPercentage, FaPassport, FaTicketAlt, FaComment, FaEllipsisH, FaSave, FaTimes
} from "react-icons/fa";
import { FiCalendar, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
import html2pdf from "html2pdf.js";
import "./Table.css";
import jsPDF from 'jspdf';
import EmployeeBenefits from "./EmployeeBenefits";
import { LogInIcon, LogOutIcon, Umbrella } from 'lucide-react'; // or any similar icon
import ProcessPayroll from "./ProcessPayroll";
const Tables = forwardRef(({ setSelectedEmployees }, ref) => {

const slipRef = useRef();
  
    const [selectedIds, setSelectedIds] = useState([]);
  const [state, setState] = useState({
    showPayrollModal: false,
    showLeaveModal: false,
    showMessageModal: false,
    showDocumentModal: false,
    employees: [],
    documents: [],
    selected: [],
    selectedEmployee: null,
    selectedEmployeeId: null,
    showUploadInput: false,
    uploading: false,
    loading: {
      employees: true,
      employee: false,
      documents: false
    },
    leaveData: {
      leaveType: "",
      fromDate: "",
      toDate: "",
      reason: "",
      isEmergency: false
    },
    messageData: {
      subject: "",
      content: "",
      priority: "normal"
    },
    newDocument: {
      title: "",
      file: null
    },
    payrollDetails: null,
    payrollMonth: new Date(),
    attendance:""
  });
  const [showEdit, setShowEdit] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(null);
const handleFileChange = (e) => {
  const { name, files } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: files[0], // single file per input
  }));
};
const handleCheckboxChange = (empId, isChecked) => {
  let updatedIds = isChecked
    ? [...selectedIds, empId]
    : selectedIds.filter(id => id !== empId);

  setSelectedIds(updatedIds);

  const updatedEmployees = state.employees.filter(emp => updatedIds.includes(emp.id));
  setSelectedEmployees(updatedEmployees); // pass full details to parent
};


const handleCheckboxChanges = (e) => {
  const { name, checked } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: checked,
  }));
};  
const handleShow = () => setShowModal(true);
 const [activeItem, setActiveItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

const [attendanceData, setAttendanceData] = useState([]);

const handleViewHistory = async (empId) => {
  setSelectedEmpId(empId);
  setShowHistoryModal(true);

  try {
    const res = await fetch(`http://127.0.0.1:8000/api/v1/users/${empId}/attendance`);
    const json = await res.json();

    console.log("API Response:", json); // Debug it!

    // Make sure to pass only array data
    setAttendanceData(json.data);
  } catch (error) {
    console.error("Failed to fetch attendance data:", error);
    setAttendanceData([]); // fallback to empty
  }
};



  const benefitItems = [
    { id: 'esi', label: 'ESI', icon: <FaFileMedical size={16} /> },
    { id: 'insurance', label: 'Insurance Details', icon: <FaUserShield size={16} /> },
    { id: 'leave', label: 'Leave Balances', icon: <FaBalanceScale size={16} /> },
    { id: 'stock', label: 'Stock Options', icon: <FaBriefcase size={16} /> },
    { id: 'loan', label: 'Loan Information', icon: <FaWallet size={16} /> },
    { id: 'pf', label: 'Provident Fund', icon: <FaMoneyBill size={16} /> },
    { id: 'gratuity', label: 'Gratuity', icon: <FaPercentage size={16} /> },
    { id: 'bonus', label: 'Bonus', icon: <FaGift size={16} /> },
    { id: 'incentives', label: 'Incentives', icon: <FaPercentage size={16} /> },
    { id: 'visa', label: 'Visa', icon: <FaPassport size={16} /> },
    { id: 'travel', label: 'Travel Tickets', icon: <FaTicketAlt size={16} /> },
    { id: 'feedback', label: 'Feedback', icon: <FaComment size={16} /> },
    { id: 'other', label: 'Other Benefits', icon: <FaEllipsisH size={16} /> }
  ];

  const handleClose = () => {
  setShowBenefitsModal(false);
  setViewItem(null);
  setActiveItem(null);
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Submitting: ${JSON.stringify(formData)}`);
    setActiveItem(null);
  };




const [formData, setFormData] = useState({
  // Personal Info
  first_name: '',
  last_name: '',
  ptax:'',
  tds:'',
  loan:'',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  address: '',

  // Emergency Contact
  contactName: '',
  relationship: '',
  contactPhone: '',
  contactEmail: '',

  // Employment Info
  position: '',
  department: '',
  employment_type: '',
  hire_date: '',
  reporting_manager: '',
  work_location: '',

  // Employment History (1st entry, others go into employmentHistory array)
  responsibilities: '',
  previous_company: '',
  previous_start_date: '',
  previous_end_date: '',
  previous_position: '',

  // 💰 Salary Fields
  base_salary: '',
  pay_frequency: '',
  housing_allowance: '',
  transport_allowance: '',
  medical_allowance: '',
  other_allowances: '',

  // 🏦 Payment Info
  bank_name: '',
  account_number: '',
  routing_number: '',
  payment_method: '',
  documents_authentic: false,
resume: null,
id_proof: null,
employment_contract: null,
medical_certificate: null,
education_certificates: null,

});


const [positions, setPositions] = useState([]);
const [showModal, setShowModal] = useState(false);
const [departments, setDepartments] = useState([]);
const [enumData, setEnumData] = useState({}); // user_type enums
useEffect(() => {
  const fetchDropdowns = async () => {
    try {
      const [positionsRes, departmentsRes, enumsRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/v1/positions"),
        fetch("http://127.0.0.1:8000/api/v1/departments"),
        fetch("http://127.0.0.1:8000/api/v1/enums/users")
      ]);

      const [positionsData, departmentsData, enumsData] = await Promise.all([
        positionsRes.json(),
        departmentsRes.json(),
        enumsRes.json()
      ]);

      console.log("Positions API:", positionsData);
      console.log("Departments API:", departmentsData);
      console.log("Enums API:", enumsData);

      setPositions(positionsData.positions); // ✅ correct // fallback if no .data
      setDepartments(departmentsData.data ?? departmentsData);
      setEnumData(enumsData);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  fetchDropdowns();
}, []);
const handleOpenModal = () => {
  const selected = state.employees.find(emp => emp.id === state.selectedEmployeeId); // if selectedEmployeeId is already set
  setState(prev => ({
    ...prev,
    selectedEmployee: selected,
  }));
  setShowModal(true);
};

const handleCloseModal = () => setShowModal(false);

  const [employmentHistory, setEmploymentHistory] = useState([
  {
    previous_company: '',
    start_date: '',
    end_date: '',
    position: '',
    responsibilities: ''
  }
]);
const [activeTab, setActiveTab] = useState('personal');
const [statusLoading, setStatusLoading] = useState(false);
const handleNext = () => {
  if (activeTab === 'personal') setActiveTab('employment');
  else if (activeTab === 'employment') setActiveTab('salary');
  else if (activeTab === 'salary') setActiveTab('documents');
};

const handleAddExperience = () => {
  setEmploymentHistory([...employmentHistory, {
    previous_company: '',
    start_date: '',
    end_date: '',
    position: '',
    responsibilities: ''
  }]);
};

const handleRemoveExperience = (index) => {
  const updated = [...employmentHistory];
  updated.splice(index, 1);
  setEmploymentHistory(updated);
};

  const handleEdit = (id) => {
    setSelectedEmpId(id);
    setShowEdit(true);
  };


useEffect(() => {
  if (selectedEmpId) {
    axios.get(`http://127.0.0.1:8000/api/v1/users/${selectedEmpId}`)
      .then(res => {
        const data = res.data;

        // ✅ Set form data - Personal, Emergency, Employment, Salary, Payment, Docs
        setFormData({
          // Personal Info
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          dob: formatDate(data.date_of_birth), // ✅ make sure formatDate handles null
          gender: data.gender || '',
          address: data.address || '',

          // Emergency Contact
          contactName: data.emergency_contact_name || '',
          relationship: data.emergency_contact_relationship || '',
          contactPhone: data.emergency_contact_phone || '',
          contactEmail: data.emergency_contact_email || '',

          // Employment Info
          position: data.position || '',
          department: data.department || '',
          employment_type: data.employment_type || '',
          hire_date: formatDate(data.hire_date),
          reporting_manager: data.reporting_manager || '',
          work_location: data.work_location || '',

          // Salary Fields
          base_salary: data.base_salary || '',
          pay_frequency: data.pay_frequency || '',
          housing_allowance: data.housing_allowance || '',
          transport_allowance: data.transport_allowance || '',
          medical_allowance: data.medical_allowance || '',
          other_allowances: data.other_allowances || '',
          ptax: data.ptax || '',
            tds: data.tds || '',
            loan: data.loan || '',

          // Payment Info
          bank_name: data.bank_name || '',
          account_number: data.account_number || '',
          routing_number: data.routing_number || '',
          payment_method: data.payment_method || '',

          // Documents (initialize empty for update form)
          documents_authentic: false,
          resume: null,
          id_proof: null,
          employment_contract: null,
          medical_certificate: null,
          education_certificates: null,
        });

        // ✅ Employment History
        setEmploymentHistory(
          (data.employment_histories || []).map((exp) => ({
            previous_company: exp.previous_company || '',
            previous_start_date: formatDate(exp.previous_start_date),
            previous_end_date: formatDate(exp.previous_end_date),
            previous_position: exp.previous_position || '',
            previous_responsibilities: exp.previous_responsibilities || ''
          }))
        );
      })
      .catch(err => console.error("Error fetching employee:", err));
  }
}, [selectedEmpId]);



const formatDate = (dateString) => {
  return dateString ? new Date(dateString).toISOString().split('T')[0] : '';
};


  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/v1/users/${selectedEmpId}`, formData);
      setShowEdit(false);
      fetchEmployees();
      toast.success("Employee updated successfully");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err);
      toast.error("Failed to update employee");
    }
  };

  // State management
  

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [searchTerm, setSearchTerm] = useState("");

  // Constants
 const [leaveTypes, setLeaveTypes] = useState([]);
 
   useEffect(() => {
     const fetchLeaveTypes = async () => {
       try {
         const response = await axios.get("http://127.0.0.1:8000/api/v1/leave-requests/enums");
         setLeaveTypes(response.data.leave_type || []);
       } catch (error) {
         console.error("Error fetching leave types:", error);
       }
     };
 
     fetchLeaveTypes();
   }, []);

  const [priorities, setPriorities] = useState([]);

useEffect(() => {
  const fetchPriorities = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/messages/priorities");
      setPriorities(res.data.priorities || []);
    } catch (error) {
      console.error("Error fetching priorities:", error);
    }
  };

  fetchPriorities();
}, []);
const handleCheckIn = async (userId) => {
  try {
    const res = await axios.post('http://127.0.0.1:8000/api/v1/attendance/check-in', {
      user_id: userId,
    });
    toast.success(res.data.message);
  } catch (err) {
    toast.error(err.response?.data?.message || 'Check-in failed');
  }
};

const handleCheckOut = async (userId) => {
  try {
    const res = await axios.post('http://127.0.0.1:8000/api/v1/attendance/check-out', {
      user_id: userId,
    });
    toast.success(res.data.message);
  } catch (err) {
    toast.error(err.response?.data?.message || 'Check-out failed');
  }
};
  const iconStyle = {
    backgroundColor: '#800080',
    borderRadius: '50%',
    padding: '6px',
    fontSize:"15px",
    color: 'white',
    marginRight: '8px',
  };
const handlePrintsSlip = async () => {
  const response = await axios.post(
    'http://127.0.0.1:8000/api/v1/payroll/print-slip',
    {
      employee: {
        first_name: state.selectedEmployee?.first_name,
        last_name: state.selectedEmployee?.last_name,
        emp_code: state.selectedEmployee?.emp_code,
        id: state.selectedEmployee?.id,
      },
      month: state.payrollMonth,
      payroll: {
        basic_salary: state.payrollDetails?.basic_salary || 0,
        hra: state.payrollDetails?.hra || 0,
        transport_allowance: state.payrollDetails?.transport_allowance || 0,

        // NEW: Matching all modal fields
        salary_deduction: state.payrollDetails?.salary_deduction || 0,
        leave_deduction: state.payrollDetails?.leave_deduction || 0,
        professional_tax: state.payrollDetails?.professional_tax || 0,
        tds: state.payrollDetails?.tds || 0,
        loan_recovery: state.payrollDetails?.loan_recovery || 0,

        // Totals
        total_earnings: state.payrollDetails?.total_earnings || 0,
        total_deductions: state.payrollDetails?.total_deductions || 0,
        net_pay: state.payrollDetails?.net_pay || 0,
      },
    },
    {
      responseType: 'blob', // For PDF download
    }
  );

  // Download PDF
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Payroll-Slip.pdf');
  document.body.appendChild(link);
  link.click();
};

  const tabLabel = (Icon, label) => (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      <Icon style={iconStyle} />
      <span>{label}</span>
    </span>
  );
  const tabKeys = ["personal", "employment", "salary", "documents"];

  // API endpoints
  const API_ENDPOINTS = {
    employees: "http://127.0.0.1:8000/api/v1/employees",
    employee: (id) => `http://127.0.0.1:8000/api/v1/employees/${id}`,
    documents: (id) => `http://127.0.0.1:8000/api/v1/employee/${id}/documents`,
    upload: (id) => `http://127.0.0.1:8000/api/v1/employee/${id}/upload-document`
  };

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      setState(prev => ({ ...prev, loading: { ...prev.loading, employees: true } }));
      const res = await fetch(API_ENDPOINTS.employees);
      const data = await res.json();

      if (res.ok) {
        setState(prev => ({
          ...prev,
          employees: data.data || [],
          loading: { ...prev.loading, employees: false }
        }));
      } else {
        console.error("Failed to fetch employees:", data.message);
        setState(prev => ({ ...prev, loading: { ...prev.loading, employees: false } }));
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setState(prev => ({ ...prev, loading: { ...prev.loading, employees: false } }));
    }
  };

  // Fetch single employee
  const fetchEmployee = async (id) => {
    try {
      setState(prev => ({...prev, loading: {...prev.loading, employee: true}}));
      const res = await fetch(API_ENDPOINTS.employee(id));
      const data = await res.json();
      
      if (res.ok) {
        setState(prev => ({
          ...prev,
          selectedEmployee: data,
          loading: {...prev.loading, employee: false}
        }));
      } else {
        console.error("Failed to fetch employee:", data.message);
        setState(prev => ({...prev, loading: {...prev.loading, employee: false}}));
      }
    } catch (error) {
      console.error("Failed to fetch employee:", error);
      setState(prev => ({...prev, loading: {...prev.loading, employee: false}}));
    }
  };

  // Fetch documents
  const fetchDocuments = async (employeeId) => {
    try {
      setState(prev => ({...prev, loading: {...prev.loading, documents: true}}));
      const res = await fetch(API_ENDPOINTS.documents(employeeId));
      const data = await res.json();
      
      if (res.ok) {
        setState(prev => ({
          ...prev,
          documents: data.data || [],
          loading: {...prev.loading, documents: false}
        }));
      } else {
        console.error("Failed to fetch documents:", data.message);
        setState(prev => ({...prev, loading: {...prev.loading, documents: false}}));
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      setState(prev => ({...prev, loading: {...prev.loading, documents: false}}));
    }
  };

  // Upload document
  const uploadDocument = async () => {
    const { selectedEmployeeId, newDocument } = state;
    
    if (!newDocument.title || !newDocument.file) {
      alert("Please provide both title and file");
      return;
    }

    try {
      setState(prev => ({...prev, uploading: true}));
      
      const formData = new FormData();
      formData.append("title", newDocument.title);
      formData.append("type", "custom");
      formData.append("file", newDocument.file);

      const res = await fetch(API_ENDPOINTS.upload(selectedEmployeeId), {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      
      if (res.ok) {
        await fetchDocuments(selectedEmployeeId);
        setState(prev => ({
          ...prev,
          showUploadInput: false,
          uploading: false,
          newDocument: { title: "", file: null }
        }));
        toast.success("Document uploaded successfully");
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`);
      setState(prev => ({...prev, uploading: false}));
    }
  };

 
const handleChange = (e) => {
  const { name, value, type, checked, files } = e.target;

  const fieldValue =
    type === "checkbox"
      ? checked
      : type === "file"
      ? files[0] || null
      : value;

  setState((prevState) => {
    const newState = { ...prevState };

    // If field exists in leaveData, update leaveData
    if (name in prevState.leaveData) {
      newState.leaveData = {
        ...prevState.leaveData,
        [name]: fieldValue,
      };
    }

    // If field exists in messageData, update messageData
    if (name in prevState.messageData) {
      newState.messageData = {
        ...prevState.messageData,
        [name]: fieldValue,
      };
    }

    return newState;
  });
};

const handleInputChanges = (e) => {
  const { name, value, type, checked, files } = e.target;
  
  // Handle different input types
  const fieldValue = type === 'checkbox' 
    ? checked 
    : type === 'file' 
      ? files[0] 
      : value;

  setFormData(prev => ({
    ...prev,
    [name]: fieldValue
  }));
};


const handleGenerateDocument = async (employeeId) => {
  try {
    const response = await axios.post(`http://127.0.0.1:8000/api/v1/employee/${employeeId}/generate-document`);
    console.log("Document generated:", response.data);
    toast.success("Document generated successfully!");
    // trigger any additional logic like refreshing list
  } catch (error) {
    console.error("Error generating document:", error);
    toast.error("Failed to generate document.");
  }
};
const handleExperienceChange = (index, field, value) => {
  const updated = [...employmentHistory];
  updated[index][field] = value;
  setEmploymentHistory(updated);
};


  // Handle leave submission
  const handleSubmitLeave = async (e) => {
    e.preventDefault();

    const payload = {
      employee_id: state.selectedEmployee?.id,
      leave_type: state.leaveData.leaveType,
      from_date: state.leaveData.fromDate,
      to_date: state.leaveData.toDate,
      reason: state.leaveData.reason,
      is_emergency: state.leaveData.isEmergency,
      status: 'PENDING'
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/leave/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json();
        console.error(error);
        toast.error("Leave submission failed.");
        return;
      }

      toast.success("Leave submitted successfully.");
      setState(prev => ({ ...prev, showLeaveModal: false }));

    } catch (err) {
      console.error("Error submitting leave:", err);
      toast.error("Something went wrong.");
    }
  };

  const handleAutoApprove = async () => {
    const payload = {
      employee_id: state.selectedEmployee?.id,
      leave_type: state.leaveData.leaveType,
      from_date: state.leaveData.fromDate,
      to_date: state.leaveData.toDate,
      reason: state.leaveData.reason,
      is_emergency: state.leaveData.isEmergency,
      status: 'APPROVED'
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/leave/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json();
        console.error(error);
        toast.error("Auto-approval failed.");
        return;
      }

      toast.success("Leave auto-approved!");
      setState(prev => ({ ...prev, showLeaveModal: false }));
    } catch (err) {
      console.error("Error in auto-approval:", err);
      toast.error("Something went wrong.");
    }
  };

  // Handle message submission
  const handleSubmitMessage = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: state.selectedEmployee?.id,
      subject: state.messageData.subject,
      content: state.messageData.content,
      priority: state.messageData.priority
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error("Failed to send message.");
        console.error(error);
        return;
      }

      toast.success("Message sent successfully!");

      setState(prev => ({
        ...prev,
        showMessageModal: false,
        messageData: {
          subject: '',
          content: '',
          priority: 'normal'
        }
      }));

    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong!");
    }
  };

  // Initialize component
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDeleteEmployee = async (employeeId) => {
    if (!employeeId) {
      toast.error("No employee selected.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/users/${employeeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete employee.");
        return;
      }

      toast.success("Employee deleted successfully!");

      setState(prev => ({
        ...prev,
        selectedEmployee: null,
        employees: prev.employees.filter(emp => emp.id !== employeeId)
      }));

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  const fetchPayrollDetails = async (employee) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/payroll/employee/${employee.id}/details`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch payroll");

      setState(prev => ({
        ...prev,
        selectedEmployee: employee,
        payrollDetails: data,
        payrollMonth: data.month || new Date(),
        showPayrollModal: true
      }));
    } catch (err) {
      console.error(err);
      toast.error("Unable to load payroll details");
    }
  };

      const filteredEmployees = state.employees.filter(emp => {
      const search = searchTerm.toLowerCase();
      const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.toLowerCase();

      return (
        (emp.first_name?.toLowerCase().includes(search)) ||
        (emp.last_name?.toLowerCase().includes(search)) ||
        (emp.emp_code?.toLowerCase().includes(search)) ||
        fullName.includes(search)
      );
    });


  const paginatedData = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper functions
  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'pdf': return <FaFilePdf className="text-danger" />;
      case 'word': return <FaFileWord className="text-primary" />;
      case 'image': return <FaFileImage className="text-success" />;
      default: return <FaFileAlt />;
    }
  };
const handleStatusChange = async (userId, status) => {
  if (statusLoading) return;
  try {
    setStatusLoading(true);
    const response = await fetch(`http://127.0.0.1:8000/api/v1/users/${userId}/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    if (data.success) {
      toast.success("Attendance status updated successfully");

      // ✅ Update local state: set emp.attendance = new status
      setState(prev => ({
        ...prev,
        employees: prev.employees.map(emp =>
          emp.id === userId ? { ...emp, attendance: status } : emp
        )
      }));

     
       await fetchEmployees();
    } else {
      toast.error("Failed to update attendance");
    }
  } catch (error) {
    console.error("Error updating status:", error);
    toast.error("Something went wrong while updating status");
  } finally {
    setStatusLoading(false);
  }
};


  const unsuspendEmployee = async (empId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/employees/${empId}/unsuspend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Employee unsuspended successfully");
        setState(prev => ({
          ...prev,
          employees: prev.employees.map(emp =>
            emp.id === empId ? { ...emp, suspend: false } : emp
          )
        }));
        fetchEmployees();
      } else {
        toast.error(data.message || "Failed to unsuspend employee");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong while unsuspending.");
    }
  };

  const suspendEmployee = async (empId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/employees/${empId}/suspend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Employee suspended successfully");
        setState(prev => ({
          ...prev,
          employees: prev.employees.map(emp =>
            emp.id === empId ? { ...emp, suspend: true } : emp
          )
        }));
        fetchEmployees();
      } else {
        toast.error(data.message || "Failed to suspend employee");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong while suspending.");
    }
  };

  const openDocumentModal = (employeeId) => {
    setState(prev => ({
      ...prev,
      selectedEmployeeId: employeeId,
      showDocumentModal: true
    }));
    fetchEmployee(employeeId);
    fetchDocuments(employeeId);
  };

  // Styles
  const styles = {
    actionBtn: {
      padding: "4px 8px",
      minWidth: "20px",
      height: "25px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    tableCell: {
      padding: "8px 0",
      color: "#333"
    },
    valueCell: {
      padding: "8px 0",
      textAlign: "right",
      fontWeight: "500"
    },
    totalLabel: {
      padding: "10px 0",
      fontWeight: "bold",
      color: "#1b5e20"
    },
    totalValue: {
      padding: "10px 0",
      textAlign: "right",
      fontWeight: "bold",
      color: "#1b5e20"
    }
  };
useImperativeHandle(ref, () => ({
  getExportData: () => {
    return paginatedData.map(emp => ({
      ID: emp.id,
      "EMP CODE":`EMP ${emp.id}`,
      Name: `${emp.first_name || ""} ${emp.last_name || ""}`.trim(),
      Email: emp.email || "N/A",
      Phone: emp.phone || "N/A",
      Department: emp.department_relation?.department_name || "N/A",
      Position: emp.position || "N/A",
      "Base Salary": emp.base_salary || "N/A",
      "Leave Taken": emp.leave_days ?? "N/A",
      "Total Leaves": emp.total_leaves ?? "N/A",
      "Leave Days": emp.leave_days ?? "N/A",
      "Daily Hours": emp.daily_hours ?? "N/A",
      "Monthly Hours": emp.monthly_hours ?? "N/A",
      "Status": emp.status === 1 ? "Active" : "Inactive"


    }));
  }
}));



  return (
    <div className="p-3">
      <div className="d-flex justify-content-end mb-3" style={{ maxWidth: "600px", marginLeft: "auto" }}>
        <Form.Control
          type="text"
          placeholder="Search employees by name"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      {/* Main Table */}
      <div className="p-3 mx-0">
        <div className="d-flex align-items-center mb-3" style={{ fontSize: "12px" }}>
          
          <strong>{selectedIds.length} Selected</strong>
        </div>

        <Table striped bordered hover responsive style={{ fontSize: "10px" }}>
          <thead style={{ backgroundColor: "#e9ecef" }}>
            <tr>
              <th style={{ width: "10%", textAlign: "center" }}>#</th>
              <th style={{ width: "10%" }}>Employee</th>
              <th style={{ width: "5%" }}>Department</th>
              <th style={{ width: "5%" }}>Position</th>
              <th style={{ width: "5%" }}>Status</th>
              <th style={{ width: "5%" }}>Attendance</th>
              <th style={{ width: "5%", textAlign: "right" }}>Payroll</th>
              <th style={{ width: "5%" }}>Leaves</th>
              <th style={{ width: "25%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.loading.employees ? (
              <tr>
                <td colSpan="9" className="text-center">
                  <Spinner animation="border" size="sm" /> Loading employees...
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">No employees found</td>
              </tr>
            ) : (
              paginatedData.map(emp => (
                <tr key={emp.id} style={{ height: "38px" }}>
                  <td style={{ textAlign: "center" }}>
                     <input
            type="checkbox"
            checked={selectedIds.includes(emp.id)}
            onChange={(e) => handleCheckboxChange(emp.id, e.target.checked)}
          />

                  </td>

                  <td style={{ fontWeight: "500", wordBreak: "break-word" }}>
                    {emp.emp_code} {emp.first_name} {emp.last_name}
                  </td>

                  <td>{emp.department_relation?.department_name || 'N/A'}</td>

                  <td>{emp.position}</td>

                  <td>
                    <Badge
                      bg={emp.status === 1 ? "success" : "secondary"}
                      style={{ fontSize: "12px" }}
                    >
                      {emp.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </td>

                 <td>
                    <div className="d-flex align-items-center" style={{ minWidth: "100px" }}>
                      <ButtonGroup
                        style={{
                          border: "1px solid #dee2e6",
                          padding: "4px 6px",
                          display: "flex",
                          alignItems: "center",
                          fontSize: "11px",
                          color: "#495057",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "4px"
                        }}
                      >
                        {/* Clock + Daily Hours */}
                        <div className="d-flex align-items-center" style={{ gap: "4px", minWidth: "60px" }}>
                          <FaClock size={12} color="#6c757d" />
                          <span style={{ whiteSpace: "nowrap" }}>
                            {
                              (() => {
                                const time = emp.daily_hours || emp.monthly_hours;
                                if (!time || time === "00:00") return "0 h/d";

                                const [h, m] = time.split(":").map(Number);
                                const hours = h + m / 60;
                                return `${hours.toFixed(1)} h/d`;
                              })()
                            }
                          </span>
                        </div>

                        {/* Separator */}
                        <div style={{ padding: "0 6px", color: "#ccc" }}>|</div>

                        {/* Calendar + Monthly Days */}
                        <div className="d-flex align-items-center" style={{ gap: "4px", minWidth: "60px" }}>
                          <FaCalendarAlt size={12} color="#6c757d" />
                          <span style={{ whiteSpace: "nowrap" }}>
                            {
                              emp.working_days ? `${emp.working_days}d/m` :
                                emp.leave_days ? `${emp.leave_days}d/m` : "0d/m"
                            }
                          </span>
                        </div>

                        {/* Separator */}
                        <div style={{ padding: "0 6px", color: "#ccc" }}>|</div>

                        {/* Attendance Dropdown */}
                        <Dropdown as={ButtonGroup}>
                          <Dropdown.Toggle
                            variant="light"
                            size="sm"
                            style={{
                              padding: "2px 8px",
                              fontWeight: "500",
                              fontSize: "11px",
                              lineHeight: "1",
                              border: "none",
                              backgroundColor: "transparent",
                              color: "#000"
                            }}
                          >
                            {(emp.attendance || "").charAt(0).toUpperCase() || "P"}
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleStatusChange(emp.id, 'present')}>
                              <FaUserCheck className="me-2 text-success" />
                              Present
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleStatusChange(emp.id, 'absent')}>
                              <FaUserTimes className="me-2 text-danger" />
                              Absent
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleStatusChange(emp.id, 'late')}>
                              <FaUserClock className="me-2 text-warning" />
                              Late
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleViewHistory(emp.id)}>
                              <FaRegCalendarAlt className="me-2 text-primary" />
                              View History
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleCheckIn(emp.id)} style={{ display: 'flex', alignItems: 'center' }}>
                              <LogInIcon style={{ fontSize: "12px", marginRight: "5px" }} className="text-primary" />
                              Check In
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleCheckOut(emp.id)} style={{ display: 'flex', alignItems: 'center' }}>
                              <LogOutIcon style={{ fontSize: "12px", marginRight: "5px" }} className="text-primary" />
                              Check Out
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </ButtonGroup>
                    </div>
                  </td>




                  <td
                    style={{ ...styles.valueCell, cursor: "pointer" }}
                    onClick={() => fetchPayrollDetails(emp)}
                  >
                    ₹{emp.base_salary?.toLocaleString() || "0"}
                  </td>

                              <td style={{ cursor: 'pointer' }}>
                  <Dropdown>
                  <Dropdown.Toggle
                  variant="light"
                  id={`dropdown-${emp.id}`}
                  style={{
                    color: '#00A0B5',
                    border: '1px solid #00A0B5',
                    borderRadius: '5px',
                    width: '60px',
                    padding: '4px 12px',
                    backgroundColor: 'white',
                    fontWeight: '500',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  {/* Display only Casual Leave and Sick Leave counts */}
                  <span>
                    {(emp.leave_type_counts?.['Casual Leave'] || 0)}/
                    {(emp.leave_type_counts?.['Sick Leave'] || 0)}
                  </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    fill="#00A0B5"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.5 5.5l6 6 6-6" />
                  </svg>
                </Dropdown.Toggle>


                    <Dropdown.Menu style={{ minWidth: '200px', padding: '10px' }}>
                  {/* Title */}
                  <div
                    style={{
                      fontWeight: '600',
                      color: '#6c757d',
                      fontSize: '13px',
                      padding: '5px 12px',
                    }}
                  >
                    Leave Balance
                  </div>

                  {/* Always show Casual Leave and Sick Leave on top in fixed order */}
                  <Dropdown.ItemText style={{ fontSize: '14px', paddingLeft: '12px' }}>
                    Casual Leave: {emp.leave_type_counts?.['Casual Leave'] || 0}
                  </Dropdown.ItemText>
                  <Dropdown.ItemText style={{ fontSize: '14px', paddingLeft: '12px' }}>
                    Sick Leave: {emp.leave_type_counts?.['Sick Leave'] || 0}
                  </Dropdown.ItemText>

                  {/* Divider if other leave types exist */}
                  {Object.entries(emp.leave_type_counts || {}).some(
                    ([type]) => type !== 'Casual Leave' && type !== 'Sick Leave'
                  ) && <Dropdown.Divider />}

                  {/* Show remaining leave types */}
                  {Object.entries(emp.leave_type_counts || {})
                    .filter(([type]) => type !== 'Casual Leave' && type !== 'Sick Leave')
                    .map(([type, count]) => (
                      <Dropdown.ItemText
                        key={type}
                        style={{ fontSize: '14px', paddingLeft: '12px' }}
                      >
                        {type}: {count}
                      </Dropdown.ItemText>
                    ))}

                  <Dropdown.Divider />

                  {/* New Request Action */}
                  <Dropdown.Item
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      paddingLeft: '12px',
                    }}
                    onClick={() =>
                      setState((prev) => ({
                        ...prev,
                        selectedEmployee: emp,
                        showLeaveModal: true,
                      }))
                    }
                  >
                    <Umbrella size={16} />
                    New Request
                  </Dropdown.Item>
                </Dropdown.Menu>

                  </Dropdown>
                </td>






                 <td>
  <div
    className="d-flex justify-content-center"
    style={{
      gap: "6px",
      flexWrap: "nowrap",
      overflowX: "auto",
      whiteSpace: "nowrap"
    }}
  >
    <Button
      variant="outline-primary"
      size="sm"
      title="Message"
      style={styles.actionBtn}
      onClick={() =>
        setState(prev => ({
          ...prev,
          selectedEmployee: {
            ...emp,
            name: `${emp.first_name} ${emp.last_name}`
          },
          showMessageModal: true
        }))
      }
    >
      <FaEnvelope />
    </Button>

    <Button
      variant="outline-secondary"
      size="sm"
      title="Edit"
      style={styles.actionBtn}
      onClick={() => handleEdit(emp.id)}
    >
      <FaEdit />
    </Button>

    <Button
      variant="outline-danger"
      size="sm"
      title="Delete"
      style={styles.actionBtn}
      onClick={() => handleDeleteEmployee(emp.id)}
    >
      <FaTrash />
    </Button>

    <Button
      variant={emp.suspend === 1 ? "outline-success" : "outline-warning"}
      size="sm"
      title={emp.suspend === 1 ? "Unsuspend" : "Suspend"}
      onClick={() =>
        emp.suspend === 1 ? unsuspendEmployee(emp.id) : suspendEmployee(emp.id)
      }
    >
      {emp.suspend === 1 ? <FaCheckCircle /> : <FaBan />}
    </Button>

    <Button
      variant="outline-success"
      size="sm"
      title="View Documents"
      style={styles.actionBtn}
      onClick={() => openDocumentModal(emp.id)}
    >
      <FaFileAlt />
    </Button>
  </div>
</td>

                </tr>
              ))
            )}
          </tbody>
        </Table>
     
        <div className="d-flex justify-content-end mt-3">
          <Pagination>
            <Pagination.First 
              onClick={() => setCurrentPage(1)} 
              disabled={currentPage === 1} 
            />
            <Pagination.Prev 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1} 
            />

            {Array.from({ length: Math.ceil(filteredEmployees.length / itemsPerPage) }, (_, i) => (
              <Pagination.Item 
                key={i + 1} 
                active={i + 1 === currentPage} 
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}

                            <Pagination.Next 
                    onClick={() => setCurrentPage(prev => {
                      const maxPage = Math.max(1, Math.ceil(filteredEmployees.length / itemsPerPage));
                      return Math.min(prev + 1, maxPage);
                    })} 
                    disabled={currentPage >= Math.ceil(filteredEmployees.length / itemsPerPage) || filteredEmployees.length === 0}
                  />

            <Pagination.Last 
              onClick={() => setCurrentPage(Math.ceil(filteredEmployees.length / itemsPerPage))} 
              disabled={currentPage === Math.ceil(filteredEmployees.length / itemsPerPage)} 
            />
          </Pagination>
        </div>
      </div>

      {/* Edit Modal */}
      
            <div 
        style={{
          display: showEdit ? 'block' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1050,
          overflow: 'auto'
        }}
      >
        <div 
          style={{
            backgroundColor: 'white',
            margin: '2rem auto',
            maxWidth: '900px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)'
          }}
        >
          {/* Header */}
          <div 
            style={{
              backgroundColor: '#800080',
              color: 'white',
              padding: '1rem',
              borderTopLeftRadius: '5px',
              borderTopRightRadius: '5px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <i className="bi bi-pencil-square me-2"></i>
              <h3 style={{ color: 'white', margin: 0 }}>Edit Employee</h3>
            </div>
            <button 
              onClick={() => setShowEdit(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '1rem' }}>
            <div className="tabs-container">
              {/* Tabs Navigation */}
              <div 
                style={{
                  display: 'flex',
                  borderBottom: '1px solid #dee2e6',
                  marginBottom: '1rem'
                }}
              >
                <button
                  onClick={() => setActiveTab('personal')}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    backgroundColor: activeTab === 'personal' ? '#f8f9fa' : 'transparent',
                    borderBottom: activeTab === 'personal' ? '2px solid #3b5998' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <FaUser style={{ marginRight: '0.5rem' }} />
                  Personal
                </button>
                <button
                  onClick={() => setActiveTab('employment')}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    backgroundColor: activeTab === 'employment' ? '#f8f9fa' : 'transparent',
                    borderBottom: activeTab === 'employment' ? '2px solid #3b5998' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <FaBriefcase style={{ marginRight: '0.5rem' }} />
                  Employment
                </button>
                <button
                  onClick={() => setActiveTab('salary')}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    backgroundColor: activeTab === 'salary' ? '#f8f9fa' : 'transparent',
                    borderBottom: activeTab === 'salary' ? '2px solid #3b5998' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <FaMoneyBill style={{ marginRight: '0.5rem' }} />
                  Salary
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    backgroundColor: activeTab === 'documents' ? '#f8f9fa' : 'transparent',
                    borderBottom: activeTab === 'documents' ? '2px solid #3b5998' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <FaFileAlt style={{ marginRight: '0.5rem' }} />
                  Documents
                </button>
              </div>

              {/* Tab Content */}
              <div>
                {/* Personal Tab */}
                {activeTab === 'personal' && (
                  <div>
                    <form>
                      <div style={{ display: 'flex', marginBottom: '1rem' }}>
                        <div style={{ flex: 1, marginRight: '1rem' }}>
                          <label>First Name</label>
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChanges}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label>Last Name</label>
                          <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChanges}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', marginBottom: '1rem' }}>
                        <div style={{ flex: 1, marginRight: '1rem' }}>
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChanges}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label>Phone</label>
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChanges}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', marginBottom: '1rem' }}>
                        <div style={{ flex: 1, marginRight: '1rem' }}>
                          <label>Date of Birth</label>
                          <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChanges}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label>Gender</label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChanges}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          >
                            <option value="">Select gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                            <option>Prefer not to say</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <label>Address</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChanges}
                          style={{
                            width: '100%',
                            padding: '0.375rem 0.75rem',
                            border: '1px solid #ced4da',
                            borderRadius: '0.25rem'
                          }}
                        />
                      </div>

                      <hr />
                      <h4 style={{ color: '#3b5998', display: 'flex', alignItems: 'center' }}>
                        <i className="bi bi-person-lines-fill" style={{ fontSize: "15px", marginRight: '0.5rem' }}></i>
                        Emergency Contact
                      </h4>

                      <div style={{ display: 'flex', marginBottom: '1rem' }}>
                        <div style={{ flex: 1, marginRight: '1rem' }}>
                          <label>Contact Name</label>
                          <input
                            type="text"
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleInputChanges}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label>Relationship</label>
                          <input
                            type="text"
                            name="relationship"
                            value={formData.relationship}
                            onChange={handleInputChanges}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex' }}>
                        <div style={{ flex: 1, marginRight: '1rem' }}>
                          <label>Contact Phone</label>
                          <input
                            type="text"
                            name="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleInputChanges}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label>Contact Email</label>
                          <input
                            type="email"
                            name="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleInputChanges}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Employment Tab */}
                {activeTab === 'employment' && (
                  <div style={{ padding: '1rem' }}>
                    <form>
                      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <div style={{ flex: '0 0 50%', maxWidth: '50%', padding: '0 0.5rem' }}>
                          <label>Position</label>
                          <select
                            name="position"
                            value={formData.position}
                            onChange={handleInputChanges}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          >
                            <option value="">Select position</option>
                            {positions.map((pos, index) => (
                              <option key={index} value={pos}>{pos}</option>
                            ))}
                          </select>
                        </div>

                        <div style={{ flex: '0 0 50%', maxWidth: '50%', padding: '0 0.5rem' }}>
                          <label>Department</label>
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleInputChanges}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          >
                            <option value="">Select department</option>
                            {departments.map((dept) => (
                              <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                            ))}
                          </select>
                        </div>

                        <div style={{ flex: '0 0 50%', maxWidth: '50%', padding: '0 0.5rem', marginTop: '1rem' }}>
                          <label>Employment Type</label>
                          <select
                            name="employment_type"
                            value={formData.employment_type}
                            onChange={handleInputChanges}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          >
                            <option value="">Select type</option>
                            {enumData?.employmentType?.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>

                        <div style={{ flex: '0 0 50%', maxWidth: '50%', padding: '0 0.5rem', marginTop: '1rem' }}>
                          <label>Hire Date</label>
                          <input
                            type="date"
                            name="hire_date"
                            value={formData.hire_date}
                            onChange={handleInputChanges}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>

                        <div style={{ flex: '0 0 50%', maxWidth: '50%', padding: '0 0.5rem', marginTop: '1rem' }}>
                          <label>Reporting Manager</label>
                          <select
                            name="reporting_manager"
                            value={formData.reporting_manager}
                            onChange={handleInputChanges}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          >
                            <option value="">Select manager</option>
                            {enumData?.reportingManager?.map((manager) => (
                              <option key={manager} value={manager}>{manager}</option>
                            ))}
                          </select>
                        </div>

                        <div style={{ flex: '0 0 50%', maxWidth: '50%', padding: '0 0.5rem', marginTop: '1rem' }}>
                          <label>Work Location</label>
                          <select
                            name="work_location"
                            value={formData.work_location}
                            onChange={handleInputChanges}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          >
                            <option value="">Select location</option>
                            {enumData?.workLocation?.map((loc) => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <hr />
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <i className="bi bi-arrow-counterclockwise" style={{ fontSize: "15px", color: "#3b5998" }}></i>
                        <h5 style={{ margin: '0 0 0 0.5rem' }}>Employment History</h5>
                      </div>

                      {employmentHistory.map((exp, index) => (
                        <div key={index} style={{ marginBottom: '1rem', border: '1px solid #dee2e6', borderRadius: '0.25rem', padding: '1rem', backgroundColor: '#f8f9fa' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            <div style={{ flex: '0 0 100%', maxWidth: '100%', padding: '0 0.5rem', marginBottom: '1rem' }}>
                              <label>Previous Company</label>
                              <input
                                type="text"
                                name="previous_company"
                                value={exp.previous_company}
                                onChange={(e) => handleExperienceChange(index, 'previous_company', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '0.375rem 0.75rem',
                                  border: '1px solid #ced4da',
                                  borderRadius: '0.25rem'
                                }}
                              />
                            </div>
                            <div style={{ flex: '0 0 33.33%', maxWidth: '33.33%', padding: '0 0.5rem', marginBottom: '1rem' }}>
                              <label>Start Date</label>
                              <input
                                type="date"
                                name="previous_start_date"
                                value={exp.previous_start_date}
                                onChange={(e) => handleExperienceChange(index, 'previous_start_date', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '0.375rem 0.75rem',
                                  border: '1px solid #ced4da',
                                  borderRadius: '0.25rem'
                                }}
                              />
                            </div>
                            <div style={{ flex: '0 0 33.33%', maxWidth: '33.33%', padding: '0 0.5rem', marginBottom: '1rem' }}>
                              <label>End Date</label>
                              <input
                                type="date"
                                name="previous_end_date"
                                value={exp.previous_end_date}
                                onChange={(e) => handleExperienceChange(index, 'previous_end_date', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '0.375rem 0.75rem',
                                  border: '1px solid #ced4da',
                                  borderRadius: '0.25rem'
                                }}
                              />
                            </div>
                            <div style={{ flex: '0 0 33.33%', maxWidth: '33.33%', padding: '0 0.5rem', marginBottom: '1rem' }}>
                              <label>Position</label>
                              <input
                                type="text"
                                name="previous_position"
                                value={exp.previous_position}
                                onChange={(e) => handleExperienceChange(index, 'previous_position', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '0.375rem 0.75rem',
                                  border: '1px solid #ced4da',
                                  borderRadius: '0.25rem'
                                }}
                              />
                            </div>
                            <div style={{ flex: '0 0 100%', maxWidth: '100%', padding: '0 0.5rem', marginBottom: '1rem' }}>
                              <label>Responsibilities</label>
                              <textarea
                                rows={2}
                                name="previous_responsibilities"
                                value={exp.previous_responsibilities}
                                onChange={(e) => handleExperienceChange(index, 'previous_responsibilities', e.target.value)}
                                style={{
                                  width: '100%',
                                  padding: '0.375rem 0.75rem',
                                  border: '1px solid #ced4da',
                                  borderRadius: '0.25rem'
                                }}
                              />
                            </div>
                            <div style={{ flex: '0 0 100%', maxWidth: '100%', padding: '0 0.5rem', textAlign: 'right' }}>
                              <button
                                onClick={() => handleRemoveExperience(index)}
                                style={{
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.2rem',
                                  fontSize: '0.875rem',
                                  cursor: 'pointer'
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={handleAddExperience}
                        style={{
                          backgroundColor: '#0d6efd',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.2rem',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }} type="button"
                      >
                        + Add Another Position
                      </button>
                    </form>
                  </div>
                )}

                {/* Salary Tab */}
                {activeTab === 'salary' && (
                  <div style={{ padding: '1rem' }}>
                    <form>
                      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <div style={{ flex: '0 0 50%', maxWidth: '50%', padding: '0 0.5rem' }}>
                          <label>Base Salary ($)</label>
                          <input
                            type="text"
                            name="base_salary"
                            value={formData.base_salary}
                            onChange={handleInputChanges}
                            placeholder="Enter amount"
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                        <div style={{ flex: '0 0 50%', maxWidth: '50%', padding: '0 0.5rem' }}>
                          <label>Pay Frequency</label>
                          <select
                            name="pay_frequency"
                            value={formData.pay_frequency}
                            onChange={handleInputChanges}
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          >
                            <option value="">Select frequency</option>
                            {enumData?.payFrequency?.map((freq) => (
                              <option key={freq} value={freq}>{freq}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <div style={{ flex: '0 0 33.33%', maxWidth: '33.33%', padding: '0 0.5rem' }}>
                          <label>PTAX ($)</label>
                          <input
                            type="text"
                            name="ptax"
                            value={formData.ptax}
                            onChange={handleInputChanges}
                            placeholder="Enter PTAX amount"
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                        <div style={{ flex: '0 0 33.33%', maxWidth: '33.33%', padding: '0 0.5rem' }}>
                          <label>TDS ($)</label>
                          <input
                            type="text"
                            name="tds"
                            value={formData.tds}
                            onChange={handleInputChanges}
                            placeholder="Enter TDS amount"
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                        <div style={{ flex: '0 0 33.33%', maxWidth: '33.33%', padding: '0 0.5rem' }}>
                          <label>Loan Deduction ($)</label>
                          <input
                            type="text"
                            name="loan"
                            value={formData.loan}
                            onChange={handleInputChanges}
                            placeholder="Enter loan amount"
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                      </div>

                      <hr />
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <i className="bi bi-cash-coin" style={{ fontSize: "16px", color: "#3b5998", marginRight: '0.5rem' }}></i>
                        <h5 style={{ margin: 0 }}>Allowances ($)</h5>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <div style={{ flex: '0 0 50%', maxWidth: '50%', padding: '0 0.5rem' }}>
                          <label>Housing Allowance ($)</label>
                          <input
                            type="text"
                            name="housing_allowance"
                            value={formData.housing_allowance || '0'}
                            onChange={handleInputChanges}
                            placeholder="Enter amount"
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                        <div style={{ flex: '0 0 50%', maxWidth: '50%', padding: '0 0.5rem' }}>
                          <label>Transport Allowance ($)</label>
                          <input
                            type="text"
                            name="transport_allowance"
                            value={formData.transport_allowance || ''}
                            onChange={handleInputChanges}
                            placeholder="Enter amount"
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                        <div style={{ flex: '0 0 50%', maxWidth: '50%', padding: '0 0.5rem', marginTop: '1rem' }}>
                          <label>Medical Allowance ($)</label>
                          <input
                            type="text"
                            name="medical_allowance"
                            value={formData.medical_allowance || ''}
                            onChange={handleInputChanges}
                            placeholder="Enter amount"
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                        <div style={{ flex: '0 0 50%', maxWidth: '50%', padding: '0 0.5rem', marginTop: '1rem' }}>
                          <label>Other Allowances ($)</label>
                          <input
                            type="text"
                            name="other_allowances"
                            value={formData.other_allowances || '0'}
                            onChange={handleInputChanges}
                            placeholder="Enter amount"
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                      </div>

                      <hr />
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <i className="bi bi-bank2" style={{ fontSize: "15px", color: "#3b5998", marginRight: '0.5rem' }}></i>
                        <h5 style={{ margin: 0 }}>Payment Information</h5>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div style={{ flex: '0 0 50%', maxWidth: '50%', padding: '0 0.5rem', marginBottom: '1rem' }}>
                          <label>Bank Name</label>
                          <input
                            type="text"
                            name="bank_name"
                            value={formData.bank_name}
                            onChange={handleInputChanges}
                            placeholder="Enter bank name"
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                        <div style={{ flex: '0 0 50%', maxWidth: '50%', padding: '0 0.5rem', marginBottom: '1rem' }}>
                          <label>Account Number</label>
                          <input
                            type="text"
                            name="account_number"
                            value={formData.account_number}
                            onChange={handleInputChanges}
                            placeholder="Enter account number"
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                        <div style={{ flex: '0 0 50%', maxWidth: '50%', padding: '0 0.5rem', marginBottom: '1rem' }}>
                          <label>Routing Number</label>
                          <input
                            type="text"
                            name="routing_number"
                            value={formData.routing_number}
                            onChange={handleInputChanges}
                            placeholder="Enter routing number"
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                        <div style={{ flex: '0 0 50%', maxWidth: '50%', padding: '0 0.5rem', marginBottom: '1rem' }}>
                          <label>Payment Method</label>
                          <input
                            type="text"
                            name="payment_method"
                            value={formData.payment_method}
                            onChange={handleInputChanges}
                            placeholder="Enter payment method"
                            style={{
                              width: '100%',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid #ced4da',
                              borderRadius: '0.25rem'
                            }}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div style={{ padding: '1rem' }}>
                    {[
                      { label: "Upload Resume", name: "resume", desc: "PDF, DOC or DOCX (Max 5MB)", icon: "bi bi-file-earmark-arrow-up" },
                      { label: "Upload ID Proof", name: "id_proof", desc: "Passport, Driver's License or ID Card (JPG, PNG or PDF)", icon: "bi bi-person-badge" },
                      { label: "Employment Contract", name: "employment_contract", desc: "PDF or DOCX (Max 10MB)", icon: "bi bi-file-earmark-text" },
                      { label: "Medical Certificate", name: "medical_certificate", desc: "JPG, PNG or PDF (Max 5MB)", icon: "bi bi-heart-pulse" },
                      { label: "Education Certificates", name: "education_certificates", desc: "PDF, JPG or PNG (Max 10MB)", icon: "bi bi-mortarboard" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          border: '1px dashed #dee2e6',
                          borderRadius: '0.25rem',
                          padding: '1rem',
                          marginBottom: '1rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div
                            style={{
                              backgroundColor: "#3b5998",
                              color: "white",
                              borderRadius: "50%",
                              width: "40px",
                              height: "40px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontSize: "18px",
                              marginRight: '1rem'
                            }}
                          >
                            <i className={item.icon}></i>
                          </div>
                          <div>
                            <div style={{ fontWeight: 'bold' }}>{item.label}</div>
                            <div style={{ fontSize: '0.875rem', color: '#555' }}>{item.desc}</div>
                          </div>
                        </div>

                        <div>
                          <input
                            type="file"
                            name={item.name}
                            id={`file-${item.name}`}
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                          />
                          <button
                            onClick={() => document.getElementById(`file-${item.name}`).click()}
                            style={{
                              backgroundColor: 'transparent',
                              color: '#0d6efd',
                              border: '1px solid #0d6efd',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.2rem',
                              fontSize: '0.875rem',
                              cursor: 'pointer'
                            }}
                          >
                            Browse
                          </button>
                        </div>
                      </div>
                    ))}

                    <div style={{ marginTop: '1rem' }}>
                      <input
                        type="checkbox"
                        id="documents_authentic"
                        name="documents_authentic"
                        checked={formData.documents_authentic || false}
                        onChange={handleCheckboxChanges}
                        style={{ marginRight: '0.5rem' }}
                      />
                      <label htmlFor="documents_authentic">
                        I confirm that all documents provided are authentic and accurate
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div 
            style={{
              padding: '1rem',
              borderTop: '1px solid #dee2e6',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <button
              onClick={() => setShowEdit(false)}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '0.375rem 0.75rem',
                borderRadius: '0.25rem',
                marginRight: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              style={{
                backgroundColor: '#0dcaf0',
                color: 'white',
                border: 'none',
                padding: '0.375rem 0.75rem',
                borderRadius: '0.25rem',
                marginRight: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Next
            </button>
            <button
              onClick={handleUpdate}
              style={{
                backgroundColor: '#0d6efd',
                color: 'white',
                border: 'none',
                padding: '0.375rem 0.75rem',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Document Modal */}
         {state.showDocumentModal && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1050,
      overflowY: "auto",
      padding: "20px",
    }}
  >
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        maxWidth: "1000px",
        width: "100%",
        boxShadow: "0 0 15px rgba(0,0,0,0.2)",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#17a2b8",
          padding: "10px 16px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontWeight: "600", width: "100%", textAlign: "center" }}>
          Employee Documents –{" "}
          {state.loading.employees ? (
            <span className="text-light">Loading...</span>
          ) : (
            <>
              {state.selectedEmployee?.first_name} {state.selectedEmployee?.last_name}{" "}
              ({state.selectedEmployee?.emp_code || `EMP${state.selectedEmployeeId}`})
            </>
          )}
        </div>
        <button
          onClick={() => setState((prev) => ({ ...prev, showDocumentModal: false }))}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "1.5rem",
            position: "absolute",
            right: "16px",
            top: "10px",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: "20px" }}>
        {state.loading.documents ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <span>Loading documents...</span>
          </div>
        ) : (
          <>
            {/* Document Cards */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
              {Object.entries(state.documents || {})
                .filter(
                  ([key, value]) =>
                    [
                      "resume",
                      "id_proof",
                      "employment_contract",
                      "medical_certificate",
                      "education_certificates",
                      "file_path",
                    ].includes(key) && value
                )
                .map(([key, value], index) => {
                  const url = value.startsWith("http") ? value : `/storage/${value.replace(/^\/+/, "")}`;
                  const ext = url.split(".").pop().toLowerCase();
                  const isImage = ["jpg", "jpeg", "png"].includes(ext);

                  let icon;
                  if (ext === "pdf") icon = <FaFilePdf style={{ fontSize: "2rem", color: "red" }} />;
                  else if (["doc", "docx"].includes(ext)) icon = <FaFileWord style={{ fontSize: "2rem", color: "#007bff" }} />;
                  else if (isImage) icon = <FaIdCard style={{ fontSize: "2rem", color: "green" }} />;
                  else icon = <FaFileAlt style={{ fontSize: "2rem", color: "gray" }} />;

                  const title =
                    key === "file_path"
                      ? "title"
                      : key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

                  return (
                    <div
                      key={index}
                      style={{
                        border: "1px solid #dee2e6",
                        borderRadius: "12px",
                        width: "280px",
                        minHeight: "280px",
                        padding: "16px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        {icon}
                        <h5 style={{ fontWeight: "600", marginTop: "10px" }}>{title}</h5>
                        {isImage && (
                          <img
                            src={url}
                            alt={title}
                            style={{
                              maxHeight: "120px",
                              maxWidth: "100%",
                              objectFit: "contain",
                              marginTop: "10px",
                              borderRadius: "6px",
                              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                            }}
                          />
                        )}
                      </div>
                      <div style={{ marginTop: "15px", display: "flex", gap: "10px", justifyContent: "center" }}>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <button style={{ padding: "6px 12px", border: "1px solid #007bff", background: "white", color: "#007bff", borderRadius: "4px" }}>
                            <FaEye style={{ marginRight: "5px" }} /> Preview
                          </button>
                        </a>
                        <a href={url} download>
                          <button style={{ padding: "6px 12px", border: "1px solid #343a40", background: "white", color: "#343a40", borderRadius: "4px" }}>
                            <FaDownload style={{ marginRight: "5px" }} /> Download
                          </button>
                        </a>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Signed & Verified Dates */}
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <p>
                <strong>Signed Date:</strong>{" "}
                {state.documents?.signed_date ? new Date(state.documents.signed_date).toLocaleDateString() : "N/A"}
              </p>
              <p>
                <strong>Verified Date:</strong>{" "}
                {state.documents?.verified_date ? new Date(state.documents.verified_date).toLocaleDateString() : "N/A"}
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "30px", flexWrap: "wrap" }}>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#0d6efd",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onClick={() => setState((prev) => ({ ...prev, showUploadInput: true }))}
              >
                <FaUpload /> Upload New Document
              </button>

              <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
        onClick={handleOpenModal}
        type="button"
      >
        <FaFileAlt /> Generate New Document
      </button>
       {showModal && (
       <GenerateDocumentModal
  show={showModal}
  onHide={handleCloseModal}
  employeeId={state.selectedEmployee?.id}
/>

      )}
            </div>

            {/* Upload Section */}
            {state.showUploadInput && (
              <Form className="mt-4">
                <Form.Group className="mb-3">
                  <Form.Label>Document Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={state.newDocument.title || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setState((prev) => ({
                        ...prev,
                        newDocument: {
                          ...prev.newDocument,
                          title: value,
                        },
                      }));
                    }}
                    placeholder="Enter title"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Upload File</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setState((prev) => ({
                        ...prev,
                        newDocument: {
                          ...prev.newDocument,
                          file,
                        },
                      }));
                    }}
                  />
                </Form.Group>

                <Button variant="success" onClick={uploadDocument} disabled={state.uploading}>
                  {state.uploading ? "Uploading..." : "Submit Document"}
                </Button>
              </Form>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "10px 16px",
          borderTop: "1px solid #dee2e6",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={() => setState((prev) => ({ ...prev, showDocumentModal: false }))}
          style={{
            padding: "8px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}




      {/* Leave Request Modal */}
     <div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: state.showLeaveModal ? "flex" : "none",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1050,
  }}
>
  <div
    style={{
      width: "90%",
      maxWidth: "600px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      padding: "20px",
      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      position: "relative",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h5 style={{ marginBottom: "20px" }}>
        Apply for Leave –{" "}
        <strong>
          {state.selectedEmployee?.first_name} {state.selectedEmployee?.last_name} (EMP{state.selectedEmployee?.id})
        </strong>
      </h5>
      <button
        onClick={() => setState((prev) => ({ ...prev, showLeaveModal: false }))}
        style={{
          border: "none",
          background: "transparent",
          fontSize: "1.5rem",
          lineHeight: "1",
          cursor: "pointer",
        }}
      >
        &times;
      </button>
    </div>

    <Form onSubmit={handleSubmitLeave}>
      <Form.Group className="mb-4">
        <Form.Label>
          <strong>Leave Type</strong>
        </Form.Label>
        <Form.Select name="leaveType" value={state.leaveData.leaveType} onChange={handleChange}>
          <option value="">Select Leave Type</option>
          {leaveTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              <strong>From Date</strong>
            </Form.Label>
            <div className="d-flex align-items-center">
              <FiCalendar className="me-2 text-primary" />
              <Form.Control
                type="date"
                name="fromDate"
                value={state.leaveData.fromDate}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    leaveData: {
                      ...prev.leaveData,
                      fromDate: e.target.value,
                    },
                  }))
                }
                required
              />
            </div>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              <strong>To Date</strong>
            </Form.Label>
            <div className="d-flex align-items-center">
              <FiCalendar className="me-2 text-primary" />
              <Form.Control
                type="date"
                name="toDate"
                value={state.leaveData.toDate}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    leaveData: {
                      ...prev.leaveData,
                      toDate: e.target.value,
                    },
                  }))
                }
                required
              />
            </div>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>
          <strong>Reason</strong>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="reason"
          value={state.leaveData.reason}
          onChange={(e) =>
            setState((prev) => ({
              ...prev,
              leaveData: {
                ...prev.leaveData,
                reason: e.target.value,
              },
            }))
          }
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          label={
            <>
              <FiAlertTriangle className="me-2 text-danger" />
              Emergency Leave
            </>
          }
          name="isEmergency"
          checked={state.leaveData.isEmergency}
          onChange={(e) =>
            setState((prev) => ({
              ...prev,
              leaveData: {
                ...prev.leaveData,
                isEmergency: e.target.checked,
              },
            }))
          }
        />
      </Form.Group>

      <div
        style={{
          backgroundColor: "#e7f3fe",
          border: "1px solid #b8daff",
          padding: "10px",
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <FiCheckCircle className="me-2 text-info" size={20} />
        <strong>AI Approval:</strong> Based on past patterns, 92% chance this leave will be approved.
      </div>

      <div className="d-flex justify-content-between mt-4">
        <Button
          variant="outline-secondary"
          onClick={() => setState((prev) => ({ ...prev, showLeaveModal: false }))}
        >
          Cancel
        </Button>
       <div style={{ display: "flex", gap: "10px" }}>
  <Button variant="primary" type="submit">
    Submit Request
  </Button>
  <Button variant="success" onClick={handleAutoApprove}>
    Auto-Approve
  </Button>
</div>

      </div>
    </Form>
  </div>
</div>


      {/* Message Modal */}
     {state.showMessageModal && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1050,
    }}
  >
    <div
      style={{
        width: "90%",
        maxWidth: "600px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#0d6efd",
          color: "#fff",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaEnvelope />
          <span>
            Send Message to{" "}
            <strong>
              {state.selectedEmployee?.first_name} {state.selectedEmployee?.last_name}{" "}
              ({state.selectedEmployee?.emp_code || `EMP${state.selectedEmployee?.id}`})
            </strong>
          </span>
        </div>
        <button
          onClick={() => setState((prev) => ({ ...prev, showMessageModal: false }))}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "1.5rem",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: "20px" }}>
        <Form onSubmit={handleSubmitMessage}>
          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Subject</strong>
            </Form.Label>
            <Form.Control
              type="text"
              name="subject"
              value={state.messageData.subject}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  messageData: {
                    ...prev.messageData,
                    subject: e.target.value,
                  },
                }))
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Message</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="content"
              value={state.messageData.content}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  messageData: {
                    ...prev.messageData,
                    content: e.target.value,
                  },
                }))
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Priority</strong>
            </Form.Label>
            <Form.Select
              name="priority"
              value={state.messageData.priority}
              onChange={handleChange}
              required
            >
              <option value="">Select Priority</option>
              {priorities.map((p, index) => (
                <option key={index} value={p.value}>
                  {p.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          borderTop: "1px solid #dee2e6",
        }}
      >
        <Button
          variant="secondary"
          onClick={() => setState((prev) => ({ ...prev, showMessageModal: false }))}
        >
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmitMessage}>
          Send Message
        </Button>
      </div>
    </div>
  </div>
)}


      {/* Payroll Modal */}
        <div style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: state.showPayrollModal ? "flex" : "none",
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
            backgroundColor: "#28a745",
            color: "white",
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTopLeftRadius: "calc(0.3rem - 1px)",
            borderTopRightRadius: "calc(0.3rem - 1px)"
          }}>
            <div style={{
              fontSize: "18px",
              fontWeight: "600",
              width: "100%"
            }}>
              Payroll Details –{" "}
              {state.selectedEmployee?.first_name || ''} {state.selectedEmployee?.last_name || ''} 
              ({state.selectedEmployee?.emp_code || (state.selectedEmployee?.id ? `EMP${state.selectedEmployee.id}` : '')}) –{" "}
              {new Date(state.payrollMonth || new Date()).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </div>
            <button 
              onClick={() => setState(prev => ({ ...prev, showPayrollModal: false }))}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "700",
                lineHeight: "1",
                cursor: "pointer"
              }}
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div style={{
            padding: "20px",
            overflowY: "auto",
            flex: "1"
          }}>
            {/* Printable Section */}
            <div
              ref={slipRef}
              style={{
                maxWidth: "900px",
                margin: "0 auto",
                padding: "30px 20px 20px",
              }}
            >
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                marginBottom: "30px"
              }}>
                {/* Earnings Card */}
                <div style={{
                  flex: "1",
                  minWidth: "300px",
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "4px"
                }}>
                  <div style={{
                    backgroundColor: "#f8f9fa",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    marginBottom: "15px"
                  }}>
                    <h2 style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      margin: "0"
                    }}>Earnings</h2>
                  </div>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr><td style={{ padding: "4px 0" }}>Basic Salary</td><td style={{ textAlign: "right", padding: "4px 0" }}>₹{state.payrollDetails?.basic_salary?.toLocaleString() || "0.00"}</td></tr>
                      <tr><td style={{ padding: "4px 0" }}>House Rent Allowance</td><td style={{ textAlign: "right", padding: "4px 0" }}>₹{state.payrollDetails?.hra?.toLocaleString() || "0.00"}</td></tr>
                      <tr><td style={{ padding: "4px 0" }}>Transport Allowance</td><td style={{ textAlign: "right", padding: "4px 0" }}>₹{state.payrollDetails?.transport_allowance?.toLocaleString() || "0.00"}</td></tr>
                      <tr><td style={{ padding: "4px 0" }}>Updated Salary</td><td style={{ textAlign: "right", padding: "4px 0" }}>₹{state.payrollDetails?.salary_deduction?.toLocaleString() || "0.00"}</td></tr>
                      <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}><td style={{ padding: "8px 0" }}>Total Earnings</td><td style={{ textAlign: "right", padding: "8px 0" }}>₹{state.payrollDetails?.total_earnings?.toLocaleString() || "0.00"}</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* Deductions Card */}
                <div style={{
                  flex: "1",
                  minWidth: "300px",
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "4px"
                }}>
                  <div style={{
                    backgroundColor: "#f8f9fa",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    marginBottom: "15px"
                  }}>
                    <h2 style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      margin: "0"
                    }}>Deductions</h2>
                  </div>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr><td style={{ padding: "4px 0" }}>Professional Tax</td><td style={{ textAlign: "right", padding: "4px 0" }}>₹{state.payrollDetails?.professional_tax?.toLocaleString() || "0.00"}</td></tr>
                      <tr><td style={{ padding: "4px 0" }}>TDS</td><td style={{ textAlign: "right", padding: "4px 0" }}>₹{state.payrollDetails?.tds?.toLocaleString() || "0.00"}</td></tr>
                      <tr><td style={{ padding: "4px 0" }}>Loan Recovery</td><td style={{ textAlign: "right", padding: "4px 0" }}>₹{state.payrollDetails?.loan_recovery?.toLocaleString() || "0.00"}</td></tr>
                      <tr><td style={{ padding: "4px 0" }}>Leave Deduction</td><td style={{ textAlign: "right", padding: "4px 0" }}>₹{(state.payrollDetails?.leave_deduction || 0).toLocaleString()}</td></tr>
                      <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}><td style={{ padding: "8px 0" }}>Total Deductions</td><td style={{ textAlign: "right", padding: "8px 0" }}>₹{state.payrollDetails?.total_deductions?.toLocaleString() || "0.00"}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Net Pay */}
              <div style={{
                textAlign: "center",
                padding: "15px 0"
              }}>
                <h2 style={{
                  margin: "0",
                  fontWeight: "bold",
                  fontSize: "24px",
                  color: "#000"
                }}>
                  Net Pay: ₹{state.payrollDetails?.net_pay?.toLocaleString() || "0.00"}
                </h2>
              </div>
            </div>

            {/* Buttons (not in print) */}
            <div style={{
              padding: "0 20px 10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <button 
                onClick={() => setState(prev => ({ ...prev, showPayrollModal: false }))}
                style={{
                  color: "#fff",
                  backgroundColor: "#6c757d",
                  borderColor: "#6c757d",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: "1px solid transparent",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
              <div style={{ display: "flex", gap: "12px" }}>
                <button 
                  onClick={handlePrintsSlip}
                  style={{
                    color: "#fff",
                    backgroundColor: "#007bff",
                    borderColor: "#007bff",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    border: "1px solid transparent",
                    cursor: "pointer"
                  }}
                >
                  Print Slip
                </button>
                <button
                  style={{
                    color: "#fff",
                    backgroundColor: "#28a745",
                    borderColor: "#28a745",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    border: "1px solid transparent",
                    cursor: "pointer"
                  }}
                >
                  Process Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


    

         
     


        {showHistoryModal && (
  <AttendanceHistory
    show={showHistoryModal}
    onClose={() => setShowHistoryModal(false)}
    data={attendanceData}

  />
)}


    </div>
  );
});

export default Tables;