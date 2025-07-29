import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function StaffTable() {
  const navigate = useNavigate();

  const [staffData, setStaffData] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [userTypes, setUserTypes] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    designation: '',
    userType: '',
    skill: '',
    organization: '',
    status: '' // Added status filter
  });

  const allDesignations = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'QA Engineer',
    'UI/UX Designer',
    'IT Support Specialist',
    'Mobile App Developer',
    'Data Analyst',
    'Data Scientist',
    'Machine Learning Engineer',
    'HR Manager',
    'Recruiter',
    'HR Executive',
    'Talent Acquisition Specialist',
    'HR Assistant',
    'Sales Executive',
    'Sales Manager',
    'Business Development Executive',
  ];

  const skillOptions = [
    'Client Service',
    'Sales',
    'Video Design',
    'Transportation',
    'Asst.Technician',
  ];

  const orgOptions = [
    'kochi organization',
    'calicut organization',
    'kozhikode organization',
    'bangalore organization',
  ];

  const statusOptions = ['All Statuses', 'Active', 'Inactive'];

  useEffect(() => {
    fetchStaffData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, staffData]);

  const fetchStaffData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/v1/staff');
      const data = response.data;
      setStaffData(data);
      setFilteredStaff(data);

      const uniqueUserTypes = Array.from(
        new Map(data.map((s) => [s.user_type, s.user_type])).values()
      );
      setUserTypes(uniqueUserTypes);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };

 const applyFilters = () => {
  let results = [...staffData];

  results = results.filter((staff) => {
    const fullName = `${staff.first_name ?? ''} ${staff.last_name ?? ''} ${staff.name ?? ''}`.toLowerCase();
    const searchMatch = fullName.includes(filters.search.toLowerCase());

    const designationMatch =
      !filters.designation ||
      (staff.designation &&
        staff.designation.toLowerCase() === filters.designation.toLowerCase());

    const userTypeMatch =
      !filters.userType || staff.user_type === filters.userType;

    const skillMatch =
      !filters.skill ||
      (Array.isArray(staff.skills) &&
        staff.skills.some(
          (skill) =>
            skill.name &&
            skill.name.toLowerCase() === filters.skill.toLowerCase()
        ));

    const organizationMatch =
      !filters.organization ||
      (staff.organization &&
        staff.organization.toLowerCase() === filters.organization.toLowerCase());

    // Status filter logic (1 = active, 0 = inactive)
    const statusMatch = 
      !filters.status ||
      (filters.status === 'Active' && staff.status === 1) ||
      (filters.status === 'Inactive' && staff.status === 0);

    return (
      searchMatch &&
      designationMatch &&
      userTypeMatch &&
      skillMatch &&
      organizationMatch &&
      statusMatch
    );
  });

  setFilteredStaff(results);
};

  const resetFilters = () => {
    setFilters({
      search: '',
      designation: '',
      userType: '',
      skill: '',
      organization: '',
      status: ''
    });
  };

  return (
    <div style={{ 
      maxWidth: '1400px', // Increased max width
      margin: '0 auto', 
      padding: '0 20px' // Increased padding
    }}>
      {/* Filters Card */}
    <div style={{
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  padding: '20px',
  marginBottom: '20px'
}}>
  {/* First Row - Search, Organization, Status */}
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '16px'
  }}>
    {/* Search Input */}
    <div style={{ flex: '2', minWidth: '320px', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#64748b'
      }}>
        <Search size={18} />
      </div>
      <input
        type="search"
        placeholder="Keyword search..."
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        style={{
          width: '100%',
          padding: '10px 12px 10px 38px',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          fontSize: '14px',
          outline: 'none',
          backgroundColor: 'white'
        }}
      />
    </div>

    {/* Organization Filter */}
    <div style={{ flex: '1', minWidth: '200px' }}>
      <select
        value={filters.organization}
        onChange={(e) => setFilters({ ...filters, organization: e.target.value })}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          fontSize: '14px',
          outline: 'none',
          backgroundColor: 'white',
          color: filters.organization ? '#1e293b' : '#64748b'
        }}
      >
        <option value="">All Organizations</option>
        {orgOptions.map((org, i) => (
          <option key={i} value={org}>{org}</option>
        ))}
      </select>
    </div>

    {/* Status Filter */}
    <div style={{ flex: '1', minWidth: '200px' }}>
      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          fontSize: '14px',
          outline: 'none',
           backgroundColor: 'white',
          color: filters.status ? '#1e293b' : '#64748b'
        }}
      >
        {statusOptions.map((status, i) => (
          <option key={i} value={status === 'All Statuses' ? '' : status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Second Row - User Type & Designation */}
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: '16px'
  }}>
    <div style={{ flex: '1', minWidth: '300px' }}>
      <select
        value={filters.userType}
        onChange={(e) => setFilters({ ...filters, userType: e.target.value })}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          fontSize: '14px',
          outline: 'none',
           backgroundColor: 'white',
          color: filters.userType ? '#1e293b' : '#64748b'
        }}
      >
        <option value="">All Types</option>
        {userTypes.map((type, i) => (
          <option key={i} value={type}>{type}</option>
        ))}
      </select>
    </div>

    <div style={{ flex: '1', minWidth: '300px' }}>
      <select
        value={filters.designation}
        onChange={(e) => setFilters({ ...filters, designation: e.target.value })}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          fontSize: '14px',
          outline: 'none',
           backgroundColor: 'white',
          color: filters.designation ? '#1e293b' : '#64748b'
        }}
      >
        <option value="">All Designations</option>
        {allDesignations.map((d, i) => (
          <option key={i} value={d}>{d}</option>
        ))}
      </select>
    </div>
  </div>

  {/* Third Row - Skill & Reset Button */}
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignItems: 'center'
  }}>
    <div style={{ flex: '1', minWidth: '300px' }}>
      <select
        value={filters.skill}
        onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          fontSize: '14px',
          outline: 'none',
           backgroundColor: 'white',
          color: filters.skill ? '#1e293b' : '#64748b'
        }}
      >
        <option value="">All Skills</option>
        {skillOptions.map((s, i) => (
          <option key={i} value={s}>{s}</option>
        ))}
      </select>
    </div>

    <div style={{ minWidth: '100px', textAlign: 'right' }}>
      <button
        onClick={resetFilters}
        style={{
          background: 'none',
          border: 'none',
          color: '#3b82f6',
          fontWeight: '600',
          fontSize: '14px',
          cursor: 'pointer',
          padding: '8px 12px'
        }}
      >
        Reset Filters
      </button>
    </div>
  </div>
</div>



      {/* Table - with adjusted width */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        width: '100%' // Ensure table takes full width
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '14px',
                color: '#475569',
                width: '20%' // Adjusted column widths
              }}>Name</th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '14px',
                color: '#475569',
                width: '15%'
              }}>Designation</th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '14px',
                color: '#475569',
                width: '15%'
              }}>Salary</th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '14px',
                color: '#475569',
                width: '15%'
              }}>Total Payable</th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '14px',
                color: '#475569',
                width: '15%'
              }}>Total Paid</th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '14px',
                color: '#475569',
                width: '10%'
              }}>Balance</th>
              <th style={{
                padding: '12px 16px',
                textAlign: 'left',
                fontWeight: '600',
                fontSize: '14px',
                color: '#475569',
                width: '10%'
              }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.length === 0 ? (
              <tr>
                <td colSpan="7" style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  color: '#64748b'
                }}>No staff found.</td>
              </tr>
            ) : (
              filteredStaff.map((staff) => {
                const fullName = `${staff.first_name || ''} ${staff.last_name || ''}`.trim();
                const initials = `${staff.first_name?.[0] || ''}${staff.last_name?.[0] || ''}`.toUpperCase();
                const org = staff.organization || '—';
                const balance = Number(staff.balance || 0);
                const isNegative = balance > 0;
                const isActive = staff.status === 1;

                return (
                  <tr
                    key={staff.id}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      ':hover': {
                        backgroundColor: '#f8fafc'
                      }
                    }}
                    onClick={() => navigate(`/staff/${staff.id}`, { state: { staff } })}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: '#e0edff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '600',
                          color: '#2563eb'
                        }}>
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: '500', color: '#1e293b' }}>{fullName}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{org}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>{staff.designation || 'N/A'}</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>₹{staff.base_salary || staff.daily_remuneration || '0'}</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>₹{staff.other_allowances || staff.rent_allowance_percent || '0'}</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>₹{staff.housing_allowance || staff.daily_remuneration || '0'}</td>
                   <td
  style={{
    padding: '12px 16px',
    color: (
      (parseFloat(staff.base_salary || staff.daily_remuneration || 0) +
      parseFloat(staff.other_allowances || staff.rent_allowance_percent || 0) +
      parseFloat(staff.housing_allowance || staff.daily_remuneration || 0) -
      parseFloat(staff.paid_amount || 0)
      ) < 0
    ) ? '#dc2626' : '#16a34a',
    fontWeight: '500',
  }}
>
  ₹{(
    (parseFloat(staff.daily_remuneration || 0)) +
    (parseFloat( staff.rent_allowance_percent || 0)) +
     (parseFloat(staff.other_allowances || 0)) +
    (parseFloat(staff.housing_allowance || 0)) -
    (parseFloat(staff.base_salary || 0))
  ).toLocaleString('en-IN')}
</td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        backgroundColor: isActive ? '#e6f6ec' : '#fdeaea',
                        color: isActive ? '#16a34a' : '#dc2626',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {isActive ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 