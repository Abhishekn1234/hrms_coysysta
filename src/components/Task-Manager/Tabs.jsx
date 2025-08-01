import React, { useState } from "react";
import {
  FolderKanban,
  CheckSquare,
  ClipboardList,
  Receipt,
  Clock,FileText
} from "lucide-react";
import Projects from "./Projects";
import Tasks from "./Tasks";
import Backlog from "./Backlog";
import Salary from "./Salary";
import Punching from "./Punching";
import TaskReport from "./TaskReport";

export default function TabsComponent() {
  const [activeTab, setActiveTab] = useState("Projects");

  const tabs = [
  { key: "Projects", label: "Projects", icon: <FolderKanban size={16} />, component: <Projects /> },
  { key: "Tasks", label: "Tasks", icon: <CheckSquare size={16} />, component: <Tasks /> },
  { 
    key: "Backlogs", 
    label: "Backlogs", 
    icon: <ClipboardList size={16} />, 
    component: <Backlog setActiveTab={setActiveTab} /> 
  },
  { key: "Salary Report", label: "Salary Report", icon: <Receipt size={16} />, component: <Salary /> },
  { key: "Punching Report", label: "Punching Report", icon: <Clock size={16} />, component: <Punching /> },
  { key: "Task Report", label: "Task Report", icon: <FileText size={16} />, component: <TaskReport /> } // ← New tab
];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "1rem" }}>
     
      <div style={{ display: "flex", borderBottom: "2px solid #ddd", marginBottom: "1rem" }}>
        {tabs.map((tab) => (
          <div
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              cursor: "pointer",
              padding: "0.75rem 1.5rem",
              borderBottom: activeTab === tab.key ? "3px solid #007bff" : "none",
              color: activeTab === tab.key ? "#007bff" : "#333",
              fontWeight: activeTab === tab.key ? "600" : "500",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            {tab.icon}
            {tab.label}
          </div>
        ))}
      </div>

      
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #dee2e6",
          borderRadius: "5px",
          padding: "1rem",
          minHeight: "150px"
        }}
      >
        {tabs.find((t) => t.key === activeTab)?.component}
      </div>
    </div>
  );
}
