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
  const safeActivities = Array.isArray(activities)
    ? activities
    : [];

  const safeProducts = Array.isArray(products)
    ? products
    : [];

  // --------------------------------------------------
  // STOCK HELPERS
  // --------------------------------------------------

  const getStock = (product) => {
    const stock = Number(product?.stock);

    return Number.isFinite(stock) ? stock : 0;
  };

  const getMinStock = (product) => {
    const minStock = Number(product?.minStock);

    return Number.isFinite(minStock) ? minStock : 0;
  };

  // --------------------------------------------------
  // STOCK STATUS
  // --------------------------------------------------

  const getStockStatus = (product) => {
    const stock = getStock(product);
    const minStock = getMinStock(product);

    // 0 = OUT OF STOCK
    if (stock === 0) {
      return "out";
    }

    // Greater than 0 but at/below minimum = LOW STOCK
    if (stock <= minStock) {
      return "low";
    }

    // Above minimum = IN STOCK
    return "in";
  };

  // --------------------------------------------------
  // LOW + OUT OF STOCK PRODUCTS
  // --------------------------------------------------

  const attentionProducts = safeProducts.filter((product) => {
    const status = getStockStatus(product);

    return status === "low" || status === "out";
  });

  // --------------------------------------------------
  // SYSTEM STOCK ALERTS
  // --------------------------------------------------

  const systemAlerts = attentionProducts
    .slice()
    .sort((a, b) => {
      const statusA = getStockStatus(a);
      const statusB = getStockStatus(b);

      // OUT OF STOCK first
      if (statusA === "out" && statusB !== "out") {
        return -1;
      }

      if (statusB === "out" && statusA !== "out") {
        return 1;
      }

      // Then lowest stock first
      return getStock(a) - getStock(b);
    })
    .slice(0, 5)
    .map((product) => {
      const stock = getStock(product);
      const minStock = getMinStock(product);
      const status = getStockStatus(product);

      const isOutOfStock = status === "out";

      return {
        id: `stock-${product.id}`,

        type: isOutOfStock
          ? "critical"
          : "warning",

        title: isOutOfStock
          ? `${product.name} is out of stock`
          : `${product.name} is below minimum stock`,

        message: isOutOfStock
          ? `Available: 0 units · Minimum: ${minStock} units`
          : `Available: ${stock} units · Minimum: ${minStock} units`,

        time: "Current inventory",
      };
    });

  return (
    <div className="notifications-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="page-header">
        <div>
          <p className="eyebrow">
            INVENTORY ALERTS
          </p>

          <h1>
            Notifications & Activity
          </h1>

          <p>
            Important stock alerts and the latest
            inventory events.
          </p>
        </div>
      </div>

      {/* ==================================================
          STOCK ALERTS
      ================================================== */}

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
                These products need attention.
              </p>
            </div>

            <AlertTriangle size={20} />
          </div>

          <div className="notification-list">
            {systemAlerts.map((alert) => (
              <div
                className="notification-row"
                key={alert.id}
              >

                {/* ICON */}
                <div className="notification-row-icon">
                  <AlertTriangle size={18} />
                </div>

                {/* CONTENT */}
                <div className="notification-content">
                  <strong>
                    {alert.title}
                  </strong>

                  <p>
                    {alert.message}
                  </p>
                </div>

                {/* TIME */}
                <span className="notification-time">
                  {alert.time}
                </span>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================
          NO STOCK ALERTS
      ================================================== */}

      {systemAlerts.length === 0 && (
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
                All products are currently above
                their minimum stock level.
              </p>
            </div>

            <CheckCircle2 size={20} />
          </div>
        </div>
      )}

      {/* ==================================================
          ACTIVITY FEED
      ================================================== */}

      <div className="analytics-panel">

        <div className="panel-heading">
          <div>
            <h2>
              Activity Feed
            </h2>

            <p>
              Sales, restocks, products and reports.
            </p>
          </div>

          <Bell size={20} />
        </div>

        {safeActivities.length ? (
          <div className="notification-list">

            {safeActivities.map((item) => (
              <div
                className="notification-row"
                key={item.id}
              >

                {/* ACTIVITY ICON */}
                <div className="notification-row-icon">

                  {item.type === "warning" ? (
                    <AlertTriangle size={18} />
                  ) : item.type === "success" ? (
                    <CheckCircle2 size={18} />
                  ) : item.type === "danger" ? (
                    <TrendingDown size={18} />
                  ) : (
                    <Package size={18} />
                  )}

                </div>

                {/* ACTIVITY CONTENT */}
                <div className="notification-content">

                  <strong>
                    {item.message}
                  </strong>

                  <p>
                    SmartShelf inventory event
                  </p>

                </div>

                {/* ACTIVITY TIME */}
                <span className="notification-time">
                  {item.time}
                </span>

              </div>
            ))}

          </div>
        ) : (
          <div className="empty-state">

            <Bell size={28} />

            <h3>
              No activity yet
            </h3>

            <p>
              Inventory events will appear here
              as you work.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

export default Notifications;