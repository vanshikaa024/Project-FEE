import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  Check,
} from "lucide-react";

function Notifications({
  notifications,
  onRead,
}) {
  const getIcon = (type) => {
    if (type === "success")
      return <CheckCircle size={21} />;

    if (type === "warning")
      return <AlertTriangle size={21} />;

    if (type === "danger")
      return <XCircle size={21} />;

    return <Info size={21} />;
  };

  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            SYSTEM ACTIVITY
          </p>

          <h1>Inventory Activity & Alerts</h1>

          <p className="page-subtitle">
            Stay informed about stock changes, completed
            orders and products requiring attention.
          </p>
        </div>
      </div>

      <section className="content-card">
        <div className="card-header">
          <div>
            <h2>Recent Notifications</h2>

            <p>
              These alerts are generated automatically
              when inventory activity occurs.
            </p>
          </div>

          <Bell size={22} />
        </div>

        <div className="notification-list">
          {notifications.map((notification) => (
            <div
              className={`notification-item ${
                notification.read ? "read" : ""
              }`}
              key={notification.id}
            >
              <div
                className={`notification-icon ${notification.type}`}
              >
                {getIcon(notification.type)}
              </div>

              <div className="notification-content">
                <strong>
                  {notification.title}
                </strong>

                <p>{notification.message}</p>

                <span>{notification.time}</span>
              </div>

              {!notification.read && (
                <button
                  className="mark-read-btn"
                  onClick={() =>
                    onRead(notification.id)
                  }
                  title="Mark as read"
                >
                  <Check size={17} />
                </button>
              )}
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="empty-state">
              <Bell size={35} />
              <h3>No notifications</h3>
              <p>
                New inventory activity will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Notifications;