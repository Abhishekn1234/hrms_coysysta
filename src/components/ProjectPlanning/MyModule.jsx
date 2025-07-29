// // import React, { useState } from 'react';
// // import './Main.css';
// // import EventPanel from './EventPanel';
// // import PlanningPanel from './PlanningPanel';

// // const initialEvents = [
// //   {
// //     id: 1,
// //     type: 'Conference',
// //     title: 'Tech Innovation Summit 2023',
// //     status: 'In Progress',
// //     manager: 'Sarah Johnson',
// //     date: 'Jun 15-17, 2023',
// //     client: 'ABC Tech Corp',
// //     progress: 85,
// //   },
// //   {
// //     id: 2,
// //     type: 'Wedding',
// //     title: 'Smith & Johnson Wedding',
// //     status: 'Planning',
// //     manager: 'Robert Davis',
// //     date: 'Aug 10, 2023',
// //     client: 'Private Client',
// //     progress: 45,
// //   },
// // ];

// // const Main = () => {
// //   const [events, setEvents] = useState(initialEvents);
// //   const [selectedEvent, setSelectedEvent] = useState(initialEvents[0]);
// //   const [activeTab, setActiveTab] = useState('overview');
// //   const [isCreatingNew, setIsCreatingNew] = useState(false);

// //   const handleEventSelect = (event) => {
// //     setSelectedEvent(event);
// //     setIsCreatingNew(false);
// //     setActiveTab('overview');
// //   };

// //   const handleCreateEvent = () => {
// //     const newEventTemplate = {
// //       id: Date.now(), // Temporary ID
// //       type: '',
// //       title: 'Untitled Event',
// //       status: 'Draft',
// //       manager: '',
// //       date: new Date().toLocaleDateString('en-US', {
// //         month: 'short',
// //         day: 'numeric',
// //         year: 'numeric'
// //       }),
// //       client: '',
// //       progress: 0,
// //       isNew: true
// //     };
    
// //     setEvents([...events, newEventTemplate]);
// //     setSelectedEvent(newEventTemplate);
// //     setIsCreatingNew(true);
// //     setActiveTab('custom'); // Open the custom view tab
// //   };

// //   const handleSaveNewEvent = (savedEvent) => {
// //     setEvents(events.map(event => 
// //       event.id === savedEvent.id ? {...savedEvent, isNew: false} : event
// //     ));
// //     setSelectedEvent({...savedEvent, isNew: false});
// //     setIsCreatingNew(false);
// //   };

// //   const handleCancelNewEvent = () => {
// //     setEvents(events.filter(event => !event.isNew));
// //     setSelectedEvent(events.length > 0 ? events[0] : null);
// //     setIsCreatingNew(false);
// //     setActiveTab('overview');
// //   };

// //   return (
// //     <div>
// //       <div className="dashboard-header">
// //         <div className="header-title">
// //           <h1>
// //             <i className="fas fa-calendar-alt"></i> Event Management Dashboard
// //           </h1>
// //           <p>Manage events, resources, staff assignments, and budgets</p>
// //         </div>
// //         <div className="header-actions">
// //           <button
// //             className="btn btn-primary"
// //             onClick={handleCreateEvent}
// //           >
// //             <i className="fas fa-plus-circle"></i> New event
// //           </button>

// //           <button
// //             className="btn btn-secondary"
// //             onClick={() => window.location.reload()}
// //           >
// //             <i className="fas fa-sync-alt"></i> Refresh
// //           </button>

// //           <button className="btn btn-inventory">
// //             <i className="fas fa-boxes"></i> Add Resources
// //           </button>
// //         </div>
// //       </div>

// //       <div className="dashboard-container">
// //         <EventPanel
// //           events={events}
// //           selectedEvent={selectedEvent}
// //           onEventSelect={handleEventSelect}
// //           isCreatingNew={isCreatingNew}
// //         />
// //         <PlanningPanel
// //           selectedEvent={selectedEvent}
// //           activeTab={activeTab}
// //           onTabChange={setActiveTab}
// //           isCreatingNew={isCreatingNew}
// //           onSaveNewEvent={handleSaveNewEvent}
// //           onCancelNewEvent={handleCancelNewEvent}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default Main;


// import React, { useState, useEffect, useRef } from 'react';
// import './Main.css';
// import EventPanel from './EventPanel';
// import PlanningPanel from './PlanningPanel';
// import ProjectPanel from './ProjectPanel';
// import ProjectPlanningPanel from './ProjectPlanningPanel';
// import axios from 'axios';


  

// const initialEvents = [
//   {
//     id: 1,
//     type: 'Conference',
//     title: 'Tech Innovation Summit 2023',
//     status: 'In Progress',
//     manager: 'Sarah Johnson',
//     date: 'Jun 15-17, 2023',
//     client: 'ABC Tech Corp',
//     progress: 85,
//   },
//   {
//     id: 2,
//     type: 'Wedding',
//     title: 'Smith & Johnson Wedding',
//     status: 'Planning',
//     manager: 'Robert Davis',
//     date: 'Aug 10, 2023',
//     client: 'Private Client',
//     progress: 45,
//   },
// ];

// const initialProjects = [
//   {
//     id: 1,
//     type: 'Software',
//     title: 'E-commerce Platform Development',
//     status: 'In Progress',
//     manager: 'Alex Brown',
//     date: 'Jun 15 - Dec 15, 2023',
//     client: 'Tech Retail Inc',
//     progress: 60,
//   },
//   {
//     id: 2,
//     type: 'Construction',
//     title: 'Office Building Renovation',
//     status: 'Planning',
//     manager: 'Emma Wilson',
//     date: 'Aug 1, 2023 - Mar 1, 2024',
//     client: 'Global Properties',
//     progress: 30,
//   },
// ];

// const Main = () => {
//   const [dashboard, setDashboard] = useState('events');
//   const [events, setEvents] = useState(initialEvents);
//   const [selectedEvent, setSelectedEvent] = useState(initialEvents[0]);
//   const [eventsActiveTab, setEventsActiveTab] = useState('overview');
//   const [isCreatingNewEvent, setIsCreatingNewEvent] = useState(false);
//   const [projects, setProjects] = useState(initialProjects);
//   const [selectedProject, setSelectedProject] = useState(initialProjects[0]);
//   const [projectsActiveTab, setProjectsActiveTab] = useState('overview');
//   const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);
 

//     useEffect(() => {
//     axios.get('/api/v1/quotations/list')
//       .then((response) => {
//          console.log("array of data quotation list",response.data);
//         if (Array.isArray(response.data.data)) {

         

//           // console.log("this is datata",response.data.data);
//           // Separate events (approved with event_id) and projects (all others)
//           const eventsData = [];
//           const projectsData = [];

//           response.data.data.forEach(quotation => {
//             if (quotation.status === 'approved' && quotation.event_id) {
//               // Convert to event
//               eventsData.push({
//                 id: quotation.event_id,  // Use event_id as the identifier
//                 type: 'Event',
//                 title: quotation.project_name || `Event ${quotation.event_id}`,
//                 status: 'Converted',
//                 manager: 'Event Team',
//                 date: quotation.setup_date || quotation.date || new Date().toLocaleDateString(),
//                 client: quotation.customer_name,
//                 progress: 0,
//                 rawData: quotation,
//                 isFromQuotation: true  // Flag to identify converted events
//               });
//             } else {
//               // Keep as project
//               projectsData.push({
//                 id: quotation.id,
//                 type: 'Quotation',
//                 title: quotation.project_name || quotation.quotation_number,
//                 status: quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1),
//                 manager: 'Sales Team',
//                 date: quotation.date || new Date().toLocaleDateString(),
//                 client: quotation.customer_name,
//                 progress: 0,
//                 rawData: quotation
//               });
//             }
//           });

//           // Combine with initial events
//           const allEvents = [...initialEvents, ...eventsData];
//           setEvents(allEvents);
          
//           // Set initial selected event if available
//           if (allEvents.length > 0 && !selectedEvent) {
//             setSelectedEvent(allEvents[0]);
//           }

//           setProjects(projectsData);
//         } else {
//           console.error('Expected array data', response.data.data);
//           setEvents(initialEvents);
//           setProjects([]);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching data', error);
//         setEvents(initialEvents);
//         setProjects([]);
//       });
//   }, []); 

//   console.log("quotation list11111", projects);

//   const getCurrentDashboardState = () => {
//     if (dashboard === 'events') {
//       return {
//         data: events,
//         setData: setEvents,
//         selectedItem: selectedEvent,
//         setSelectedItem: setSelectedEvent,
//         activeTab: eventsActiveTab,
//         setActiveTab: setEventsActiveTab,
//         isCreatingNew: isCreatingNewEvent,
//         setIsCreatingNew: setIsCreatingNewEvent,
//         title: 'Project Management Dashboard',
//         icon: 'fas fa-calendar-alt',
//         description: 'Manage events, resources, staff assignments, and budgets',
//         newButtonText: 'New event'
//       };
//     } else {
//       return {
//         data: projects,
//         setData: setProjects,
//         selectedItem: selectedProject,
//         setSelectedItem: setSelectedProject,
//         activeTab: projectsActiveTab,
//         setActiveTab: setProjectsActiveTab,
//         isCreatingNew: isCreatingNewProject,
//         setIsCreatingNew: setIsCreatingNewProject,
//         title: 'Project Planning Dashboard',
//         icon: 'fas fa-project-diagram',
//         description: 'Manage projects, resources, team assignments, and budgets',
//         newButtonText: 'New project'
//       };
//     }
//   };

//   const handleSelect = (item) => {
//     const state = getCurrentDashboardState();
//     state.setSelectedItem(item);
//     state.setIsCreatingNew(false);
//     state.setActiveTab('overview');
//   };

//   const handleCreate = () => {
//     const state = getCurrentDashboardState();
//     const newItemTemplate = {
//       id: Date.now(),
//       type: '',
//       title: dashboard === 'events' ? 'Untitled Event' : 'Untitled Project',
//       status: 'Draft',
//       manager: '',
//       date: new Date().toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric'
//       }),
//       client: '',
//       progress: 0,
//       isNew: true
//     };
    
//     state.setData([...state.data, newItemTemplate]);
//     state.setSelectedItem(newItemTemplate);
//     state.setIsCreatingNew(true);
//     state.setActiveTab('details');
//   };

//   const handleSave = (savedItem) => {
//     const state = getCurrentDashboardState();
//     state.setData(state.data.map(item => 
//       item.id === savedItem.id ? {...savedItem, isNew: false} : item
//     ));
//     state.setSelectedItem({...savedItem, isNew: false});
//     state.setIsCreatingNew(false);
//   };

//   const handleCancel = () => {
//     const state = getCurrentDashboardState();
//     if (state.isCreatingNew) {
//       state.setData(state.data.filter(item => !item.isNew));
//       state.setSelectedItem(state.data.length > 0 ? state.data[0] : null);
//     }
//     state.setIsCreatingNew(false);
//     state.setActiveTab('overview');
//   };

//   const currentState = getCurrentDashboardState();

//   return (
//     <div className="dashboard-wrapper">
//       {/* Dashboard Switcher Tabs */}
//       {/* <div className="dashboard-switcher">
//         <div className="switcher-container">
//           <button 
//             className={`switch-btn ${dashboard === 'events' ? 'active' : ''}`}
//             onClick={() => setDashboard('events')}
//           >
//             <i className="fas fa-calendar-alt"></i> Event Management
//           </button> */}
//           {/* <button 
//             className={`switch-btn ${dashboard === 'projects' ? 'active' : ''}`}
//             onClick={() => setDashboard('projects')}
//           >
//             <i className="fas fa-project-diagram"></i> Project Planning
//           </button> */}
//         {/* </div>
//       </div> */}

//       {/* Dashboard Header */}
//       <div className="dashboard-header">
//         <div className="header-content">
//           <div className="header-title">
//             <h1>
//               <i className={currentState.icon}></i> {currentState.title}
//             </h1>
//             <p>{currentState.description}</p>
//           </div>
//           <div className="header-actions">
//             {dashboard === 'events' && (
//                 <button
//                   className="btn btn-primary"
//                   onClick={handleCreate}
//                 >
//                   <i className="fas fa-plus-circle"></i> 
//                   {currentState.newButtonText}
//                 </button>
//               )}

//             <button
//               className="btn btn-secondary"
//               onClick={() => window.location.reload()}
//             >
//               <i className="fas fa-sync-alt"></i> Refresh
//             </button>

//             {/* <button className="btn btn-inventory">
//               <i className="fas fa-boxes"></i> Add Resources
//             </button> */}
//           </div>
//         </div>
//       </div>

//       {/* Dashboard Content */}
//       <div className="dashboard-container">
//         {dashboard === 'events' ? (
//           <>
//             <EventPanel
//               events={currentState.data}
//               selectedEvent={currentState.selectedItem}
//               onEventSelect={handleSelect}
//               isCreatingNew={currentState.isCreatingNew}
//             />
//             <PlanningPanel
//               selectedEvent={currentState.selectedItem}
//               activeTab={currentState.activeTab}
//               onTabChange={currentState.setActiveTab}
//               isCreatingNew={currentState.isCreatingNew}
//               onSaveEvent={handleSave}
//               onCancelEvent={handleCancel}
//               dashboardType={dashboard}
//             />
//           </>
//         ) : (
//           <>
//             <ProjectPanel
//               projects={currentState.data}
//               selectedProject={currentState.selectedItem}
//               onProjectSelect={handleSelect}
//               isCreatingNew={currentState.isCreatingNew}
//             />
//             <ProjectPlanningPanel
//               selectedProject={currentState.selectedItem}
//               activeTab={currentState.activeTab}
//               onTabChange={currentState.setActiveTab}
//               isCreatingNew={currentState.isCreatingNew}
//               onSaveProject={handleSave}
//               onCancelProject={handleCancel}
//             />
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Main;

import React, { useState, useEffect, useMemo, useRef } from 'react';
import './Main.css';
import ProjectPanel from './ProjectPanel';
import ProjectPlanningPanel from './ProjectPlanningPanel';
import axios from 'axios';

// Helper functions for safe access
const safeString = (value, fallback = '') => value || fallback;
const safeNumber = (value, fallback = 0) => 
  typeof value === 'number' ? value : (parseFloat(value) || fallback);
const safeDate = (dateValue) => {
  try {
    return dateValue ? new Date(dateValue) : new Date();
  } catch (e) {
    return new Date();
  }
};

// Empty initial projects
const initialProjects = [];

const MyModule = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedProject, setSelectedProject] = useState(null); // Start with null
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);
  const [timeFilter, setTimeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const hasSetInitialSelected = useRef(false);
  
  // Summary statistics with safe defaults
  const summaryStats = useMemo(() => {
    return {
      totalProjects: projects.length,
      totalSpend: projects.reduce((sum, project) => 
        sum + safeNumber(project?.spend, 0), 0),
      totalExpense: projects.reduce((sum, project) => 
        sum + safeNumber(project?.expense, 0), 0),
      projectsInProgress: projects.filter(p => 
        safeString(p?.status) === 'In Progress').length,
    };
  }, [projects]);

  useEffect(() => {
    axios.get('/api/v1/quotations/list')
      .then((response) => {
        console.log("this is response", response);
        if (Array.isArray(response.data?.data)) {
          const projectsData = response.data.data
            .filter(q => q != null && safeString(q.status).toLowerCase() === 'approved') // Filter only approved quotations
            .map(quotation => ({
              id: safeString(quotation.id, String(Date.now())),
              type: 'Quotation',
              title: safeString(
                quotation.project_name || quotation.quotation_number, 
                'Untitled Project'
              ),
              status: safeString(
                quotation.status?.charAt(0)?.toUpperCase() + quotation.status?.slice(1), 
                'Draft'
              ),
              manager: safeString(quotation.manager, 'Sales Team'),
              date: safeString(
                quotation.date, 
                new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              ),
              client: safeString(quotation.customer_name, 'Unknown Client'),
              progress: 0,
              spend: 0,
              expense: 0,
              rawData: quotation,
              createdAt: safeDate(quotation.date)
            }));

          const newProjects = [...initialProjects, ...projectsData];
          setProjects(newProjects);
          
          // Set first project as selected if none selected yet
          if (!hasSetInitialSelected.current && newProjects.length > 0) {
            setSelectedProject(newProjects[0]);
            hasSetInitialSelected.current = true;
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching data', error);
      });
  }, []); 

  const handleSelect = (project) => {
    setSelectedProject(project);
    setIsCreatingNewProject(false);
    setActiveTab('overview');
  };

  const handleCreate = () => {
    const newProject = {
      id: String(Date.now()),
      type: '',
      title: 'Untitled Project',
      status: 'Draft',
      manager: '',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      client: '',
      progress: 0,
      spend: 0,
      expense: 0,
      isNew: true,
      createdAt: new Date()
    };
    
    setProjects(prev => [...prev, newProject]);
    setSelectedProject(newProject);
    setIsCreatingNewProject(true);
    setActiveTab('details');
  };

  const handleSave = (savedProject) => {
    setProjects(prev => prev.map(project => 
      project.id === savedProject.id ? {...savedProject, isNew: false} : project
    ));
    setSelectedProject({...savedProject, isNew: false});
    setIsCreatingNewProject(false);
  };

  const handleCancel = () => {
    if (isCreatingNewProject) {
      setProjects(prev => prev.filter(project => !project.isNew));
      setSelectedProject(projects.length > 0 ? projects[0] : null);
    }
    setIsCreatingNewProject(false);
    setActiveTab('overview');
  };

  // Apply time filter to projects with safe date handling
  const filteredProjects = useMemo(() => {
    // Filter out any null/undefined projects first
    let result = projects.filter(project => project != null);
    
    // Apply time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (timeFilter) {
        case 'thisMonth':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'last3Months':
          startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
          break;
        case 'last6Months':
          startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
          break;
        case 'thisFinancialYear':
          // Financial year starts in April (month 3)
          const currentYear = now.getFullYear();
          startDate = new Date(
            now.getMonth() >= 3 ? currentYear : currentYear - 1, 
            3, 
            1
          );
          break;
        case 'lastYear':
          startDate = new Date(now.getFullYear() - 1, 0, 1);
          break;
        case 'tillDate':
          startDate = new Date(0); // All time
          break;
        default:
          startDate = new Date(0);
      }
      
      result = result.filter(project => {
        const projectDate = project.createdAt instanceof Date 
          ? project.createdAt 
          : safeDate(project.createdAt);
        return projectDate >= startDate;
      });
    }
    
    // Apply search filter with safe values
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(project => 
        safeString(project.title).toLowerCase().includes(query) ||
        safeString(project.client).toLowerCase().includes(query) ||
        safeString(project.manager).toLowerCase().includes(query) ||
        safeString(project.status).toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [projects, timeFilter, searchQuery]);

  return (
    <div className="dashboard-wrapper">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>
              <i className="fas fa-project-diagram"></i> Project Planning Dashboard
            </h1>
            <p>Manage projects, resources, team assignments, and budgets</p>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-secondary"
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-content">
            <h3>Total Projects</h3>
            <p>{summaryStats.totalProjects}</p>
          </div>
          <div className="card-icon">
            <i className="fas fa-folder-open"></i>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-content">
            <h3>Total Spend</h3>
            <p>${summaryStats.totalSpend.toLocaleString()}</p>
          </div>
          <div className="card-icon">
            <i className="fas fa-money-bill-wave"></i>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-content">
            <h3>Total Expense</h3>
            <p>${summaryStats.totalExpense.toLocaleString()}</p>
          </div>
          <div className="card-icon">
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-temporal">
            <h3>In Progress</h3>
            <p>{summaryStats.projectsInProgress}</p>
          </div>
          <div className="card-icon">
            <i className="fas fa-tasks"></i>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="filter-section">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="time-filters">
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Time</option>
            <option value="thisMonth">This Month</option>
            <option value="last3Months">Last 3 Months</option>
            <option value="last6Months">Last 6 Months</option>
            <option value="thisFinancialYear">This Financial Year</option>
            <option value="lastYear">Last Year</option>
            <option value="tillDate">Till Date</option>
          </select>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-container">
        <ProjectPanel
          projects={filteredProjects}
          selectedProject={selectedProject}
          onProjectSelect={handleSelect}
          isCreatingNew={isCreatingNewProject}
          onCreateProject={handleCreate}
        />
        
        {selectedProject ? (
          <ProjectPlanningPanel
            selectedProject={selectedProject}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isCreatingNew={isCreatingNewProject}
            onSaveProject={handleSave}
            onCancelProject={handleCancel}
          />
        ) : (
          <div className="empty-project-panel">
            <div className="empty-state">
              <i className="fas fa-folder-open fa-3x"></i>
              <h3>No Project Selected</h3>
              <p>Select a project from the list or create a new one</p>
              <button 
                className="btn btn-primary"
                onClick={handleCreate}
              >
                <i className="fas fa-plus"></i> Create New Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyModule;