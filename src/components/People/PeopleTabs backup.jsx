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
export default function PeopleTabs() {
 const location = useLocation();
const navigate = useNavigate();

const [activeKey, setActiveKey] = useState('0');
const [key, setKey] = useState('staff');
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

const handleInputChanges = (field, value) => {
  setNewAddress(prev => ({ ...prev, [field]: value }));
};
const handleAddClick = () => {
    const key = getActiveTab();
    if (key === 'staff') setShowStaffModal(true);
    else if (key === 'customers') setShowCustomerModal(true);
    else if (key === 'vendors') setShowVendorModal(true);
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
    const response = await axios.post('/api/v1/vendors', vendorData);
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
    navigate('/vendor');
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
const getActiveTab = () => {
  console.log("this is path name",location.pathname )
  if (location.pathname === '/admin/people' || location.pathname.startsWith('/admin/people/staff')) return 'staff';
  if (location.pathname.startsWith('/admin/people/customers')) return 'customers';
  if (location.pathname.startsWith('/admin/people/vendors')) return 'vendors';
  return 'staff'; // default to staff if no match
};

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

const activeTab = getActiveTab();
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
    const res = await fetch('/api/v1/staff', {
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
      '/api/customer/customer',
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
      {activeTab === "staff"
        ? "Add New Staff"
        : activeTab === "customers"
        ? "Add New Customer"
        : activeTab === "vendors"
        ? "Add New Vendor"
        : "Add New"}
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
  id="people-tabs"
  activeKey={getActiveTab()}
  onSelect={(k) => {
    console.log('Tab selected:', k);
    if (k === 'staff') navigate('/admin/people/staff');
    else if (k === 'customers') navigate('/admin/people/customer');
    else if (k === 'vendors') navigate('/admin/people/vendor');
  }}
  style={{
    display: 'flex',
    width: '100%',
    gap: '0.5rem', // Increased gap for more breathing space
  }}
  variant="tabs"
>
  <Tab
    eventKey="staff"
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
    title={
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <User size={16} strokeWidth={2.2} />
        <span>Vendors</span>
      </div>
    }
    tabClassName="me-3"
  />
</Tabs>

        </div>
      </div>
    </div>



       <Modal
      show={showStaffModal}
      onHide={()=>{setShowStaffModal(false)}}
      size="lg"
      centered
      scrollable
      style={{ borderRadius: '16px' }}
    >
      <Modal.Header closeButton style={{ borderBottom: '1px solid #f1f5f9', padding: '1rem 1.5rem' }}>
        <Modal.Title style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#0f172a' }}>
          Add New Staff
        </Modal.Title>
      </Modal.Header>

     <Modal.Body
  style={{
    padding: '1.5rem',
    maxHeight: '70vh',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch', // smooth scrolling on iOS
    scrollbarWidth: 'thin', // Firefox
    scrollbarColor: '#cbd5e1 #f1f5f9', // Firefox fallback
  }}
>
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
              Login is enable
            </span>
            <Form.Check
              type="switch"
              id="login-switch"
              checked={loginEnabled}
              onChange={(e) => setLoginEnabled(e.target.checked)}
              style={{ transform: 'scale(1.1)' }}
            />
          </div>

          <div style={{ width: '50%' }}>
            <Form.Label style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.5rem' }}>
              Organization <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              required
              style={{ borderRadius: '10px', padding: '0.6rem 1rem', fontSize: '0.95rem', border: '1px solid #cbd5e1' }}
            >
              <option value="">Select Organization</option>
              <option value="Kochi Organization">Kochi Organization</option>
              <option value="Kozhikode Organization">Kozhikode Organization</option>
              <option value="Trivandrum Organization">Trivandrum Organization</option>
            </Form.Select>
          </div>
        </div>

        <Accordion alwaysOpen defaultActiveKey="0">
          <Accordion.Item 
  eventKey="0" 
  style={{ 
    border: 'none',
    borderRadius: '8px',
    marginBottom: '10px',
    overflow: 'hidden',
    transition: 'all 0.2s ease'
  }}
>
  <CustomAccordionToggle 
    eventKey="0" 
    style={{ 
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0'
    }} icon={<User size={18} color="#7c3aed" />}
  >
    Staff Details
  </CustomAccordionToggle>
  <Accordion.Body style={{ padding: '1.5rem 1rem 0.5rem' }}>
    <Staffdeta data={staffFormData} setData={setStaffFormData} />
  </Accordion.Body>
</Accordion.Item>

          <Accordion.Item eventKey="1" style={{ 
    border: 'none',
    borderRadius: '8px',
    marginBottom: '10px',
    overflow: 'hidden',
    transition: 'all 0.2s ease'
  }}>
            <CustomAccordionToggle eventKey="1" icon={<Phone color="#7c3aed" />} >Contact Information</CustomAccordionToggle>
            <Accordion.Body style={{ padding: '1.5rem 1rem 0.5rem' }}>
              <ContactForms data={contactFormData} setData={setContactFormData} />
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2"style={{ 
    border: 'none',
    borderRadius: '8px',
    marginBottom: '10px',
    overflow: 'hidden',
    transition: 'all 0.2s ease'
  }}>
            <CustomAccordionToggle eventKey="2" icon={<DollarSign color="#7c3aed" />}>Financial & HR Details</CustomAccordionToggle>
            <Accordion.Body style={{ padding: '1.5rem 1rem 0.5rem' }}>
              <FinancialHRs data={financialFormData} setData={setFinancialFormData} />
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3" style={{ 
    border: 'none',
    borderRadius: '8px',
    marginBottom: '10px',
    overflow: 'hidden',
    transition: 'all 0.2s ease'
  }}>
            <CustomAccordionToggle eventKey="3" icon={<Award color="#7c3aed" />}>Skills</CustomAccordionToggle>
            <Accordion.Body style={{ padding: '1.5rem 1rem 0.5rem' }}>
              <Skill selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4"style={{ 
    border: 'none',
    borderRadius: '8px',
    marginBottom: '10px',
    overflow: 'hidden',
    transition: 'all 0.2s ease'
  }}>
  <CustomAccordionToggle eventKey="4" icon={<FileText />}>Documents</CustomAccordionToggle>
<Accordion.Body className="pb-4 ps-4">
 <div className="row">
        {uploadFields.map(({ id, label, key }) => (
          <div key={id} className="col-md-4 mb-4">
            <label className="form-label">{label}</label>
            <div className="file-upload-box">
              <input
                type="file"
                className="d-none"
                id={id}
                onChange={(e) => handleFileChange(e, key)}
              />
              <label htmlFor={id} className="file-upload-label text-center">
                <i className="fas fa-upload upload-icon mb-2"></i>
                <div className="upload-text">
                  <strong>Click to upload</strong> or drag and drop
                </div>
                {files[key] && (
                  <div className="mt-2 text-success small">{files[key].name}</div>
                )}
              </label>
            </div>
          </div>
        ))}
      </div>
</Accordion.Body>

</Accordion.Item>

      <Accordion.Item eventKey="5"style={{ 
    border: 'none',
    borderRadius: '8px',
    marginBottom: '10px',
    overflow: 'hidden',
    transition: 'all 0.2s ease'
  }}>
  <CustomAccordionToggle eventKey="5" icon={<Banknote />}>Bank Details</CustomAccordionToggle>
  <Accordion.Body className="pb-4 ps-4">
  <div className="row">
        {/* Date */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="bank_document_date"
            value={bankFormData.bank_document_date}
            onChange={handleBankDocumentChange}
            className="form-control"
          />
        </div>

        {/* Title */}
        <div className="col-md-6 mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="bank_document_title"
            value={bankFormData.bank_document_title}
            onChange={handleBankDocumentChange}
            className="form-control"
            placeholder="Enter title"
          />
        </div>

        {/* Description */}
        <div className="col-md-12 mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="bank_document_description"
            value={bankFormData.bank_document_description}
            onChange={handleBankDocumentChange}
            rows="3"
            placeholder="Enter description"
          />
        </div>

        {/* File Upload */}
        <div className="col-md-12 mb-3">
          <label className="form-label">Bank Document</label>
          <div className="file-uploads-box">
            <input
              type="file"
              className="d-none"
              id="bank-doc-upload"
              onChange={handleBankDocumentFileChange}
            />
            <label
              htmlFor="bank-doc-upload"
              className="file-uploads-label text-center"
            >
              <i className="fas fa-upload uploads-icon mb-2"></i>
              <div className="uploads-text">
                <strong>Click to upload</strong> or drag and drop
              </div>
              {bankFormData.bank_document_file && (
                <div className=" text-success large">
                  {bankFormData.bank_document_file.name}
                </div>
              )}
            </label>
          </div>
        </div>
      </div>
  </Accordion.Body>
</Accordion.Item>
        </Accordion>
        
      </Modal.Body>

      <Modal.Footer
        style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #f1f5f9',
          backgroundColor:"lightcyan",
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button variant="outline-secondary" onClick={handleClose} style={{ marginRight: '1rem' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading}
          style={{
            backgroundColor: 'blue',
            border: 'none',
            padding: '0.45rem 1.2rem',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '15px',
          }}
        >
          {loading ? 'Saving...' : 'Save Staff'}
        </Button>
      </Modal.Footer>
    </Modal>

   {/* Customer Modal */}

   <Modal show={showCustomerModal} onHide={() => setShowCustomerModal(false)} size="lg" centered scrollable>
    <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Add New Customer</Modal.Title>
        </Modal.Header>
        <hr/>
       <div
  style={{
    backgroundColor: '#f8f9fa', // Bootstrap light
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    border: '1px solid #e0e0e0',
    marginLeft:"42px",
    marginRight:"42px"
  }}
>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <span style={{ fontWeight: 600, color: '#212529' }}>Login is enable</span>
    <Form.Check
      type="switch"
      id="login-switch"
      checked={loginEnabled}
      onChange={(e) => setLoginEnabled(e.target.checked)}
      style={{ marginLeft: '0.75rem' }}
    />
  </div>

  <div style={{ width: '50%' }}>
    <Form.Label style={{ fontWeight: 600, color: '#212529', marginBottom: '0.5rem' }}>
      Organization <span style={{ color: 'red' }}>*</span>
    </Form.Label>
    <Form.Select
      value={organization}
      onChange={(e) => setOrganization(e.target.value)}
    >
      <option value="">Select Organization</option>
      <option>Kochi Organization</option>
      <option>Bangalore Organization</option>
      <option>Kozhikode Organization</option>
    </Form.Select>
  </div>
</div>

          <Modal.Body style={{  padding: '1.5rem',
    maxHeight: '70vh',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch', // smooth scrolling on iOS
    scrollbarWidth: 'thin', // Firefox
    scrollbarColor: '#cbd5e1 #f1f5f9',}}> 
             <Accordion activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
  {/* Primary Details */}
  <Card className="mb-3">
    <CustomAccordionToggle eventKey="0">
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <UserCircle size={18} strokeWidth={2} />
    <span>Primary Details</span>
  </div>
</CustomAccordionToggle>
    <Accordion.Collapse eventKey="0">
      <Card.Body>
        <Form>
          {/* Profile Upload */}
          <Row className="mb-4">
            <Col md={12}>
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
                <FaUpload size={30} color="#888" style={{ marginBottom: '10px' }} />
                <strong style={{ color: 'grey' }}>Click to upload or drag and drop</strong>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  accept="image/*"
                />
              </div>
            </Col>
          </Row>

          {/* Customer Type, Company Name, Display Name */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Customer Type*</Form.Label>
                <Form.Select
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                >
                  <option value="">Select type</option>
                  <option>Business</option>
                  <option>Individual</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Customer Display Name*</Form.Label>
                <Form.Control
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Owner, Primary Contact Name, Phone */}
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Owner Name</Form.Label>
                <Form.Control
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Primary Contact Name*</Form.Label>
                <Form.Control
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Primary Contact Phone*</Form.Label>
                <Form.Control
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Email & PAN */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>PAN No.</Form.Label>
                <Form.Control
                  type="text"
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Accordion.Collapse>
  </Card>

  {/* GST Details */}
 <Card className="mb-3">
 <CustomAccordionToggle eventKey="1">
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <Receipt size={18} strokeWidth={2} />
    <span>GST Details</span>
  </div>
</CustomAccordionToggle>
  <Accordion.Collapse eventKey="1">
    <Card.Body>
      <Form>
        {gstDetails.map((gst, index) => (
          <div key={index} className="mb-3 p-3 border rounded">
            <Row className="align-items-end">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>GST No.</Form.Label>
                  <Form.Control
                    type="text"
                    value={gst.gstNo}
                    onChange={(e) => handleInputChange(index, 'gstNo', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Place of Supply</Form.Label>
                  <Form.Control
                    type="text"
                    value={gst.placeOfSupply}
                    onChange={(e) => handleInputChange(index, 'placeOfSupply', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="text-end">
                <Button
                  variant="link"
                  className="text-danger mt-2"
                  onClick={() => handleRemoveGst(index)}
                >
                  <FaTrash size={18} /> {/* Import FaTrash from react-icons/fa */}
                </Button>
              </Col>
            </Row>
          </div>
        ))}

        <Button variant="outline-primary" onClick={handleAddGst}>
          + Add GST Number
        </Button>
      </Form>
    </Card.Body>
  </Accordion.Collapse>
</Card>


  {/* Shipping Addresses */}
 <Card className="mb-3">
 <CustomAccordionToggle eventKey="2">
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <MapPin size={18} strokeWidth={2} />
    <span>Shipping Addresses</span>
  </div>
</CustomAccordionToggle>
  <Accordion.Collapse eventKey="2">
    <Card.Body>
      {/* Existing addresses */}
      {addresses.map((address, index) => (
        <div key={index} className="mb-3 p-3 border rounded">
          <Row className="mb-2">
            <Col md={12}>
              <strong>Address:</strong>
              <div>{address.address}</div>
            </Col>
          </Row>
          <Row>
            <Col md={4}><strong>City:</strong><div>{address.city}</div></Col>
            <Col md={4}><strong>State:</strong><div>{address.state}</div></Col>
            <Col md={4}><strong>Pincode:</strong><div>{address.pincode}</div></Col>
          </Row>
          <Row className="mt-2">
            <Col className="text-end">
              <Button 
                variant="link" 
                className="text-danger p-0" 
                onClick={() => handleRemoveAddress(index)}
              >
                <FaTrash className="me-1" /> Delete
              </Button>
            </Col>
          </Row>
        </div>
      ))}

      {/* Add new address form */}
      {showForm && (
        <div className="mb-3 p-3 border rounded">
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newAddress.address}
                  onChange={(e) => handleInputChanges('address', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  value={newAddress.city}
                  onChange={(e) => handleInputChanges('city', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  value={newAddress.state}
                  onChange={(e) => handleInputChanges('state', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Pincode</Form.Label>
                <Form.Control
                  type="text"
                  value={newAddress.pincode}
                  onChange={(e) => handleInputChanges('pincode', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col className="text-end">
              <Button 
                variant="link" 
                className="text-danger p-0" 
                onClick={() => setShowForm(false)}
              >
                <FaTrash className="me-1" /> 
              </Button>
            </Col>
          </Row>
        </div>
      )}

      <div className="d-flex justify-content-between">
        {!showForm && (
          <Button 
            variant="outline-primary" 
            onClick={handleAddClicks}
          >
            <FaPlus className="me-1" /> Add Shipping Address
          </Button>
        )}
        {showForm && (
          <Button 
            variant="primary" 
            onClick={() => {
              setAddresses([...addresses, newAddress]);
              setShowForm(false);
            }}
          >
            Save Address
          </Button>
        )}
      </div>
    </Card.Body>
  </Accordion.Collapse>
</Card>


  {/* Contact Persons */}
  <Card className="mb-3">
  <CustomAccordionToggle eventKey="3">
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <PhoneCall size={18} strokeWidth={2} />
    <span>Contact Persons</span>
  </div>
</CustomAccordionToggle>
    <Accordion.Collapse eventKey="3">
      <Card.Body>
        {contactPersons.map((person, index) => (
          <div key={index} className="mb-4 p-3 border rounded">
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Contact Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={person.name}
                    onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    value={person.designation}
                    onChange={(e) => handleContactChange(index, 'designation', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Work Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={person.workEmail}
                    onChange={(e) => handleContactChange(index, 'workEmail', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Work Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={person.workPhone}
                    onChange={(e) => handleContactChange(index, 'workPhone', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Personal Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={person.personalEmail}
                    onChange={(e) => handleContactChange(index, 'personalEmail', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Personal Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={person.personalPhone}
                    onChange={(e) => handleContactChange(index, 'personalPhone', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="text-end">
                <Button variant="link" className="text-danger" onClick={() => handleRemoveContact(index)}>
                  <FaTrash />
                </Button>
              </Col>
            </Row>
          </div>
        ))}
        <Button variant="outline-primary" onClick={handleAddContact}>+ Add Contact Person</Button>
      </Card.Body>
    </Accordion.Collapse>
  </Card>
</Accordion>

      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowCustomerModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Customer
        </Button>
      </Modal.Footer>
  
   </Modal>





   {/* Vendor Modal */}

   <Modal show={showVendorModal} onHide={() => setShowVendorModal(false)} size="lg" centered scrollable>
      <Modal.Header closeButton style={{ backgroundColor: '#f8f9fa' }}>
        <Modal.Title className="fw-semibold">Add New Vendor</Modal.Title>
      </Modal.Header>
    <br/><br/>
      {/* Login & Org Selection Section */}
      <div style={{ backgroundColor: '#f8f9fa', // Bootstrap light
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    border: '1px solid #e0e0e0',
    marginLeft:"42px",
    marginRight:"42px"}}>
        <div className="d-flex align-items-center">
          <span className="fw-semibold me-3">Login is enabled</span>
          <Form.Check
            type="switch"
            id="login-switch"
            checked={loginEnabled}
            onChange={(e) => setLoginEnabled(e.target.checked)}
          />
        </div>
        <div style={{ width: '50%' }}>
         <Form.Group controlId="organization">
  <Form.Label className="fw-semibold">
    Organization <span className="text-danger">*</span>
  </Form.Label>
  <Form.Select
    value={organization}
    onChange={(e) => setOrganization(e.target.value)}
  >
    <option value="">Select Organization</option>
    <option>Kochi Organization</option>
    <option>Kozhikode Organization</option>
    <option>Bangalore Organization</option>
  </Form.Select>
</Form.Group>

        </div>
      </div>

     <Modal.Body style={{  padding: '1.5rem',
    maxHeight: '70vh',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch', // smooth scrolling on iOS
    scrollbarWidth: 'thin', // Firefox
    scrollbarColor: '#cbd5e1 #f1f5f9',border:"none"}}>
        <Accordion defaultActiveKey="0" alwaysOpen>
          {/* Vendor Details */}
          <Accordion.Item eventKey="0" style={{ border: 'none', boxShadow: 'none' }}>
            <CustomAccordionToggle eventKey="0">
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <Briefcase size={18} strokeWidth={2} />
    <span>Vendor Details</span>
  </div>
</CustomAccordionToggle>
            <Accordion.Body>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group controlId="salutation">
                    <Form.Label>Salutation<span className="text-danger">*</span></Form.Label>
                    <Form.Select value={salutation} onChange={(e) => setSalutation(e.target.value)}>
                      <option>Mr.</option>
                      <option>Ms.</option>
                      <option>Mrs.</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="vendorName">
                    <Form.Label>Name<span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" value={vendorName} onChange={(e) => setVendorName(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="vendorPhone">
                    <Form.Label>Phone<span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" value={vendorPhone} onChange={(e) => setVendorPhone(e.target.value)} />
                  </Form.Group>
                </Col>
               
              </Row>

              <Row className="mb-3">
                 <Col md={4}>
                  <Form.Group controlId="vendorEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={vendorEmail} onChange={(e) => setVendorEmail(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="gstNo">
                    <Form.Label>GST No.</Form.Label>
                    <Form.Control type="text" value={gstNo} onChange={(e) => setGstNo(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="vendorType">
                    <Form.Label>Type<span className="text-danger">*</span></Form.Label>
                    <Form.Select value={vendorType} onChange={(e) => setVendorType(e.target.value)}>
                      <option>Material</option>
                      <option>Service</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
             
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="vendorAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={vendorAddress}
                      onChange={(e) => setVendorAddress(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          {/* Contact Persons */}
          <Accordion.Item eventKey="1" style={{ border: 'none', boxShadow: 'none' }}>
           <CustomAccordionToggle eventKey="1">
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <Users size={18} strokeWidth={2} />
    <span>Contact Persons</span>
  </div>
</CustomAccordionToggle>
            <Accordion.Body>
              {contacts.length === 0 && (
                <div className="text-end mb-3">
                  <Button variant="primary" size="sm" onClick={addContact}>
                    + Add Contact Person
                  </Button>
                </div>
              )}

              {contacts.map((contact, index) => (
                <div key={index} className="mb-3 border rounded p-3 bg-white">
                  <Row className="mb-2">
                    <Col md={6}>
                      <Form.Group controlId={`contact-name-${index}`}>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={contact.name}
                          onChange={(e) => handleContactChanges(index, "name", e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId={`contact-designation-${index}`}>
                        <Form.Label>Designation</Form.Label>
                        <Form.Control
                          type="text"
                          value={contact.designation}
                          onChange={(e) => handleContactChanges(index, "designation", e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId={`contact-email-${index}`}>
                        <Form.Label>Work Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={contact.email}
                          onChange={(e) => handleContactChanges(index, "email", e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId={`contact-phone-${index}`}>
                        <Form.Label>Work Phone</Form.Label>
                        <Form.Control
                          type="text"
                          value={contact.phone}
                          onChange={(e) => handleContactChanges(index, "phone", e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="text-end mt-3">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeContact(index)}
                      title="Delete Contact"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              ))}

              {contacts.length > 0 && (
                <div className="text-start">
                  <Button variant="primary" size="sm" onClick={addContact}>
                    + Add Contact Person
                  </Button>
                </div>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowVendorModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveVendor}>
          Save Vendor
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}