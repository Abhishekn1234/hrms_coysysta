import React, { useState } from 'react';
import './Main.css';

const ProjectItem = ({ project, isActive, isNew, onSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Check if the quotation has attachments
  const hasAttachments = project.rawData?.attachments?.length > 0;

  return (
    <div
      className={`event-item ${isActive ? 'active' : ''} ${isNew ? 'new-event' : ''}`}
      onClick={() => onSelect(project)}
    >
      {isNew && (
        <div className="new-event-badge">
          <i className="fas fa-star"></i> NEW
        </div>
      )}
      <span className="event-type">{project.type || 'Quotation'}</span>
      <div className="event-title">
        <h3>{project.title}</h3>
        <span className={`event-badge ${isNew ? 'draft-badge' : ''}`}>
          {isNew ? 'Draft' : project.status}
        </span>
        {hasAttachments && (
          <span className="attachment-indicator">
            <i className="fas fa-paperclip"></i>
          </span>
        )}
      </div>
      <div className="event-details">
        <span>
          <i className="fas fa-user"></i> {project.manager || 'Unassigned'}
        </span>
        <span>
          <i className="fas fa-calendar"></i> {project.date}
        </span>
      </div>
      <div className="event-progress">
        <div className="progress-bar" style={{ width: `${project.progress}%` }}></div>
      </div>
      <div className="event-footer">
        <span>{project.client || 'No client'}</span>
        <span>{project.progress}% Complete</span>
      </div>
      <div className="event-actions">
        <button
          className="action-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleDropdownClick(e);
          }}
        >
          <i className="fas fa-ellipsis-v"></i>
        </button>
        <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
          <div className="dropdown-item">
            <i className="fas fa-edit"></i> Edit Quotation
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectPanel = ({
  projects,
  selectedProject,
  onProjectSelect,
  isCreatingNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) =>
    [
      project.rawData?.quotation_number || '',
      project.rawData?.project_name || '',
      project.rawData?.customer_name || '',
    ].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="event-panel">
      <div className="panel-header">
        <h2>
          <i className="fas fa-project-diagram"></i> Active Quotation Requests
          {isCreatingNew && (
            <span className="creating-indicator">
              <i className="fas fa-pencil-alt"></i> Creating new quotation...
            </span>
          )}
        </h2>
        <p className="subtitle">Select a Quotation to Approve and Create Project</p>
        {/* <div className="search-bar">
          <input
            type="text"
            placeholder="Search by quotation number, project name, or client..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div> */}
      </div>
      <div className="event-list">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              isActive={selectedProject?.id === project.id}
              isNew={project.status.toLowerCase() === 'draft'} // Mark as new if status is draft
              onSelect={onProjectSelect}
            />
          ))
        ) : (
          <p>No quotations match your search.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectPanel;