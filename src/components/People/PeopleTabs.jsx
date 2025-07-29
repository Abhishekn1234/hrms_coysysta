import React, { useState,useContext,useEffect,useRef } from 'react';
import { Container, Row, Col, Button, Modal,Tabs,Tab,AccordionContext, Form, Accordion,useAccordionButton,Card } from 'react-bootstrap';
import { FaUsers, FaUserFriends, FaUserTie,FaPlus, FaUser,FaTrash, FaPhone,FaUpload, FaDollarSign, FaCertificate, FaFileAlt, FaBuilding} from 'react-icons/fa';
import { BsChevronRight, BsChevronDown } from "react-icons/bs";
import { useNavigate,useLocation } from 'react-router-dom';
import { Plus ,User,Phone,Users, Briefcase ,UserCircle,Receipt, MapPin,PhoneCall,
  DollarSign,
  Award,
  FileText,
  Banknote} from 'lucide-react';
import axios from 'axios';
import StaffDetails from './StaffDetails';
import ContactForm from './ContactForm';
import FinancialHR from './FinancialHr';
import Skills from './Skills';
import './styles.css';
import './page.css';
import Dashboard from './Dashboard';
import StaffTable from './StaffTable';
import CustomerProfileForm from './CustomerProfileForm';
import CustomerCards from './CustomerCards';
import CustomerTable from './CustomerTable';
import VendorCards from './VendorCards';
import VendorTable from './VendorTable';
import { toast } from 'react-toastify';
import Staffdeta from './Staffdeta';
import FinancialHRs from './FinanicialHrs';
import ContactForms from './ContactForms';
import Skill from './Skill';
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
export default function PeopleTabs({ activeTab, setActiveTab }) {
 const location = useLocation();
const navigate = useNavigate();

const [activeKey, setActiveKey] = useState('0');

const [showModal, setShowModal] = useState(false);
const [showStaffModal, setShowStaffModal] = useState(false);
const [showCustomerModal, setShowCustomerModal] = useState(false);
const [showVendorModal, setShowVendorModal] = useState(false);

const [customerType, setCustomerType] = useState('');
const [companyName, setCompanyName] = useState('');
const [displayName, setDisplayName] = useState('');
const [ownerName, setOwnerName] = useState('');
const [contactName, setContactName] = useState('');
const [contactPhone, setContactPhone] = useState('');
const [email, setEmail] = useState('');
const [pan, setPan] = useState('');
const [salutation, setSalutation] = useState('Mr.');
const [vendorName, setVendorName] = useState('');
const [vendorPhone, setVendorPhone] = useState('');
const [vendorEmail, setVendorEmail] = useState('');
const [gstNo, setGstNo] = useState('');
const [vendorType, setVendorType] = useState('Material');
const [vendorAddress, setVendorAddress] = useState('');

const handleClose = () => setShowModal(false);
const handleShow = () => setShowModal(true);

const [loginEnabled, setLoginEnabled] = useState(false);
const [organization, setOrganization] = useState('');
const [activeAccordion, setActiveAccordion] = useState('0');
const [staffFormData, setStaffFormData] = useState({
  organization:'',
  salutation: '', firstName: '', lastName: '', staffId: '',
  staffType: '', designation: '', status: '', dob: '',
  bloodGroup: '', joiningDate: '', natureOfStaff: '',
  experience: '', qualification: ''
});

const [contactFormData, setContactFormData] = useState({
  phone: '', workPhone: '', workEmail: '', personalEmail: '',
  emergencyContact1: '', emergencyContact2: '', parentMobile: '', address: ''
});

const [financialFormData, setFinancialFormData] = useState({
  dailyRemuneration: '', rentAllowance: '', casualLeaves: '',
  esiCardNo: '', pfNo: '', vaccinated: ''
});

const [selectedSkills, setSelectedSkills] = useState([]);
const [bankFormData, setBankFormData] = useState({
  bank_document_date: '', bank_document_title: '',
  bank_document_description: '', bank_document_file: null
});

const [files, setFiles] = useState({});
const [addresses, setAddresses] = useState([]);
const [showForm, setShowForm] = useState(false);
const [contacts, setContacts] = useState([]);
const [contactPersons, setContactPersons] = useState([]);
const [gstDetails, setGstDetails] = useState([]);
const [loading, setLoading] = useState(false);
const [isSticky, setIsSticky] = useState(false);

const fileInputRef = useRef(null);
const [profileImage, setProfileImage] = useState(null);
const [newAddress, setNewAddress] = useState({ address: '', city: '', state: '', pincode: '' });
const resetVendorForm = () => {
  setLoginEnabled(false);
  setOrganization('');
  setSalutation('Mr.');
  setVendorName('');
  setVendorPhone('');
  setVendorEmail('');
  setGstNo('');
  setVendorType('Material');
  setVendorAddress('');
  setContacts([]);
};

const uploadFields = [
  { id: 'cv-upload', label: 'CV', key: 'resume' },
  { id: 'padhar-front-upload', label: 'Padhar Card (Front)', key: 'padhar_front' },
  { id: 'dl-front-upload', label: 'Driving License (Front)', key: 'dl_front' },
  { id: 'photo-upload', label: 'Photo', key: 'photo' },
  { id: 'padhar-back-upload', label: 'Padhar Card (Back)', key: 'padhar_back' },
  { id: 'dl-back-upload', label: 'Driving License (Back)', key: 'dl_back' },
  { id: 'passport-photo-upload', label: 'Passport Size Photo', key: 'passport_photo' },
  { id: 'pan-upload', label: 'PAN Card', key: 'pan' },
  { id: 'passport-front-upload', label: 'Passport (Front)', key: 'passport_front' },
  { id: 'passport-back-upload', label: 'Passport (Back)', key: 'passport_back' },
  { id: 'pf-upload', label: 'PF Document', key: 'pf' },
  { id: 'contract-upload', label: 'Employee Contract', key: 'employment_contract' },
  { id: 'esi-upload', label: 'ESI Document', key: 'esi' }
];

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    setProfileImage(file);
    console.log("Selected File:", file);
  }
};
// useEffect(() => {
//   if (showStaffModal || showCustomerModal || showVendorModal) {
//     setShowStaffModal(false);
//     setShowCustomerModal(false);
//     setShowVendorModal(false);
//   }
// }, [activeTab]);

const handleInputChanges = (field, value) => {
  setNewAddress(prev => ({ ...prev, [field]: value }));
};
const handleTabSelect = (selectedTab) => {
  setActiveTab(selectedTab);
  // Close any open modals if needed
  setShowStaffModal(false);
  setShowCustomerModal(false);
  setShowVendorModal(false);
};

const handleAddClick = () => {
  // Use activeTab instead of key
  if (activeTab === 'staff') {
    setShowStaffModal(true);
  } else if (activeTab === 'customers') {
    setShowCustomerModal(true);
  } else if (activeTab === 'vendors') {
    setShowVendorModal(true);
  }
};
const handleSaveVendor = async () => {
  const vendorData = {
    salutation: salutation,
    name: vendorName,
    phone: vendorPhone,
    email: vendorEmail,
    gst_no: gstNo,
    type: vendorType,
    address: vendorAddress,
    organization: organization,
    login_enabled: loginEnabled,
    contact_persons: contacts.map(c => ({
      name: c.name,
      designation: c.designation,
      work_email: c.email,
      work_phone: c.phone
    }))
  };

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/v1/vendors', vendorData);
    toast.success("Vendor added successfully!");
    setShowVendorModal(false);

    // ✅ Clear input fields
    setSalutation('');
    setVendorName('');
    setVendorPhone('');
    setVendorEmail('');
    setGstNo('');
    setVendorType('');
    setVendorAddress('');
    setOrganization('');
    setLoginEnabled(false);
    setContacts([]); // or initial default contact structure if needed

    // ✅ Navigate to /vendor
   
  } catch (error) {
    console.error("Failed to add vendor:", error.response?.data || error.message);
    toast.error("Failed to save vendor. Please check your input.");
  }
};

 const addContact = () => {
  setContacts([...contacts, { name: "", designation: "", email: "", phone: "" }]);
 }
const handleAddClicks = () => {
  setShowForm(true);
  setNewAddress({ address: '', city: '', state: '', pincode: '' });
};

const handleBankDocumentChange = (e) => {
  const { name, value } = e.target;
  setBankFormData(prev => ({ ...prev, [name]: value }));
};

const handleBankDocumentFileChange = (e) => {
  setBankFormData(prev => ({ ...prev, bank_document_file: e.target.files[0] }));
};

const handleFileChange = (e, key) => {
  setFiles(prev => ({ ...prev, [key]: e.target.files[0] }));
};

// const getActiveTab = () => {
//   if (location.pathname === '/admin/people' || location.pathname.startsWith('/staff/')) return 'staff';
//   if (location.pathname === '/customer' || location.pathname.startsWith('/admin/people/customers/')) return 'customers';
//   if (location.pathname === '/vendor' || location.pathname.startsWith('/admin/people/vendors/')) return 'vendors';
//   return '';
// };

useEffect(() => {
  const handleScroll = () => setIsSticky(window.scrollY > 60);
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

const handleAddContact = () => {
  setContactPersons([...contactPersons, {
    name: '', designation: '', workEmail: '', workPhone: '', personalEmail: '', personalPhone: ''
  }]);
};

const handleRemoveContact = (index) => {
  const updated = [...contactPersons];
  updated.splice(index, 1);
  setContactPersons(updated);
};

const handleContactChange = (index, field, value) => {
  const updated = [...contactPersons];
  updated[index][field] = value;
  setContactPersons(updated);
};

const handleAddGst = () => {
  setGstDetails([...gstDetails, { gstNo: '', placeOfSupply: '' }]);
};

const handleRemoveGst = (index) => {
  const newGstDetails = [...gstDetails];
  newGstDetails.splice(index, 1);
  setGstDetails(newGstDetails);
};

const handleInputChange = (index, field, value) => {
  const newGstDetails = [...gstDetails];
  newGstDetails[index][field] = value;
  setGstDetails(newGstDetails);
};


const handleSave = async () => {
  try {
    const formData = new FormData();

    // Personal & Employment Info
    formData.append('salutation', staffFormData.salutation);
    formData.append('first_name', staffFormData.firstName);
    formData.append('last_name', staffFormData.lastName);
    formData.append('designation', staffFormData.designation);
    formData.append('status', parseInt(staffFormData.status || 1));
    formData.append('date_of_birth', staffFormData.dob);
    formData.append('blood_group', staffFormData.bloodGroup);
    formData.append('join_date', staffFormData.joiningDate);
    formData.append('nature_of_staff', staffFormData.natureOfStaff);
    formData.append('staff_type', staffFormData.staffType);
    formData.append('experience', staffFormData.experience);
    formData.append('qualification', staffFormData.qualification);
    formData.append('user_type', 'STAFF');
    formData.append('organization', organization || '');

    // Login Toggle
    formData.append('login_enabled', loginEnabled ? 1 : 0);

    // Contact Info
    formData.append('phone', contactFormData.phone);
    formData.append('work_phone', contactFormData.workPhone);
    formData.append('email', contactFormData.workEmail);
    formData.append('personal_email', contactFormData.personalEmail);
    formData.append('emergency_contact_1', contactFormData.emergencyContact1);
    formData.append('emergency_contact_2', contactFormData.emergencyContact2);
    formData.append('parent_mobile', contactFormData.parentMobile);
    formData.append('address', contactFormData.address);

    // Financial Info
    formData.append('daily_remuneration', financialFormData.dailyRemuneration || 0);
    formData.append('rent_allowance_percent', financialFormData.rentAllowance || 0);
    formData.append('casual_leaves', financialFormData.casualLeaves || 0);
    formData.append('esi_card_no', financialFormData.esiCardNo);
    formData.append('pf_no', financialFormData.pfNo);
    formData.append('covid_vaccinated', financialFormData.vaccinated === 'Yes' ? 1 : 0);

    // Skills
    formData.append('skills', JSON.stringify(selectedSkills));

    // Bank Document Info
    formData.append('bank_document_date', bankFormData.bank_document_date);
    formData.append('bank_document_title', bankFormData.bank_document_title);
    formData.append('bank_document_description', bankFormData.bank_document_description);
    if (bankFormData.bank_document_file) {
      formData.append('bank_document_file', bankFormData.bank_document_file);
    }

    // File Uploads
    const fileKeyMapping = {
      resume: 'resume',
      padhar_front: 'aadhar_front',
      padhar_back: 'aadhar_back',
      dl_front: 'driving_license_front',
      dl_back: 'driving_license_back',
      photo: 'photo',
      passport_photo: 'passport_size_photo',
      pan: 'pan_card',
      passport_front: 'passport_front',
      passport_back: 'passport_back',
      pf: 'pf_document',
      esi: 'esi_document',
      employment_contract: 'employment_contract',
    };

    Object.entries(fileKeyMapping).forEach(([uploadKey, dbKey]) => {
      const file = files[uploadKey];
      if (file) {
        formData.append(dbKey, file);
      }
    });

    // Optional Previous Employment Info
    formData.append('position', staffFormData.designation || '');
    formData.append('department', staffFormData.department || '');
    formData.append('previous_company', staffFormData.previousCompany || '');
    formData.append('previous_position', staffFormData.previousPosition || '');
    formData.append('previous_responsibilities', staffFormData.previousResponsibilities || '');

    // Debugging: Log the data being sent
    // for (let pair of formData.entries()) {
    //   console.log(${pair[0]}: ${pair[1]});
    // }

    // Submit form
    const res = await fetch('http://127.0.0.1:8000/api/v1/staff', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();

    if (res.ok) {
      toast.success('Staff saved successfully!');
      setShowStaffModal(false);
    } else {
      console.error(result.error);
      toast.error(result.message || 'Failed to save staff');
    }
  } catch (error) {
    console.log(error);
    console.error('Save error:', error);
    toast.error('Something went wrong');
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();

    // ✅ Required Fields
    formData.append('customer_type', customerType); 
    formData.append('display_name', displayName);   
    formData.append('primary_contact_name', contactName); 
    formData.append('primary_contact_phone', contactPhone);

    // ✅ Optional Fields
    formData.append('organization', organization);
    formData.append('login_enabled', loginEnabled ? '1' : '0');
    formData.append('company_name', companyName || '');
    formData.append('owner_name', ownerName || '');
    formData.append('email', email || '');
    formData.append('pan_no', pan || '');

    // ✅ Contact Persons
    contactPersons.forEach((person, index) => {
      formData.append(`contact_persons[${index}][contact_name]`, person.name || '');
      formData.append(`contact_persons[${index}][designation]`, person.designation || '');
      formData.append(`contact_persons[${index}][work_email]`, person.workEmail || '');
      formData.append(`contact_persons[${index}][work_phone]`, person.workPhone || '');
      formData.append(`contact_persons[${index}][personal_email]`, person.personalEmail || '');
      formData.append(`contact_persons[${index}][personal_phone]`, person.personalPhone || '');
    });

    // ✅ GST Details
    gstDetails.forEach((gst, index) => {
      formData.append(`gst_details[${index}][gst_number]`, gst.gstNo || '');
      formData.append(`gst_details[${index}][place_of_supply]`, gst.placeOfSupply || '');
      formData.append(`gst_details[${index}][registered_address]`, gst.registeredAddress || '');
    });

    // ✅ Shipping Addresses
    addresses.forEach((address, index) => {
      formData.append(`shipping_addresses[${index}][address]`, address.address || '');
      formData.append(`shipping_addresses[${index}][city]`, address.city || '');
      formData.append(`shipping_addresses[${index}][state]`, address.state || '');
      formData.append(`shipping_addresses[${index}][pincode]`, address.pincode || '');
    });

    // ✅ Profile Logo Upload
    if (profileImage) {
      formData.append('profile_logo', profileImage);
    }

    // ✅ Debug: Log all formData values
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    // ✅ API Call
    const response = await axios.post(
      'http://127.0.0.1:8000/api/v1/customer/customer',
      formData,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    toast.success('Customer saved successfully!');
          setCustomerType('');
      setDisplayName('');
      setContactName('');
      setContactPhone('');
      setOrganization('');
      setLoginEnabled(false);
      setCompanyName('');
      setOwnerName('');
      setEmail('');
      setPan('');
      setContactPersons([]);
      setGstDetails([]);
      setAddresses([]);
      setProfileImage(null);



    setShowCustomerModal(false);

  } catch (error) {
    console.error('Error saving customer:', error);
    const message = error.response?.data?.message || 'Unknown error';
    toast.error(`Error: ${message}`);
  } finally {
    setLoading(false);
  }
};


const handleContactChanges = (index, field, value) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };
  return (
    <>
      {/* Header */}
     <Row className="align-items-center justify-content-between mb-4"
     style={{
      backgroundColor: '#265a87ff', // Light bluish background
      boxShadow: '0 4px 8px rgba(0, 123, 255, 0.2)', // Bluish shadow
      borderRadius: '8px',
      padding: '1rem',
      transition: 'all 0.3s ease'
    }}>
  <Col>
    <h2 style={{ 
      fontWeight: '700', 
      fontSize: '1.5rem', 
      marginBottom: '0.3rem',
      color: '#040404'
    }}>
      People
    </h2>
    <p style={{ 
      color: '#040404', 
      marginBottom: 0,
      fontSize: '0.9rem'
    }}>
      Manage all your staff, customers, and vendors in one place.
    </p>
  </Col>
  
  <Col xs="auto">
    <button
      style={{
        backgroundColor: "#0d6efd",
        color: "white",
        border: "none",
        padding: "0.5rem 1rem",
        borderRadius: "0.375rem",
        fontWeight: "500",
        fontSize: "0.875rem",
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
        transition: "background-color 0.2s"
      }}
      onClick={handleAddClick}
    >
      <Plus size={16} style={{ marginRight: '0.5rem' }} />
     Add New {activeTab === "staff" ? "Staff" : activeTab === "customers" ? "Customer" : "Vendor"}
    </button>
  </Col>
</Row>

   
<div
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '1rem',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: isSticky ? 'fixed' : 'static',
          top: isSticky ? '60px' : 'auto',
          zIndex: 1055,
          backgroundColor: '#fff',
          width: '100%',
          maxWidth: '100%',
          padding: '0.75rem 2rem 0.75rem 1rem',
          borderRadius: '12px',
          
          boxShadow: isSticky ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
          transition: 'top 0.2s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            maxWidth: '800px',
          }}
        >
            <Tabs 
  activeKey={activeTab} 
  onSelect={handleTabSelect}
  className="mb-3"
  aria-label="People sections"
>
  <Tab
    eventKey="staff"
    key="staff"
    title={
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Users size={16} strokeWidth={2.2} />
        <span>Staff</span>
      </div>
    }
    tabClassName="me-3"
  />
  <Tab
    eventKey="customers"
    key="customers"
    title={
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Briefcase size={16} strokeWidth={2.2} />
        <span>Customers</span>
      </div>
    }
    tabClassName="me-3"
  />
  <Tab
    eventKey="vendors"
    key="vendors"
    title={
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <User size={16} strokeWidth={2.2} />
        <span>Vendors</span>
      </div>
    }
  />
</Tabs>
        </div>
      </div>
    </div>



       <div 
  style={{
    display: showStaffModal ? 'block' : 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1050,
    overflow: 'auto'
  }}
>
  <div 
    style={{
      position: 'relative',
      margin: '2rem auto',
      maxWidth: '900px',
      width: '90%',
      backgroundColor: '#fff',
      borderRadius: '16px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
    }}
  >
    {/* Modal Header */}
    <div 
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #f1f5f9'
      }}
    >
      <h2 
        style={{
          fontWeight: 'bold',
          fontSize: '1.3rem',
          color: '#0f172a',
          margin: 0
        }}
      >
        Add New Staff
      </h2>
      <button 
        onClick={() => setShowStaffModal(false)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: '#6c757d'
        }}
      >
        &times;
      </button>
    </div>

    {/* Modal Body */}
    <div 
      style={{
        padding: '1.5rem',
        maxHeight: '70vh',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Login & Organization Section */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          padding: '1.2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, marginRight: '0.5rem', fontSize: '0.95rem', color: '#0f172a' }}>
            Login is enabled
          </span>
          <input
            type="checkbox"
            id="login-switch"
            checked={loginEnabled}
            onChange={(e) => setLoginEnabled(e.target.checked)}
            style={{
              width: '40px',
              height: '20px',
              appearance: 'none',
              backgroundColor: loginEnabled ? '#0d6efd' : '#ccc',
              borderRadius: '10px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              transform: 'scale(1.1)'
            }}
          />
        </div>

        <div style={{ width: '50%' }}>
          <label 
            style={{ 
              fontWeight: 600, 
              fontSize: '0.95rem', 
              color: '#0f172a', 
              marginBottom: '0.5rem',
              display: 'block'
            }}
          >
            Organization <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
            style={{
              width: '100%',
              borderRadius: '10px',
              padding: '0.6rem 1rem',
              fontSize: '0.95rem',
              border: '1px solid #cbd5e1',
              backgroundColor: '#fff'
            }}
          >
            <option value="">Select Organization</option>
            <option value="Kochi Organization">Kochi Organization</option>
            <option value="Kozhikode Organization">Kozhikode Organization</option>
            <option value="Trivandrum Organization">Trivandrum Organization</option>
          </select>
        </div>
      </div>

      {/* Accordion Sections */}
      <div style={{ marginBottom: '1rem' }}>
        {/* Staff Details */}
        <div 
          style={{ 
            border: 'none',
            borderRadius: '8px',
            marginBottom: '10px',
            overflow: 'hidden',
            transition: 'all 0.2s ease'
          }}
        >
          <div
            onClick={() => setActiveAccordion(activeAccordion === '0' ? null : '0')}
            style={{
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              padding: '1rem',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <User size={18} color="#7c3aed" style={{ marginRight: '8px' }} />
              <span>Staff Details</span>
            </div>
            {activeAccordion === '0' ? <BsChevronDown /> : <BsChevronRight />}
          </div>
          
          {activeAccordion === '0' && (
            <div style={{ padding: '1.5rem 1rem 0.5rem' }}>
              <Staffdeta data={staffFormData} setData={setStaffFormData} />
            </div>
          )}
        </div>

        {/* Repeat similar structure for other accordion sections */}
        {/* Contact Information */}
        <div style={{ marginBottom: '10px' }}>
          <div
            onClick={() => setActiveAccordion(activeAccordion === '1' ? null : '1')}
            style={{
              backgroundColor: '#f8fafc',
              padding: '1rem',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Phone color="#7c3aed" style={{ marginRight: '8px' }} />
              <span>Contact Information</span>
            </div>
            {activeAccordion === '1' ? <BsChevronDown /> : <BsChevronRight />}
          </div>
          
          {activeAccordion === '1' && (
            <div style={{ padding: '1.5rem 1rem 0.5rem' }}>
              <ContactForms data={contactFormData} setData={setContactFormData} />
            </div>
          )}
        </div>

        {/* Add similar div structures for other sections */}
        <div style={{ marginBottom: '20px' }}>
  {/* Financial & HR Details Section */}
  <div style={{
    border: 'none',
    borderRadius: '8px',
    marginBottom: '10px',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff'
  }}>
    <div 
      onClick={() => setActiveAccordion(activeAccordion === '2' ? null : '2')}
      style={{
        backgroundColor: '#f8fafc',
        padding: '16px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e2e8f0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <DollarSign color="#7c3aed" size={18} style={{ marginRight: '8px' }} />
        <span style={{ fontWeight: 500 }}>Financial & HR Details</span>
      </div>
      {activeAccordion === '2' ? <BsChevronDown /> : <BsChevronRight />}
    </div>
    
    {activeAccordion === '2' && (
      <div style={{ padding: '24px 16px 8px' }}>
        <FinancialHRs data={financialFormData} setData={setFinancialFormData} />
      </div>
    )}
  </div>

  {/* Skills Section */}
  <div style={{
    border: 'none',
    borderRadius: '8px',
    marginBottom: '10px',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff'
  }}>
    <div 
      onClick={() => setActiveAccordion(activeAccordion === '3' ? null : '3')}
      style={{
        backgroundColor: '#f8fafc',
        padding: '16px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e2e8f0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Award color="#7c3aed" size={18} style={{ marginRight: '8px' }} />
        <span style={{ fontWeight: 500 }}>Skills</span>
      </div>
      {activeAccordion === '3' ? <BsChevronDown /> : <BsChevronRight />}
    </div>
    
    {activeAccordion === '3' && (
      <div style={{ padding: '24px 16px 8px' }}>
        <Skill selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} />
      </div>
    )}
  </div>

  {/* Documents Section */}
  <div style={{
    border: 'none',
    borderRadius: '8px',
    marginBottom: '10px',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff'
  }}>
    <div 
      onClick={() => setActiveAccordion(activeAccordion === '4' ? null : '4')}
      style={{
        backgroundColor: '#f8fafc',
        padding: '16px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e2e8f0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FileText size={18} color="#7c3aed" style={{ marginRight: '8px' }} />
        <span style={{ fontWeight: 500 }}>Documents</span>
      </div>
      {activeAccordion === '4' ? <BsChevronDown /> : <BsChevronRight />}
    </div>
    
    {activeAccordion === '4' && (
      <div style={{ padding: '16px', paddingBottom: '32px' }}>
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          {uploadFields.map(({ id, label, key }) => (
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
                  alignItems: 'center',
                  justifyContent: 'center'
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
                  onChange={(e) => handleFileChange(e, key)}
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
              {files[key] && (
                <div style={{ 
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#28a745',
                  textAlign: 'center'
                }}>
                  {files[key].name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>

  {/* Bank Details Section */}
  <div style={{
    border: 'none',
    borderRadius: '8px',
    marginBottom: '10px',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff'
  }}>
    <div 
      onClick={() => setActiveAccordion(activeAccordion === '5' ? null : '5')}
      style={{
        backgroundColor: '#f8fafc',
        padding: '16px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e2e8f0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Banknote size={18} color="#7c3aed" style={{ marginRight: '8px' }} />
        <span style={{ fontWeight: 500 }}>Bank Details</span>
      </div>
      {activeAccordion === '5' ? <BsChevronDown /> : <BsChevronRight />}
    </div>
    
    {activeAccordion === '5' && (
      <div style={{ padding: '16px', paddingBottom: '32px' }}>
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
              value={bankFormData.bank_document_date}
              onChange={handleBankDocumentChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
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
              value={bankFormData.bank_document_title}
              onChange={handleBankDocumentChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              placeholder="Enter title"
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
            value={bankFormData.bank_document_description}
            onChange={handleBankDocumentChange}
            rows="3"
            placeholder="Enter description"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical',
              minHeight: '80px'
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
              alignItems: 'center',
              justifyContent: 'center'
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
              onChange={handleBankDocumentFileChange}
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
          {bankFormData.bank_document_file && (
            <div style={{ 
              marginTop: '8px',
              fontSize: '12px',
              color: '#28a745',
              textAlign: 'center'
            }}>
              {bankFormData.bank_document_file.name}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
</div>
      </div>
    </div>

    {/* Modal Footer */}
    <div 
      style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid #f1f5f9',
        backgroundColor: 'lightcyan',
        display: 'flex',
        justifyContent: 'flex-end',
        borderRadius: '0 0 16px 16px'
      }}
    >
      <button
        onClick={handleClose}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #6c757d',
          color: '#6c757d',
          padding: '0.45rem 1.2rem',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '15px',
          marginRight: '1rem',
          cursor: 'pointer'
        }}
      >
        Cancel
      </button>
      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          backgroundColor: 'blue',
          border: 'none',
          color: 'white',
          padding: '0.45rem 1.2rem',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '15px',
          cursor: 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Saving...' : 'Save Staff'}
      </button>
    </div>
  </div>
</div>

   {/* Customer Modal */}

  {showCustomerModal && (
  <div style={{
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1050'
  }}>
    <div style={{
      width: '800px',
      maxWidth: '90%',
      maxHeight: '90vh',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Modal Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '20px', fontWeight: '600', color: '#212529' }}>Add New Customer</div>
        <button 
          onClick={() => setShowCustomerModal(false)} 
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '24px', 
            color: '#6c757d',
            cursor: 'pointer'
          }}
        >
          &times;
        </button>
      </div>
      
      {/* Login Enable and Organization Section */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '16px 42px', marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '16px',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', color: '#212529', marginRight: '12px' }}>Login is enable</span>
            <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
              <input 
                type="checkbox" 
                checked={loginEnabled}
                onChange={(e) => setLoginEnabled(e.target.checked)}
                style={{ opacity: '0', width: '0', height: '0' }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundColor: loginEnabled ? '#0d6efd' : '#6c757d',
                transition: '.4s',
                borderRadius: '24px'
              }}>
                <span style={{
                  position: 'absolute',
                  height: '16px',
                  width: '16px',
                  left: loginEnabled ? '30px' : '4px',
                  bottom: '4px',
                  backgroundColor: 'white',
                  transition: '.4s',
                  borderRadius: '50%'
                }}></span>
              </span>
            </label>
          </div>
          
          <div style={{ width: '50%' }}>
            <div style={{ fontWeight: '600', color: '#212529', marginBottom: '8px' }}>
              Organization <span style={{ color: 'red' }}>*</span>
            </div>
            <select
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #ced4da',
                backgroundColor: '#fff'
              }}
            >
              <option value="">Select Organization</option>
              <option>Kochi Organization</option>
              <option>Bangalore Organization</option>
              <option>Kozhikode Organization</option>
            </select>
          </div>
        </div>
      </div>

      {/* Modal Body */}
      <div style={{ 
        padding: '24px',
        overflowY: 'auto',
        flex: '1',
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 #f1f5f9'
      }}>
        {/* Primary Details Section */}
        <div style={{ marginBottom: '16px', border: '1px solid #dee2e6', borderRadius: '8px' }}>
          <div 
            onClick={() => setActiveKey(activeKey === '0' ? null : '0')}
            style={{
              padding: '16px',
              backgroundColor: activeKey === '0' ? '#f8f9fa' : '#fff',
              borderBottom: activeKey === '0' ? '1px solid #dee2e6' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div style={{ width: '18px', height: '18px' }}>👤</div>
            <span>Primary Details</span>
          </div>
          
          {activeKey === '0' && (
            <div style={{ padding: '16px' }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '8px', fontSize: '14px', color: 'black' }}>Profile Logo</div>
                <div
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    border: '2px dotted #ccc',
                    borderRadius: '8px',
                    height: '180px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#f8f9fc',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ fontSize: '30px', color: '#888', marginBottom: '10px' }}>📤</div>
                  <strong style={{ color: 'grey' }}>Click to upload or drag and drop</strong>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    accept="image/*"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: '1' }}>
                  <div style={{ marginBottom: '8px' }}>Customer Type*</div>
                  <select
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da'
                    }}
                  >
                    <option value="">Select type</option>
                    <option>Business</option>
                    <option>Individual</option>
                  </select>
                </div>
                <div style={{ flex: '1' }}>
                  <div style={{ marginBottom: '8px' }}>Company Name</div>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da'
                    }}
                  />
                </div>
                <div style={{ flex: '1' }}>
                  <div style={{ marginBottom: '8px' }}>Customer Display Name*</div>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: '1' }}>
                  <div style={{ marginBottom: '8px' }}>Owner Name</div>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da'
                    }}
                  />
                </div>
                <div style={{ flex: '1' }}>
                  <div style={{ marginBottom: '8px' }}>Primary Contact Name*</div>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da'
                    }}
                  />
                </div>
                <div style={{ flex: '1' }}>
                  <div style={{ marginBottom: '8px' }}>Primary Contact Phone*</div>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: '1' }}>
                  <div style={{ marginBottom: '8px' }}>Email</div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da'
                    }}
                  />
                </div>
                <div style={{ flex: '1' }}>
                  <div style={{ marginBottom: '8px' }}>PAN No.</div>
                  <input
                    type="text"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* GST Details Section */}
        <div style={{ marginBottom: '16px', border: '1px solid #dee2e6', borderRadius: '8px' }}>
          <div 
            onClick={() => setActiveKey(activeKey === '1' ? null : '1')}
            style={{
              padding: '16px',
              backgroundColor: activeKey === '1' ? '#f8f9fa' : '#fff',
              borderBottom: activeKey === '1' ? '1px solid #dee2e6' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div style={{ width: '18px', height: '18px' }}>🧾</div>
            <span>GST Details</span>
          </div>
          
          {activeKey === '1' && (
            <div style={{ padding: '16px' }}>
              {gstDetails.map((gst, index) => (
                <div key={index} style={{ 
                  marginBottom: '16px', 
                  padding: '16px', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ flex: '1' }}>
                      <div style={{ marginBottom: '8px' }}>GST No.</div>
                      <input
                        type="text"
                        value={gst.gstNo}
                        onChange={(e) => handleInputChange(index, 'gstNo', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ced4da'
                        }}
                      />
                    </div>
                    <div style={{ flex: '1' }}>
                      <div style={{ marginBottom: '8px' }}>Place of Supply</div>
                      <input
                        type="text"
                        value={gst.placeOfSupply}
                        onChange={(e) => handleInputChange(index, 'placeOfSupply', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ced4da'
                        }}
                      />
                    </div>
                    <div style={{ 
                      flex: '0 0 auto',
                      display: 'flex',
                      alignItems: 'flex-end',
                      paddingBottom: '8px'
                    }}>
                      <button 
                        onClick={() => handleRemoveGst(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc3545',
                          cursor: 'pointer',
                          fontSize: '18px'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddGst}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: '#0d6efd',
                  border: '1px solid #0d6efd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                + Add GST Number
              </button>
            </div>
          )}
        </div>

        {/* Shipping Addresses Section */}
        <div style={{ marginBottom: '16px', border: '1px solid #dee2e6', borderRadius: '8px' }}>
          <div 
            onClick={() => setActiveKey(activeKey === '2' ? null : '2')}
            style={{
              padding: '16px',
              backgroundColor: activeKey === '2' ? '#f8f9fa' : '#fff',
              borderBottom: activeKey === '2' ? '1px solid #dee2e6' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div style={{ width: '18px', height: '18px' }}>📍</div>
            <span>Shipping Addresses</span>
          </div>
          
          {activeKey === '2' && (
            <div style={{ padding: '16px' }}>
              {addresses.map((address, index) => (
                <div key={index} style={{ 
                  marginBottom: '16px', 
                  padding: '16px', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px'
                }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Address:</strong>
                    <div>{address.address}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: '1' }}>
                      <strong>City:</strong>
                      <div>{address.city}</div>
                    </div>
                    <div style={{ flex: '1' }}>
                      <strong>State:</strong>
                      <div>{address.state}</div>
                    </div>
                    <div style={{ flex: '1' }}>
                      <strong>Pincode:</strong>
                      <div>{address.pincode}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', marginTop: '8px' }}>
                    <button 
                      onClick={() => handleRemoveAddress(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc3545',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {showForm && (
                <div style={{ 
                  marginBottom: '16px', 
                  padding: '16px', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px'
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ marginBottom: '8px' }}>Address</div>
                    <textarea
                      rows={3}
                      value={newAddress.address}
                      onChange={(e) => handleInputChanges('address', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #ced4da'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ flex: '1' }}>
                      <div style={{ marginBottom: '8px' }}>City</div>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => handleInputChanges('city', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ced4da'
                        }}
                      />
                    </div>
                    <div style={{ flex: '1' }}>
                      <div style={{ marginBottom: '8px' }}>State</div>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => handleInputChanges('state', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ced4da'
                        }}
                      />
                    </div>
                    <div style={{ flex: '1' }}>
                      <div style={{ marginBottom: '8px' }}>Pincode</div>
                      <input
                        type="text"
                        value={newAddress.pincode}
                        onChange={(e) => handleInputChanges('pincode', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ced4da'
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => setShowForm(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc3545',
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {!showForm && (
                  <button
                    onClick={handleAddClicks}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      color: '#0d6efd',
                      border: '1px solid #0d6efd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>+</span> Add Shipping Address
                  </button>
                )}
                {showForm && (
                  <button
                    onClick={() => {
                      setAddresses([...addresses, newAddress]);
                      setShowForm(false);
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#0d6efd',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Save Address
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Contact Persons Section */}
        <div style={{ border: '1px solid #dee2e6', borderRadius: '8px' }}>
          <div 
            onClick={() => setActiveKey(activeKey === '3' ? null : '3')}
            style={{
              padding: '16px',
              backgroundColor: activeKey === '3' ? '#f8f9fa' : '#fff',
              borderBottom: activeKey === '3' ? '1px solid #dee2e6' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div style={{ width: '18px', height: '18px' }}>📞</div>
            <span>Contact Persons</span>
          </div>
          
          {activeKey === '3' && (
            <div style={{ padding: '16px' }}>
              {contactPersons.map((person, index) => (
                <div key={index} style={{ 
                  marginBottom: '16px', 
                  padding: '16px', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ flex: '1' }}>
                      <div style={{ marginBottom: '8px' }}>Contact Name</div>
                      <input
                        type="text"
                        value={person.name}
                        onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ced4da'
                        }}
                      />
                    </div>
                    <div style={{ flex: '1' }}>
                      <div style={{ marginBottom: '8px' }}>Designation</div>
                      <input
                        type="text"
                        value={person.designation}
                        onChange={(e) => handleContactChange(index, 'designation', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ced4da'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ flex: '1' }}>
                      <div style={{ marginBottom: '8px' }}>Work Email</div>
                      <input
                        type="email"
                        value={person.workEmail}
                        onChange={(e) => handleContactChange(index, 'workEmail', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ced4da'
                        }}
                      />
                    </div>
                    <div style={{ flex: '1' }}>
                      <div style={{ marginBottom: '8px' }}>Work Phone</div>
                      <input
                        type="text"
                        value={person.workPhone}
                        onChange={(e) => handleContactChange(index, 'workPhone', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ced4da'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ flex: '1' }}>
                      <div style={{ marginBottom: '8px' }}>Personal Email</div>
                      <input
                        type="email"
                        value={person.personalEmail}
                        onChange={(e) => handleContactChange(index, 'personalEmail', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ced4da'
                        }}
                      />
                    </div>
                    <div style={{ flex: '1' }}>
                      <div style={{ marginBottom: '8px' }}>Personal Phone</div>
                      <input
                        type="text"
                        value={person.personalPhone}
                        onChange={(e) => handleContactChange(index, 'personalPhone', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ced4da'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => handleRemoveContact(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc3545',
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddContact}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: '#0d6efd',
                  border: '1px solid #0d6efd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                + Add Contact Person
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Footer */}
      <div style={{ 
        padding: '16px 24px', 
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '8px'
      }}>
        <button
          onClick={() => setShowCustomerModal(false)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Save Customer
        </button>
      </div>
    </div>
  </div>
)}





   {/* Vendor Modal */}

   {showVendorModal && (
  <div style={{
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1050'
  }}>
    <div style={{
      width: '800px',
      maxWidth: '90%',
      maxHeight: '90vh',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Modal Header */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '20px', fontWeight: '600', color: '#212529' }}>Add New Vendor</div>
        <button 
          onClick={() => setShowVendorModal(false)} 
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '24px', 
            color: '#6c757d',
            cursor: 'pointer'
          }}
        >
          &times;
        </button>
      </div>
      
      {/* Spacer */}
      <div style={{ height: '32px' }}></div>
      
      {/* Login & Org Selection Section */}
      <div style={{ 
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '0 42px 24px 42px',
        border: '1px solid #e0e0e0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: '600', marginRight: '12px' }}>Login is enabled</span>
          <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
            <input 
              type="checkbox" 
              checked={loginEnabled}
              onChange={(e) => setLoginEnabled(e.target.checked)}
              style={{ opacity: '0', width: '0', height: '0' }}
            />
            <span style={{
              position: 'absolute',
              cursor: 'pointer',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              backgroundColor: loginEnabled ? '#0d6efd' : '#6c757d',
              transition: '.4s',
              borderRadius: '24px'
            }}>
              <span style={{
                position: 'absolute',
                height: '16px',
                width: '16px',
                left: loginEnabled ? '30px' : '4px',
                bottom: '4px',
                backgroundColor: 'white',
                transition: '.4s',
                borderRadius: '50%'
              }}></span>
            </span>
          </label>
        </div>
        
        <div style={{ width: '50%' }}>
          <div style={{ fontWeight: '600', marginBottom: '8px' }}>
            Organization <span style={{ color: 'red' }}>*</span>
          </div>
          <select
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              backgroundColor: '#fff'
            }}
          >
            <option value="">Select Organization</option>
            <option>Kochi Organization</option>
            <option>Kozhikode Organization</option>
            <option>Bangalore Organization</option>
          </select>
        </div>
      </div>

      {/* Modal Body */}
      <div style={{ 
        padding: '24px',
        overflowY: 'auto',
        flex: '1',
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 #f1f5f9'
      }}>
        {/* Vendor Details Section */}
        <div style={{ marginBottom: '16px', border: '1px solid #dee2e6', borderRadius: '8px' }}>
          <div 
            onClick={() => setActiveKey(activeKey === '0' ? null : '0')}
            style={{
              padding: '16px',
              backgroundColor: activeKey === '0' ? '#f8f9fa' : '#fff',
              borderBottom: activeKey === '0' ? '1px solid #dee2e6' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div style={{ width: '18px', height: '18px' }}>💼</div>
            <span>Vendor Details</span>
          </div>
          
          {activeKey === '0' && (
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: '1' }}>
                  <div style={{ marginBottom: '8px' }}>Salutation<span style={{ color: 'red' }}>*</span></div>
                  <select
                    value={salutation}
                    onChange={(e) => setSalutation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da'
                    }}
                  >
                    <option>Mr.</option>
                    <option>Ms.</option>
                    <option>Mrs.</option>
                  </select>
                </div>
                <div style={{ flex: '1' }}>
                  <div style={{ marginBottom: '8px' }}>Name<span style={{ color: 'red' }}>*</span></div>
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da'
                    }}
                  />
                </div>
                <div style={{ flex: '1' }}>
                  <div style={{ marginBottom: '8px' }}>Phone<span style={{ color: 'red' }}>*</span></div>
                  <input
                    type="text"
                    value={vendorPhone}
                    onChange={(e) => setVendorPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: '1' }}>
                  <div style={{ marginBottom: '8px' }}>Email</div>
                  <input
                    type="email"
                    value={vendorEmail}
                    onChange={(e) => setVendorEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da'
                    }}
                  />
                </div>
                <div style={{ flex: '1' }}>
                  <div style={{ marginBottom: '8px' }}>GST No.</div>
                  <input
                    type="text"
                    value={gstNo}
                    onChange={(e) => setGstNo(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da'
                    }}
                  />
                </div>
                <div style={{ flex: '1' }}>
                  <div style={{ marginBottom: '8px' }}>Type<span style={{ color: 'red' }}>*</span></div>
                  <select
                    value={vendorType}
                    onChange={(e) => setVendorType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da'
                    }}
                  >
                    <option>Material</option>
                    <option>Service</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ marginBottom: '8px' }}>Address</div>
                <textarea
                  rows={2}
                  value={vendorAddress}
                  onChange={(e) => setVendorAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                ></textarea>
              </div>
            </div>
          )}
        </div>

        {/* Contact Persons Section */}
        <div style={{ border: '1px solid #dee2e6', borderRadius: '8px' }}>
          <div 
            onClick={() => setActiveKey(activeKey === '1' ? null : '1')}
            style={{
              padding: '16px',
              backgroundColor: activeKey === '1' ? '#f8f9fa' : '#fff',
              borderBottom: activeKey === '1' ? '1px solid #dee2e6' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div style={{ width: '18px', height: '18px' }}>👥</div>
            <span>Contact Persons</span>
          </div>
          
          {activeKey === '1' && (
            <div style={{ padding: '16px' }}>
              {contacts.length === 0 && (
                <div style={{ textAlign: 'right', marginBottom: '16px' }}>
                  <button
                    onClick={addContact}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#0d6efd',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    + Add Contact Person
                  </button>
                </div>
              )}

              {contacts.map((contact, index) => (
                <div key={index} style={{ 
                  marginBottom: '16px', 
                  padding: '16px', 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: 'white'
                }}>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ flex: '1' }}>
                      <div style={{ marginBottom: '8px' }}>Name</div>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => handleContactChanges(index, "name", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ced4da'
                        }}
                      />
                    </div>
                    <div style={{ flex: '1' }}>
                      <div style={{ marginBottom: '8px' }}>Designation</div>
                      <input
                        type="text"
                        value={contact.designation}
                        onChange={(e) => handleContactChanges(index, "designation", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ced4da'
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: '1' }}>
                      <div style={{ marginBottom: '8px' }}>Work Email</div>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => handleContactChanges(index, "email", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ced4da'
                        }}
                      />
                    </div>
                    <div style={{ flex: '1' }}>
                      <div style={{ marginBottom: '8px' }}>Work Phone</div>
                      <input
                        type="text"
                        value={contact.phone}
                        onChange={(e) => handleContactChanges(index, "phone", e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ced4da'
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', marginTop: '16px' }}>
                    <button
                      onClick={() => removeContact(index)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'transparent',
                        color: '#dc3545',
                        border: '1px solid #dc3545',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}

              {contacts.length > 0 && (
                <div style={{ textAlign: 'left' }}>
                  <button
                    onClick={addContact}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#0d6efd',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    + Add Contact Person
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Footer */}
      <div style={{ 
        padding: '16px 24px', 
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '8px'
      }}>
        <button
          onClick={() => setShowVendorModal(false)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSaveVendor}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Save Vendor
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
}