import React from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Package,
} from "lucide-react";

function Notifications({
  activities = [],
  products = [],
}) {
  const safeProducts = Array.isArray(products)
    ? products
    : [];

  const safeActivities = Array.isArray(activities)
    ? activities
    : [];

  /* =====================================================
     STOCK ALERTS
     ===================================================== */

  const stockAlerts = safeProducts
    .filter((product) => {
      const stock = Number(product?.stock || 0);
      const minStock = Number(product?.minStock || 0);

      return stock > 0 && stock < minStock;
    })
    .sort((a, b) => {
      const stockA = Number(a?.stock || 0);
      const stockB = Number(b?.stock || 0);

      return stockA - stockB;
    });

  /* =====================================================
     REMOVE LOGIN ACTIVITIES
     ===================================================== */

  const filteredActivities = safeActivities.filter(
    (activity) => {
      const message = String(
        activity?.message || ""
      ).toLowerCase();

      return (
        !message.includes(
          "signed in to smartshelf"
        ) &&
        !message.includes(
          "logged into smartshelf"
        ) &&
        !message.includes(
          "logged in to smartshelf"
        )
      );
    }
  );

  /* =====================================================
     ACTIVITY DATE
     ===================================================== */

  const getActivityDate = (activity) => {
    if (activity?.timestamp) {
      const date = new Date(
        activity.timestamp
      );

      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }

    if (activity?.createdAt) {
      const date = new Date(
        activity.createdAt
      );

      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }

    if (activity?.time) {
      const date = new Date(
        activity.time
      );

      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }

    return new Date(0);
  };

  /* =====================================================
     FORMAT ACTIVITY DATE
     ===================================================== */

  const formatActivityDate = (activity) => {
    const date = getActivityDate(activity);

    if (date.getTime() === 0) {
      return "";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =====================================================
     LAST 20 ACTIVITIES
     ===================================================== */

  const recentActivities =
    filteredActivities
      .slice()
      .sort((a, b) => {
        return (
          getActivityDate(b).getTime() -
          getActivityDate(a).getTime()
        );
      })
      .slice(0, 20);

  /* =====================================================
     ACTIVITY ICON
     ===================================================== */

  const getActivityIcon = (type) => {
    if (
      type === "warning" ||
      type === "low-stock" ||
      type === "danger"
    ) {
      return <AlertTriangle size={18} />;
    }

    if (type === "success") {
      return <CheckCircle2 size={18} />;
    }

    return <Package size={18} />;
  };

  return (
    <div className="page notifications-page">

      {/* =================================================
          PAGE HEADER
          ================================================= */}

      <div className="notifications-page-header">
        <div>
          <span className="notifications-eyebrow">
            INVENTORY ALERTS
          </span>

          <h1>
            Notifications & Activity
          </h1>

          <p>
            Important stock alerts and the latest
            inventory events.
          </p>
        </div>
      </div>


      {/* =================================================
          STOCK ALERTS
          ================================================= */}

      <section className="notifications-panel">

        <div className="notifications-panel-header">
          <div>
            <h2>Stock Alerts</h2>

            <p>
              These products need attention.
            </p>
          </div>

          <AlertTriangle size={20} />
        </div>


        {stockAlerts.length === 0 ? (
          <div className="notification-empty">
            <CheckCircle2 size={28} />

            <strong>
              Inventory is healthy
            </strong>

            <span>
              No products are below their
              minimum stock level.
            </span>
          </div>
        ) : (
          <div className="stock-alert-list">

            {stockAlerts.map((product) => {
              const stock = Number(
                product?.stock || 0
              );

              const minStock = Number(
                product?.minStock || 0
              );

              return (
                <div
                  className="stock-alert-row"
                  key={product.id}
                >

                  <div className="stock-alert-icon">
                    <AlertTriangle size={17} />
                  </div>


                  <div className="stock-alert-content">

                    <strong>
                      {product.name} is below minimum stock
                    </strong>

                    <span>
                      Available: {stock} units ·
                      Minimum: {minStock} units
                    </span>

                  </div>


                  <span className="stock-alert-label">
                    Current inventory
                  </span>

                </div>
              );
            })}

          </div>
        )}

      </section>


      {/* =================================================
          ACTIVITY FEED
          ================================================= */}

      <section className="notifications-panel activity-feed-panel">

        <div className="notifications-panel-header">

          <div>
            <h2>Activity Feed</h2>

            <p>
              Showing you {recentActivities.length} most recent
              {recentActivities.length === 1
                ? " activity."
                : " activities."}
            </p>
          </div>

          <Bell size={20} />

        </div>


        {recentActivities.length === 0 ? (
          <div className="notification-empty">

            <Bell size={28} />

            <strong>
              No recent activity
            </strong>

            <span>
              New inventory activity will appear here.
            </span>

          </div>
        ) : (

          <div className="activity-feed-list">

            {recentActivities.map(
              (activity) => (

                <div
                  className="activity-feed-row"
                  key={activity.id}
                >

                  <div
                    className={`activity-feed-icon ${
                      activity.type || "info"
                    }`}
                  >
                    {getActivityIcon(
                      activity.type
                    )}
                  </div>


                  <div className="activity-feed-content">

                    <strong>
                      {activity.message}
                    </strong>

                    <span>
                      SmartShelf inventory event
                    </span>

                  </div>


                  <time>
                    {formatActivityDate(
                      activity
                    )}
                  </time>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </div>
  );
}

export default Notifications;