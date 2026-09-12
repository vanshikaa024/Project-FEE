import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Package,
  TrendingDown,
} from "lucide-react";

function Notifications({
  activities = [],
  products = [],
}) {
  const safeActivities =
    Array.isArray(activities)
      ? activities
      : [];

  const lowStock = (
    Array.isArray(products)
      ? products
      : []
  ).filter(
    (product) =>
      Number(product.stock || 0) <
      Number(product.minStock || 0)
  );

  const systemAlerts =
    lowStock.slice(0, 5).map(
      (product) => ({
        id: `stock-${product.id}`,
        type:
          Number(product.stock || 0) ===
          0
            ? "critical"
            : "warning",

        title:
          Number(product.stock || 0) ===
          0
            ? `${product.name} is out of stock`
            : `${product.name} is below minimum stock`,

        message: `Available: ${product.stock} units · Minimum: ${product.minStock} units`,

        time: "Current inventory",
      })
    );

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">
            INVENTORY ALERTS
          </p>

          <h1>
            Notifications & Activity
          </h1>

          <p>
            Important stock alerts and
            the latest inventory events.
          </p>
        </div>
      </div>

      {systemAlerts.length > 0 && (
        <div
          className="analytics-panel"
          style={{
            marginBottom: 18,
          }}
        >
          <div className="panel-heading">
            <div>
              <h2>
                Stock Alerts
              </h2>

              <p>
                These products need
                attention.
              </p>
            </div>

            <AlertTriangle size={20} />
          </div>

          <div className="notification-list">
            {systemAlerts.map(
              (alert) => (
                <div
                  className="notification-row"
                  key={alert.id}
                >
                  <div className="notification-row-icon">
                    <AlertTriangle
                      size={18}
                    />
                  </div>

                  <div className="notification-content">
                    <strong>
                      {alert.title}
                    </strong>

                    <p>
                      {alert.message}
                    </p>
                  </div>

                  <span className="notification-time">
                    {alert.time}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      <div className="analytics-panel">
        <div className="panel-heading">
          <div>
            <h2>
              Activity Feed
            </h2>

            <p>
              Sales, restocks, products
              and reports.
            </p>
          </div>

          <Bell size={20} />
        </div>

        {safeActivities.length ? (
          <div className="notification-list">
            {safeActivities.map(
              (item) => (
                <div
                  className="notification-row"
                  key={item.id}
                >
                  <div className="notification-row-icon">
                    {item.type ===
                    "warning" ? (
                      <AlertTriangle
                        size={18}
                      />
                    ) : item.type ===
                      "success" ? (
                      <CheckCircle2
                        size={18}
                      />
                    ) : item.type ===
                      "danger" ? (
                      <TrendingDown
                        size={18}
                      />
                    ) : (
                      <Package
                        size={18}
                      />
                    )} 
                  </div>

                  <div className="notification-content">
                    <strong>
                      {item.message}
                    </strong>

                    <p>
                      SmartShelf
                      inventory event
                    </p>
                  </div>

                  <span className="notification-time">
                    {item.time}
                  </span>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="empty-state">
            <Bell size={28} />

            <h3>
              No activity yet
            </h3>

            <p>
              Inventory events will
              appear here as you work.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;