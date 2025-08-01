import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TaskReport() {
  const [taskData, setTaskData] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [pagination, setPagination] = useState({});

  const parseDurationToMinutes = (durationStr) => {
    if (!durationStr) return "0 minute";
    const hrMatch = durationStr.match(/(\d+)\s*hr/);
    const minMatch = durationStr.match(/(\d+)\s*min/);
    const hours = hrMatch ? parseInt(hrMatch[1]) : 0;
    const minutes = minMatch ? parseInt(minMatch[1]) : 0;
    const totalMinutes = hours * 60 + minutes;
    return `${totalMinutes} ${totalMinutes === 1 ? "minute" : "minutes"}`;
  };

  const fetchTaskReport = async (page = 1) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/task-report", {
        params: { ...filters, page },
      });
      setTaskData(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
      });
    } catch (error) {
      console.error("Error fetching task report:", error);
    }
  };
const formatToAmPm = (dateTimeStr) => {
  if (!dateTimeStr) return "";
  const formattedStr = dateTimeStr.replace(" ", "T"); // convert to valid ISO format
  const date = new Date(formattedStr);
  if (isNaN(date)) return ""; // fallback if still invalid
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};


  useEffect(() => {
    fetchTaskReport();
  }, [filters]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchTaskReport(page);
    }
  };

  const handleReset = () => {
    setFilters({
      search: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1800px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Filters */}
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <input
          type="text"
          placeholder="Search by user or task"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          style={{
            padding: "10px 12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            fontSize: "14px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            outline: "none",
            width: "600px",
          }}
        />
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
          style={{
            padding: "10px 12px",
            borderRadius: "6px",
            border: "1px solid #ddd",
            fontSize: "14px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            outline: "none",
            width: "600px",
          }}
        />
        <button
          onClick={handleReset}
          style={{
            padding: "10px 16px",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div
        style={{
          overflowX: "auto",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "16px",
        }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            minWidth: "800px",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f8f9fa",
                borderBottom: "2px solid #dee2e6",
              }}
            >
              <th style={tableHeaderStyle}>User ID</th>
              <th style={tableHeaderStyle}>Username</th>
              <th style={tableHeaderStyle}>Task</th>
              <th style={tableHeaderStyle}>Resumed At</th>
              
              <th style={tableHeaderStyle}>Paused At</th>
               <th style={tableHeaderStyle}>Ended At</th>
              <th style={tableHeaderStyle}>Duration</th>
              
              <th style={tableHeaderStyle}>Project Status</th>
              <th style={tableHeaderStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {taskData.length > 0 ? (
              taskData.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #dee2e6",
                  }}
                >
                  <td style={tableCellStyle}>{row.user_id}</td>
                  <td style={tableCellStyle}>{row.username}</td>
                  <td style={tableCellStyle}>{row.task}</td>
                <td style={tableCellStyle}>{formatToAmPm(row.resumed_at)}</td>
                    <td style={tableCellStyle}>{formatToAmPm(row.paused_at)}</td>
                     <td style={tableCellStyle}>{formatToAmPm(row.ended_at)}</td>

                  <td style={tableCellStyle}>{parseDurationToMinutes(row.duration)}</td>
                  <td style={tableCellStyle}>{row.project_status}</td>
                  <td style={tableCellStyle}>{row.log_date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    ...tableCellStyle,
                    textAlign: "center",
                    color: "#6c757d",
                    padding: "20px",
                  }}
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          onClick={() => handlePageChange(pagination.current_page - 1)}
          disabled={pagination.current_page <= 1}
          style={paginationButtonStyle}
        >
          Previous
        </button>
        <span
          style={{
            color: "#495057",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Page {pagination.current_page || 0} of {pagination.last_page || 0}
        </span>
        <button
          onClick={() => handlePageChange(pagination.current_page + 1)}
          disabled={pagination.current_page >= pagination.last_page}
          style={paginationButtonStyle}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const tableHeaderStyle = {
  padding: "12px 16px",
  textAlign: "left",
  fontWeight: "600",
  color: "#495057",
  fontSize: "14px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const tableCellStyle = {
  padding: "12px 16px",
  textAlign: "left",
  color: "#212529",
  fontSize: "14px",
  borderBottom: "1px solid #dee2e6",
};

const paginationButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#fff",
  color: "#007bff",
  border: "1px solid #dee2e6",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.2s",
};
