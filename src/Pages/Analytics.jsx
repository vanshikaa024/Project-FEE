import { useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  IndianRupee,
  ShoppingCart,
} from "lucide-react";

function Analytics({ products = [], orders = [] }) {
  const safeProducts = Array.isArray(products) ? products : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  const totalProducts = safeProducts.length;

  const totalStock = safeProducts.reduce(
    (total, product) => total + Number(product.stock || 0),
    0
  );

  const totalSalesUnits = safeProducts.reduce(
    (total, product) => total + Number(product.sold30 || 0),
    0
  );

  const totalInventoryValue = safeProducts.reduce(
    (total, product) =>
      total +
      Number(product.costPrice || 0) * Number(product.stock || 0),
    0
  );

  const totalRevenue = safeOrders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  const totalProfit = safeOrders.reduce(
    (total, order) => total + Number(order.profit || 0),
    0
  );

  const lowStockProducts = safeProducts.filter(
    (product) =>
      Number(product.stock || 0) < Number(product.minStock || 0)
  );

  const outOfStockProducts = safeProducts.filter(
    (product) => Number(product.stock || 0) === 0
  );

  const averageOrderValue = safeOrders.length
    ? totalRevenue / safeOrders.length
    : 0;

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  const fastMoving = useMemo(
    () =>
      [...safeProducts]
        .sort(
          (a, b) =>
            Number(b.sold30 || 0) - Number(a.sold30 || 0)
        )
        .slice(0, 5),
    [safeProducts]
  );

  const slowMoving = useMemo(
    () =>
      [...safeProducts]
        .sort(
          (a, b) =>
            Number(a.sold30 || 0) - Number(b.sold30 || 0)
        )
        .slice(0, 5),
    [safeProducts]
  );

  const categorySales = useMemo(() => {
    const data = {};

    safeProducts.forEach((product) => {
      const category = product.category || "Other";

      if (!data[category]) {
        data[category] = 0;
      }

      data[category] += Number(product.sold30 || 0);
    });

    return Object.entries(data).sort((a, b) => b[1] - a[1]);
  }, [safeProducts]);

  const maxCategorySales = Math.max(
    ...categorySales.map(([, value]) => value),
    1
  );

  /*
   * ==========================================================
   * INVENTORY AT A GLANCE
   * This is intentionally the SAME TYPE of graph used on the
   * Dashboard: four vertical bars for stock status.
   * ==========================================================
   */

  const inventoryBars = [
    {
      label: "Total Products",
      shortLabel: "Inventory",
      value: totalProducts,
      colorClass: "business-bar-blue",
      badge: "100%",
      subLabel: "All products",
    },
    {
      label: "In Stock",
      shortLabel: "In Stock",
      value: safeProducts.filter(
        (product) =>
          Number(product.stock || 0) > Number(product.minStock || 0)
      ).length,
      colorClass: "business-bar-green",
      subLabel: "Available",
    },
    {
      label: "Low Stock",
      shortLabel: "Low Stock",
      value: lowStockProducts.filter(
        (product) => Number(product.stock || 0) > 0
      ).length,
      colorClass: "business-bar-yellow",
      subLabel: "Needs restock",
    },
    {
      label: "Out Of Stock",
      shortLabel: "Out Of Stock",
      value: outOfStockProducts.length,
      colorClass: "business-bar-red",
      subLabel: "Unavailable",
    },
  ];

  const totalForPercent = Math.max(totalProducts, 1);

  const inventoryBarsWithPercent = inventoryBars.map((bar) => ({
    ...bar,
    percent:
      bar.label === "Total Products"
        ? 100
        : Math.round((bar.value / totalForPercent) * 100),
  }));

  const maxBarPercent = 100;

  const health =
    totalProducts === 0
      ? 0
      : Math.round(
          ((inventoryBarsWithPercent[1].value +
            Math.max(inventoryBarsWithPercent[2].value, 0) * 0.5) /
            totalProducts) *
            100
        );

  return (
    <div className="analytics-page business-performance-page">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="page-header business-performance-header">
        <div>
          <span className="business-eyebrow">BUSINESS INSIGHTS</span>

          <h1>Business Performance</h1>

          <p>
            Understand your sales, inventory movement and
            restocking needs.
          </p>
        </div>

        <div className="business-period">CURRENT VIEW</div>
      </div>

      {/* ======================================================
          SUMMARY CARDS
      ======================================================= */}

      <div className="analytics-summary business-summary-grid">

        <div className="analytics-card business-summary-card">
          <div className="business-summary-icon">
            <Package size={20} />
          </div>

          <div>
            <span>Total Products</span>
            <strong>{totalProducts.toLocaleString("en-IN")}</strong>
            <small>Products currently managed</small>
          </div>
        </div>

        <div className="analytics-card business-summary-card">
          <div className="business-summary-icon">
            <ShoppingCart size={20} />
          </div>

          <div>
            <span>Units Sold</span>
            <strong>{totalSalesUnits.toLocaleString("en-IN")}</strong>
            <small>Sales volume in 30 days</small>
          </div>
        </div>

        <div className="analytics-card business-summary-card">
          <div className="business-summary-icon">
            <IndianRupee size={20} />
          </div>

          <div>
            <span>Inventory Value</span>
            <strong>{money(totalInventoryValue)}</strong>
            <small>Current stock at cost</small>
          </div>
        </div>

        <div className="analytics-card business-summary-card">
          <div className="business-summary-icon warning">
            <AlertTriangle size={20} />
          </div>

          <div>
            <span>Products Needing Attention</span>
            <strong>{lowStockProducts.length}</strong>
            <small>{outOfStockProducts.length} out of stock</small>
          </div>
        </div>

      </div>

      {/* ======================================================
          INVENTORY AT A GLANCE
          SAME GRAPH STYLE AS DASHBOARD
      ======================================================= */}

      <section className="analytics-panel inventory-glance-business">

        <div className="business-panel-heading">

          <div className="business-title-with-icon">
            <div className="business-heading-icon">
              <Package size={19} />
            </div>

            <div>
              <h2>Inventory at a Glance</h2>
              <p>Current stock status across all products.</p>
            </div>
          </div>

          <div className="business-month-button">
            Month <span>⌄</span>
          </div>

        </div>

        <div className="inventory-glance-content">

          {/* LEFT LEGEND / TOTAL */}

          <div className="inventory-glance-summary">

            <strong>
              {totalProducts.toLocaleString("en-IN")}
            </strong>

            <span className="inventory-total-label">
              Total Products
            </span>

            <div className="inventory-legend">

              <div>
                <i className="legend-blue" />
                <span>Total Products</span>
                <strong>{totalProducts}</strong>
              </div>

              <div>
                <i className="legend-green" />
                <span>In Stock</span>
                <strong>{inventoryBarsWithPercent[1].value}</strong>
              </div>

              <div>
                <i className="legend-yellow" />
                <span>Low Stock</span>
                <strong>{inventoryBarsWithPercent[2].value}</strong>
              </div>

              <div>
                <i className="legend-red" />
                <span>Out Of Stock</span>
                <strong>{outOfStockProducts.length}</strong>
              </div>

            </div>

          </div>

          {/* BARS */}

          <div className="inventory-bars-area">

            {inventoryBarsWithPercent.map((bar) => {

              const height =
                bar.percent === 0
                  ? 0
                  : Math.max(
                      (bar.percent / maxBarPercent) * 100,
                      12
                    );

              return (
                <div className="business-stock-column" key={bar.label}>

                  <div className="business-stock-bar-wrap">

                    {bar.percent > 0 && (
                      <div
                        className={`business-stock-bar ${bar.colorClass}`}
                        style={{ height: `${height}%` }}
                      >
                        <span className="business-stock-badge">
                          ↗ {bar.percent}%
                        </span>
                      </div>
                    )}

                    {bar.percent === 0 && (
                      <div
                        className={`business-stock-bar business-empty-bar ${bar.colorClass}`}
                      />
                    )}

                  </div>

                  <strong>{bar.shortLabel}</strong>

                  <span>{bar.subLabel}</span>

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* ======================================================
          BUSINESS PERFORMANCE NUMBERS
      ======================================================= */}

      <section className="business-performance-mini-grid">

        <div className="business-mini-card">
          <span>Recorded Revenue</span>
          <strong>{money(totalRevenue)}</strong>
          <small>{safeOrders.length} completed orders</small>
        </div>

        <div className="business-mini-card">
          <span>Gross Profit</span>
          <strong>{money(totalProfit)}</strong>
          <small>
            {totalRevenue
              ? `${((totalProfit / totalRevenue) * 100).toFixed(1)}% margin`
              : "No recorded revenue"}
          </small>
        </div>

        <div className="business-mini-card">
          <span>Average Order Value</span>
          <strong>{money(averageOrderValue)}</strong>
          <small>Across recorded orders</small>
        </div>

        <div className="business-mini-card">
          <span>Inventory Health</span>
          <strong>{health}/100</strong>
          <small>
            {health >= 80
              ? "Healthy"
              : health >= 60
              ? "Watch"
              : "Needs attention"}
          </small>
        </div>

      </section>

      {/* ======================================================
          TOP SELLING / LOW SALES
      ======================================================= */}

      <div className="analytics-grid business-products-grid">

        {/* TOP SELLERS */}

        <section className="analytics-panel">

          <div className="panel-heading">
            <div>
              <h2>Top Selling Products</h2>
              <p>Products with the highest unit movement.</p>
            </div>

            <TrendingUp size={20} />
          </div>

          <div className="business-product-list">

            {fastMoving.length ? (
              fastMoving.map((product, index) => (
                <div className="business-product-row" key={product.id}>

                  <div className="business-rank">
                    {index + 1}
                  </div>

                  <div className="business-product-image">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                    ) : (
                      <Package size={18} />
                    )}
                  </div>

                  <div className="business-product-name">
                    <strong>{product.name}</strong>
                    <span>{product.category || "Other"}</span>
                  </div>

                  <div className="business-product-sales">
                    <strong>{Number(product.sold30 || 0)}</strong>
                    <span>units</span>
                  </div>

                </div>
              ))
            ) : (
              <div className="business-empty">
                <Package size={25} />
                <strong>No products yet</strong>
              </div>
            )}

          </div>

        </section>

        {/* LOW SALES */}

        <section className="analytics-panel">

          <div className="panel-heading">
            <div>
              <h2>Products With Low Sales</h2>
              <p>Products that may need promotion.</p>
            </div>

            <TrendingDown size={20} />
          </div>

          <div className="business-product-list">

            {slowMoving.length ? (
              slowMoving.map((product, index) => (
                <div className="business-product-row" key={product.id}>

                  <div className="business-rank">
                    {index + 1}
                  </div>

                  <div className="business-product-image">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                    ) : (
                      <Package size={18} />
                    )}
                  </div>

                  <div className="business-product-name">
                    <strong>{product.name}</strong>
                    <span>
                      {Number(product.stock || 0)} units in stock
                    </span>
                  </div>

                  <div className="business-product-sales">
                    <strong>{Number(product.sold30 || 0)}</strong>
                    <span>units</span>
                  </div>

                </div>
              ))
            ) : (
              <div className="business-empty">
                <Package size={25} />
                <strong>No products yet</strong>
              </div>
            )}

          </div>

        </section>

      </div>

      {/* ======================================================
          CATEGORY PERFORMANCE
      ======================================================= */}

      <section className="analytics-panel">

        <div className="panel-heading">
          <div>
            <h2>Sales Performance by Category</h2>
            <p>Unit movement across your product categories.</p>
          </div>

          <BarChart3 size={20} />
        </div>

        <div className="business-category-list">

          {categorySales.length ? (
            categorySales.map(([category, sales]) => {

              const width =
                (sales / maxCategorySales) * 100;

              return (
                <div className="business-category-row" key={category}>

                  <div className="business-category-name">
                    <strong>{category}</strong>
                  </div>

                  <div className="business-category-track">
                    <div
                      className="business-category-fill"
                      style={{ width: `${width}%` }}
                    />
                  </div>

                  <div className="business-category-value">
                    {sales} units sold
                  </div>

                </div>
              );
            })
          ) : (
            <div className="business-empty">
              <BarChart3 size={25} />
              <strong>No category data yet</strong>
            </div>
          )}

        </div>

      </section>

      {/* ======================================================
          REPLENISHMENT
      ======================================================= */}

      <section className="analytics-panel">

        <div className="panel-heading">

          <div>
            <h2>Inventory Replenishment Needs</h2>
            <p>Products below their minimum stock level.</p>
          </div>

          <AlertTriangle size={20} />

        </div>

        {lowStockProducts.length === 0 ? (

          <div className="business-empty business-healthy">
            <Package size={28} />
            <strong>Inventory levels are healthy</strong>
            <p>No products currently require replenishment.</p>
          </div>

        ) : (

          <div className="business-replenishment-list">

            {lowStockProducts.map((product) => (

              <div className="business-replenishment-row" key={product.id}>

                <div className="business-replenishment-product">

                  <div className="business-product-image small">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                    ) : (
                      <Package size={16} />
                    )}
                  </div>

                  <div>
                    <strong>{product.name}</strong>
                    <span>
                      Minimum required: {product.minStock} units
                    </span>
                  </div>

                </div>

                <div className="business-replenishment-stock">
                  <strong>{Number(product.stock || 0)}</strong>
                  <span>units left</span>
                </div>

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Analytics;
