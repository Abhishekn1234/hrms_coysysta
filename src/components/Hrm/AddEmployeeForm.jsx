import React, { useState,useEffect } from "react";
import { Form, Button, Row, Col, Tab, Nav, Card } from "react-bootstrap";
import { BsPersonLinesFill } from "react-icons/bs";
import { FaMoneyBill, FaUniversity, FaWallet ,FaUser, FaBriefcase, FaFileAlt} from "react-icons/fa";
import { BsBuildingAdd } from "react-icons/bs";
import { MdPayment } from "react-icons/md";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2"; // For Allowances
import { MdWorkOutline } from "react-icons/md"; // For Current Employment
import { FaHistory } from "react-icons/fa"; // For Employment History
import { FaFilePdf,FaPlus, FaIdCard, FaFileContract, FaFileMedical, FaGraduationCap } from "react-icons/fa";
import { toast } from 'react-toastify';
import axios from "axios";
export default function AddEmployeeForm({onClose}) {
  
  const SectionHeader = ({ icon: Icon, text }) => (
  <div className="d-flex align-items-center mb-3">
    <span
      style={{
        backgroundColor: "#3b5998", // Or Bootstrap blue: "#0d6efd"
        color: "#fff",
        borderRadius: "50%",
        padding: "10px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        marginRight: "10px",
      }}
    >
      <Icon size={20} />
    </span>
    <h5 className="m-0">{text}</h5>
  </div>
);
const iconStyle = {
  backgroundColor: "#3b5998",
  color: "#fff",
  borderRadius: "50%",
  padding: "8px",
  fontSize: "18px", // Increase size
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "34px",
  height: "34px",
};


const fileUploadStyle = {
  border: "1px dashed #ccc",
  borderRadius: "10px",
  padding: "15px 20px",
  marginBottom: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#fff",
  transition: "background-color 0.3s ease",
};

const fileUploadHoverStyle = {
  backgroundColor: "#f8f9fa",
};

const iconLeftStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const iconCircleStyle = {
  backgroundColor: "#3b5998",
  color: "white",
  borderRadius: "50%",
  padding: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  fontSize: "18px",
};
const [positions, setPositions] = useState([
  {
    previousCompany: '',
    previousStartDate: '',
    previousEndDate: '',
    previousPosition: '',
    previousResponsibilities: ''
  }
]);
const handlePositionChange = (index, event) => {
  const { name, value } = event.target;
  const updatedPositions = [...positions];
  updatedPositions[index][name] = value;
  setPositions(updatedPositions);
};

const addPosition = () => {
  setPositions([
    ...positions,
    {
      previousCompany: '',
      previousStartDate: '',
      previousEndDate: '',
      previousPosition: '',
      previousResponsibilities: ''
    }
  ]);
};
const removePosition = (index) => {
  const updatedPositions = [...positions];
  updatedPositions.splice(index, 1); // remove one at the given index
  setPositions(updatedPositions);
};

// 👇 Helper component for each file field
function FileUploadField({ icon, label, sublabel, name, accept, onChange }) {
  return (
    <div
      className="file-upload-wrapper"
      style={fileUploadStyle}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = fileUploadHoverStyle.backgroundColor)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
    >
      <div style={iconLeftStyle}>
        <div style={iconCircleStyle}>{icon}</div>
        <div>
          <strong>{label}</strong><br />
          <small>{sublabel}</small>
        </div>
      </div>
      <div>
        <label
          htmlFor={name}
          style={{
            backgroundColor: "#fff",
            border: "1px solid #0d6efd",
            color: "#0d6efd",
            padding: "5px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Browse
        </label>
        <Form.Control
          type="file"
          id={name}
          name={name}
          accept={accept}
          onChange={onChange}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}
const iconBoxStyle = {
  backgroundColor: "#f0f4ff",
  border: "1px dashed #d9e1f7",
  borderRadius: "8px",
  padding: "15px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "10px",
};

const handleCancel = () => {
  // Reset all form fields to empty
  setFormData({
    previousCompany: '',
    previousStartDate: '',
    previousEndDate: '',
    previousPosition: '',
    previousResponsibilities: '',
    // ... add other fields if needed
  });
  onClose();
};

  const [activeTab, setActiveTab] = useState("personal");
 const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  address: "",
    ptax: "",
  tds: "",
  loan: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
  emergencyContactEmail: "",

  position: "",
  department: "",
  employmentType: "",
  hireDate: "",
  reportingManager: "",
  workLocation: "",

  baseSalary: "",
  payFrequency: "",
  housingAllowance: "",
  transportAllowance: "",
  medicalAllowance: "",
  otherAllowances: "",
  bankName: "",
  accountNumber: "",
  routingNumber: "",
  paymentMethod: "",
  documentsAuthentic:false,
  positions: [
    {
      previousCompany: '',
      previousStartDate: '',
      previousEndDate: '',
      previousPosition: '',
      previousResponsibilities: ''
    }
  ]
};


const [formData, setFormData] = useState(initialFormData);


  const [departments, setDepartments] = useState([]);

  const [enumOptions, setEnumOptions] = useState({
  employmentType: [],
  gender: [],
  workLocation: [],
  payFrequency: [],
  reportingManager: []
});

useEffect(() => {
  fetch("http://127.0.0.1:8000/api/v1/enums/users")
    .then((res) => res.json())
    .then((data) => setEnumOptions(data))
    .catch((err) => console.error("Failed to fetch enums", err));
}, []);

 const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};


  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };
 const fetchData=async()=>{
  const response=await axios.get("http://127.0.0.1:8000/api/v1/employees");

 }
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const formDataToSend = new FormData();

//   // Basic personal info
//   formDataToSend.append('firstName', formData.firstName);
//   formDataToSend.append('lastName', formData.lastName);
//   formDataToSend.append('email', formData.email);
//   formDataToSend.append('phone', formData.phone);
//   formDataToSend.append('dob', formData.dob);
//   formDataToSend.append('gender', formData.gender);
//   formDataToSend.append('address', formData.address);

//   // Emergency contact
//   formDataToSend.append('emergencyContactName', formData.emergencyContactName);
//   formDataToSend.append('emergencyContactRelationship', formData.emergencyContactRelationship);
//   formDataToSend.append('emergencyContactPhone', formData.emergencyContactPhone);
//   formDataToSend.append('emergencyContactEmail', formData.emergencyContactEmail || '');

//   // Employment
//   formDataToSend.append('position', formData.position);
//   formDataToSend.append('department', formData.department);
//   formDataToSend.append('employmentType', formData.employmentType.toUpperCase().replace('-', '_'));
//   formDataToSend.append('hireDate', formData.hireDate);
//   formDataToSend.append('reportingManager', formData.reportingManager);
//   formDataToSend.append('workLocation', formData.workLocation);

//   // Salary
//   formDataToSend.append('baseSalary', formData.baseSalary);
//   formDataToSend.append('payFrequency', formData.payFrequency);
//  formDataToSend.append('housingAllowance', parseFloat(formData.housingAllowance) || 0);
// formDataToSend.append('otherAllowances', parseFloat(formData.otherAllowances) || 0);

  
//   formDataToSend.append('transportAllowance', formData.transportAllowance || 0);
//   formDataToSend.append('medicalAllowance', formData.medicalAllowance || 0);
//   formDataToSend.append('documentsAuthentic', formData.documentsAuthentic ? '1' : '0');

//   // Bank
//   formDataToSend.append('bankName', formData.bankName);
//   formDataToSend.append('accountNumber', formData.accountNumber);
//   formDataToSend.append('routingNumber', formData.routingNumber || '');
//   formDataToSend.append('paymentMethod', formData.paymentMethod || '');

//   // Documents
//   if (formData.resume) formDataToSend.append('resume', formData.resume);
//   if (formData.idProof) formDataToSend.append('idProof', formData.idProof);
//   if (formData.employmentContract) formDataToSend.append('employmentContract', formData.employmentContract);
//   if (formData.medicalCertificate) formDataToSend.append('medicalCertificate', formData.medicalCertificate);
//   if (formData.educationCertificates) formDataToSend.append('educationCertificates', formData.educationCertificates);

//   // Employment history
//   positions.forEach((position, index) => {
//     formDataToSend.append(`positions[${index}][previousCompany]`, position.previousCompany);
//     formDataToSend.append(`positions[${index}][previousStartDate]`, position.previousStartDate);
//     formDataToSend.append(`positions[${index}][previousEndDate]`, position.previousEndDate);
//     formDataToSend.append(`positions[${index}][previousPosition]`, position.previousPosition);
//     formDataToSend.append(`positions[${index}][previousResponsibilities]`, position.previousResponsibilities || '');
//   });

//   try {
//     const response = await axios.post("/api/hrm/personal-details", formDataToSend, {
//       headers: {
//         'Accept': 'application/json',
//         // Content-Type is automatically set by axios for FormData
//       },
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Submission failed');
//     }

//     const result = await response.json();
//     toast.success("Employee created successfully!");
//     onClose(); // Close the form if successful
    
//   } catch (error) {
//     console.error("Error:", error);
//     toast.error(error.message || "Network error. Please try again later.");
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate required fields
  const requiredFields = [
    'firstName', 'lastName', 'email', 'phone', 'dob', 'gender', 'address',
    'emergencyContactName', 'emergencyContactRelationship', 'emergencyContactPhone',
    'position', 'department', 'employmentType', 'hireDate', 'reportingManager',
    'workLocation', 'baseSalary', 'payFrequency', 'bankName', 'accountNumber','ptax','loan','tds'
  ];
  const missingFields = requiredFields.filter(field => !formData[field]);
  if (missingFields.length > 0) {
    toast.error(`Please fill in: ${missingFields.join(', ')}`);
    return;
  }
   


  if (!formData.documentsAuthentic) {
    toast.error("Please confirm that all documents are authentic.");
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append('firstName', formData.firstName || '');
  formDataToSend.append('lastName', formData.lastName || '');
  formDataToSend.append('email', formData.email || '');
  formDataToSend.append('phone', formData.phone || '');
  formDataToSend.append('dob', formData.dob || '');
  formDataToSend.append('gender', formData.gender || '');
  formDataToSend.append('address', formData.address || '');
  formDataToSend.append('place', formData.place || '');
  formDataToSend.append('qualification', formData.qualification || '');
  formDataToSend.append('experience', formData.experience || '');
  formDataToSend.append('expertise', formData.expertise || '');
  formDataToSend.append('hourlyRate', formData.hourlyRate || '');
  formDataToSend.append('monthlyRate', formData.monthlyRate || '');
  formDataToSend.append('annualCTC', formData.annualCTC || '');
  formDataToSend.append('probationPeriod', formData.probationPeriod || '');
  formDataToSend.append('joinType', formData.joinType || 'DIRECT');
  formDataToSend.append('image', formData.image || '');
  formDataToSend.append('emergencyContactName', formData.emergencyContactName || '');
  formDataToSend.append('emergencyContactRelationship', formData.emergencyContactRelationship || '');
  formDataToSend.append('emergencyContactPhone', formData.emergencyContactPhone || '');
  formDataToSend.append('emergencyContactEmail', formData.emergencyContactEmail || '');
  formDataToSend.append('position', formData.position || '');
  formDataToSend.append('department', formData.department || '');
      formDataToSend.append('ptax', formData.ptax !== '' && formData.ptax != null ? parseFloat(formData.ptax) : 0);
  formDataToSend.append('tds', formData.tds !== '' && formData.tds != null ? parseFloat(formData.tds) : 0);
  formDataToSend.append('loan', formData.loan !== '' && formData.loan != null ? parseFloat(formData.loan) : 0);

  formDataToSend.append('employmentType', formData.employmentType ? formData.employmentType.toUpperCase().replace('-', '_') : '');
  formDataToSend.append('hireDate', formData.hireDate || '');
  formDataToSend.append('reportingManager', formData.reportingManager || '');
  formDataToSend.append('workLocation', formData.workLocation || '');
  formDataToSend.append('baseSalary', formData.baseSalary || '');
  formDataToSend.append('payFrequency', formData.payFrequency || '');
  formDataToSend.append('housingAllowance', parseFloat(formData.housingAllowance) || 0);
  formDataToSend.append('transportAllowance', parseFloat(formData.transportAllowance) || 0);
  formDataToSend.append('medicalAllowance', parseFloat(formData.medicalAllowance) || 0);
  formDataToSend.append('otherAllowances', parseFloat(formData.otherAllowances) || 0);
  formDataToSend.append('bankName', formData.bankName || '');
  formDataToSend.append('accountNumber', formData.accountNumber || '');
  formDataToSend.append('routingNumber', formData.routingNumber || '');
  formDataToSend.append('paymentMethod', formData.paymentMethod || '');
  formDataToSend.append('documentsAuthentic', formData.documentsAuthentic ? '1' : '0');
   
  if (formData.resume) formDataToSend.append('resume', formData.resume);
  if (formData.idProof) formDataToSend.append('idProof', formData.idProof);
  if (formData.employmentContract) formDataToSend.append('employmentContract', formData.employmentContract);
  if (formData.medicalCertificate) formDataToSend.append('medicalCertificate', formData.medicalCertificate);
  if (formData.educationCertificates) formDataToSend.append('educationCertificates', formData.educationCertificates);

  if (positions.length > 0) {
    positions.forEach((position, index) => {
      formDataToSend.append(`positions[${index}][previousCompany]`, position.previousCompany || '');
      formDataToSend.append(`positions[${index}][previousStartDate]`, position.previousStartDate || '');
      formDataToSend.append(`positions[${index}][previousEndDate]`, position.previousEndDate || '');
      formDataToSend.append(`positions[${index}][previousPosition]`, position.previousPosition || '');
      formDataToSend.append(`positions[${index}][previousResponsibilities]`, position.previousResponsibilities || '');
    });
  } else {
    formDataToSend.append('positions', '[]');
  }

  console.log('FormData:', [...formDataToSend.entries()].map(([key, value]) => `${key}: ${value instanceof File ? value.name : value}`));

  try {
    const response = await axios.post("http://127.0.0.1:8000/api/hrm/personal-details", formDataToSend, {
      headers: {
        'Accept': 'application/json',
      },
    });

    // Access response.data directly (axios parses JSON automatically)
    console.log('Response Data:', response.data);
    toast.success(response.data.message || "Employee created successfully!");
    onClose();
  } catch (error) {
    console.error("Error:", error);
    console.log("Response Data:", error.response?.data);
    let errorMessage = "Network error. Please try again later.";
    if (error.response?.status === 422) {
      const errors = error.response.data.errors || {};
      errorMessage = Object.values(errors).flat().join(', ');
    } else {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    toast.error(errorMessage);
  }
};
const [position, setPosition] = useState([]);


useEffect(() => {
  axios.get("http://127.0.0.1:8000/api/v1/positions")
    .then(res => setPosition(res.data.positions || res.data)) // Use res.data, not res.json()
    .catch(err => console.error("Failed to load positions", err));
}, []);

useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/departments");
      const data = await response.json();

      if (response.ok) {
        setDepartments(data);
      } else {
        console.error("Failed to fetch departments:", data);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  fetchDepartments();
}, []);


  const nextTab = () => {
    const tabs = ["personal", "employment", "salary", "documents"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const tabs = ["personal", "employment", "salary", "documents"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
   <div style={{ padding: '1rem', border: '1px solid #dee2e6', borderRadius: '0.375rem', height:"800px" }}>
  {/* Tabs Navigation */}
  <div style={{ 
    display: 'flex', 
    borderBottom: '1px solid #dee2e6',
    marginBottom: '1rem'
  }}>
    <div 
      style={{ 
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderBottom: activeTab === 'personal' ? '2px solid #0d6efd' : 'none',
        color: activeTab === 'personal' ? '#0d6efd' : '#495057',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      onClick={() => setActiveTab('personal')}
    >
      <FaUser style={{ fontSize: '1rem' }} />
      <span>Personal</span>
    </div>
    <div 
      style={{ 
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderBottom: activeTab === 'employment' ? '2px solid #0d6efd' : 'none',
        color: activeTab === 'employment' ? '#0d6efd' : '#495057',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      onClick={() => setActiveTab('employment')}
    >
      <FaBriefcase style={{ fontSize: '1rem' }} />
      <span>Employment</span>
    </div>
    <div 
      style={{ 
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderBottom: activeTab === 'salary' ? '2px solid #0d6efd' : 'none',
        color: activeTab === 'salary' ? '#0d6efd' : '#495057',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      onClick={() => setActiveTab('salary')}
    >
      <FaMoneyBill style={{ fontSize: '1rem' }} />
      <span>Salary</span>
    </div>
    <div 
      style={{ 
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderBottom: activeTab === 'documents' ? '2px solid #0d6efd' : 'none',
        color: activeTab === 'documents' ? '#0d6efd' : '#495057',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      onClick={() => setActiveTab('documents')}
    >
      <FaFileAlt style={{ fontSize: '1rem' }} />
      <span>Documents</span>
    </div>
  </div>

  {/* Tab Content */}
  <div>
    {/* Personal Tab */}
    {activeTab === 'personal' && (
      <div>
        {/* Personal Info */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>First Name</label>
            <input
              type="text"
              placeholder="Enter first name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Last Name</label>
            <input
              type="text"
              placeholder="Enter last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Phone</label>
            <input
              type="tel"
              placeholder="Enter phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Date of Birth</label>
            <input
              type="date"
              placeholder="dd-mm-yyyy"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            >
              <option value="">-- Select Gender --</option>
              {enumOptions.gender.map((gender, index) => (
                <option key={index} value={gender}>{gender}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Address</label>
          <textarea
            rows={3}
            placeholder="Enter full address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.375rem 0.75rem',
              border: '1px solid #ced4da',
              borderRadius: '0.25rem'
            }}
          />
        </div>

        <hr style={{ margin: '1rem 0' }} />

        {/* Emergency Contact */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: '#0d6efd',
          marginBottom: '1rem',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}>
          <BsPersonLinesFill style={{ marginRight: '0.5rem', fontSize: '1rem' }} />
          <span>Emergency Contact</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Contact Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Relationship</label>
            <input
              type="text"
              placeholder="Enter relationship"
              name="emergencyContactRelationship"
              value={formData.emergencyContactRelationship}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Contact Phone</label>
            <input
              type="tel"
              placeholder="Enter phone number"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Contact Email</label>
            <input
              type="email"
              placeholder="Enter email"
              name="emergencyContactEmail"
              value={formData.emergencyContactEmail}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
        </div>
      </div>
    )}

    {/* Employment Tab */}
    {activeTab === 'employment' && (
      <div style={{ padding: '0.5rem' }}>
        {/* Current Employment */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Position</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            >
              <option value="">Select Position</option>
              {position.map((pos, idx) => (
                <option key={idx} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.department_name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Employment Type</label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            >
              <option value="">Select Employment Type</option>
              {enumOptions.employmentType?.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Hire Date</label>
            <input
              type="date"
              placeholder="dd-mm-yyyy"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Reporting Manager</label>
            <select
              name="reportingManager"
              value={formData.reportingManager}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            >
              <option value="">Select Manager</option>
              {enumOptions.reportingManager?.map((manager, index) => (
                <option key={index} value={manager}>{manager}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Work Location</label>
            <select
              name="workLocation"
              value={formData.workLocation}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            >
              <option value="">Select Work Location</option>
              {enumOptions.workLocation?.map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        <hr style={{ margin: '1rem 0' }} />

        {/* Employment History */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '1rem',
          color: '#495057'
        }}>
          <FaHistory style={{ marginRight: '0.5rem', fontSize: '1rem' }} />
          <span style={{ fontWeight: 'bold' }}>Employment History</span>
        </div>

        {positions.map((position, index) => (
          <div key={index} style={{ 
            marginBottom: '1rem', 
            border: '1px solid #dee2e6', 
            borderRadius: '0.25rem', 
            padding: '1rem',
            position: 'relative'
          }}>
            {positions.length > 1 && (
              <button
                style={{ 
                  position: 'absolute', 
                  top: '0.5rem', 
                  right: '0.5rem',
                  background: 'transparent',
                  border: '1px solid #dc3545',
                  color: '#dc3545',
                  borderRadius: '0.2rem',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
                onClick={() => removePosition(index)}
              >
                Remove
              </button>
            )}
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', color: '#495057' }}>Previous Company</label>
              <input
                type="text"
                placeholder="Enter company name"
                name="previousCompany"
                value={position.previousCompany}
                onChange={(e) => handlePositionChange(index, e)}
                style={{
                  width: '100%',
                  padding: '0.375rem 0.75rem',
                  border: '1px solid #adb5bd',
                  borderRadius: '0.25rem',
                  backgroundColor: 'transparent'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', color: '#495057' }}>Start Date</label>
                <input
                  type="date"
                  name="previousStartDate"
                  value={position.previousStartDate}
                  onChange={(e) => handlePositionChange(index, e)}
                  style={{
                    width: '100%',
                    padding: '0.375rem 0.75rem',
                    border: '1px solid #adb5bd',
                    borderRadius: '0.25rem',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', color: '#495057' }}>End Date</label>
                <input
                  type="date"
                  name="previousEndDate"
                  value={position.previousEndDate}
                  onChange={(e) => handlePositionChange(index, e)}
                  style={{
                    width: '100%',
                    padding: '0.375rem 0.75rem',
                    border: '1px solid #adb5bd',
                    borderRadius: '0.25rem',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', color: '#495057' }}>Position</label>
              <input
                type="text"
                placeholder="Enter position"
                name="previousPosition"
                value={position.previousPosition}
                onChange={(e) => handlePositionChange(index, e)}
                style={{
                  width: '100%',
                  padding: '0.375rem 0.75rem',
                  border: '1px solid #adb5bd',
                  borderRadius: '0.25rem',
                  backgroundColor: 'transparent'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.875rem', color: '#495057' }}>Responsibilities</label>
              <textarea
                rows={3}
                placeholder="Describe responsibilities"
                name="previousResponsibilities"
                value={position.previousResponsibilities}
                onChange={(e) => handlePositionChange(index, e)}
                style={{
                  width: '100%',
                  padding: '0.375rem 0.75rem',
                  border: '1px solid #adb5bd',
                  borderRadius: '0.25rem',
                  backgroundColor: 'transparent',
                  resize: 'none'
                }}
              />
            </div>
          </div>
        ))}

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '0.5rem',
            background: 'transparent',
            border: '1px solid #0d6efd',
            color: '#0d6efd',
            borderRadius: '0.25rem',
            padding: '0.375rem 0.75rem',
            cursor: 'pointer'
          }}
          onClick={addPosition}
        >
          <FaPlus style={{ marginRight: '0.5rem', fontSize: '0.875rem' }} />
          <span>Add Another Position</span>
        </button>
      </div>
    )}

    {/* Salary Tab */}
    {activeTab === 'salary' && (
      <div style={{ padding: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Base Salary ($)</label>
            <input
              type="number"
              placeholder="Enter amount"
              name="baseSalary"
              value={formData.baseSalary}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Pay Frequency</label>
            <select
              name="payFrequency"
              value={formData.payFrequency}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            >
              <option value="">Select Pay Frequency</option>
              {enumOptions.payFrequency?.map((freq, index) => (
                <option key={index} value={freq}>{freq}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>PTax</label>
            <input
              type="number"
              name="ptax"
              value={formData.ptax}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>TDS</label>
            <input
              type="number"
              name="tds"
              value={formData.tds}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Loan</label>
            <input
              type="number"
              name="loan"
              value={formData.loan}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
        </div>

        <hr style={{ margin: '1rem 0' }} />

        {/* Allowances Section */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '1rem',
          color: '#495057'
        }}>
          <HiOutlineDocumentArrowDown style={{ marginRight: '0.5rem', fontSize: '1rem' }} />
          <span style={{ fontWeight: 'bold' }}>Allowances</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Housing Allowance ($)</label>
            <input
              type="number"
              placeholder="Enter amount"
              name="housingAllowance"
              value={formData.housingAllowance}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Transport Allowance ($)</label>
            <input
              type="number"
              placeholder="Enter amount"
              name="transportAllowance"
              value={formData.transportAllowance}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Medical Allowance ($)</label>
            <input
              type="number"
              placeholder="Enter amount"
              name="medicalAllowance"
              value={formData.medicalAllowance}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Other Allowances ($)</label>
            <input
              type="number"
              placeholder="Enter amount"
              name="otherAllowances"
              value={formData.otherAllowances}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
        </div>

        <hr style={{ margin: '1rem 0' }} />

        {/* Payment Information */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '1rem',
          color: '#495057'
        }}>
          <FaUniversity style={{ marginRight: '0.5rem', fontSize: '1rem' }} />
          <span style={{ fontWeight: 'bold' }}>Payment Information</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Bank Name</label>
            <input
              type="text"
              placeholder="Enter bank name"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Account Number</label>
            <input
              type="text"
              placeholder="Enter account number"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Routing Number</label>
            <input
              type="text"
              placeholder="Enter routing number"
              name="routingNumber"
              value={formData.routingNumber}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Payment Method</label>
            <input
              type="text"
              placeholder="Enter payment method"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.375rem 0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.25rem'
              }}
            />
          </div>
        </div>
      </div>
    )}

    {/* Documents Tab */}
    {activeTab === 'documents' && (
      <div style={{ padding: '0.5rem' }}>
        {/* File Upload Fields */}
        {[
          { icon: <FaFilePdf />, label: "Upload Resume", sublabel: "PDF, DOC or DOCX (Max 5MB)", name: "resume", accept: ".pdf,.doc,.docx" },
          { icon: <FaIdCard />, label: "Upload ID Proof", sublabel: "Passport, Driver's License or ID Card (JPG, PNG or PDF)", name: "idProof", accept: ".jpg,.jpeg,.png,.pdf" },
          { icon: <FaFileContract />, label: "Employment Contract", sublabel: "PDF or DOCX (Max 10MB)", name: "employmentContract", accept: ".pdf,.docx" },
          { icon: <FaFileMedical />, label: "Medical Certificate", sublabel: "JPG, PNG or PDF (Max 5MB)", name: "medicalCertificate", accept: ".jpg,.jpeg,.png,.pdf" },
          { icon: <FaGraduationCap />, label: "Education Certificates", sublabel: "PDF, JPG or PNG (Max 10MB)", name: "educationCertificates", accept: ".pdf,.jpg,.jpeg,.png" }
        ].map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            border: '1px dashed #dee2e6',
            borderRadius: '0.25rem',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                backgroundColor: '#3b5998',
                color: 'white',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '18px',
                marginRight: '1rem'
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>{item.label}</div>
                <div style={{ fontSize: '0.875rem', color: '#555' }}>{item.sublabel}</div>
              </div>
            </div>

            <div>
              <input
                type="file"
                name={item.name}
                id={`file-${item.name}`}
                onChange={handleFileChange}
                accept={item.accept}
                style={{ display: 'none' }}
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

        {/* Confirmation Checkbox */}
        <div style={{ marginTop: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="documentsAuthentic"
              checked={formData.documentsAuthentic}
              onChange={handleCheckboxChange}
              required
              style={{ marginRight: '0.5rem' }}
            />
            <span>I confirm that all documents provided are authentic and accurate</span>
          </label>
        </div>
      </div>
    )}
  </div>

  <hr style={{ margin: '1rem 0' }} />

  {/* Footer Buttons */}
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: '1rem'
  }}>
    <button
      onClick={handleCancel}
      style={{
        backgroundColor: 'transparent',
        border: '1px solid #dc3545',
        color: '#dc3545',
        padding: '0.375rem 0.75rem',
        borderRadius: '0.25rem',
        cursor: 'pointer'
      }}
    >
      Cancel
    </button>

    <div>
      <button
        onClick={nextTab}
        style={{
          backgroundColor: '#0d6efd',
          border: '1px solid #0d6efd',
          color: 'white',
          padding: '0.375rem 0.75rem',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}
      >
        Next
      </button>
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: '#198754',
          border: '1px solid #198754',
          color: 'white',
          padding: '0.375rem 0.75rem',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          marginLeft: '0.5rem'
        }}
      >
        Submit
      </button>
    </div>
  </div>
</div>
  );
}