import { useEffect, useState } from 'react';
import { Table, Row, Col, Card, InputGroup, Form } from 'react-bootstrap';
import { FaSearch, FaFilter, FaUndo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

export default function CustomerTable() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: '',
    organization: '',
    date: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, customers]);

  const handleReset = () => {
    setFilters({ search: '', organization: '', date: '' });
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/v1/customer/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...customers];

    // 🔍 Search
    if (filters.search) {
      filtered = filtered.filter((customer) => {
        const searchTerm = filters.search.toLowerCase();
        return (
          customer.display_name?.toLowerCase().includes(searchTerm) ||
          customer.company_name?.toLowerCase().includes(searchTerm) ||
          customer.email?.toLowerCase().includes(searchTerm) ||
          customer.primary_contact_phone?.toLowerCase().includes(searchTerm)
        );
      });
    }

    // 🏢 Organization
       if (filters.organization) {
          filtered = filtered.filter(
            (customer) =>
              customer.organization &&
              customer.organization.toLowerCase() === filters.organization.toLowerCase()
          );
        }



    // 🗓 Date filter
    const today = dayjs();
    if (filters.date) {
      filtered = filtered.filter((customer) => {
        const created = dayjs(customer.created_at || customer.updated_at);

        if (filters.date === 'today') {
          return created.isSame(today, 'day');
        } else if (filters.date === 'week') {
          return created.isSame(today, 'week');
        } else if (filters.date === 'month') {
          return created.isSame(today, 'month');
        }
        return true; // For 'till date' or unrecognized value
      });
    }

    setFilteredCustomers(filtered);
  };

  return (
    <>
   <Card
  className="border-0 mb-4"
  style={{
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#ffffff',
    padding: '0.75rem 1rem',
  }}
>
  <Card.Body>
    <Row className="align-items-center">
      {/* Search Input - Left */}
      <Col md={4}>
        <InputGroup style={{ height: '40px' }}>
          <InputGroup.Text
            className="bg-white border-end-0"
            style={{
              borderTopLeftRadius: '8px',
              borderBottomLeftRadius: '8px',
              borderRight: 'none',
              backgroundColor: '#fff',
              fontSize: '14px',
              color: '#9ca3af',
            }}
          >
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Keyword search..."
            className="border-start-0 shadow-none"
            style={{
              borderTopRightRadius: '8px',
              borderBottomRightRadius: '8px',
              borderLeft: 'none',
              fontSize: '14px',
              color: '#1e293b',
              backgroundColor: '#fff',
            }}
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />
        </InputGroup>
      </Col>

      {/* Organization - Center */}
      <Col md={4}>
        <Form.Select
          value={filters.organization}
          onChange={(e) =>
            setFilters({ ...filters, organization: e.target.value })
          }
          style={{
            borderRadius: '8px',
            height: '40px',
            fontSize: '14px',
            color: filters.organization ? '#0f172a' : '#6b7280',
            backgroundColor: '#fff',
          }}
        >
          <option value="">All Organizations</option>
          <option>Calicut Organization</option>
          <option>Kozhikode Organization</option>
          <option>Bangalore Organization</option>
          <option>Kochi Organization</option>
          <option>Trivandrum Organization</option>
        </Form.Select>
      </Col>

      {/* Date - Right + Reset */}
      <Col md={4}>
        <div className="d-flex flex-column align-items-end">
          <Form.Select
            value={filters.date}
            onChange={(e) =>
              setFilters({ ...filters, date: e.target.value })
            }
            style={{
              borderRadius: '8px',
              height: '40px',
              fontSize: '14px',
              color: filters.date ? '#0f172a' : '#6b7280',
              backgroundColor: '#fff',
            }}
          >
            <option value="">Till Date</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </Form.Select>

          {/* Reset Filters Below Date */}
          <span
            className="fw-semibold mt-2"
            style={{
              cursor: 'pointer',
              color: '#4f46e5',
              fontSize: '13.5px',
            }}
            onClick={handleReset}
          >
            Reset Filters
          </span>
        </div>
      </Col>
    </Row>
  </Card.Body>
</Card>



{/* Styled Table */}
<div
  className="border rounded-4 overflow-hidden bg-white"
  style={{
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
  }}
>
  <Table hover responsive className="mb-0 align-middle">
    <thead
      className="text-uppercase"
      style={{
        fontSize: '13px',
        backgroundColor: '#f8fafc',
        color: '#475569',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <tr>
        <th style={{ padding: '12px 16px' }}>Company Name</th>
        <th style={{ padding: '12px 16px' }}>Contact</th>
        <th style={{ padding: '12px 16px' }} className="text-center">
          Projects
        </th>
        <th style={{ padding: '12px 16px' }} className="text-center">
          Quotations
        </th>
        <th style={{ padding: '12px 16px' }} className="text-center">
          Total Value
        </th>
        <th style={{ padding: '12px 16px' }} className="text-center">
          Login
        </th>
      </tr>
    </thead>
    <tbody>
      {!loading && filteredCustomers.length === 0 ? (
        <tr>
          <td colSpan="6" className="text-center text-muted py-4">
            No records found.
          </td>
        </tr>
      ) : (
        filteredCustomers.map((customer) => (
          <tr
            key={customer.id}
            onClick={() =>
              navigate(`/admin/people/customers/${customer.id}`, {
                state: { customer },
              })
            }
            style={{
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#f9fafb')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            <td style={{ padding: '12px 16px' }}>
              <div className="fw-semibold" style={{ color: '#0f172a' }}>
                {customer.display_name || customer.company_name}
              </div>
              <div className="text-muted small">
                {customer.organization || '—'}
              </div>
            </td>
            <td style={{ padding: '12px 16px' }}>
              <div>{customer.primary_contact_phone}</div>
              <div className="small text-muted">{customer.email}</div>
            </td>
            <td className="text-center fw-semibold" style={{ padding: '12px 16px' }}>
              {customer?.projects.length ?? 0}
            </td>
            <td className="text-center fw-semibold" style={{ padding: '12px 16px' }}>
              {customer.quotations ?? 0}
            </td>
            <td className="text-center fw-semibold" style={{ padding: '12px 16px' }}>
                            {
                  (customer?.invoices?.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0) ?? 0).toFixed(2)
                }

            </td>
            <td className="text-center" style={{ padding: '12px 16px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor:
                    customer.login_status === 'active' ? 'green' : 'red',
                  display: 'inline-block',
                }}
              ></div>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </Table>
</div>

    </>
  );
}