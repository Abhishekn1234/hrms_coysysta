import React,{useState} from "react";
import { Modal,Row,Col,Form,Tabs,Tab,Button,Dropdown } from "react-bootstrap";
import {
  FaEnvelope, FaEdit, FaTrash, FaBan, FaFileAlt,FaRegCalendar,FaRegCalendarAlt,
  FaFilePdf, FaFileWord, FaFileImage, FaDownload, FaCheckCircle,
  FaUser, FaBriefcase, FaMoneyBill, FaGift, FaClock, FaCalendarAlt,
  FaUserCheck, FaUserTimes, FaUserClock, FaHistory, FaEye,
  FaPlus, FaFileContract, FaPaperclip, FaUpload, FaIdCard, FaRobot,
  FaFileMedical, FaUserShield, FaBalanceScale, FaWallet,
  FaPercentage, FaPassport, FaTicketAlt, FaComment, FaEllipsisH, FaSave, FaTimes
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditEmployee({
  show,
  fetchEmployees,
  onHide,
  formData,
  selectedEmpId,
  setFormData,
  positions,
  setPositions,
  departments,
  setDepartments,
  enumData,
  setEnumData
}) {

const [activeTab, setActiveTab] = useState('personal');
    
  const [employmentHistory, setEmploymentHistory] = useState([
    {
      previous_company: '',
      start_date: '',
      end_date: '',
      position: '',
      responsibilities: ''
    }
  ]);
  const handleExperienceChange = (index, field, value) => {
  const updated = [...employmentHistory];
  updated[index][field] = value;
  setEmploymentHistory(updated);
};
const handleRemoveExperience = (index) => {
  const updated = [...employmentHistory];
  updated.splice(index, 1);
  setEmploymentHistory(updated);
};
  const iconStyle = {
    backgroundColor: '#800080',
    borderRadius: '50%',
    padding: '6px',
    fontSize:"15px",
    color: 'white',
    marginRight: '8px',
  };
  const tabLabel = (Icon, label) => (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      <Icon style={iconStyle} />
      <span>{label}</span>
    </span>
  );
  const handleNext = () => {
  if (activeTab === 'personal') setActiveTab('employment');
  else if (activeTab === 'employment') setActiveTab('salary');
  else if (activeTab === 'salary') setActiveTab('documents');
};
 const handleUpdate = async () => {
    try {
      await axios.put(`/api/v1/users/${selectedEmpId}`, formData);
     onHide();
      fetchEmployees();
      toast.success("Employee updated successfully");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err);
      toast.error("Failed to update employee");
    }
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
const handleCheckboxChange = (e) => {
  const { name, checked } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: checked,
  }));
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
const handleFileChange = (e) => {
  const { name, files } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: files[0], // single file per input
  }));
};
    return(

    <>
   <div 
  style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1050,
    display: show ? 'block' : 'none'
  }}
>
  <div 
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      maxWidth: '900px',
      backgroundColor: 'white',
      borderRadius: '5px',
      boxShadow: '0 3px 9px rgba(0,0,0,0.5)'
    }}
  >
    {/* Modal Header */}
    <div 
      style={{
        backgroundColor: '#800080',
        color: '#fff',
        padding: '15px',
        borderBottom: '1px solid #e5e5e5',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div style={{ color: 'white', fontSize: '1.25rem' }}>
        <i className="bi bi-pencil-square" style={{ marginRight: '10px' }}></i>
        Edit Employee
      </div>
      <button 
        onClick={onHide}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer'
        }}
      >
        &times;
      </button>
    </div>

    {/* Modal Body */}
    <div style={{ padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
      {/* Tabs Navigation */}
      <div style={{ marginBottom: '15px', borderBottom: '1px solid #dee2e6' }}>
        <div style={{ display: 'flex' }}>
          <div 
            style={{
              padding: '10px 15px',
              cursor: 'pointer',
              borderBottom: activeTab === 'personal' ? '2px solid #3b5998' : 'none',
              color: activeTab === 'personal' ? '#3b5998' : '#495057',
              fontWeight: activeTab === 'personal' ? 'bold' : 'normal'
            }}
            onClick={() => setActiveTab('personal')}
          >
            <i className="bi bi-person" style={{ marginRight: '5px' }}></i>
            Personal
          </div>
          <div 
            style={{
              padding: '10px 15px',
              cursor: 'pointer',
              borderBottom: activeTab === 'employment' ? '2px solid #3b5998' : 'none',
              color: activeTab === 'employment' ? '#3b5998' : '#495057',
              fontWeight: activeTab === 'employment' ? 'bold' : 'normal'
            }}
            onClick={() => setActiveTab('employment')}
          >
            <i className="bi bi-briefcase" style={{ marginRight: '5px' }}></i>
            Employment
          </div>
          <div 
            style={{
              padding: '10px 15px',
              cursor: 'pointer',
              borderBottom: activeTab === 'salary' ? '2px solid #3b5998' : 'none',
              color: activeTab === 'salary' ? '#3b5998' : '#495057',
              fontWeight: activeTab === 'salary' ? 'bold' : 'normal'
            }}
            onClick={() => setActiveTab('salary')}
          >
            <i className="bi bi-cash-stack" style={{ marginRight: '5px' }}></i>
            Salary
          </div>
          <div 
            style={{
              padding: '10px 15px',
              cursor: 'pointer',
              borderBottom: activeTab === 'documents' ? '2px solid #3b5998' : 'none',
              color: activeTab === 'documents' ? '#3b5998' : '#495057',
              fontWeight: activeTab === 'documents' ? 'bold' : 'normal'
            }}
            onClick={() => setActiveTab('documents')}
          >
            <i className="bi bi-file-earmark" style={{ marginRight: '5px' }}></i>
            Documents
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {/* Personal Tab */}
        {activeTab === 'personal' && (
          <div>
            <div style={{ display: 'flex', marginBottom: '15px' }}>
              <div style={{ flex: 1, paddingRight: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChanges}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChanges}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', marginBottom: '15px' }}>
              <div style={{ flex: 1, paddingRight: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChanges}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChanges}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', marginBottom: '15px' }}>
              <div style={{ flex: 1, paddingRight: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChanges}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChanges}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da',
                    backgroundColor: 'white'
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

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChanges}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ced4da',
                  minHeight: '80px'
                }}
              />
            </div>

            <hr style={{ margin: '20px 0' }} />
            <h4 style={{ color: '#3b5998', marginBottom: '15px' }}>
              <i className="bi bi-person-lines-fill" style={{ fontSize: "15px", marginRight: '5px' }}></i>
              Emergency Contact
            </h4>

            <div style={{ display: 'flex', marginBottom: '15px' }}>
              <div style={{ flex: 1, paddingRight: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Contact Name</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChanges}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Relationship</label>
                <input
                  type="text"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleInputChanges}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', marginBottom: '15px' }}>
              <div style={{ flex: 1, paddingRight: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Contact Phone</label>
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChanges}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChanges}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Employment Tab */}
        {activeTab === 'employment' && (
          <div style={{ padding: '15px' }}>
            <div style={{ display: 'flex', marginBottom: '15px' }}>
              <div style={{ flex: 1, paddingRight: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Position</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChanges}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select position</option>
                  {positions.map((pos, index) => (
                    <option key={index} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChanges}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', marginBottom: '15px' }}>
              <div style={{ flex: 1, paddingRight: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Employment Type</label>
                <select
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleInputChanges}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select type</option>
                  {enumData?.employmentType?.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Hire Date</label>
                <input
                  type="date"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleInputChanges}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', marginBottom: '15px' }}>
              <div style={{ flex: 1, paddingRight: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Reporting Manager</label>
                <select
                  name="reporting_manager"
                  value={formData.reporting_manager}
                  onChange={handleInputChanges}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select manager</option>
                  {enumData?.reportingManager?.map((manager) => (
                    <option key={manager} value={manager}>{manager}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Work Location</label>
                <select
                  name="work_location"
                  value={formData.work_location}
                  onChange={handleInputChanges}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select location</option>
                  {enumData?.workLocation?.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <hr style={{ margin: '20px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <i className="bi bi-arrow-counterclockwise" style={{ fontSize: "15px", color: "#3b5998", marginRight: '10px' }}></i>
              <h5 style={{ margin: 0 }}>Employment History</h5>
            </div>

            {employmentHistory.map((exp, index) => (
              <div 
                key={index} 
                style={{
                  marginBottom: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '15px',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <div style={{ display: 'flex', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Previous Company</label>
                    <input
                      type="text"
                      name="previous_company"
                      value={exp.previous_company}
                      onChange={(e) => handleExperienceChange(index, 'previous_company', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ced4da'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', marginBottom: '15px' }}>
                  <div style={{ flex: 1, paddingRight: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Start Date</label>
                    <input
                      type="date"
                      name="previous_start_date"
                      value={exp.previous_start_date}
                      onChange={(e) => handleExperienceChange(index, 'previous_start_date', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ced4da'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, paddingLeft: '10px', paddingRight: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>End Date</label>
                    <input
                      type="date"
                      name="previous_end_date"
                      value={exp.previous_end_date}
                      onChange={(e) => handleExperienceChange(index, 'previous_end_date', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ced4da'
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, paddingLeft: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Position</label>
                    <input
                      type="text"
                      name="previous_position"
                      value={exp.previous_position}
                      onChange={(e) => handleExperienceChange(index, 'previous_position', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ced4da'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Responsibilities</label>
                  <textarea
                    name="previous_responsibilities"
                    value={exp.previous_responsibilities}
                    onChange={(e) => handleExperienceChange(index, 'previous_responsibilities', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da',
                      minHeight: '80px'
                    }}
                  />
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => handleRemoveExperience(index)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={handleAddExperience}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              + Add Another Position
            </button>
          </div>
        )}

        {/* Salary Tab */}
        {activeTab === 'salary' && (
          <div style={{ padding: '15px' }}>
            <div style={{ display: 'flex', marginBottom: '15px' }}>
              <div style={{ flex: 1, paddingRight: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Base Salary ($)</label>
                <input
                  type="text"
                  name="base_salary"
                  value={formData.base_salary}
                  onChange={handleInputChanges}
                  placeholder="Enter amount"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Pay Frequency</label>
                <select
                  name="pay_frequency"
                  value={formData.pay_frequency}
                  onChange={handleInputChanges}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select frequency</option>
                  {enumData?.payFrequency?.map((freq) => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', marginBottom: '15px' }}>
              <div style={{ flex: 1, paddingRight: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>PTAX ($)</label>
                <input
                  type="text"
                  name="ptax"
                  value={formData.ptax}
                  onChange={handleInputChanges}
                  placeholder="Enter PTAX amount"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
              <div style={{ flex: 1, paddingRight: '10px', paddingLeft: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>TDS ($)</label>
                <input
                  type="text"
                  name="tds"
                  value={formData.tds}
                  onChange={handleInputChanges}
                  placeholder="Enter TDS amount"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Loan Deduction ($)</label>
                <input
                  type="text"
                  name="loan"
                  value={formData.loan}
                  onChange={handleInputChanges}
                  placeholder="Enter loan amount"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
            </div>

            <hr style={{ margin: '20px 0' }} />
            <h5 style={{ color: '#3b5998', marginBottom: '15px' }}>
              <i className="bi bi-cash-coin" style={{ fontSize: "16px", marginRight: '5px' }}></i>
              Allowances ($)
            </h5>

            <div style={{ display: 'flex', marginBottom: '15px' }}>
              <div style={{ flex: 1, paddingRight: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Housing Allowance ($)</label>
                <input
                  type="text"
                  name="housing_allowance"
                  value={formData.housing_allowance || '0'}
                  onChange={handleInputChanges}
                  placeholder="Enter amount"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Transport Allowance ($)</label>
                <input
                  type="text"
                  name="transport_allowance"
                  value={formData.transport_allowance || ''}
                  onChange={handleInputChanges}
                  placeholder="Enter amount"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', marginBottom: '15px' }}>
              <div style={{ flex: 1, paddingRight: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Medical Allowance ($)</label>
                <input
                  type="text"
                  name="medical_allowance"
                  value={formData.medical_allowance || ''}
                  onChange={handleInputChanges}
                  placeholder="Enter amount"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Other Allowances ($)</label>
                <input
                  type="text"
                  name="other_allowances"
                  value={formData.other_allowances || '0'}
                  onChange={handleInputChanges}
                  placeholder="Enter amount"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
            </div>

            <hr style={{ margin: '20px 0' }} />
            <h5 style={{ color: '#3b5998', marginBottom: '15px' }}>
              <i className="bi bi-bank2" style={{ fontSize: "15px", marginRight: '5px' }}></i>
              Payment Information
            </h5>

            <div style={{ display: 'flex', marginBottom: '15px' }}>
              <div style={{ flex: 1, paddingRight: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Bank Name</label>
                <input
                  type="text"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleInputChanges}
                  placeholder="Enter bank name"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Account Number</label>
                <input
                  type="text"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleInputChanges}
                  placeholder="Enter account number"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', marginBottom: '15px' }}>
              <div style={{ flex: 1, paddingRight: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Routing Number</label>
                <input
                  type="text"
                  name="routing_number"
                  value={formData.routing_number}
                  onChange={handleInputChanges}
                  placeholder="Enter routing number"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
              <div style={{ flex: 1, paddingLeft: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Payment Method</label>
                <input
                  type="text"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChanges}
                  placeholder="Enter payment method"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div style={{ padding: '15px' }}>
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
                  border: '1px dashed #ddd',
                  borderRadius: '4px',
                  padding: '15px',
                  marginBottom: '15px'
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
                      marginRight: '15px'
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
                      border: '1px solid #007bff',
                      color: '#007bff',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    Browse
                  </button>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  name="documents_authentic"
                  checked={formData.documents_authentic || false}
                  onChange={handleCheckboxChange}
                  style={{ marginRight: '10px' }}
                />
                I confirm that all documents provided are authentic and accurate
              </label>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Modal Footer */}
    <div 
      style={{
        padding: '15px',
        borderTop: '1px solid #e5e5e5',
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <button
        onClick={onHide}
        style={{
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        Cancel
      </button>

      <button
        onClick={handleNext}
        style={{
          backgroundColor: '#17a2b8',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        Next
      </button>

      <button
        onClick={handleUpdate}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Update
      </button>
    </div>
  </div>
</div>
    
    </>
    );
}