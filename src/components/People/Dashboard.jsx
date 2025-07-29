import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserCheck, UserX, Gift } from 'lucide-react';
import StaffTable from './StaffTable';

export default function Dashboard() {
  const [counts, setCounts] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    monthly: 0
  });

  const [error, setError] = useState(null);
  const [columns, setColumns] = useState(getColumns());

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/staff/counts');
        setCounts((prev) => ({
          ...prev,
          total: res.data.total_staff || 0,
          active: res.data.active_staff || 0,
          inactive: res.data.inactive_staff || 0
        }));
      } catch (err) {
        console.error('Error fetching staff counts:', err);
        setError('Failed to load staff counts');
      }
    };

    const fetchMonthly = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/staff/monthly');
        const latestMonth = res.data?.[res.data.length - 1]?.count || 0;
        setCounts((prev) => ({
          ...prev,
          monthly: latestMonth
        }));
      } catch (err) {
        console.error('Error fetching monthly staff:', err);
        setError('Failed to load monthly staff');
      }
    };

    fetchCounts();
    fetchMonthly();

    const handleResize = () => setColumns(getColumns());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function getColumns() {
    const width = window.innerWidth;
    if (width < 576) return 1;
    if (width < 1024) return 2;
    return 4;
  }

  const cards = [
    {
      title: 'Total Staff',
      value: counts.total,
      icon: <Users size={20} color="#1d4ed8" />,
      bg: '#e0edff'
    },
    {
      title: 'Active',
      value: counts.active,
      icon: <UserCheck size={20} color="#16a34a" />,
      bg: '#e6f6ec'
    },
    {
      title: 'Inactive',
      value: counts.inactive,
      icon: <UserX size={20} color="#dc2626" />,
      bg: '#fdeaea'
    },
    {
      title: 'Monthly Staff',
      value: counts.monthly,
      icon: <Gift size={20} color="#9333ea" />,
      bg: '#f3e8ff'
    }
  ];

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '24px',
    padding: '24px',
    backgroundColor: '#f9fafb',
    transition: 'all 0.3s ease-in-out'
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.08)',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    height: '120px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  };

  const iconWrapperStyle = (bg) => ({
    backgroundColor: bg || '#f3f4f6',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '20px',
    flexShrink: 0,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  });

  const valueStyle = {
    fontWeight: 700,
    fontSize: '24px',
    color: '#111827',
    lineHeight: '1.3'
  };

  const labelStyle = {
    fontSize: '15px',
    color: '#6b7280',
    marginTop: '4px',
    fontWeight: 500
  };

  const cardHoverStyle = {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)'
  };

  return (
    <div>
      {error && (
        <div style={{ color: '#dc2626', padding: '16px', textAlign: 'center' }}>
          {error}
        </div>
      )}
      <div style={containerStyle}>
        {cards.map((card, idx) => (
          <div
            key={idx}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
            style={{ ...cardStyle }}
          >
            <div style={iconWrapperStyle(card.bg)}>{card.icon}</div>
            <div>
              <div style={valueStyle}>{card.value}</div>
              <div style={labelStyle}>{card.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
