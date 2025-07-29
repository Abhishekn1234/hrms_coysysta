import React from "react";

export default function ActivityTab({ lead }) {
  const isValidArray = Array.isArray(lead) && lead.length > 0;

  const getIconAndStyle = (type, title) => {
    const lowerTitle = title?.toLowerCase();

    if (type === "tab_actions") {
      if (lowerTitle.includes("call")) {
        return { icon: "fas fa-phone text-success", label: "Call" };
      } else if (lowerTitle.includes("whatsapp")) {
        return { icon: "fab fa-whatsapp text-success", label: "WhatsApp" };
      } else if (lowerTitle.includes("email")) {
        return { icon: "fas fa-envelope text-danger", label: "Email" };
      } else if (lowerTitle.includes("sms")) {
        return { icon: "fas fa-sms text-warning", label: "SMS" };
      }
    }

    if (type === "task") {
      return { icon: "fas fa-tasks text-primary", label: "Task" };
    }

    if (lowerTitle.includes("create")) {
      return { icon: "fas fa-user-plus text-info", label: "Account Created" };
    }

    return { icon: "fas fa-info-circle text-muted", label: "Activity" };
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "0000-00-00") return "No date";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="tab-pane" id="activity">
      <div className="card compact-card">
        <div className="card-header bg-info p-2 text-white">
          <h6 className="card-title mb-0">Activity Log</h6>
        </div>
        <div className="card-body p-2 card-body-scroll">
          {!isValidArray ? (
            <p className="text-muted mb-0">No activity available.</p>
          ) : (
            lead.map((item) => {
              const { icon, label } = getIconAndStyle(item.type, item.task_title);
              const formattedDate = formatDate(item.due_date);

              return (
                <div className="activity-item mb-2" key={item.id}>
                  <small className="text-muted">{formattedDate}</small>
                  <p className="mb-1 d-flex align-items-start">
                    <i className={`${icon} me-2 mt-1`}></i>&nbsp;
                    <span>
                      <strong>{label}:</strong> {item.task_title}
                    </span>
                  </p>
                  {item.notes && (
                    <div className="small text-muted ms-4">{item.notes}</div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
