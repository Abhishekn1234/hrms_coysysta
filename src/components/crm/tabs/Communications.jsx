import React from "react";

export default function CommunicationsTab({ lead }) {
  const communications = Array.isArray(lead?.details) ? lead.details : [];

  const getIconAndColor = (title) => {
    if (title.toLowerCase().includes("call")) {
      return { icon: "fas fa-phone", color: "text-success" };
    } else if (title.toLowerCase().includes("email")) {
      return { icon: "fas fa-envelope", color: "text-primary" };
    } else if (title.toLowerCase().includes("sms")) {
      return { icon: "fas fa-sms", color: "text-warning" };
    } else if (title.toLowerCase().includes("whatsapp")) {
      return { icon: "fab fa-whatsapp", color: "text-success" };
    } else {
      return { icon: "fas fa-comment-dots", color: "text-muted" };
    }
  };

  return (
    <div className="tab-pane active" id="communications">
      <div className="card compact-card mt-2">
        <div className="card-header bg-primary p-2 text-white">
          <h6 className="card-title mb-0">Recent Communications</h6>
        </div>
        <div className="card-body p-2 card-body-scroll">
          {communications.length === 0 ? (
            <p className="text-muted mb-0">No recent communications.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {communications.map((item) => {
                const { icon, color } = getIconAndColor(item.task_title);
                const formattedDate = new Date(item.due_date).toLocaleString();

                return (
                  <li key={item.id} className="list-group-item px-0 py-1 border-0">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="me-2">
                        <p className="mb-1" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className={`${icon} ${color}`}></i>
                          <span>{item.task_title}</span>
                        </p>
                        {item.notes && (
                          <div className="small text-muted ms-4">{item.notes}</div>
                        )}
                      </div>
                      <small className="text-muted">{formattedDate}</small>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
