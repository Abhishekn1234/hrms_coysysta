import React, { useState,useContext } from 'react';
import { Container, Row, Col, Button, Modal,Tabs,Tab,AccordionContext, Form, Accordion,useAccordionButton,Card } from 'react-bootstrap';
import { FaUsers, FaUserFriends, FaUserTie, FaUser, FaPhone, FaDollarSign, FaCertificate, FaFileAlt, FaBuilding} from 'react-icons/fa';
import { BsChevronRight, BsChevronDown } from "react-icons/bs";
import { FaTrash } from 'react-icons/fa';
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
function PeoplePage() {
  const [key, setKey] = useState('staff');
  const [showModal, setShowModal] = useState(false);
  const [loginEnabled, setLoginEnabled] = useState(false);
  const [organization, setOrganization] = useState('');
        const [showStaffModal, setShowStaffModal] = useState(false);
        const [showCustomerModal, setShowCustomerModal] = useState(false);
        const [showVendorModal, setShowVendorModal] = useState(false);
    const [activeKey, setActiveKey] = useState('0');
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
 const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

// const [loginEnabled, setLoginEnabled] = useState(false);
//   const [organization, setOrganization] = useState("");
 const [contacts, setContacts] = useState([]); // start empty

  const handleSaveAddress = () => {
    setAddresses([...addresses, newAddress]);
    setNewAddress({
      address: '',
      city: '',
      state: '',
      pincode: ''
    });
    setShowForm(false);
  };

  const [contactPersons, setContactPersons] = useState([]);

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
const handleSaveVendor=()=>{

}
const handleRemoveContact = (index) => {
  const updated = [...contactPersons];
  updated.splice(index, 1);
  setContactPersons(updated);
};
 const addContact = () => {
    setContacts([...contacts, { name: "", designation: "", email: "", phone: "" }]);
  };

  const removeContact = (index) => {
    const newContacts = contacts.filter((_, i) => i !== index);
    setContacts(newContacts);
  };

  const handleContactChanges = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };
const handleContactChange = (index, field, value) => {
  const updated = [...contactPersons];
  updated[index][field] = value;
  setContactPersons(updated);
};


  const handleRemoveAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };
    const handleAddClicks = () => {
    setShowForm(true);
  };
 const handleAddClick = () => {
  if (key === "staff") setShowStaffModal(true);
  else if (key === "customers") setShowCustomerModal(true);
  else if (key === "vendors") setShowVendorModal(true);
};
 const [gstDetails, setGstDetails] = useState([]);

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
  setNewAddress({
      ...newAddress,
      [field]: value
    });
};

  return (
    <>
    
    
    </>
  );
}

export default PeoplePage;