import React, { useState } from 'react';
import { Bell } from 'lucide-react';

export default function NotificationBell({ count, notifications, onNotificationClick }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div style={{ position: 'relative', marginLeft: '1rem',marginTop:"10rem" }}>
      {/* Bell Icon with badge */}
      <div
        style={{
          position: 'relative',
          cursor: 'pointer',
          padding: '0.5rem',
          borderRadius: '50%',
          transition: 'background 0.2s',
        }}
        onClick={() => setShowNotifications(!showNotifications)}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <Bell size={20} />
        {count > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              fontWeight: 'bold',
            }}
          >
            {count}
          </span>
        )}
      </div>

      {/* Notification dropdown */}
      {showNotifications && (
        <div
    style={{
      position: 'absolute',
      right: 0,
      top: '110%',
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
      width: '320px',
      maxHeight: '850px', // ⬅️ Increased height to show ~15 notifications
      overflowY: 'auto',
      zIndex: 999,
    }}
  >
          {notifications.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>
              No notifications
            </div>
          ) : (
            <>
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: notification.read ? '#fff' : '#eaf3ff',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                  
                    transition: 'background-color 0.2s',
                  }}
                  onClick={() => {
                    onNotificationClick(notification.backlogId);
                    setShowNotifications(false);
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f1f1f1')}
                  onMouseLeave={e =>
                    (e.currentTarget.style.backgroundColor = notification.read ? '#fff' : '#eaf3ff')
                  }
                >
                  {notification.message}
                </div>
              ))}
              {/* Padding bottom to prevent last notification from touching edge */}
              <div style={{ height: '0.5rem' }} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
