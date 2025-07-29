import { useParams, Outlet } from 'react-router-dom';
import Menubar from './Menubar';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Layout = () => {
  const { subPage } = useParams();
  const [activeMainMenu, setActiveMainMenu] = useState('Dashboard');
  const [activeSubMenu, setActiveSubMenu] = useState(subPage || 'Dashboard');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const controller = new AbortController();
    
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_BASE_URL}/api/v1/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          withCredentials: true,
          signal: controller.signal
        });
        
        setUserData(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error('Failed to fetch user data', err);
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Menubar
        activeMenu={activeMainMenu}
        onMenuChange={(menu) => {
          setActiveMainMenu(menu);
          setActiveSubMenu(menu);
        }}
        userData={userData}
        loading={loading}
        error={error}
      />
      <div className="min-h-0 overflow-auto">
        <Outlet context={{ 
          activeMainMenu, 
          activeSubMenu, 
          setActiveSubMenu,
          userData,
          loading,
          error
        }} />
      </div>
    </div>
  );
};

export default Layout;