import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import { Users, Building2, User2 } from 'lucide-react';

export default function CustomerCards() {
  const [counts, setCounts] = useState({
    total: 0,
    business: 0,
    individual: 0,
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const [totalRes, businessRes, individualRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/v1/customer/customers'),
        axios.get('http://127.0.0.1:8000/api/v1/customer/customer-count-business'),
        axios.get('http://127.0.0.1:8000/api/v1/customer/customer-count-individual'),
      ]);

      setCounts({
        total: totalRes.data.length,
        business: businessRes.data.business,
        individual: individualRes.data.individual,
      });
    } catch (err) {
      console.error('Error fetching counts:', err);
    }
  };

  const boxStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0px 8px 24px rgba(149, 157, 165, 0.2)',
    padding: '20px',
    minHeight: '100px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const iconCircleStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const valueTextStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
  };

  const labelTextStyle = {
    fontSize: '14px',
    color: '#64748b',
  };

  return (
    <Row
      className="my-4"
      style={{ gap: '24px', justifyContent: 'flex-start', paddingLeft: '8px', paddingRight: '8px', flexWrap: 'wrap' }}
    >
      {/* Total Vendors */}
      <Col style={{ flex: '0 0 310px', maxWidth: '310px' }}>
        <div style={boxStyle}>
          <div style={iconCircleStyle}>
            <Users size={20} color="#3b82f6" />
          </div>
          <div>
            <div style={valueTextStyle}>{counts.total}</div>
            <div style={labelTextStyle}>Total Customers</div>
          </div>
        </div>
      </Col>

      {/* Material */}
      <Col style={{ flex: '0 0 310px', maxWidth: '310px' }}>
        <div style={boxStyle}>
          <div style={iconCircleStyle}>
            <Building2 size={20} color="#22c55e" />
          </div>
          <div>
            <div style={valueTextStyle}>{counts.business}</div>
            <div style={labelTextStyle}>Business</div>
          </div>
        </div>
      </Col>

      {/* Service */}
      <Col style={{ flex: '0 0 310px', maxWidth: '310px' }}>
        <div style={boxStyle}>
          <div style={iconCircleStyle}>
            <User2 size={20} color="#a855f7" />
          </div>
          <div>
            <div style={valueTextStyle}>{counts.individual}</div>
            <div style={labelTextStyle}>Individual</div>
          </div>
        </div>
      </Col>
    </Row>
  );
}