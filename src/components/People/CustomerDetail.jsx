import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import NewProjectModal from './NewProjectModal';
import InvoiceModal from './InvoiceModal';
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Tabs,
  Tab,
  Accordion,
  AccordionContext,
  useAccordionButton,
  Card,
  Form
} from 'react-bootstrap';
import {
  FaUser,
  FaUsers,
  FaUserTie,
  FaUserFriends,
  FaEnvelope,
  FaFileInvoice,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaClipboardList,
  FaBriefcase,
  FaPlus,
  FaTrash,
  FaPhone,
  FaDollarSign,
  FaCertificate,
  FaFileAlt,
  FaBuilding
} from 'react-icons/fa';
import { BsChevronRight, BsChevronDown } from "react-icons/bs";
import axios from 'axios';

// Custom components
import StaffDetails from './StaffDetails';
import ContactForm from './ContactForm';
import FinancialHR from './FinancialHr';
import Skills from './Skills';
import Dashboard from './Dashboard';
import StaffTable from './StaffTable';
import CustomerProfileForm from './CustomerProfileForm';
import { toast } from 'react-toastify';
// Styles
import './styles.css';
import './page.css';
import CustomerProfiles from './CustomerProfiles';

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

export default function Customerdetail() {

 const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNewProject, setShowNewProject] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  // State setup
  const [customer, setCustomer] = useState({});
  const [gstDetails, setGstDetails] = useState([]);
  const [loginEnabled, setLoginEnabled] = useState(false);
const [organization, setOrganization] = useState('');
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [contactPersons, setContactPersons] = useState([]);
  const [newAddress, setNewAddress] = useState({ address: '', city: '', state: '', pincode: '' });
  const [showForm, setShowForm] = useState(false);
   const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeKey, setActiveKey] = useState('profile');
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [estimateNumber, setEstimateNumber] = useState('');
const [estimateDate, setEstimateDate] = useState('');
const [amount, setAmount] = useState('');
const [status, setStatus] = useState('Pending');
const handleCloseEstimate = () => setShowEstimateModal(false);

const quickActions = [
  { label: 'New Project', icon: <FaPlus />, onClick: () => setShowNewProject(true) },
  { label: 'New Invoice', icon: <FaFileInvoice />, onClick: () => setShowModal(true) },
  { label: 'New Estimate', icon: <FaClipboardList />, onClick: () => setShowEstimateModal(true) },
  { label: 'Log Payment', icon: <FaMoneyBillWave /> },
  { label: 'Send Mail', icon: <FaEnvelope /> }
];
useEffect(() => {
  if (showEstimateModal) {
    const randomEstimateNumber = `EST-${Math.floor(1000 + Math.random() * 9000)}`;
    setEstimateNumber(randomEstimateNumber);
    setEstimateDate(new Date().toISOString().split('T')[0]); // yyyy-mm-dd
  }
}, [showEstimateModal]);



  // Fetch customer data
  useEffect(() => {
    if (id) {
      axios.get(`http://127.0.0.1:8000/api/v1/customer/customer/${id}`)
        .then((res) => {
          const data = res.data;
          setCustomer(data);
          setGstDetails(data.gst_details || []);
          setAddresses(data.shipping_addresses || []);
          setContactPersons(data.contact_persons || []);
        })
        .catch((err) => {
          console.error('Failed to fetch customer:', err);
          toast.error('Failed to load customer data');
        });
    }
  }, [id]);

  // Update field in customer object
  const handleCustomerUpdate = (updatedCustomer) => {
    setCustomer(updatedCustomer);
  };

  // GST update
  const handleGstChange = (index, field, value) => {
    const updated = [...gstDetails];
    updated[index] = { ...updated[index], [field]: value };
    setGstDetails(updated);
  };

  // Address update
  const handleAddressEdit = (index, field, value) => {
    const updated = [...addresses];
    updated[index] = { ...updated[index], [field]: value };
    setAddresses(updated);
  };
const handleCreateEstimate = async () => {
  const payload = {
    customer_id: customer?.id,
    estimate_number: estimateNumber,
    date: estimateDate,
    amount,
    status
  };

  try {
    await axios.post('http://127.0.0.1:8000/api/v1/estimate/estimates', payload);
    toast.success("Estimate created successfully!");
    setShowEstimateModal(false);
  } catch (error) {
    console.error(error);
    toast.error("Failed to create estimate.");
  }
};

  // Contact person update
  const handleContactChange = (index, field, value) => {
    const updated = [...contactPersons];
    updated[index] = { ...updated[index], [field]: value };
    setContactPersons(updated);
  };

  // Add new address
  const handleAddNewAddress = () => {
    if (newAddress.address && newAddress.city && newAddress.state && newAddress.pincode) {
      setAddresses([...addresses, newAddress]);
      setNewAddress({ address: '', city: '', state: '', pincode: '' });
      setShowForm(false);
    } else {
      toast.error('Please fill all address fields');
    }
  };

  // Update customer to backend
  const handleUpdateCustomer = async () => {
    try {
      const payload = {
        ...customer,
        gst_details: gstDetails,
        shipping_addresses: addresses,
        contact_persons: contactPersons
      };

      await axios.put(`http://127.0.0.1:8000/api/v1/customer/customer/${id}`, payload);
      toast.success('Customer updated successfully!');
      setShowEditModal(false);
    } catch (err) {
      console.error('Failed to update customer:', err);
      toast.error('Failed to update customer');
    }
  };
  const handleDeleteCustomer = async (id) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/customer/customer/${id}`);
    toast.success('Customer deleted successfully!');
    // Optionally: redirect or refresh list
    navigate('/customer'); // or any appropriate path
  } catch (error) {
    console.error('Delete failed:', error);
    toast.error('Failed to delete customer');
  }
};

  if (!customer) return <p>Loading...</p>;
  return (
    <div className="bg-light min-vh-100">
      
      <Container className="py-4">
        {/* Back Button */}
        <div className="mb-3">
          <Button variant="link" onClick={() => navigate(-1)} className="p-0 text-primary">
            ← Back to Customers
          </Button>
        </div>

        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow"
              style={{ width: 80, height: 80, fontSize: '2rem' }}
            >
              {customer.company_name?.charAt(0) || 'C'}
            </div>
            <div>
              <h3 className="fw-bold mb-1">{customer.company_name}</h3>
              <div className="text-muted">{customer.organization}</div>
             <div className="small text-muted">
  Last login: {customer?.created_at ? customer.created_at.slice(0, 10) : 'Never'}
</div>

            </div>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" onClick={() => setShowEditModal(true)}>
              <i className="bi bi-pencil-square"></i> Edit
            </Button>
            <Button variant="outline-danger" onClick={() => handleDeleteCustomer(customer.id)}>
              <i className="bi bi-trash"></i> Delete
            </Button>

          </div>
        </div>

        {/* Quick Actions */}
       <div style={{
  backgroundColor: 'white',
  padding: '1rem',
  borderRadius: '0.375rem',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  marginBottom: '1.5rem'
}}>
  <h6 style={{ color: '#6c757d', marginBottom: '1rem' }}>Quick Actions</h6>
  
  <div style={{ 
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: '0.75rem' 
  }}>
    {quickActions.map((action, idx) => (
      <div 
        key={idx} 
        onClick={action.onClick}
        style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          padding: '0.375rem 0.75rem',
          borderRadius: '0.375rem',
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          gap: '0.5rem'
        }}
      >
        {action.icon}
        <span>{action.label}</span>
      </div>
    ))}

    {/* Modals should be rendered outside of the action list */}
    <NewProjectModal 
      show={showNewProject} 
      onHide={() => setShowNewProject(false)} 
      customer={customer.company_name} 
      id={id} 
    />

    <InvoiceModal 
      show={showModal} 
      onClose={() => setShowModal(false)} 
      customerId={id} 
    />
  </div>
</div>


        {/* Detail Tabs */}
      <div style={{
  backgroundColor: '#fff',
  padding: '1rem',
  borderRadius: '0.375rem',
  boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
}}>
  {/* Tabs Navigation */}
  <div style={{
    display: 'flex',
    borderBottom: '1px solid #dee2e6',
    marginBottom: '1rem',
    paddingBottom: '0.5rem'
  }}>
    {/* Profile Tab */}
    <div 
      style={{
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderBottom: activeKey === 'profile' ? '2px solid #0d6efd' : 'none',
        color: activeKey === 'profile' ? '#0d6efd' : '#495057',
        fontWeight: activeKey === 'profile' ? '600' : '400',
        display: 'inline-flex',
        alignItems: 'center'
      }}
      onClick={() => setActiveKey('profile')}
    >
      <i className="fas fa-user" style={{ marginRight: '0.5rem', fontSize: '0.875rem' }}></i>
      <span>Profile</span>
    </div>

    {/* Contacts Tab */}
    <div 
      style={{
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderBottom: activeKey === 'contacts' ? '2px solid #0d6efd' : 'none',
        color: activeKey === 'contacts' ? '#0d6efd' : '#495057',
        fontWeight: activeKey === 'contacts' ? '600' : '400',
        display: 'inline-flex',
        alignItems: 'center'
      }}
      onClick={() => setActiveKey('contacts')}
    >
      <i className="fas fa-envelope" style={{ marginRight: '0.5rem', fontSize: '0.875rem' }}></i>
      <span>Contacts</span>
    </div>

    {/* Projects Tab */}
    <div 
      style={{
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderBottom: activeKey === 'projects' ? '2px solid #0d6efd' : 'none',
        color: activeKey === 'projects' ? '#0d6efd' : '#495057',
        fontWeight: activeKey === 'projects' ? '600' : '400',
        display: 'inline-flex',
        alignItems: 'center'
      }}
      onClick={() => setActiveKey('projects')}
    >
      <i className="fas fa-project-diagram" style={{ marginRight: '0.5rem', fontSize: '0.875rem' }}></i>
      <span>Projects</span>
    </div>

    {/* Invoices Tab */}
    <div 
      style={{
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderBottom: activeKey === 'invoices' ? '2px solid #0d6efd' : 'none',
        color: activeKey === 'invoices' ? '#0d6efd' : '#495057',
        fontWeight: activeKey === 'invoices' ? '600' : '400',
        display: 'inline-flex',
        alignItems: 'center'
      }}
      onClick={() => setActiveKey('invoices')}
    >
      <i className="fas fa-file-invoice" style={{ marginRight: '0.5rem', fontSize: '0.875rem' }}></i>
      <span>Invoices</span>
    </div>

    {/* Estimates Tab */}
    <div 
      style={{
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderBottom: activeKey === 'estimates' ? '2px solid #0d6efd' : 'none',
        color: activeKey === 'estimates' ? '#0d6efd' : '#495057',
        fontWeight: activeKey === 'estimates' ? '600' : '400',
        display: 'inline-flex',
        alignItems: 'center'
      }}
      onClick={() => setActiveKey('estimates')}
    >
      <i className="fas fa-clipboard-list" style={{ marginRight: '0.5rem', fontSize: '0.875rem' }}></i>
      <span>Estimates</span>
    </div>

    {/* Payments Tab */}
    <div 
      style={{
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderBottom: activeKey === 'payments' ? '2px solid #0d6efd' : 'none',
        color: activeKey === 'payments' ? '#0d6efd' : '#495057',
        fontWeight: activeKey === 'payments' ? '600' : '400',
        display: 'inline-flex',
        alignItems: 'center'
      }}
      onClick={() => setActiveKey('payments')}
    >
      <i className="fas fa-money-bill-wave" style={{ marginRight: '0.25rem', fontSize: '0.875rem' }}></i>
      <span>Payments</span>
    </div>

    {/* Mails Tab */}
    <div 
      style={{
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderBottom: activeKey === 'mails' ? '2px solid #0d6efd' : 'none',
        color: activeKey === 'mails' ? '#0d6efd' : '#495057',
        fontWeight: activeKey === 'mails' ? '600' : '400',
        display: 'inline-flex',
        alignItems: 'center'
      }}
      onClick={() => setActiveKey('mails')}
    >
      <i className="fas fa-envelope" style={{ marginRight: '0.25rem', fontSize: '0.875rem' }}></i>
      <span>Mails</span>
    </div>
  </div>

  {/* Tab Content */}
  <div>
    {/* Profile Tab Content */}
    {activeKey === 'profile' && (
      <div>
        {/* Company & Contact Info */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h5 style={{ 
            marginBottom: '1rem',
            fontSize: '1.25rem',
            fontWeight: '500',
            color: '#212529'
          }}>Company & Contact Information</h5>
          <hr style={{ 
            margin: '0.5rem 0',
            border: '0',
            borderTop: '1px solid #dee2e6'
          }}/>
          
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: '0.5rem'
          }}>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.5rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Organization:</strong>
              <div>{customer.organization || 'N/A'}</div></div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.5rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Customer Type:</strong>
              <div>{customer.customer_type || 'N/A'}</div></div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.5rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Company Name:</strong>
              <div>{customer.company_name || 'N/A'}</div></div>
            </div>
          </div>

          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: '0.5rem'
          }}>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.5rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Display Name:</strong>
              <div>{customer.display_name || 'N/A'}</div></div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.5rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>Owner Name:</strong>
              <div>{customer.owner_name || 'N/A'}</div></div>
            </div>
            <div style={{ 
              flex: '0 0 33.333333%',
              maxWidth: '33.333333%',
              padding: '0 0.75rem',
              marginBottom: '0.5rem'
            }}>
              <div><strong style={{ fontWeight: '600' }}>PAN No.:</strong>
              <div>{customer.pan_no || 'N/A'}</div></div>
            </div>
          </div> 
          <hr style={{ 
            margin: '0.5rem 0',
            border: '0',
            borderTop: '1px solid #dee2e6'
          }}/>

          <div style={{ marginTop: '1rem' }}>
            <h5>Registered Address:</h5>
            <hr style={{ 
              margin: '0.5rem 0',
              border: '0',
              borderTop: '1px solid #dee2e6'
            }}/>
            <div>{customer.address || 'No registered address'}</div>
          </div>
        </div>
        <hr style={{ 
          margin: '0.5rem 0',
          border: '0',
          borderTop: '1px solid #dee2e6'
        }}/>
        
        {/* GST Details Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h5>GST Details</h5>
          <hr style={{ 
            margin: '0.5rem 0',
            border: '0',
            borderTop: '1px solid #dee2e6'
          }}/>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '1rem',
              border: '1px solid #dee2e6'
            }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ 
                    padding: '0.75rem',
                    textAlign: 'left',
                    borderBottom: '1px solid #dee2e6',
                    borderRight: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>GST Number</th>
                  <th style={{ 
                    padding: '0.75rem',
                    textAlign: 'left',
                    borderBottom: '1px solid #dee2e6',
                    borderRight: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>Place of Supply</th>
                  <th style={{ 
                    padding: '0.75rem',
                    textAlign: 'left',
                    borderBottom: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>Registered Address</th>
                </tr>
              </thead>
              <tbody>
                {gstDetails.length > 0 ? (
                  gstDetails.map((gst, index) => (
                    <tr key={index}>
                      <td style={{ 
                        padding: '0.75rem',
                        borderBottom: '1px solid #dee2e6',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>{gst.gst_number || 'N/A'}</td>
                      <td style={{ 
                        padding: '0.75rem',
                        borderBottom: '1px solid #dee2e6',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>{gst.place_of_supply || 'N/A'}</td>
                      <td style={{ 
                        padding: '0.75rem',
                        borderBottom: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>{gst.registered_address || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ 
                      padding: '0.75rem',
                      textAlign: 'center',
                      borderBottom: '1px solid #dee2e6'
                    }}>No GST details available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <hr style={{ 
          margin: '0.5rem 0',
          border: '0',
          borderTop: '1px solid #dee2e6'
        }}/>
        
        {/* Shipping Address Table */}
        <div>
          <h5>Shipping Addresses</h5>
          <hr style={{ 
            margin: '0.5rem 0',
            border: '0',
            borderTop: '1px solid #dee2e6'
          }}/>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '1rem',
              border: '1px solid #dee2e6'
            }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ 
                    padding: '0.75rem',
                    textAlign: 'left',
                    borderBottom: '1px solid #dee2e6',
                    borderRight: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>Address</th>
                  <th style={{ 
                    padding: '0.75rem',
                    textAlign: 'left',
                    borderBottom: '1px solid #dee2e6',
                    borderRight: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>City</th>
                  <th style={{ 
                    padding: '0.75rem',
                    textAlign: 'left',
                    borderBottom: '1px solid #dee2e6',
                    borderRight: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>State</th>
                  <th style={{ 
                    padding: '0.75rem',
                    textAlign: 'left',
                    borderBottom: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>Pincode</th>
                </tr>
              </thead>
              <tbody>
                {addresses.length > 0 ? (
                  addresses.map((address, index) => (
                    <tr key={index}>
                      <td style={{ 
                        padding: '0.75rem',
                        borderBottom: '1px solid #dee2e6',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>{address.address || 'N/A'}</td>
                      <td style={{ 
                        padding: '0.75rem',
                        borderBottom: '1px solid #dee2e6',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>{address.city || 'N/A'}</td>
                      <td style={{ 
                        padding: '0.75rem',
                        borderBottom: '1px solid #dee2e6',
                        borderRight: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>{address.state || 'N/A'}</td>
                      <td style={{ 
                        padding: '0.75rem',
                        borderBottom: '1px solid #dee2e6',
                        verticalAlign: 'middle'
                      }}>{address.pincode || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ 
                      padding: '0.75rem',
                      textAlign: 'center',
                      borderBottom: '1px solid #dee2e6'
                    }}>No shipping addresses available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}

    {/* Contacts Tab Content */}
    {activeKey === 'contacts' && (
      <div style={{ paddingTop: '0.75rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
        <h6 style={{ 
          fontWeight: '500',
          marginBottom: '0.5rem',
          fontSize: '1rem',
          color: '#212529'
        }}>All Contacts</h6>
        <hr style={{ 
          margin: '0.5rem 0',
          border: '0',
          borderTop: '1px solid #dee2e6'
        }} />
        {contactPersons.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '1rem',
              border: '1px solid #dee2e6'
            }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ 
                    padding: '0.75rem',
                    textAlign: 'left',
                    borderBottom: '1px solid #dee2e6',
                    borderRight: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>Name</th>
                  <th style={{ 
                    padding: '0.75rem',
                    textAlign: 'left',
                    borderBottom: '1px solid #dee2e6',
                    borderRight: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>Designation</th>
                  <th style={{ 
                    padding: '0.75rem',
                    textAlign: 'left',
                    borderBottom: '1px solid #dee2e6',
                    borderRight: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>Work Email</th>
                  <th style={{ 
                    padding: '0.75rem',
                    textAlign: 'left',
                    borderBottom: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>Work Phone</th>
                </tr>
              </thead>
              <tbody>
                {contactPersons.map((person, index) => (
                  <tr key={index}>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{person.contact_name || 'N/A'}</td>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{person.designation || 'N/A'}</td>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{person.work_email || 'N/A'}</td>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{person.work_phone || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ 
            color: '#6c757d',
            marginBottom: '0'
          }}>No contacts found.</p>
        )}
      </div>
    )}

    {/* Projects Tab Content */}
    {activeKey === 'projects' && (
      <div style={{ paddingTop: '0.75rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
        <h6 style={{ 
          fontWeight: '500',
          marginBottom: '0.75rem',
          fontSize: '1rem',
          color: '#212529'
        }}>Projects</h6>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '1rem',
            border: '1px solid #dee2e6'
          }}>
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th style={{ 
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  borderRight: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Project Name</th>
                <th style={{ 
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  borderRight: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Start Date</th>
                <th style={{ 
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  borderRight: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>End Date</th>
                <th style={{ 
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  borderRight: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Value</th>
                <th style={{ 
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {customer?.projects?.length > 0 ? (
                customer.projects.map((project) => (
                  <tr key={project.id}>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{project.project_name}</td>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{new Date(project.project_starting_date).toLocaleDateString()}</td>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{new Date(project.expected_release_date).toLocaleDateString()}</td>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{project.amount ?? 'N/A'}</td>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{project.status === 1 ? 'Active' : 'Inactive'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ 
                    padding: '0.75rem',
                    textAlign: 'center',
                    borderBottom: '1px solid #dee2e6'
                  }}>No projects found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* Invoices Tab Content */}
    {activeKey === 'invoices' && (
      <div style={{ paddingTop: '0.75rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
        <h6 style={{ 
          fontWeight: '500',
          marginBottom: '0.75rem',
          fontSize: '1rem',
          color: '#212529'
        }}>Invoices</h6>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '1rem',
            border: '1px solid #dee2e6'
          }}>
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th style={{ 
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  borderRight: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Invoice ID</th>
                <th style={{ 
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  borderRight: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Issue Date</th>
                <th style={{ 
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  borderRight: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Due Date</th>
                <th style={{ 
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  borderRight: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Amount</th>
                <th style={{ 
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {customer?.invoices && customer?.invoices.length > 0 ? (
                customer.invoices.map((invoice, index) => (
                  <tr key={index}>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{invoice.id}</td>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{new Date(invoice.issue_date).toLocaleDateString()}</td>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{new Date(invoice.due_date).toLocaleDateString()}</td>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{invoice.amount}</td>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{invoice.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ 
                    padding: '0.75rem',
                    textAlign: 'center',
                    borderBottom: '1px solid #dee2e6'
                  }}>No invoices found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* Estimates Tab Content */}
    {activeKey === 'estimates' && (
      <div style={{ paddingTop: '0.75rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
        <h6 style={{ 
          fontWeight: '500',
          marginBottom: '0.75rem',
          fontSize: '1rem',
          color: '#212529'
        }}>Estimates</h6>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '1rem',
            border: '1px solid #dee2e6'
          }}>
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th style={{ 
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  borderRight: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Estimate ID</th>
                <th style={{ 
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  borderRight: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Date</th>
                <th style={{ 
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  borderRight: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Amount</th>
                <th style={{ 
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {customer?.estimates?.length > 0 ? (
                customer.estimates.map((estimate, idx) => (
                  <tr key={idx}>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{estimate.estimate_number || `EST-${estimate.id}`}</td>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{estimate.date}</td>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>₹ {parseFloat(estimate.amount).toFixed(2)}</td>
                    <td style={{ 
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25em 0.4em',
                        fontSize: '75%',
                        fontWeight: '700',
                        lineHeight: '1',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        verticalAlign: 'baseline',
                        borderRadius: '10rem',
                        backgroundColor: estimate.status === 'Approved' ? '#198754' : 
                                         estimate.status === 'Rejected' ? '#dc3545' : '#ffc107',
                        color: estimate.status === 'Approved' ? '#fff' : 
                               estimate.status === 'Rejected' ? '#fff' : '#000'
                      }}>
                        {estimate.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ 
                    padding: '0.75rem',
                    textAlign: 'center',
                    color: '#6c757d',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    No estimates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* Payments Tab Content */}
    {activeKey === 'payments' && (
      <div style={{ padding: '0.75rem 0.5rem' }}>
        <p>Payment history for this customer.</p>
      </div>
    )}

    {/* Mails Tab Content */}
    {activeKey === 'mails' && (
      <div style={{ padding: '0.75rem 0.5rem' }}>
        <p>Emails sent to this customer.</p>
      </div>
    )}
  </div>
</div>
       


        {/* Edit Customer Modal */}

        {showEditModal && (
             <div style={{
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: showEditModal ? 'flex' : 'none',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1050
}}>
  <div style={{
    width: '800px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    backgroundColor: '#fff',
    borderRadius: '0.3rem',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }}>
    {/* Modal Header */}
    <div style={{
      padding: '1rem',
      borderBottom: '1px solid #dee2e6',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h5 style={{
        margin: 0,
        fontWeight: 'bold',
        fontSize: '1.25rem'
      }}>Edit Customer</h5>
      <button 
        style={{
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: '#6c757d'
        }}
        onClick={() => setShowEditModal(false)}
      >
        &times;
      </button>
    </div>
    <hr style={{margin: 0}}/>

    {/* Login & Organization Section */}
    <div style={{
      maxWidth: '720px',
      margin: '1rem 0 1rem 40px',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '0.375rem',
      boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)',
      border: '1px solid #dee2e6'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        marginBottom: '1rem'
      }}>
        <div style={{
          flex: '0 0 50%',
          maxWidth: '50%',
          padding: '0 0.75rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <label style={{
            fontWeight: '600',
            margin: '0 0.75rem 0 0'
          }}>Login is enabled</label>
          <div style={{
            position: 'relative',
            width: '3.5rem',
            height: '1.75rem'
          }}>
            <input 
              type="checkbox"
              id="login-switch"
              checked={loginEnabled}
              onChange={(e) => setLoginEnabled(e.target.checked)}
              style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0,0,0,0)',
                whiteSpace: 'nowrap',
                border: 0
              }}
            />
            <label 
              htmlFor="login-switch"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '3.5rem',
                height: '1.75rem',
                backgroundColor: loginEnabled ? '#0d6efd' : '#6c757d',
                borderRadius: '1.75rem',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease-in-out'
              }}
            >
              <span style={{
                position: 'absolute',
                top: '0.25rem',
                left: loginEnabled ? '1.75rem' : '0.25rem',
                width: '1.25rem',
                height: '1.25rem',
                backgroundColor: '#fff',
                borderRadius: '50%',
                transition: 'left 0.15s ease-in-out'
              }}></span>
            </label>
          </div>
        </div>

        <div style={{
          flex: '0 0 50%',
          maxWidth: '50%',
          padding: '0 0.75rem'
        }}>
          <label style={{
            fontWeight: '600',
            display: 'block',
            marginBottom: '0.5rem'
          }}>Organization <span style={{color: '#dc3545'}}>*</span></label>
          <select 
            value={organization} 
            onChange={(e) => setOrganization(e.target.value)}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.375rem 2.25rem 0.375rem 0.75rem',
              fontSize: '1rem',
              fontWeight: '400',
              lineHeight: '1.5',
              color: '#212529',
              backgroundColor: '#fff',
              backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'%3e%3cpath fill=\'none\' stroke=\'%23343a40\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M2 5l6 6 6-6\'/%3e%3c/svg%3e")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '16px 12px',
              border: '1px solid #ced4da',
              borderRadius: '0.375rem',
              appearance: 'none'
            }}
          >
            <option value="">Select Organization</option>
            <option>Bangalore Organization</option>
            <option>Kochi Organization</option>
            <option>Calicut Organization</option>
          </select>
        </div>
      </div>

      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        <div style={{
          flex: '0 0 50%',
          maxWidth: '50%',
          padding: '0 0.75rem'
        }}>
          <div style={{marginBottom: '1rem'}}>
            <label style={{
              fontWeight: '600',
              display: 'block',
              marginBottom: '0.5rem'
            }}>Username <span style={{color: '#dc3545'}}>*</span></label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              style={{
                display: 'block',
                width: '100%',
                padding: '0.375rem 0.75rem',
                fontSize: '1rem',
                fontWeight: '400',
                lineHeight: '1.5',
                color: '#212529',
                backgroundColor: '#fff',
                backgroundClip: 'padding-box',
                border: '1px solid #ced4da',
                appearance: 'none',
                borderRadius: '0.375rem',
                transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
              }}
            />
          </div>
        </div>

        <div style={{
          flex: '0 0 50%',
          maxWidth: '50%',
          padding: '0 0.75rem'
        }}>
          <div style={{marginBottom: '1rem'}}>
            <label style={{
              fontWeight: '600',
              display: 'block',
              marginBottom: '0.5rem'
            }}>Password <span style={{color: '#dc3545'}}>*</span></label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={!loginEnabled}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.375rem 0.75rem',
                fontSize: '1rem',
                fontWeight: '400',
                lineHeight: '1.5',
                color: '#212529',
                backgroundColor: loginEnabled ? '#fff' : '#e9ecef',
                backgroundClip: 'padding-box',
                border: '1px solid #ced4da',
                appearance: 'none',
                borderRadius: '0.375rem',
                transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                opacity: loginEnabled ? '1' : '0.65'
              }}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Modal Body */}
    <div style={{
      flex: '1',
      overflowY: 'auto',
      padding: '1rem'
    }}>
      <div style={{width: '100%'}}>
        {/* Primary Details */}
        <div style={{
          marginBottom: '1rem',
          border: '1px solid #dee2e6',
          borderRadius: '0.375rem'
        }}>
          <button 
            style={{
              width: '100%',
              padding: '1rem',
              textAlign: 'left',
              backgroundColor: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontWeight: '500'
            }}
            onClick={() => setActiveAccordion(activeAccordion === '0' ? null : '0')}
          >
            <i className="fas fa-user-tie" style={{
              marginRight: '0.5rem',
              fontSize: '0.875rem'
            }}></i>
            Primary Details
            <span style={{
              marginLeft: 'auto',
              transition: 'transform 0.2s ease-in-out',
              transform: activeAccordion === '0' ? 'rotate(180deg)' : 'rotate(0)'
            }}>
              <i className="fas fa-chevron-down"></i>
            </span>
          </button>
          
          {activeAccordion === '0' && (
            <div style={{
              padding: '1rem',
              borderTop: '1px solid #dee2e6'
            }}>
              <CustomerProfiles
                customer={customer}
                setCustomer={setCustomer}
              />
            </div>
          )}
        </div>

        {/* GST Details */}
        <div style={{
          marginBottom: '1rem',
          border: '1px solid #dee2e6',
          borderRadius: '0.375rem'
        }}>
          <button 
            style={{
              width: '100%',
              padding: '1rem',
              textAlign: 'left',
              backgroundColor: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontWeight: '500'
            }}
            onClick={() => setActiveAccordion(activeAccordion === '1' ? null : '1')}
          >
            <i className="fas fa-file-invoice" style={{
              marginRight: '0.5rem',
              fontSize: '0.875rem'
            }}></i>
            GST Details
            <span style={{
              marginLeft: 'auto',
              transition: 'transform 0.2s ease-in-out',
              transform: activeAccordion === '1' ? 'rotate(180deg)' : 'rotate(0)'
            }}>
              <i className="fas fa-chevron-down"></i>
            </span>
          </button>
          
          {activeAccordion === '1' && (
            <div style={{
              padding: '1rem',
              borderTop: '1px solid #dee2e6'
            }}>
              {gstDetails.map((gst, index) => (
                <div key={index} style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.375rem'
                }}>
                  <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <div style={{
                      flex: '0 0 50%',
                      maxWidth: '50%',
                      padding: '0 0.75rem'
                    }}>
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem'
                        }}>GST No.</label>
                        <input
                          value={gst.gst_number}
                          onChange={(e) =>
                            handleGstChange(index, 'gst_number', e.target.value)
                          }
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.375rem 0.75rem',
                            fontSize: '1rem',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            color: '#212529',
                            backgroundColor: '#fff',
                            backgroundClip: 'padding-box',
                            border: '1px solid #ced4da',
                            appearance: 'none',
                            borderRadius: '0.375rem',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{
                      flex: '0 0 50%',
                      maxWidth: '50%',
                      padding: '0 0.75rem'
                    }}>
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem'
                        }}>Place of Supply</label>
                        <input
                          value={gst.place_of_supply}
                          onChange={(e) =>
                            handleGstChange(index, 'place_of_supply', e.target.value)
                          }
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.375rem 0.75rem',
                            fontSize: '1rem',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            color: '#212529',
                            backgroundColor: '#fff',
                            backgroundClip: 'padding-box',
                            border: '1px solid #ced4da',
                            appearance: 'none',
                            borderRadius: '0.375rem',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    style={{
                      color: '#fff',
                      backgroundColor: '#dc3545',
                      borderColor: '#dc3545',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.875rem',
                      borderRadius: '0.2rem',
                      border: '1px solid transparent',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                    onClick={() => {
                      const updated = [...gstDetails];
                      updated.splice(index, 1);
                      setGstDetails(updated);
                    }}
                  >
                    <i className="fas fa-trash" style={{marginRight: '0.25rem'}}></i> 
                  </button>
                </div>
              ))}
              <button
                style={{
                  color: '#fff',
                  backgroundColor: '#0d6efd',
                  borderColor: '#0d6efd',
                  padding: '0.375rem 0.75rem',
                  fontSize: '1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid transparent',
                  cursor: 'pointer'
                }}
                onClick={() =>
                  setGstDetails([...gstDetails, { gst_number: '', place_of_supply: '' }])
                }
              >
                + Add GST
              </button>
            </div>
          )}
        </div>

        {/* Shipping Addresses */}
        <div style={{
          marginBottom: '1rem',
          border: '1px solid #dee2e6',
          borderRadius: '0.375rem'
        }}>
          <button 
            style={{
              width: '100%',
              padding: '1rem',
              textAlign: 'left',
              backgroundColor: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontWeight: '500'
            }}
            onClick={() => setActiveAccordion(activeAccordion === '2' ? null : '2')}
          >
            <i className="fas fa-clipboard-list" style={{
              marginRight: '0.5rem',
              fontSize: '0.875rem'
            }}></i>
            Shipping Addresses
            <span style={{
              marginLeft: 'auto',
              transition: 'transform 0.2s ease-in-out',
              transform: activeAccordion === '2' ? 'rotate(180deg)' : 'rotate(0)'
            }}>
              <i className="fas fa-chevron-down"></i>
            </span>
          </button>
          
          {activeAccordion === '2' && (
            <div style={{
              padding: '1rem',
              borderTop: '1px solid #dee2e6'
            }}>
              {addresses.map((address, index) => (
                <div key={index} style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.375rem'
                }}>
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Address</label>
                    <input
                      value={address.address}
                      onChange={(e) =>
                        handleAddressEdit(index, 'address', e.target.value)
                      }
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '0.375rem 0.75rem',
                        fontSize: '1rem',
                        fontWeight: '400',
                        lineHeight: '1.5',
                        color: '#212529',
                        backgroundColor: '#fff',
                        backgroundClip: 'padding-box',
                        border: '1px solid #ced4da',
                        appearance: 'none',
                        borderRadius: '0.375rem',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                      }}
                    />
                  </div>
                  <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <div style={{
                      flex: '0 0 33.333333%',
                      maxWidth: '33.333333%',
                      padding: '0 0.75rem'
                    }}>
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem'
                        }}>City</label>
                        <input
                          value={address.city}
                          onChange={(e) =>
                            handleAddressEdit(index, 'city', e.target.value)
                          }
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.375rem 0.75rem',
                            fontSize: '1rem',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            color: '#212529',
                            backgroundColor: '#fff',
                            backgroundClip: 'padding-box',
                            border: '1px solid #ced4da',
                            appearance: 'none',
                            borderRadius: '0.375rem',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{
                      flex: '0 0 33.333333%',
                      maxWidth: '33.333333%',
                      padding: '0 0.75rem'
                    }}>
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem'
                        }}>State</label>
                        <input
                          value={address.state}
                          onChange={(e) =>
                            handleAddressEdit(index, 'state', e.target.value)
                          }
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.375rem 0.75rem',
                            fontSize: '1rem',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            color: '#212529',
                            backgroundColor: '#fff',
                            backgroundClip: 'padding-box',
                            border: '1px solid #ced4da',
                            appearance: 'none',
                            borderRadius: '0.375rem',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{
                      flex: '0 0 33.333333%',
                      maxWidth: '33.333333%',
                      padding: '0 0.75rem'
                    }}>
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem'
                        }}>Pincode</label>
                        <input
                          value={address.pincode}
                          onChange={(e) =>
                            handleAddressEdit(index, 'pincode', e.target.value)
                          }
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.375rem 0.75rem',
                            fontSize: '1rem',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            color: '#212529',
                            backgroundColor: '#fff',
                            backgroundClip: 'padding-box',
                            border: '1px solid #ced4da',
                            appearance: 'none',
                            borderRadius: '0.375rem',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    style={{
                      color: '#fff',
                      backgroundColor: '#dc3545',
                      borderColor: '#dc3545',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.875rem',
                      borderRadius: '0.2rem',
                      border: '1px solid transparent',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                    onClick={() => {
                      const updated = [...addresses];
                      updated.splice(index, 1);
                      setAddresses(updated);
                    }}
                  >
                    <i className="fas fa-trash" style={{marginRight: '0.25rem'}}></i> 
                  </button>
                </div>
              ))}

              {showForm ? (
                <div style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.375rem'
                }}>
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Address</label>
                    <input
                      value={newAddress.address}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, address: e.target.value })
                      }
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '0.375rem 0.75rem',
                        fontSize: '1rem',
                        fontWeight: '400',
                        lineHeight: '1.5',
                        color: '#212529',
                        backgroundColor: '#fff',
                        backgroundClip: 'padding-box',
                        border: '1px solid #ced4da',
                        appearance: 'none',
                        borderRadius: '0.375rem',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                      }}
                    />
                  </div>
                  <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <div style={{
                      flex: '0 0 33.333333%',
                      maxWidth: '33.333333%',
                      padding: '0 0.75rem'
                    }}>
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem'
                        }}>City</label>
                        <input
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, city: e.target.value })
                          }
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.375rem 0.75rem',
                            fontSize: '1rem',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            color: '#212529',
                            backgroundColor: '#fff',
                            backgroundClip: 'padding-box',
                            border: '1px solid #ced4da',
                            appearance: 'none',
                            borderRadius: '0.375rem',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{
                      flex: '0 0 33.333333%',
                      maxWidth: '33.333333%',
                      padding: '0 0.75rem'
                    }}>
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem'
                        }}>State</label>
                        <input
                          value={newAddress.state}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, state: e.target.value })
                          }
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.375rem 0.75rem',
                            fontSize: '1rem',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            color: '#212529',
                            backgroundColor: '#fff',
                            backgroundClip: 'padding-box',
                            border: '1px solid #ced4da',
                            appearance: 'none',
                            borderRadius: '0.375rem',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{
                      flex: '0 0 33.333333%',
                      maxWidth: '33.333333%',
                      padding: '0 0.75rem'
                    }}>
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem'
                        }}>Pincode</label>
                        <input
                          value={newAddress.pincode}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, pincode: e.target.value })
                          }
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.375rem 0.75rem',
                            fontSize: '1rem',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            color: '#212529',
                            backgroundColor: '#fff',
                            backgroundClip: 'padding-box',
                            border: '1px solid #ced4da',
                            appearance: 'none',
                            borderRadius: '0.375rem',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    style={{
                      color: '#fff',
                      backgroundColor: '#198754',
                      borderColor: '#198754',
                      padding: '0.375rem 0.75rem',
                      fontSize: '1rem',
                      borderRadius: '0.375rem',
                      border: '1px solid transparent',
                      cursor: 'pointer',
                      marginRight: '0.5rem'
                    }}
                    onClick={handleAddNewAddress}
                  >
                    Save Address
                  </button>
                  <button 
                    style={{
                      color: '#0d6efd',
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: '0.375rem 0.75rem',
                      fontSize: '1rem',
                      borderRadius: '0.375rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  style={{
                    color: '#fff',
                    backgroundColor: '#0d6efd',
                    borderColor: '#0d6efd',
                    padding: '0.375rem 0.75rem',
                    fontSize: '1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid transparent',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowForm(true)}
                >
                  + Add Address
                </button>
              )}
            </div>
          )}
        </div>

        {/* Contact Persons */}
        <div style={{
          marginBottom: '1rem',
          border: '1px solid #dee2e6',
          borderRadius: '0.375rem'
        }}>
          <button 
            style={{
              width: '100%',
              padding: '1rem',
              textAlign: 'left',
              backgroundColor: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontWeight: '500'
            }}
            onClick={() => setActiveAccordion(activeAccordion === '3' ? null : '3')}
          >
            <i className="fas fa-user-friends" style={{
              marginRight: '0.5rem',
              fontSize: '0.875rem'
            }}></i>
            Contact Persons
            <span style={{
              marginLeft: 'auto',
              transition: 'transform 0.2s ease-in-out',
              transform: activeAccordion === '3' ? 'rotate(180deg)' : 'rotate(0)'
            }}>
              <i className="fas fa-chevron-down"></i>
            </span>
          </button>
          
          {activeAccordion === '3' && (
            <div style={{
              padding: '1rem',
              borderTop: '1px solid #dee2e6'
            }}>
              {contactPersons.map((person, index) => (
                <div key={index} style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.375rem'
                }}>
                  <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <div style={{
                      flex: '0 0 50%',
                      maxWidth: '50%',
                      padding: '0 0.75rem'
                    }}>
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem'
                        }}>Name</label>
                        <input
                          value={person.contact_name}
                          onChange={(e) =>
                            handleContactChange(index, 'contact_name', e.target.value)
                          }
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.375rem 0.75rem',
                            fontSize: '1rem',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            color: '#212529',
                            backgroundColor: '#fff',
                            backgroundClip: 'padding-box',
                            border: '1px solid #ced4da',
                            appearance: 'none',
                            borderRadius: '0.375rem',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{
                      flex: '0 0 50%',
                      maxWidth: '50%',
                      padding: '0 0.75rem'
                    }}>
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem'
                        }}>Designation</label>
                        <input
                          value={person.designation}
                          onChange={(e) =>
                            handleContactChange(index, 'designation', e.target.value)
                          }
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.375rem 0.75rem',
                            fontSize: '1rem',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            color: '#212529',
                            backgroundColor: '#fff',
                            backgroundClip: 'padding-box',
                            border: '1px solid #ced4da',
                            appearance: 'none',
                            borderRadius: '0.375rem',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <div style={{
                      flex: '0 0 50%',
                      maxWidth: '50%',
                      padding: '0 0.75rem'
                    }}>
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem'
                        }}>Work Email</label>
                        <input
                          type="email"
                          value={person.work_email}
                          onChange={(e) =>
                            handleContactChange(index, 'work_email', e.target.value)
                          }
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.375rem 0.75rem',
                            fontSize: '1rem',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            color: '#212529',
                            backgroundColor: '#fff',
                            backgroundClip: 'padding-box',
                            border: '1px solid #ced4da',
                            appearance: 'none',
                            borderRadius: '0.375rem',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{
                      flex: '0 0 50%',
                      maxWidth: '50%',
                      padding: '0 0.75rem'
                    }}>
                      <div style={{marginBottom: '1rem'}}>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem'
                        }}>Work Phone</label>
                        <input
                          value={person.work_phone}
                          onChange={(e) =>
                            handleContactChange(index, 'work_phone', e.target.value)
                          }
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '0.375rem 0.75rem',
                            fontSize: '1rem',
                            fontWeight: '400',
                            lineHeight: '1.5',
                            color: '#212529',
                            backgroundColor: '#fff',
                            backgroundClip: 'padding-box',
                            border: '1px solid #ced4da',
                            appearance: 'none',
                            borderRadius: '0.375rem',
                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    style={{
                      color: '#fff',
                      backgroundColor: '#dc3545',
                      borderColor: '#dc3545',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.875rem',
                      borderRadius: '0.2rem',
                      border: '1px solid transparent',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                    onClick={() => {
                      const updated = [...contactPersons];
                      updated.splice(index, 1);
                      setContactPersons(updated);
                    }}
                  >
                    <i className="fas fa-trash" style={{marginRight: '0.25rem'}}></i> Remove
                  </button>
                </div>
              ))}
              <button
                style={{
                  color: '#fff',
                  backgroundColor: '#0d6efd',
                  borderColor: '#0d6efd',
                  padding: '0.375rem 0.75rem',
                  fontSize: '1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid transparent',
                  cursor: 'pointer'
                }}
                onClick={() =>
                  setContactPersons([
                    ...contactPersons,
                    {
                      contact_name: '',
                      designation: '',
                      work_email: '',
                      work_phone: ''
                    }
                  ])
                }
              >
                + Add Contact
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Modal Footer */}
    <div style={{
      padding: '1rem',
      borderTop: '1px solid #dee2e6',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <button 
        style={{
          color: '#6c757d',
          backgroundColor: 'transparent',
          border: '1px solid #6c757d',
          padding: '0.375rem 0.75rem',
          fontSize: '1rem',
          borderRadius: '0.375rem',
          marginRight: '0.5rem',
          cursor: 'pointer'
        }}
        onClick={() => setShowEditModal(false)}
      >
        Cancel
      </button>
      <button 
        style={{
          color: '#fff',
          backgroundColor: '#0d6efd',
          border: '1px solid #0d6efd',
          padding: '0.375rem 0.75rem',
          fontSize: '1rem',
          borderRadius: '0.375rem',
          cursor: 'pointer'
        }}
        onClick={handleUpdateCustomer}
      >
        Edit Customer
      </button>
    </div>
  </div>
</div>
        )}
       
        




{showEstimateModal && (
   <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050
    }}>
      <div style={{
        backgroundColor: '#fff',
        width: '500px',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h4 style={{ margin: 0 }}>Create New Estimate</h4>
          <button onClick={() => setShowEstimateModal(false)} style={{
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer'
          }}>&times;</button>
        </div>

        {/* Modal Body */}
        <div>
          <div style={{ marginBottom: '15px' }}>
            <label>Customer ID</label>
            <input
              type="text"
              value={customer?.id || ''}
              readOnly
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                color: '#000'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Estimate Number</label>
            <input
              type="text"
              value={estimateNumber}
              readOnly
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                color: '#000'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Date</label>
            <input
              type="date"
              value={estimateDate}
              onChange={(e) => setEstimateDate(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              <option value="Pending">Pending</option>
              <option value="Sent">Sent</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button
            onClick={() => setShowEstimateModal(false)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ccc',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateEstimate}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create Estimate
          </button>
        </div>
      </div>
    </div>
)};
      

      </Container>
    </div>
  );
}