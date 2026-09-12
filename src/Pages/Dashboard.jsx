import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CheckCircle2,
  ClipboardList,
  IndianRupee,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

function Dashboard({
  products = [],
  orders = [],
  activities = [],
}) {
  const safeProducts = Array.isArray(products)
    ? products
    : [];

  const safeOrders = Array.isArray(orders)
    ? orders
    : [];

  const safeActivities = Array.isArray(activities)
    ? activities
    : [];

  /* =========================
     INVENTORY CALCULATIONS
  ========================= */

  const totalStock = safeProducts.reduce(
    (sum, product) =>
      sum + Number(product.stock || 0),
    0
  );

  const inventoryValue = safeProducts.reduce(
    (sum, product) =>
      sum +
      Number(product.costPrice || 0) *
        Number(product.stock || 0),
    0
  );

  /* =========================
     SALES CALCULATIONS
  ========================= */

  const revenue = safeOrders.reduce(
    (sum, order) =>
      sum + Number(order.total || 0),
    0
  );

  const cost = safeOrders.reduce(
    (sum, order) =>
      sum + Number(order.costTotal || 0),
    0
  );

  const profit = revenue - cost;

  const margin = revenue
    ? (profit / revenue) * 100
    : 0;

  const totalUnitsSold = safeProducts.reduce(
    (sum, product) =>
      sum + Number(product.sold30 || 0),
    0
  );

  /* =========================
     STOCK STATUS
  ========================= */

  const lowStock = safeProducts.filter(
    (product) =>
      Number(product.stock || 0) <
      Number(product.minStock || 0)
  );

  const outOfStock = safeProducts.filter(
    (product) =>
      Number(product.stock || 0) === 0
  );

  /* =========================
     SLOW MOVING PRODUCTS
  ========================= */

  const slowMoving = [...safeProducts]
    .sort(
      (a, b) =>
        Number(a.sold30 || 0) -
        Number(b.sold30 || 0)
    )
    .slice(0, 5);

  /* =========================
     TOP PRODUCTS
  ========================= */

  const topProducts = [...safeProducts]
    .sort(
      (a, b) =>
        Number(b.sold30 || 0) -
        Number(a.sold30 || 0)
    )
    .slice(0, 5);

  /* =========================
     CATEGORY PERFORMANCE
  ========================= */

  const categories = Object.values(
    safeProducts.reduce((acc, product) => {
      const key =
        product.category || "Other";

      if (!acc[key]) {
        acc[key] = {
          name: key,
          units: 0,
          value: 0,
          profit: 0,
        };
      }

      acc[key].units += Number(
        product.sold30 || 0
      );

      acc[key].value +=
        Number(product.costPrice || 0) *
        Number(product.stock || 0);

      acc[key].profit +=
        (Number(product.price || 0) -
          Number(product.costPrice || 0)) *
        Number(product.sold30 || 0);

      return acc;
    }, {})
  ).sort(
    (a, b) => b.units - a.units
  );

  const maxCategoryUnits = Math.max(
    ...categories.map(
      (category) => category.units
    ),
    1
  );

  /* =========================
     INVENTORY HEALTH
  ========================= */

  const health = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        100 -
          (lowStock.length /
            Math.max(
              safeProducts.length,
              1
            )) *
            45 -
          (outOfStock.length /
            Math.max(
              safeProducts.length,
              1
            )) *
            35
      )
    )
  );

  /* =========================
     REORDER QUANTITY
  ========================= */

  const reorderQty = (product) =>
    Math.max(
      Number(product.minStock || 0) * 2 -
        Number(product.stock || 0),
      Math.ceil(
        Number(product.sold30 || 0) / 2
      )
    );

  /* =====================================================
     SALES OVERVIEW DATA
     
     Creates a 7-point sales graph from recorded orders.
     Each point represents the revenue recorded for a date.
  ===================================================== */

  const salesOverview = (() => {
    const grouped = {};

    safeOrders.forEach((order) => {
      const date =
        order.date || "Unknown";

      if (!grouped[date]) {
        grouped[date] = 0;
      }

      grouped[date] += Number(
        order.total || 0
      );
    });

    const entries =
      Object.entries(grouped);

    /* No orders yet */
    if (!entries.length) {
      return [
        {
          label: "Mon",
          value: 0,
        },
        {
          label: "Tue",
          value: 0,
        },
        {
          label: "Wed",
          value: 0,
        },
        {
          label: "Thu",
          value: 0,
        },
        {
          label: "Fri",
          value: 0,
        },
        {
          label: "Sat",
          value: 0,
        },
        {
          label: "Sun",
          value: 0,
        },
      ];
    }

    /* Use the latest 7 recorded dates */
    return entries
      .slice(-7)
      .map(([label, value]) => ({
        label,
        value,
      }));
  })();

  return (
    <div className="dashboard-page">

      {/* =================================================
          HERO
      ================================================= */}

      <div className="dashboard-hero">

        <div>

          <p className="eyebrow">
            INVENTORY CONTROL CENTER
          </p>

          <h1>
            Good morning,Welcome back!
          </h1>

          <p>
            See what is selling, what is at
            risk, and where your inventory
            money is tied up.
          </p>

        </div>

        <div className="health-card">

          <div className="health-ring">

            <strong>
              {health}
            </strong>

            <span>
              /100
            </span>

          </div>

          <div>

            <span>
              Inventory health
            </span>

            <strong>
              {health >= 80
                ? "Healthy"
                : health >= 60
                ? "Watch"
                : "Needs attention"}
            </strong>

          </div>

        </div>

      </div>

      {/* =================================================
          KPI
      ================================================= */}

      <div className="dashboard-stats kpi-grid">

        {/* REVENUE */}

        <div className="stat-card">

          <div className="stat-icon">
            <IndianRupee size={20} />
          </div>

          <span>
            Recorded Revenue
          </span>

          <strong>
            {money(revenue)}
          </strong>

          <small>
            {safeOrders.length} completed
            orders
          </small>

        </div>

        {/* PROFIT */}

        <div className="stat-card">

          <div className="stat-icon">
            <TrendingUp size={20} />
          </div>

          <span>
            Gross Profit
          </span>

          <strong>
            {money(profit)}
          </strong>

          <small>
            {margin.toFixed(1)}% gross margin
          </small>

        </div>

        {/* INVENTORY */}

        <div className="stat-card">

          <div className="stat-icon">
            <Boxes size={20} />
          </div>

          <span>
            Inventory Value
          </span>

          <strong>
            {money(inventoryValue)}
          </strong>

          <small>
            {totalStock.toLocaleString(
              "en-IN"
            )}{" "}
            units at cost
          </small>

        </div>

        {/* STOCK RISK */}

        <div className="stat-card">

          <div className="stat-icon">
            <AlertTriangle size={20} />
          </div>

          <span>
            Stock Risk
          </span>

          <strong>
            {lowStock.length}
          </strong>

          <small>
            {outOfStock.length} out of stock
          </small>

        </div>

      </div>

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="dashboard-grid dashboard-main-grid">

        {/* =================================================
            SALES & INVENTORY
        ================================================= */}

        <section className="dashboard-panel">

          <div className="panel-heading">

            <div>

              <h2>
                Sales & Inventory Snapshot
              </h2>

              <p>
                Current business performance
                from recorded sales and stock
                data.
              </p>

            </div>

            <div className="period-pill">
              30 DAYS
            </div>

          </div>

          {/* SNAPSHOT NUMBERS */}

          <div className="snapshot-grid">

            <div className="snapshot-main">

              <span>
                Units sold
              </span>

              <strong>
                {totalUnitsSold}
              </strong>

              <small>
                Across all products
              </small>

            </div>

            <div className="snapshot-main">

              <span>
                Average order value
              </span>

              <strong>
                {money(
                  safeOrders.length
                    ? revenue /
                        safeOrders.length
                    : 0
                )}
              </strong>

              <small>
                Recorded orders
              </small>

            </div>

            <div className="snapshot-main">

              <span>
                Stock on hand
              </span>

              <strong>
                {totalStock.toLocaleString(
                  "en-IN"
                )}
              </strong>

              <small>
                Available units
              </small>

            </div>

          </div>

          {/* =================================================
              SALES OVERVIEW LINE GRAPH
          ================================================= */}

          <div className="sales-overview-chart">

            <div className="sales-chart-header">

              <div>

                <strong>
                  Sales Overview
                </strong>

                <span>
                  Revenue from recorded orders
                </span>

              </div>

              <div className="sales-chart-total">
                {money(revenue)}
              </div>

            </div>

            <div className="sales-line-chart">

              <svg
                viewBox="0 0 900 300"
                preserveAspectRatio="none"
                className="sales-svg"
              >

                {/* =================================================
                    HORIZONTAL GRID LINES
                ================================================= */}

                <line
                  x1="60"
                  y1="40"
                  x2="850"
                  y2="40"
                  className="sales-grid-line"
                />

                <line
                  x1="60"
                  y1="95"
                  x2="850"
                  y2="95"
                  className="sales-grid-line"
                />

                <line
                  x1="60"
                  y1="150"
                  x2="850"
                  y2="150"
                  className="sales-grid-line"
                />

                <line
                  x1="60"
                  y1="205"
                  x2="850"
                  y2="205"
                  className="sales-grid-line"
                />

                <line
                  x1="60"
                  y1="260"
                  x2="850"
                  y2="260"
                  className="sales-grid-line"
                />

                {/* =================================================
                    Y AXIS
                ================================================= */}

                <text
                  x="45"
                  y="45"
                  className="sales-axis-label"
                  textAnchor="end"
                >
                  100%
                </text>

                <text
                  x="45"
                  y="100"
                  className="sales-axis-label"
                  textAnchor="end"
                >
                  75%
                </text>

                <text
                  x="45"
                  y="155"
                  className="sales-axis-label"
                  textAnchor="end"
                >
                  50%
                </text>

                <text
                  x="45"
                  y="210"
                  className="sales-axis-label"
                  textAnchor="end"
                >
                  25%
                </text>

                <text
                  x="45"
                  y="265"
                  className="sales-axis-label"
                  textAnchor="end"
                >
                  0%
                </text>

                {/* =================================================
                    GRAPH
                ================================================= */}

                {(() => {

                  const values =
                    salesOverview.map(
                      (item) =>
                        item.value
                    );

                  const maxValue =
                    Math.max(
                      ...values,
                      1
                    );

                  const chartLeft = 60;
                  const chartRight = 850;
                  const chartTop = 40;
                  const chartBottom = 260;

                  const width =
                    chartRight -
                    chartLeft;

                  const height =
                    chartBottom -
                    chartTop;

                  const points =
                    salesOverview.map(
                      (
                        item,
                        index
                      ) => {

                        const x =
                          chartLeft +
                          (index /
                            Math.max(
                              salesOverview.length -
                                1,
                              1
                            )) *
                            width;

                        const y =
                          chartBottom -
                          (item.value /
                            maxValue) *
                            height;

                        return {
                          x,
                          y,
                          value:
                            item.value,
                          label:
                            item.label,
                        };
                      }
                    );

                  if (!points.length) {
                    return null;
                  }

                  /* LINE PATH */

                  const linePath =
                    points
                      .map(
                        (
                          point,
                          index
                        ) =>
                          `${
                            index === 0
                              ? "M"
                              : "L"
                          } ${
                            point.x
                          } ${
                            point.y
                          }`
                      )
                      .join(" ");

                  /* AREA PATH */

                  const areaPath = `
                    ${linePath}
                    L ${
                      points[
                        points.length - 1
                      ].x
                    }
                    ${chartBottom}
                    L ${
                      points[0].x
                    }
                    ${chartBottom}
                    Z
                  `;

                  return (
                    <>

                      {/* AREA */}

                      <path
                        d={areaPath}
                        className="sales-area"
                      />

                      {/* LINE */}

                      <path
                        d={linePath}
                        className="sales-line"
                      />

                      {/* POINTS */}

                      {points.map(
                        (
                          point,
                          index
                        ) => (
                          <g
                            key={index}
                          >

                            <circle
                              cx={
                                point.x
                              }
                              cy={
                                point.y
                              }
                              r="5"
                              className="sales-point-outer"
                            />

                            <circle
                              cx={
                                point.x
                              }
                              cy={
                                point.y
                              }
                              r="2.5"
                              className="sales-point-inner"
                            />

                            <text
                              x={
                                point.x
                              }
                              y="285"
                              className="sales-date-label"
                              textAnchor="middle"
                            >
                              {
                                point.label
                              }
                            </text>

                          </g>
                        )
                      )}

                    </>
                  );
                })()}

              </svg>

            </div>

          </div>

        </section>

        {/* =================================================
            ATTENTION
        ================================================= */}

        <section className="dashboard-panel">

          <div className="panel-heading">

            <div>

              <h2>
                Needs Attention
              </h2>

              <p>
                Actions that protect
                availability.
              </p>

            </div>

            <AlertTriangle size={20} />

          </div>

          <div className="attention-summary">

            <div>

              <strong>
                {lowStock.length}
              </strong>

              <span>
                low stock
              </span>

            </div>

            <div>

              <strong>
                {outOfStock.length}
              </strong>

              <span>
                out of stock
              </span>

            </div>

          </div>

          <div className="decision-list">

            {lowStock
              .slice(0, 4)
              .map((product) => (

                <div
                  className="decision-row"
                  key={product.id}
                >

                  <div>

                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      {product.stock} left ·
                      min{" "}
                      {product.minStock}
                    </span>

                  </div>

                  <div className="decision-action">

                    <b>
                      Order{" "}
                      {reorderQty(product)}
                    </b>

                    <small>
                      units
                    </small>

                  </div>

                </div>

              ))}

            {!lowStock.length && (

              <div className="empty-state">

                <CheckCircle2
                  size={28}
                />

                <h3>
                  Inventory is healthy
                </h3>

                <p>
                  No products are below
                  minimum stock.
                </p>

              </div>

            )}

          </div>

        </section>

      </div>

      {/* =================================================
          THREE COLUMNS
      ================================================= */}

      <div className="dashboard-grid three-panel-grid">

        {/* =================================================
            TOP SELLERS
        ================================================= */}

        <section className="dashboard-panel">

          <div className="panel-heading">

            <div>

              <h2>
                Top Sellers
              </h2>

              <p>
                Highest unit movement.
              </p>

            </div>

            <TrendingUp size={20} />

          </div>

          <div className="dashboard-list">

            {topProducts.map(
              (
                product,
                index
              ) => (

                <div
                  className="dashboard-list-row"
                  key={product.id}
                >

                  <div className="rank">
                    {index + 1}
                  </div>

                  <div>

                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      {product.category}
                    </span>

                  </div>

                  <div className="list-value">

                    <strong>
                      {product.sold30 || 0}
                    </strong>

                    <span>
                      sold
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

        {/* =================================================
            LOW SALES
        ================================================= */}

        <section className="dashboard-panel">

          <div className="panel-heading">

            <div>

              <h2>
                Low Sales
              </h2>

              <p>
                Stock that may need
                review.
              </p>

            </div>

            <TrendingDown size={20} />

          </div>

          <div className="dashboard-list">

            {slowMoving.map(
              (product) => (

                <div
                  className="dashboard-list-row"
                  key={product.id}
                >

                  <div className="dashboard-product-icon">

                    <Package size={16} />

                  </div>

                  <div>

                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      {product.stock} units
                      held
                    </span>

                  </div>

                  <div className="list-value">

                    <strong>
                      {product.sold30 || 0}
                    </strong>

                    <span>
                      sold
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

        {/* =================================================
            CATEGORY PERFORMANCE
        ================================================= */}

        <section className="dashboard-panel">

          <div className="panel-heading">

            <div>

              <h2>
                Category Performance
              </h2>

              <p>
                Unit movement by category.
              </p>

            </div>

            <BarChart3 size={20} />

          </div>

          <div className="category-list">

            {categories
              .slice(0, 5)
              .map(
                (category) => (

                  <div
                    className="category-item"
                    key={category.name}
                  >

                    <div className="category-top">

                      <strong>
                        {category.name}
                      </strong>

                      <span>
                        {category.units} units
                      </span>

                    </div>

                    <div className="category-bar">

                      <div
                        className="category-bar-fill"
                        style={{
                          width: `${
                            (category.units /
                              maxCategoryUnits) *
                            100
                          }%`,
                        }}
                      />

                    </div>

                    <small>

                      {money(
                        category.value
                      )}{" "}
                      inventory ·{" "}
                      {money(
                        category.profit
                      )}{" "}
                      potential profit

                    </small>

                  </div>

                )
              )}

          </div>

        </section>

      </div>

      {/* =================================================
          RECENT ORDERS
      ================================================= */}

      <section className="dashboard-panel recent-orders-panel">

        <div className="panel-heading">

          <div>

            <h2>
              Recent Orders
            </h2>

            <p>
              Latest completed sales.
            </p>

          </div>

          <ClipboardList size={20} />

        </div>

        {safeOrders.length ? (

          <div className="recent-order-list">

            {safeOrders
              .slice(0, 5)
              .map(
                (order) => (

                  <div
                    className="recent-order-row"
                    key={order.id}
                  >

                    <div>

                      <strong>
                        {order.id}
                      </strong>

                      <span>
                        {order.productName} ·{" "}
                        {order.quantity} units
                      </span>

                    </div>

                    <div>

                      <strong>
                        {money(
                          order.total
                        )}
                      </strong>

                      <span className="profit-text">
                        +
                        {money(
                          order.profit
                        )}{" "}
                        profit
                      </span>

                    </div>

                    <time>
                      {order.date}
                    </time>

                  </div>

                )
              )}

          </div>

        ) : (

          <div className="empty-state">

            <ShoppingCart size={28} />

            <h3>
              No sales recorded yet
            </h3>

            <p>
              Record your first sale from
              Sales & Orders.
            </p>

          </div>

        )}

      </section>

      {/* =================================================
          ACTIVITY
      ================================================= */}

      <section className="dashboard-panel activity-panel">

        <div className="panel-heading">

          <div>

            <h2>
              Recent Activity
            </h2>

            <p>
              Inventory events in
              chronological order.
            </p>

          </div>

          <Package size={20} />

        </div>

        {safeActivities.length ? (

          <div className="activity-list">

            {safeActivities
              .slice(0, 6)
              .map(
                (activity) => (

                  <div
                    className="activity-row"
                    key={activity.id}
                  >

                    <div
                      className={`activity-dot ${
                        activity.type ||
                        "info"
                      }`}
                    />

                    <div>

                      <strong>
                        {activity.message}
                      </strong>

                      <span>
                        {activity.time}
                      </span>

                    </div>

                  </div>

                )
              )}

          </div>

        ) : (

          <div className="empty-state">

            <p>
              No activity yet.
            </p>

          </div>

        )}

      </section>

    </div>
  );
}

export default Dashboard;