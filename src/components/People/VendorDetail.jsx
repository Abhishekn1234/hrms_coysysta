import { useParams, useLocation, useNavigate, } from 'react-router-dom';
import { Button, Tabs, Tab,Nav,Table ,Modal,Card,Row,Col,Form,Accordion,AccordionButton,AccordionContext,useAccordionButton} from 'react-bootstrap';
import {
  FaUserTie, FaUserFriends, FaUsers,FaFileAlt, FaEnvelope, FaFileInvoice, FaClipboardList,
  FaMoneyBillWave, FaStickyNote, FaCartPlus,FaEdit,FaTrash
} from 'react-icons/fa';
import { BsChevronRight, BsChevronDown } from "react-icons/bs";
import React,{useState,useEffect,useContext} from 'react';
import { toast } from 'react-toastify';
import CreatePOModal from './CreatePOModal';
import CreateBillModal from './CreateBillModal';
import axios from 'axios';
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
export default function Vendordetail() {
const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showBillModal, setShowBillModal] = useState(false);
const [showModal, setShowModal] = useState(false);
  const [vendor, setVendor] = useState(location.state?.vendor || null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(!vendor);
 const [activeAccordion, setActiveAccordion] = useState(null);
 const [activeTab, setActiveTab] = useState('overview');
  // Vendor fields
  const [loginEnabled, setLoginEnabled] = useState(false);
  const [organization, setOrganization] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [salutation, setSalutation] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [type, setType] = useState('');
  const [address, setAddress] = useState('');
  const [contacts, setContacts] = useState([]);
const [showNoteForm, setShowNoteForm] = useState(false);
const [noteText, setNoteText] = useState("");
  // Load vendor on initial mount
  useEffect(() => {
    if (!vendor) {
      async function fetchVendorDetail() {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/v1/vendors/${id}`);
          setVendor(response.data);
          console.log(response.data); // Check if purchase_orders exists

          console.log('Fetched vendor for editing:', response.data);
        } catch (error) {
          console.error('Failed to fetch vendor details:', error);
        } finally {
          setLoading(false);
        }
      }

      fetchVendorDetail();
    }
  }, [id, vendor]);

  // Preload vendor into form when modal is opened
  useEffect(() => {
    if (showEditModal && selectedVendorId) {
      axios
        .get(`http://127.0.0.1:8000/api/v1/vendors/${selectedVendorId}`)
        .then((res) => {
          const v = res.data;
          setLoginEnabled(v.login_enabled);
          setOrganization(v.organization || '');
          setUsername(v.username || '');
          setPassword(v.password || '');
          setSalutation(v.salutation || '');
          setName(v.name);
          setPhone(v.phone);
          setEmail(v.email || '');
          setGstNo(v.gst_no || '');
          setType(v.type);
          setAddress(v.address || '');
          setContacts(
            v.contact_persons?.map((cp) => ({
              name: cp.name || '',
              designation: cp.designation || '',
              email: cp.work_email || '',
              phone: cp.work_phone || '',
            })) || []
          );
        });
    }
  }, [showEditModal, selectedVendorId]);

  const handleSaveVendor = async () => {
    const payload = {
      salutation,
      name,
      phone,
      email,
      gst_no: gstNo,
      type,
      address,
      login_enabled: loginEnabled,
      organization,
      username,
      password,
      contact_persons: contacts,
    };
   console.log(payload);
    try {
      await axios.put(`http://127.0.0.1:8000/api/v1/vendors/${selectedVendorId}`, payload);
      toast.success('Vendor updated successfully');
      setShowEditModal(false);
      // Optionally refresh vendor data
    } catch (error) {
      console.log(error);
      toast.error('Error updating vendor', error);
    
    }
  };


const handleAddNote = async () => {
  if (!noteText.trim()) return;

  // API POST request to store the note
  try {
    await axios.post(`http://127.0.0.1:8000/api/v1/vendors/${vendor.id}/notes`, { note: noteText });
    setNoteText("");
    setShowNoteForm(false);
    // Refresh note list if needed
  } catch (error) {
    console.error("Error saving note:", error);
  }
};

  const addContact = () => {
    setContacts([...contacts, { name: '', designation: '', email: '', phone: '' }]);
  };

  const removeContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleContactChanges = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  if (loading) return <p>Loading vendor...</p>;
  if (!vendor) return <p className="text-danger">Vendor not found.</p>;
  const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this vendor?')) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/vendors/${id}`);
      toast.success('Vendor deleted successfully');
       navigate('/vendor');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete vendor');
    }
  }
};


  return (
    <div className="p-3">
      {/* Top nav */}
     

      {/* Back */}
     <Card className="mb-4 shadow-sm border-0">
  <Card.Body className="p-4">

    {/* Back Button */}
    <Button variant="link" onClick={() => navigate(-1)} className="p-0 text-primary mb-3">
      ← Back to Vendors
    </Button>

    {/* Header Section */}
    <div className="d-flex justify-content-between align-items-start">
      <div className="d-flex align-items-center gap-3">
        {/* Light Blue Circle */}
        <div
          className="rounded-circle text-dark d-flex align-items-center justify-content-center shadow"
          style={{
            width: 80,
            height: 80,
            fontSize: '2rem',
            backgroundColor: '#e0f0ff' // Light blue
          }}
        >
          {vendor.name.charAt(0)}
        </div>

        {/* Vendor Name and Type */}
        <div>
          <h3 className="fw-bold mb-0">{vendor.name}</h3>
          <div className="text-muted">{vendor.type} Vendor</div>
        </div>
      </div>

      {/* Edit & Delete Buttons */}
      <div className="d-flex gap-2">
        <Button
  variant="outline-primary"
  className="d-flex align-items-center"
  onClick={() => {
    setSelectedVendorId(vendor.id); // Replace `vendor` with your current item
    setShowEditModal(true);
  }}
>
  <FaEdit className="me-1" /> Edit
</Button>

        <Button
  variant="outline-danger"
  className="d-flex align-items-center"
  onClick={() => handleDelete(vendor.id)} // pass the vendor ID
>
  <FaTrash className="me-1" /> Delete
</Button>

      </div>
    </div>

  </Card.Body>
</Card>
<br/>

      {/* Quick Actions */}
     <Card className="mb-4 shadow-sm border-0">
  <Card.Body className="bg-light rounded">
    <div className="fw-semibold mb-2 text-muted">Quick Actions</div>
    <div className="d-flex flex-wrap gap-3">
     <Button
  variant="light"
  className="border d-flex align-items-center mt-3"
  onClick={() => setShowBillModal(true)}
>
  <FaFileInvoice className="me-2" /> New Bill
</Button>
      <Button variant="light" className="border d-flex align-items-center" onClick={() => setShowModal(true)}>
  <FaCartPlus className="me-2" /> New PO
</Button>

      <Button variant="light" className="border d-flex align-items-center">
        <FaMoneyBillWave className="me-2" /> Log Payment
      </Button>
       <Button
      variant="light"
      className="border d-flex align-items-center mb-3"
      onClick={() => setShowNoteForm(true)}
    >
      <FaStickyNote className="me-2" /> Add Note
    </Button>
    </div>
  </Card.Body>
</Card>



      {/* Tabs (example only Overview) */}
      <div className="bg-white p-3 rounded shadow-sm">
       <div style={{ marginBottom: '1rem' }}>
  {/* Tabs Navigation */}
  <div style={{
    display: 'flex',
    borderBottom: '1px solid #dee2e6',
    marginBottom: '1rem'
  }}>
    {/* Overview Tab */}
    <div 
      style={{
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderBottom: activeTab === 'overview' ? '2px solid #0d6efd' : 'none',
        color: activeTab === 'overview' ? '#0d6efd' : '#495057',
        fontWeight: activeTab === 'overview' ? '600' : '400',
        display: 'inline-flex',
        alignItems: 'center'
      }}
      onClick={() => setActiveTab('overview')}
    >
      <i className="fas fa-user-tie" style={{ marginRight: '0.25rem', fontSize: '0.875rem' }}></i>
      <span>Overview</span>
    </div>

    {/* Contacts Tab */}
    <div 
      style={{
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderBottom: activeTab === 'contacts' ? '2px solid #0d6efd' : 'none',
        color: activeTab === 'contacts' ? '#0d6efd' : '#495057',
        fontWeight: activeTab === 'contacts' ? '600' : '400',
        display: 'inline-flex',
        alignItems: 'center'
      }}
      onClick={() => setActiveTab('contacts')}
    >
      <i className="fas fa-envelope" style={{ marginRight: '0.25rem', fontSize: '0.875rem' }}></i>
      <span>Contacts</span>
    </div>

    {/* Purchase Orders Tab */}
    <div 
      style={{
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderBottom: activeTab === 'purchase-orders' ? '2px solid #0d6efd' : 'none',
        color: activeTab === 'purchase-orders' ? '#0d6efd' : '#495057',
        fontWeight: activeTab === 'purchase-orders' ? '600' : '400',
        display: 'inline-flex',
        alignItems: 'center'
      }}
      onClick={() => setActiveTab('purchase-orders')}
    >
      <i className="fas fa-file-alt" style={{ marginRight: '0.25rem', fontSize: '0.875rem' }}></i>
      <span>Purchase Orders</span>
    </div>

    {/* Bills Tab */}
    <div 
      style={{
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderBottom: activeTab === 'bills' ? '2px solid #0d6efd' : 'none',
        color: activeTab === 'bills' ? '#0d6efd' : '#495057',
        fontWeight: activeTab === 'bills' ? '600' : '400',
        display: 'inline-flex',
        alignItems: 'center'
      }}
      onClick={() => setActiveTab('bills')}
    >
      <i className="fas fa-file-invoice" style={{ marginRight: '0.25rem', fontSize: '0.875rem' }}></i>
      <span>Bills</span>
    </div>

    {/* Payments Tab */}
    <div 
      style={{
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderBottom: activeTab === 'payments' ? '2px solid #0d6efd' : 'none',
        color: activeTab === 'payments' ? '#0d6efd' : '#495057',
        fontWeight: activeTab === 'payments' ? '600' : '400',
        display: 'inline-flex',
        alignItems: 'center'
      }}
      onClick={() => setActiveTab('payments')}
    >
      <i className="fas fa-money-bill-wave" style={{ marginRight: '0.25rem', fontSize: '0.875rem' }}></i>
      <span>Payments</span>
    </div>

    {/* Notes Tab */}
    <div 
      style={{
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        borderBottom: activeTab === 'notes' ? '2px solid #0d6efd' : 'none',
        color: activeTab === 'notes' ? '#0d6efd' : '#495057',
        fontWeight: activeTab === 'notes' ? '600' : '400',
        display: 'inline-flex',
        alignItems: 'center'
      }}
      onClick={() => setActiveTab('notes')}
    >
      <i className="fas fa-sticky-note" style={{ marginRight: '0.25rem', fontSize: '0.875rem' }}></i>
      <span>Notes</span>
    </div>
  </div>

  {/* Tab Content */}
  <div>
    {/* Overview Tab Content */}
    {activeTab === 'overview' && (
      <div>
        <h5 style={{
          fontWeight: '600',
          fontSize: '1.25rem',
          marginBottom: '1rem'
        }}>Vendor Information</h5>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          marginTop: '1rem'
        }}>
          <div style={{
            flex: '0 0 33.333333%',
            maxWidth: '33.333333%',
            padding: '0 0.75rem',
            marginBottom: '1rem'
          }}>
            <strong>Organization:</strong><br />
            <span>{vendor.organization}</span>
          </div>
          <div style={{
            flex: '0 0 33.333333%',
            maxWidth: '33.333333%',
            padding: '0 0.75rem',
            marginBottom: '1rem'
          }}>
            <strong>Vendor Name:</strong><br />
            <span>Mr. {vendor.name}</span>
          </div>
          <div style={{
            flex: '0 0 33.333333%',
            maxWidth: '33.333333%',
            padding: '0 0.75rem',
            marginBottom: '1rem'
          }}>
            <strong>Phone:</strong><br />
            <span>{vendor.phone}</span>
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          marginTop: '1rem'
        }}>
          <div style={{
            flex: '0 0 33.333333%',
            maxWidth: '33.333333%',
            padding: '0 0.75rem',
            marginBottom: '1rem'
          }}>
            <strong>Email:</strong><br />
            <span>{vendor.email}</span>
          </div>
          <div style={{
            flex: '0 0 33.333333%',
            maxWidth: '33.333333%',
            padding: '0 0.75rem',
            marginBottom: '1rem'
          }}>
            <strong>Type:</strong><br />
            <span>{vendor.type}</span>
          </div>
          <div style={{
            flex: '0 0 33.333333%',
            maxWidth: '33.333333%',
            padding: '0 0.75rem',
            marginBottom: '1rem'
          }}>
            <strong>Created:</strong><br />
            <span>{vendor.created_at?.slice(0,10)}</span>
          </div>
        </div>
      </div>
    )}

    {/* Contacts Tab Content */}
    {activeTab === 'contacts' && (
      <div>
        <h6 style={{
          fontWeight: '600',
          fontSize: '1rem',
          marginBottom: '1rem'
        }}>All Contacts</h6>
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
              {vendor.contact_persons?.length > 0 ? (
                vendor.contact_persons.map((person) => (
                  <tr key={person.id}>
                    <td style={{
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{person.name || '-'}</td>
                    <td style={{
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{person.designation || '-'}</td>
                    <td style={{
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{person.work_email || '-'}</td>
                    <td style={{
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{person.work_phone || '-'}</td>
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
                    No contact persons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* Purchase Orders Tab Content */}
    {activeTab === 'purchase-orders' && (
      <div>
        <h6 style={{
          fontWeight: '600',
          fontSize: '1rem',
          marginBottom: '1rem'
        }}>Purchase Orders</h6>
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
                }}>PO ID</th>
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
              {vendor?.purchase_orders?.map((po) => (
                <tr key={po.id}>
                  <td style={{
                    padding: '0.75rem',
                    borderBottom: '1px solid #dee2e6',
                    borderRight: '1px solid #dee2e6',
                    verticalAlign: 'middle'
                  }}>{`PO-${po.id.toString().padStart(3, '0')}`}</td>
                  <td style={{
                    padding: '0.75rem',
                    borderBottom: '1px solid #dee2e6',
                    borderRight: '1px solid #dee2e6',
                    verticalAlign: 'middle'
                  }}>{po.date}</td>
                  <td style={{
                    padding: '0.75rem',
                    borderBottom: '1px solid #dee2e6',
                    borderRight: '1px solid #dee2e6',
                    verticalAlign: 'middle'
                  }}>₹{parseFloat(po.amount).toLocaleString('en-IN')}</td>
                  <td style={{
                    padding: '0.75rem',
                    borderBottom: '1px solid #dee2e6',
                    verticalAlign: 'middle'
                  }}>{po.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* Bills Tab Content */}
    {activeTab === 'bills' && (
      <div>
        <h6 style={{
          fontWeight: '600',
          fontSize: '1rem',
          marginBottom: '1rem'
        }}>Vendor Bills</h6>
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
                }}>Bill ID</th>
                <th style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  borderBottom: '1px solid #dee2e6',
                  borderRight: '1px solid #dee2e6',
                  fontWeight: '500'
                }}>PO ID</th>
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
              {vendor?.bills?.length > 0 ? (
                vendor.bills.map((bill) => (
                  <tr key={bill.id}>
                    <td style={{
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{`BILL-${bill.id.toString().padStart(3, '0')}`}</td>
                    <td style={{
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{`PO-${bill.po_id.toString().padStart(3, '0')}`}</td>
                    <td style={{
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>{bill.date}</td>
                    <td style={{
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'middle'
                    }}>₹{parseFloat(bill.amount).toLocaleString()}</td>
                    <td style={{
                      padding: '0.75rem',
                      borderBottom: '1px solid #dee2e6',
                      verticalAlign: 'middle',
                      color: bill.status.toLowerCase() === 'paid'
                        ? 'green'
                        : bill.status.toLowerCase() === 'due'
                        ? 'orange'
                        : 'black',
                      fontWeight: '500'
                    }}>
                      {bill.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{
                    padding: '0.75rem',
                    textAlign: 'center',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    No bills found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* Payments Tab Content */}
    {activeTab === 'payments' && (
      <div>
        <p>Payment records.</p>
      </div>
    )}

    {/* Notes Tab Content */}
    {activeTab === 'notes' && (
      <div>
        <p>Notes related to this vendor.</p>
        {vendor?.notes?.length > 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {vendor.notes.map((note) => (
              <div key={note.id} style={{
                padding: '1rem',
                backgroundColor: '#fff',
                borderRadius: '0.375rem',
                boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)',
                border: '1px solid rgba(0,0,0,0.125)'
              }}>
                <p style={{ margin: 0 }}>{note.note}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#6c757d' }}>No notes available.</p>
        )}
      </div>
    )}
  </div>
</div>


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
      }}>Edit Vendor</h5>
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
    </div>

    {/* Modal Body */}
    <div style={{
      flex: '1',
      overflowY: 'auto',
      padding: '1rem'
    }}>
      <div style={{width: '100%'}}>
        {/* Vendor Details Accordion */}
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
            Vendor Details
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
              <div style={{display: 'flex', flexWrap: 'wrap', marginBottom: '1rem'}}>
                <div style={{
                  flex: '0 0 25%',
                  maxWidth: '25%',
                  padding: '0 0.75rem'
                }}>
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Salutation<span style={{color: '#dc3545'}}>*</span></label>
                    <select 
                      value={salutation} 
                      onChange={(e) => setSalutation(e.target.value)}
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
                      <option>Mr.</option>
                      <option>Ms.</option>
                      <option>Mrs.</option>
                    </select>
                  </div>
                </div>
                <div style={{
                  flex: '0 0 25%',
                  maxWidth: '25%',
                  padding: '0 0.75rem'
                }}>
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Name<span style={{color: '#dc3545'}}>*</span></label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                  flex: '0 0 25%',
                  maxWidth: '25%',
                  padding: '0 0.75rem'
                }}>
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Phone<span style={{color: '#dc3545'}}>*</span></label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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
                  flex: '0 0 25%',
                  maxWidth: '25%',
                  padding: '0 0.75rem'
                }}>
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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

              <div style={{display: 'flex', flexWrap: 'wrap', marginBottom: '1rem'}}>
                <div style={{
                  flex: '0 0 33.333333%',
                  maxWidth: '33.333333%',
                  padding: '0 0.75rem'
                }}>
                  <div style={{marginBottom: '1rem'}}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem'
                    }}>GST No.</label>
                    <input
                      type="text"
                      value={gstNo}
                      onChange={(e) => setGstNo(e.target.value)}
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
                    }}>Type<span style={{color: '#dc3545'}}>*</span></label>
                    <select 
                      value={type} 
                      onChange={(e) => setType(e.target.value)}
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
                      <option>Material</option>
                      <option>Service</option>
                    </select>
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
                    }}>Address</label>
                    <textarea
                      rows={1}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
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
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                        resize: 'vertical'
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Contact Persons Accordion */}
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
            Contact Persons
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
              {contacts.length === 0 && (
                <div style={{
                  textAlign: 'right',
                  marginBottom: '1rem'
                }}>
                  <button
                    style={{
                      color: '#fff',
                      backgroundColor: '#0d6efd',
                      borderColor: '#0d6efd',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.875rem',
                      borderRadius: '0.2rem',
                      border: '1px solid transparent',
                      cursor: 'pointer'
                    }}
                    onClick={addContact}
                  >
                    + Add Contact Person
                  </button>
                </div>
              )}

              {contacts.map((contact, index) => (
                <div key={index} style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.375rem',
                  backgroundColor: '#fff'
                }}>
                  <div style={{display: 'flex', flexWrap: 'wrap', marginBottom: '0.5rem'}}>
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
                          type="text"
                          value={contact.name}
                          onChange={(e) => handleContactChanges(index, "name", e.target.value)}
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
                          type="text"
                          value={contact.designation}
                          onChange={(e) => handleContactChanges(index, "designation", e.target.value)}
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
                          value={contact.email}
                          onChange={(e) => handleContactChanges(index, "email", e.target.value)}
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
                          type="text"
                          value={contact.phone}
                          onChange={(e) => handleContactChanges(index, "phone", e.target.value)}
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
                  <div style={{
                    textAlign: 'right',
                    marginTop: '1rem'
                  }}>
                    <button
                      style={{
                        color: '#dc3545',
                        backgroundColor: 'transparent',
                        border: '1px solid #dc3545',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.875rem',
                        borderRadius: '0.2rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}
                      onClick={() => removeContact(index)}
                      title="Delete Contact"
                    >
                      <i className="fas fa-trash" style={{marginRight: '0.25rem'}}></i>
                    </button>
                  </div>
                </div>
              ))}

              {contacts.length > 0 && (
                <div style={{textAlign: 'left'}}>
                  <button
                    style={{
                      color: '#fff',
                      backgroundColor: '#0d6efd',
                      borderColor: '#0d6efd',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.875rem',
                      borderRadius: '0.2rem',
                      border: '1px solid transparent',
                      cursor: 'pointer'
                    }}
                    onClick={addContact}
                  >
                    + Add Contact Person
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Modal Footer */}
    <div style={{
      padding: '1rem',
      borderTop: '1px solid #dee2e6',
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
        onClick={handleSaveVendor}
      >
        Edit Vendor
      </button>
    </div>
  </div>
</div>
   {showModal && (
  <CreatePOModal
    show={showModal}
    handleClose={() => setShowModal(false)}
    vendor={vendor}
  />
)}
{showBillModal && (
<CreateBillModal
  show={showBillModal}
  handleClose={() => setShowBillModal(false)}
  vendor={vendor}
  purchaseOrders={vendor.purchase_orders}
/>
)}
{showNoteForm && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1050
  }}>
    <div style={{
      width: '500px',
      maxWidth: '90vw',
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
          fontSize: '1.25rem',
          fontWeight: '500'
        }}>Add Note</h5>
        <button 
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#6c757d'
          }}
          onClick={() => setShowNoteForm(false)}
        >
          &times;
        </button>
      </div>

      {/* Modal Body */}
      <div style={{ padding: '1rem' }}>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleAddNote();
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <textarea
              rows={4}
              placeholder="Write your note here..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
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
                borderRadius: '0.375rem',
                transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
                resize: 'vertical',
                minHeight: 'calc(1.5em + 0.75rem + 2px)'
              }}
            ></textarea>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
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
              onClick={() => setShowNoteForm(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                color: '#fff',
                backgroundColor: '#0d6efd',
                border: '1px solid #0d6efd',
                padding: '0.375rem 0.75rem',
                fontSize: '1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}