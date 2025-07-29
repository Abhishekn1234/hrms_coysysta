import React, { useState } from 'react';
import { Bell, Menu, X, ChevronLeft, ChevronRight, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const API_BASE_URL='http://localhost:8000';


const Menubar = ({ 
  userData,  
  onMenuChange = () => {},
  alertCount = 5  
}) => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  console.log("Menu bar passed data",userData);
  const user = userData?.user || {};  // Safely get user object or empty object
  const userName = user.name || "Guest";
  const userImage = user.image_url 
  ? user.image_url 
  : "https://via.placeholder.com/40";

  const mainMenuItems = [
    'Dashboard', 'CRM', 'Inventory Grouping', 'Inventory Management', 
    'Project Planning', 'Quotation Management', 'HRM', 'People','Task Manager'
  ];

  const secondaryMenuItems = [];

  const handleMenuClick = (item) => {
    setActiveMenu(item);
    setMobileMenuOpen(false);
    onMenuChange(item);
    const path = `/${item.toLowerCase().replace(/\s+/g, '-')}`;
    navigate(path);
  };

  const handleUserAction = async (action) => {
    if (action === 'profile') {
      setUserMenuOpen(false);
      navigate('/profile');
    } else if (action === 'logout') {
      setShowLogoutConfirm(true); // Show confirmation prompt
    }
  };


  // const confirmLogout = async () => {
  //   setShowLogoutConfirm(false);
  //   setUserMenuOpen(false);
  //   try {
  //     const token = localStorage.getItem('access_token');
  //     if (!token) {
  //       console.warn('No token found in localStorage');
  //       navigate('/');
  //       return;
  //     }
      

  //     const response = await axios.post(
  //       `${API_BASE_URL}/api/v1/logout`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         withCredentials: true,
  //       }
  //     );

  //     console.log('Logout response:', response.data); // Log response for debugging
  //     localStorage.removeItem('access_token');
  //     localStorage.removeItem('user');
  //     // navigate('/');
  //   } catch (error) {
  //     console.error('Logout error:', error.response?.data || error.message);
  //     localStorage.removeItem('access_token');
  //     localStorage.removeItem('user');
  //     // navigate('/');
  //     alert('Logged out successfully, but server may not have been notified.');
  //   }
  // };
// const confirmLogout = async () => {
//   setShowLogoutConfirm(false);
//   setUserMenuOpen(false);
  
//   try {
//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       console.warn('No token found in localStorage');
//       navigate('/');
//       return;
//     }

//     // Use the top-level API_BASE_URL consistently
//     const response = await axios.post(
//       `${API_BASE_URL}/api/v1/logout`,
//       {},
//       {
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       }
//     );

//     console.log('Logout response:', response.data);
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('user');
//     navigate('/');  // Navigate only on success
    
//   } catch (error) {
//     console.error('Logout error:', error.response?.data || error.message);
//     // Do NOT remove tokens on failure
//     alert('Logout failed. Please try again.');
//   }
// };
const confirmLogout = async () => {
  setShowLogoutConfirm(false);
  setUserMenuOpen(false);
  
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn('No access token found');
      navigate('/');
      return;
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/v1/logout`,
      {},
      {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        withCredentials: true,
      }
    );

    // Only clear storage if API confirms successful logout
    if (response.status === 200) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('token_expiry'); // If you track expiry
      navigate('/');
    } else {
      throw new Error('Logout not confirmed by server');
    }
    
  } catch (error) {
    console.error('Logout failed:', {
      error: error.response?.data || error.message,
      status: error.response?.status,
    });
    
    // Consider partial cleanup if server error occurred
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token'); // Token was already invalid
    }
    
    alert(`Logout failed: ${error.response?.data?.message || 'Please try again'}`);
  }
};
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const MenuButton = ({ item, isActive, onClick }) => (
    <button
      onClick={() => onClick(item)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
        isActive
          ? 'bg-[rgba(255,255,255,0.25)] text-white shadow-sm'
          : 'bg-[rgba(255,255,255,0.15)] text-white text-opacity-90 hover:bg-[rgba(255,255,255,0.20)]'
      }`}
      style={{ pointerEvents: 'auto', zIndex: 10 }}
    >
      {item}
    </button>
  );

  return (
    <nav style={{ backgroundColor: '#3c5989' }} className="text-white shadow-lg">
      {/* Desktop View */}
      <div className="hidden lg:flex items-start justify-between px-6 pt-4 pb-2 w-full">
        {isCollapsed ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <MenuButton
                item={activeMenu}
                isActive={true}
                onClick={handleMenuClick}
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleCollapse}
                className="p-2 rounded-lg bg-[rgba(255,255,255,0.15)] text-white text-opacity-90 hover:bg-[rgba(255,255,255,0.20)]"
                style={{ pointerEvents: 'auto', zIndex: 20 }}
                title="Expand Menu"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.15)] text-white text-opacity-90 hover:bg-[rgba(255,255,255,0.20)]"
                  style={{ pointerEvents: 'auto', zIndex: 10 }}
                >
                  <img
                    src={userImage}
                    alt="User"
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium">{userName}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 text-gray-800 z-20">
                    <button
                      onClick={() => handleUserAction('profile')}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Profile Settings
                    </button>
                    <button
                      onClick={() => handleUserAction('logout')}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                    {showLogoutConfirm && (
                      <div className="px-4 py-2 text-sm text-gray-800 border-t border-gray-200">
                        <p className="mb-2">Are you sure you want to logout?</p>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={cancelLogout}
                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={confirmLogout}
                            className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                className="relative bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full transition-transform duration-200 transform hover:scale-105 shadow-md group"
                style={{ pointerEvents: 'auto', zIndex: 10 }}
              >
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span className="text-sm font-medium">Alerts ({alertCount})</span>
                </div>
                <span className="absolute inset-0 rounded-full bg-red-400 opacity-0 group-hover:opacity-100 animate-ping duration-1000"></span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col w-60">
              <h1 className="text-xl font-bold">Enterprise ERP</h1>
              <p className="text-sm text-white text-opacity-70">Business Management System</p>
              <div className="mt-2 bg-[rgba(255,255,255,0.25)] px-3 py-2 rounded-lg font-medium text-sm text-white shadow-sm w-fit">
                Welcome, {userName}
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center space-y-2">
              <div className="flex flex-wrap justify-center gap-2">
                {mainMenuItems.map((item) => (
                  <MenuButton
                    key={item}
                    item={item}
                    isActive={activeMenu === item}
                    onClick={handleMenuClick}
                  />
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {secondaryMenuItems.map((item) => (
                  <MenuButton
                    key={item}
                    item={item}
                    isActive={activeMenu === item}
                    onClick={handleMenuClick}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-end w-60 space-x-4">
              <button
                onClick={toggleCollapse}
                className="p-2 rounded-lg bg-[rgba(255,255,255,0.15)] text-white text-opacity-90 hover:bg-[rgba(255,255,255,0.20)]"
                style={{ pointerEvents: 'auto', zIndex: 20 }}
                title="Collapse Menu"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.15)] text-white text-opacity-90 hover:bg-[rgba(255,255,255,0.20)]"
                  style={{ pointerEvents: 'auto', zIndex: 10 }}
                >
                  <img
                    src={userImage}
                    alt="User"
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium">{userName}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 text-gray-800 z-20">
                    <button
                      onClick={() => handleUserAction('profile')}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Profile Settings
                    </button>
                    <button
                      onClick={() => handleUserAction('logout')}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                    {showLogoutConfirm && (
                      <div className="px-4 py-2 text-sm text-gray-800 border-t border-gray-200">
                        <p className="mb-2">Are you sure you want to logout?</p>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={cancelLogout}
                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={confirmLogout}
                            className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <button
                className="relative bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full transition-transform duration-200 transform hover:scale-105 shadow-md group"
                style={{ pointerEvents: 'auto', zIndex: 10 }}
              >
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span className="text-sm font-medium">Alerts ({alertCount})</span>
                </div>
                <span className="absolute inset-0 rounded-full bg-red-400 opacity-0 group-hover:opacity-100 animate-ping duration-1000"></span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="lg:hidden px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
              style={{ pointerEvents: 'auto', zIndex: 20 }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold">Lieux ERP</h1>
              <p className="text-xs text-white text-opacity-70">Business Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center"
                style={{ pointerEvents: 'auto', zIndex: 10 }}
              >
                <img
                  src={userImage}
                  alt="User"
                  className="w-6 h-6 rounded-full"
                />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 text-gray-800 z-20">
                  <div className="px-4 py-2 text-sm font-medium border-b">{userName}</div>
                  <button
                    onClick={() => handleUserAction('profile')}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </button>
                  <button
                    onClick={() => handleUserAction('logout')}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                  {showLogoutConfirm && (
                    <div className="px-4 py-2 text-sm text-gray-800 border-t border-gray-200">
                      <p className="mb-2">Are you sure you want to logout?</p>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={cancelLogout}
                          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={confirmLogout}
                          className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              className="relative bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full transition-transform duration-200 transform hover:scale-105 shadow-md group"
              style={{ pointerEvents: 'auto', zIndex: 10 }}
            >
              <div className="flex items-center space-x-1">
                <Bell className="w-4 h-4" />
                <span className="text-xs font-medium">({alertCount})</span>
              </div>
              <span className="absolute inset-0 rounded-full bg-red-400 opacity-0 group-hover:opacity-100 animate-ping duration-1000"></span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mt-4">
            <div className="bg-[rgba(255,255,255,0.25)] px-3 py-2 rounded-lg font-medium text-sm text-white shadow-sm">
              Welcome, {userName}
            </div>
            {isCollapsed ? (
              <div className="mt-4 grid grid-cols-1 gap-2">
                <MenuButton
                  item={activeMenu}
                  isActive={true}
                  onClick={handleMenuClick}
                />
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {mainMenuItems.map((item) => (
                  <MenuButton
                    key={item}
                    item={item}
                    isActive={activeMenu === item}
                    onClick={handleMenuClick}
                  />
                ))}
                {secondaryMenuItems.map((item) => (
                  <MenuButton
                    key={item}
                    item={item}
                    isActive={activeMenu === item}
                    onClick={handleMenuClick}
                  />
                ))}
              </div>
            )}
            <div className="mt-4 flex justify-center">
              <button
                onClick={toggleCollapse}
                className="p-2 rounded-lg bg-[rgba(255,255,255,0.15)] text-white text-opacity-90 hover:bg-[rgba(255,255,255,0.20)]"
                style={{ pointerEvents: 'auto', zIndex: 20 }}
                title={isCollapsed ? "Expand Menu" : "Collapse Menu"}
              >
                {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
            </div>
            <div className="mt-4 text-sm text-white text-opacity-70 font-medium text-center">
              smart POS
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Menubar;