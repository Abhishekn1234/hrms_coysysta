import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import $ from 'jquery';

import TopBar from "./TopBar";
import LeadList from "./LeadList";
import LeadDetailsTabs from "./LeadDetailsTabs";
import AddLeadModal from './AddLeadModal';
import axios from "axios";

// Register Chart.js components
Chart.register(...registerables);

// Shadow styles
const shadowStyle = {
  boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
};

const strongShadowStyle = {
  boxShadow: '0 1rem 3rem rgba(0, 0, 0, 0.175)'
};

const cardShadowStyle = {
  boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.5)',
  borderRadius: '0.35rem'
};

const smallShadowStyle = {
  boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
};

function MyModule() {
  const [selectedLead, setSelectedLead] = useState(null);
  const [allLeads, setAllLeads] = useState([]);
  const [refreshLeads, setRefreshLeads] = useState(0);
  const [activeTab, setActiveTab] = useState('leads');
  const [taskSubTab, setTaskSubTab] = useState('overview');

  useEffect(() => {
    $('.js-navbar-vertical-aside-menu-link')
      .off('click')
      .on('click', function (e) {
        e.preventDefault();
        const $li = $(this).closest('li');
        const $submenu = $(this).next('.js-navbar-vertical-aside-submenu');
        $li.toggleClass('active');
        $submenu.slideToggle(200);
      });
  }, []);

  function handleLeadData(lead) {
    setSelectedLead(lead);
  }

  function handleAllLeadsData(leads) {
    setAllLeads(prev => {
      const prevStr = JSON.stringify(prev);
      const newStr = JSON.stringify(leads);
      return prevStr !== newStr ? leads : prev;
    });
  }

  function triggerRefreshLeads() {
    setRefreshLeads(prev => prev + 1);
  }

  function handleLeadUpdated(updatedLead) {
    setSelectedLead(updatedLead);
  }

  // Calculate lead statistics
  const calculateLeadStats = () => {
    const stats = {
      total: allLeads.length,
      contacted: allLeads.filter(lead => lead.contact_status === 'contacted').length,
      success: allLeads.filter(lead => lead.contact_status === 'success').length,
      failed: allLeads.filter(lead => lead.contact_status === 'failed').length,
      facebook: allLeads.filter(lead => lead.source === 'facebook').length,
      instagram: allLeads.filter(lead => lead.source === 'instagram').length,
      facebookSuccess: allLeads.filter(lead => lead.source === 'facebook' && lead.contact_status === 'success').length,
      instagramSuccess: allLeads.filter(lead => lead.source === 'instagram' && lead.contact_status === 'success').length,
      employees: {}
    };

    // Calculate employee-wise stats
    allLeads.forEach(lead => {
      if (lead.assigned_to) {
        if (!stats.employees[lead.assigned_to]) {
          stats.employees[lead.assigned_to] = {
            total: 0,
            success: 0,
            failed: 0
          };
        }
        stats.employees[lead.assigned_to].total++;
        if (lead.contact_status === 'success') stats.employees[lead.assigned_to].success++;
        if (lead.contact_status === 'failed') stats.employees[lead.assigned_to].failed++;
      }
    });

    return stats;
  };

  const stats = calculateLeadStats();

  // Chart data
  const statusChartData = {
    labels: ['Success', 'Failed', 'Not Contacted'],
    datasets: [{
      data: [
        stats.success,
        stats.failed,
        stats.total - stats.contacted
      ],
      backgroundColor: [
        '#4e73df',
        '#e74a3b',
        '#f6c23e'
      ],
      hoverBackgroundColor: [
        '#2e59d9',
        '#be2617',
        '#dda20a'
      ],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }]
  };

  const sourceChartData = {
    labels: ['Facebook', 'Instagram', 'Other'],
    datasets: [{
      data: [
        stats.facebook,
        stats.instagram,
        stats.total - stats.facebook - stats.instagram
      ],
      backgroundColor: [
        '#36b9cc',
        '#1cc88a',
        '#858796'
      ],
      hoverBackgroundColor: [
        '#2c9faf',
        '#17a673',
        '#6b6d7d'
      ],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }]
  };

  const sourceSuccessRateData = {
    labels: ['Facebook Success', 'Facebook Failure', 'Instagram Success', 'Instagram Failure'],
    datasets: [{
      data: [
        stats.facebookSuccess,
        stats.facebook - stats.facebookSuccess,
        stats.instagramSuccess,
        stats.instagram - stats.instagramSuccess
      ],
      backgroundColor: [
        '#1cc88a',
        '#e74a3b',
        '#4e73df',
        '#f6c23e'
      ],
      hoverBackgroundColor: [
        '#17a673',
        '#be2617',
        '#2e59d9',
        '#dda20a'
      ],
    }]
  };

  // Prepare employee performance data
  const employeeNames = Object.keys(stats.employees);
  const employeeSuccessData = {
    labels: employeeNames,
    datasets: [{
      label: 'Success',
      backgroundColor: '#4e73df',
      hoverBackgroundColor: '#2e59d9',
      borderColor: '#4e73df',
      data: employeeNames.map(name => stats.employees[name].success)
    }, {
      label: 'Failed',
      backgroundColor: '#e74a3b',
      hoverBackgroundColor: '#be2617',
      borderColor: '#e74a3b',
      data: employeeNames.map(name => stats.employees[name].failed)
    }]
  };

  // Calculate conversion rates
  const totalConversionRate = stats.contacted > 0 ? (stats.success / stats.contacted * 100).toFixed(1) : 0;
  const facebookConversionRate = stats.facebook > 0 ? (stats.facebookSuccess / stats.facebook * 100).toFixed(1) : 0;
  const instagramConversionRate = stats.instagram > 0 ? (stats.instagramSuccess / stats.instagram * 100).toFixed(1) : 0;

  // Filter tasks
  const now = new Date();
  const todayTasks = allLeads.filter(lead => {
    if (!lead.follow_up) return false;
    const followUpDate = new Date(lead.follow_up);
    return followUpDate.toDateString() === now.toDateString();
  });
  
  const futureTasks = allLeads.filter(lead => {
    if (!lead.follow_up) return false;
    const followUpDate = new Date(lead.follow_up);
    return followUpDate > now && followUpDate.toDateString() !== now.toDateString();
  });
  
  const completedTasks = allLeads.filter(lead => lead.contact_status === 'success' || lead.contact_status === 'failed');

  // Progress bar component with shadow
  const ProgressBar = ({ percentage, color }) => (
    <div className="progress mb-2" style={smallShadowStyle}>
      <div
        className={`progress-bar bg-${color}`}
        role="progressbar"
        style={{ width: `${percentage}%`, ...smallShadowStyle }}
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {percentage}%
      </div>
    </div>
  );

  // Stat Card component with shadow
  const StatCard = ({ title, value, icon, color, trend, trendValue }) => (
    <div className={`card border-left-${color} h-100 py-2`} style={cardShadowStyle}>
      <div className="card-body">
        <div className="row no-gutters align-items-center">
          <div className="col mr-2">
            <div className={`text-xs font-weight-bold text-${color} text-uppercase mb-1`}>
              {title}
            </div>
            <div className="h5 mb-0 font-weight-bold text-gray-800">{value}</div>
          </div>
          <div className="col-auto">
            <i className={`fas fa-${icon} fa-2x text-gray-300`}></i>
          </div>
        </div>
        {trend && (
          <div className="mt-2 text-xs">
            <span className={`text-${trendValue > 0 ? 'success' : 'danger'} mr-2`}>
              <i className={`fas fa-arrow-${trendValue > 0 ? 'up' : 'down'}`}></i> {Math.abs(trendValue)}%
            </span>
            <span className="text-nowrap">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container-fluid px-0">
      <div className="container-fluid">
        {/* Card for Search, Add, and Refresh */}
        <div className="card border-0 rounded-3 mb-3 w-100" style={cardShadowStyle}>
          <div className="card-body pt-3" style={{ width: '100%', maxWidth: 'none' }}>
            <TopBar leads={allLeads} onLeadSelect={handleLeadData} />
            <AddLeadModal onLeadAdded={triggerRefreshLeads} />
          </div>
        </div>
        
        {/* Main Tabs Navigation with shadow */}
        {/* <ul className="nav nav-tabs mb-3" style={smallShadowStyle}>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
              style={activeTab === 'tasks' ? smallShadowStyle : {}}
            >
              <i className="fas fa-tasks mr-1"></i> Analytics Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'leads' ? 'active' : ''}`}
              onClick={() => setActiveTab('leads')}
              style={activeTab === 'leads' ? smallShadowStyle : {}}
            >
              <i className="fas fa-users mr-1"></i> Leads Management
            </button>
          </li>
        </ul> */}
        <ul className="nav nav-tabs mb-3 shadow-sm">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'tasks' ? 'active shadow' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              <i className="fas fa-tasks mr-1"></i> Analytics Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'leads' ? 'active shadow' : ''}`}
              onClick={() => setActiveTab('leads')}
            >
              <i className="fas fa-users mr-1"></i> Leads Management
            </button>
          </li>
        </ul>

        
        {activeTab === 'tasks' ? (
          <div className="tasks-tab-content w-100" style={{ ...smallShadowStyle }}>
            {/* Sub-tabs for Tasks with shadow */}
            <ul className="nav nav-pills mb-4" style={smallShadowStyle}>
              <li className="nav-item">
                <button 
                  className={`nav-link ${taskSubTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setTaskSubTab('overview')}
                  style={taskSubTab === 'overview' ? smallShadowStyle : {}}
                >
                  <i className="fas fa-chart-pie mr-1"></i> Overview
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${taskSubTab === 'completed' ? 'active' : ''}`}
                  onClick={() => setTaskSubTab('completed')}
                  style={taskSubTab === 'completed' ? smallShadowStyle : {}}
                >
                  <i className="fas fa-check-circle mr-1"></i> Completed Calls
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${taskSubTab === 'today' ? 'active' : ''}`}
                  onClick={() => setTaskSubTab('today')}
                  style={taskSubTab === 'today' ? smallShadowStyle : {}}
                >
                  <i className="fas fa-calendar-day mr-1"></i> Today's Calls
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${taskSubTab === 'future' ? 'active' : ''}`}
                  onClick={() => setTaskSubTab('future')}
                  style={taskSubTab === 'future' ? smallShadowStyle : {}}
                >
                  <i className="fas fa-calendar-week mr-1"></i> Future Calls
                </button>
              </li>
            </ul>

            {taskSubTab === 'overview' && (
              <div className="row">
                {/* Compact Stat Cards */}
                <div className="col-xl-3 col-md-6 mb-3">
                  <StatCard 
                    title="Total" 
                    value={stats.total} 
                    icon="users" 
                    color="primary"
                  />
                </div>
                <div className="col-xl-3 col-md-6 mb-3">
                  <StatCard 
                    title="Contacted" 
                    value={stats.contacted} 
                    icon="phone" 
                    color="success"
                  />
                </div>
                <div className="col-xl-3 col-md-6 mb-3">
                  <StatCard 
                    title="Success" 
                    value={stats.success} 
                    icon="thumbs-up" 
                    color="info"
                  />
                </div>
                <div className="col-xl-3 col-md-6 mb-3">
                  <StatCard 
                    title="Failed" 
                    value={stats.failed} 
                    icon="thumbs-down" 
                    color="warning"
                  />
                </div>

                {/* Combined Charts Row */}
                <div className="col-lg-6 mb-3">
                  <div className="card h-100" style={cardShadowStyle}>
                    <div className="card-header py-2" style={smallShadowStyle}>
                      <h6 className="m-0 font-weight-bold text-primary">Lead Sources</h6>
                    </div>
                    <div className="card-body p-2">
                      <div style={{ height: '200px' }}>
                        <Pie data={sourceChartData} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-6 mb-3">
                  <div className="card h-100" style={cardShadowStyle}>
                    <div className="card-header py-2" style={smallShadowStyle}>
                      <h6 className="m-0 font-weight-bold text-primary">Contact Status</h6>
                    </div>
                    <div className="card-body p-2">
                      <div style={{ height: '200px' }}>
                        <Doughnut data={statusChartData} />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Compact Conversion Rates */}
                <div className="col-12 mb-3">
                  <div className="card w-100" style={cardShadowStyle}>
                    <div className="card-header py-2" style={smallShadowStyle}>
                      <h6 className="m-0 font-weight-bold text-primary">Conversion Rates</h6>
                    </div>
                    <div className="card-body p-2">
                      <div className="row">
                        <div className="col-md-4">
                          <h6 className="small mb-1">
                            Overall <span className="float-right">{totalConversionRate}%</span>
                          </h6>
                          <ProgressBar percentage={totalConversionRate} color="primary" />
                        </div>
                        <div className="col-md-4">
                          <h6 className="small mb-1">
                            Facebook <span className="float-right">{facebookConversionRate}%</span>
                          </h6>
                          <ProgressBar percentage={facebookConversionRate} color="info" />
                        </div>
                        <div className="col-md-4">
                          <h6 className="small mb-1">
                            Instagram <span className="float-right">{instagramConversionRate}%</span>
                          </h6>
                          <ProgressBar percentage={instagramConversionRate} color="success" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Source Success Rates */}
                <div className="col-lg-6 mb-3">
                  <div className="card h-100" style={cardShadowStyle}>
                    <div className="card-header py-2" style={smallShadowStyle}>
                      <h6 className="m-0 font-weight-bold text-primary">Source Success</h6>
                    </div>
                    <div className="card-body p-2">
                      <div style={{ height: '200px' }}>
                        <Doughnut data={sourceSuccessRateData} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employee Performance */}
                {employeeNames.length > 0 && (
                  <div className="col-lg-6 mb-3">
                    <div className="card h-100" style={cardShadowStyle}>
                      <div className="card-header py-2" style={smallShadowStyle}>
                        <h6 className="m-0 font-weight-bold text-primary">Employee Perf.</h6>
                      </div>
                      <div className="card-body p-2">
                        <div style={{ height: '200px' }}>
                          <Bar
                            data={employeeSuccessData}
                            options={{
                              maintainAspectRatio: false,
                              scales: {
                                x: { stacked: true },
                                y: { stacked: true, beginAtZero: true }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {taskSubTab === 'completed' && (
              <div className="card mb-3 w-100" style={cardShadowStyle}>
                <div className="card-header py-2" style={smallShadowStyle}>
                  <h6 className="m-0 font-weight-bold text-primary">Completed Calls</h6>
                </div>
                <div className="card-body p-1">
                  {completedTasks.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered mb-0" style={smallShadowStyle}>
                        <thead>
                          <tr style={smallShadowStyle}>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Source</th>
                            <th>Employee</th>
                          </tr>
                        </thead>
                        <tbody>
                          {completedTasks.map((lead, index) => (
                            <tr key={index} style={smallShadowStyle}>
                              <td>{lead.name}</td>
                              <td>{lead.phone}</td>
                              <td>
                                <span className={`badge badge-${lead.contact_status === 'success' ? 'success' : 'danger'}`} style={smallShadowStyle}>
                                  {lead.contact_status}
                                </span>
                              </td>
                              <td>{lead.source}</td>
                              <td>{lead.assigned_to || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-2" style={smallShadowStyle}>
                      <i className="fas fa-check-circle fa-2x text-gray-300 mb-1"></i>
                      <p className="text-gray-500 mb-0">No completed calls</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {taskSubTab === 'today' && (
              <div className="card mb-3 w-100" style={cardShadowStyle}>
                <div className="card-header py-2 d-flex justify-content-between align-items-center" style={smallShadowStyle}>
                  <h6 className="m-0 font-weight-bold text-primary">Today's Calls</h6>
                  <span className="badge badge-primary" style={smallShadowStyle}>{todayTasks.length}</span>
                </div>
                <div className="card-body p-1">
                  {todayTasks.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered mb-0" style={smallShadowStyle}>
                        <thead>
                          <tr style={smallShadowStyle}>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {todayTasks.map((lead, index) => (
                            <tr key={index} style={smallShadowStyle}>
                              <td>{lead.name}</td>
                              <td>{lead.phone}</td>
                              <td>
                                <span className={`badge badge-${lead.contact_status === 'contacted' ? 'info' : 
                                  lead.contact_status === 'success' ? 'success' : 
                                  lead.contact_status === 'failed' ? 'danger' : 'warning'}`} style={smallShadowStyle}>
                                  {lead.contact_status || 'pending'}
                                </span>
                              </td>
                              <td>{lead.follow_up ? new Date(lead.follow_up).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-2" style={smallShadowStyle}>
                      <i className="fas fa-calendar-day fa-2x text-gray-300 mb-1"></i>
                      <p className="text-gray-500 mb-0">No calls today</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {taskSubTab === 'future' && (
              <div className="card mb-3 w-100" style={cardShadowStyle}>
                <div className="card-header py-2 d-flex justify-content-between align-items-center" style={smallShadowStyle}>
                  <h6 className="m-0 font-weight-bold text-primary">Future Calls</h6>
                  <span className="badge badge-primary" style={smallShadowStyle}>{futureTasks.length}</span>
                </div>
                <div className="card-body p-1">
                  {futureTasks.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered mb-0" style={smallShadowStyle}>
                        <thead>
                          <tr style={smallShadowStyle}>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {futureTasks.map((lead, index) => (
                            <tr key={index} style={smallShadowStyle}>
                              <td>{lead.name}</td>
                              <td>{lead.phone}</td>
                              <td>{lead.follow_up ? new Date(lead.follow_up).toLocaleDateString() : '-'}</td>
                              <td>
                                <span className={`badge badge-${lead.contact_status === 'contacted' ? 'info' : 
                                  lead.contact_status === 'success' ? 'success' : 
                                  lead.contact_status === 'failed' ? 'danger' : 'warning'}`} style={smallShadowStyle}>
                                  {lead.contact_status || 'pending'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-2" style={smallShadowStyle}>
                      <i className="fas fa-calendar-week fa-2x text-gray-300 mb-1"></i>
                      <p className="text-gray-500 mb-0">No future calls</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="row mt-2 g-3">
            <div className="col-lg-4 col-12">
              <div className="card border-0 rounded-3 h-100 w-100" style={{ ...cardShadowStyle, width: '100%', maxWidth: 'none' }}>
                <div className="card-body p-0" style={{ width: '100%', maxWidth: 'none' }}>
                  <div style={{ width: '100%', maxWidth: 'none', margin: 0, padding: 0, height: '100%' }}>
                    <LeadList
                      onLeadSelect={handleLeadData}
                      onAllLeads={handleAllLeadsData}
                      refresh={refreshLeads}
                      onRefresh={triggerRefreshLeads}
                      style={{ width: '100%', maxWidth: 'none', margin: 0, padding: 0 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8 col-12">
              <div className="card border-0 rounded-3 h-100 w-100" style={cardShadowStyle}>
                <div className="card-body p-0">
                  <LeadDetailsTabs
                    lead={selectedLead}
                    refresh={triggerRefreshLeads}
                    onLeadUpdated={handleLeadUpdated}
                    style={{ width: '100%', maxWidth: 'none', margin: 0 }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyModule;