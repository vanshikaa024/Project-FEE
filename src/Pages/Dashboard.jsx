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

function ProductThumb({ product, size = 42 }) {
  const fallback = product?.name
    ? product.name.charAt(0).toUpperCase()
    : "P";

  return (
    <div
      className="ss-product-thumb"
      style={{ width: size, height: size }}
    >
      {product?.image ? (
        <img
          src={product.image}
          alt={product.name || "Product"}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const fallbackBox = e.currentTarget.nextElementSibling;
            if (fallbackBox) fallbackBox.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className="ss-product-thumb-fallback"
        style={{ display: product?.image ? "none" : "flex" }}
      >
        {product?.image ? <Package size={17} /> : fallback}
      </div>
    </div>
  );
}

function Dashboard({ products = [], orders = [], activities = [] }) {
  const safeProducts = Array.isArray(products) ? products : [];
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeActivities = Array.isArray(activities) ? activities : [];

  // -----------------------------
  // INVENTORY
  // -----------------------------
  const totalProducts = safeProducts.length;
  const totalUnits = safeProducts.reduce(
    (sum, product) => sum + Number(product.stock || 0),
    0
  );

  const inStockProducts = safeProducts.filter(
    (product) =>
      Number(product.stock || 0) > Number(product.minStock || 0)
  ).length;

  const lowStockProducts = safeProducts.filter(
    (product) =>
      Number(product.stock || 0) > 0 &&
      Number(product.stock || 0) <= Number(product.minStock || 0)
  ).length;

  const outOfStockProducts = safeProducts.filter(
    (product) => Number(product.stock || 0) === 0
  ).length;

  const maxInventoryCount = Math.max(
    totalProducts,
    inStockProducts,
    lowStockProducts,
    outOfStockProducts,
    1
  );

  const inventoryValue = safeProducts.reduce(
    (sum, product) =>
      sum +
      Number(product.costPrice || 0) *
        Number(product.stock || 0),
    0
  );

  // -----------------------------
  // BUSINESS PERFORMANCE
  // -----------------------------
  const revenue = safeOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const cost = safeOrders.reduce(
    (sum, order) =>
      sum + Number(order.cost ?? order.costTotal ?? 0),
    0
  );

  const profit = safeOrders.reduce(
    (sum, order) => {
      if (order.profit !== undefined && order.profit !== null) {
        return sum + Number(order.profit || 0);
      }
      return (
        sum +
        (Number(order.total || 0) -
          Number(order.cost ?? order.costTotal ?? 0))
      );
    },
    0
  );

  const margin = revenue ? (profit / revenue) * 100 : 0;

  const totalUnitsSold = safeOrders.reduce(
    (sum, order) => sum + Number(order.quantity || 0),
    0
  );

  const averageOrderValue = safeOrders.length
    ? revenue / safeOrders.length
    : 0;

  // -----------------------------
  // HEALTH
  // -----------------------------
  const health = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        totalProducts === 0
          ? 100
          : ((inStockProducts + lowStockProducts * 0.55) /
              totalProducts) *
              100
      )
    )
  );

  // -----------------------------
  // TOP / LOW SALES
  // -----------------------------
  const topProducts = [...safeProducts]
    .sort((a, b) => Number(b.sold30 || 0) - Number(a.sold30 || 0))
    .slice(0, 5);

  const lowSalesProducts = [...safeProducts]
    .sort((a, b) => Number(a.sold30 || 0) - Number(b.sold30 || 0))
    .slice(0, 5);

  // -----------------------------
  // CATEGORIES
  // -----------------------------
  const categories = Object.values(
    safeProducts.reduce((acc, product) => {
      const name = product.category || "Other";
      if (!acc[name]) {
        acc[name] = { name, units: 0 };
      }
      acc[name].units += Number(product.sold30 || 0);
      return acc;
    }, {})
  )
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  const maxCategoryUnits = Math.max(
    ...categories.map((category) => category.units),
    1
  );

  // -----------------------------
  // NEEDS ATTENTION
  // -----------------------------
  const attentionProducts = [...safeProducts]
    .filter(
      (product) =>
        Number(product.stock || 0) <= Number(product.minStock || 0)
    )
    .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
    .slice(0, 5);

  return (
    <div className="ss-dashboard">
      {/* HEADER */}
      <section className="ss-dashboard-header">
        <div>
          <div className="ss-eyebrow">INVENTORY CONTROL CENTER</div>
          <h1>Good morning, Welcome back!</h1>
          <p>
            See what is selling, what is at risk, and where your inventory
            money is tied up.
          </p>
        </div>

        <div className="ss-health-card">
          <div
            className="ss-health-ring"
            style={{
              background: `conic-gradient(#22a866 ${health}%, #edf1f5 ${health}% 100%)`,
            }}
          >
            <div>
              <strong>{health}%</strong>
            
            </div>
          </div>
          <div>
            <span>Inventory health</span>
            <strong>{health >= 80 ? "Healthy" : health >= 60 ? "Watch" : "Needs attention"}</strong>
            <small>{totalUnits.toLocaleString("en-IN")} units available</small>
          </div>
        </div>
      </section>

      {/* KPI CARDS */}
      <section className="ss-kpi-grid">
        <div className="ss-kpi-card">
          <div className="ss-kpi-icon"><IndianRupee size={19} /></div>
          <div className="ss-kpi-label">Recorded Revenue</div>
          <div className="ss-kpi-value">{money(revenue)}</div>
          <div className="ss-kpi-note">{safeOrders.length} completed orders</div>
        </div>

        <div className="ss-kpi-card">
          <div className="ss-kpi-icon"><TrendingUp size={19} /></div>
          <div className="ss-kpi-label">Gross Profit</div>
          <div className="ss-kpi-value">{money(profit)}</div>
          <div className="ss-kpi-note">{margin.toFixed(1)}% gross margin</div>
        </div>

        <div className="ss-kpi-card">
          <div className="ss-kpi-icon"><Boxes size={19} /></div>
          <div className="ss-kpi-label">Stock Value</div>
          <div className="ss-kpi-value">{money(inventoryValue)}</div>
          <div className="ss-kpi-note">{totalUnits.toLocaleString("en-IN")} units on hand</div>
        </div>

        <div className="ss-kpi-card">
          <div className="ss-kpi-icon"><AlertTriangle size={19} /></div>
          <div className="ss-kpi-label">Stock Attention</div>
          <div className="ss-kpi-value">{lowStockProducts + outOfStockProducts}</div>
          <div className="ss-kpi-note">{outOfStockProducts} products out of stock</div>
        </div>
      </section>

      {/* MAIN TWO-COLUMN ROW */}
      <section className="ss-main-grid">
        {/* INVENTORY AT A GLANCE */}
        <div className="ss-card ss-inventory-card">
          <div className="ss-card-header">
            <div className="ss-card-title-wrap">
              <div className="ss-section-icon"><Boxes size={18} /></div>
              <div>
                <h2>Inventory at a Glance</h2>
                <p>Current stock status across all products.</p>
              </div>
            </div>
            <div className="ss-header-control">Month <span>⌄</span></div>
          </div>

          <div className="ss-inventory-body">
            <div className="ss-inventory-summary">
              <div className="ss-inventory-total">{totalProducts.toLocaleString("en-IN")}</div>
              <div className="ss-inventory-total-label">Total Products</div>

              <div className="ss-legend-list">
                <div><i className="ss-dot total" /><span>Total Products</span><strong>{totalProducts}</strong></div>
                <div><i className="ss-dot in" /><span>In Stock</span><strong>{inStockProducts}</strong></div>
                <div><i className="ss-dot low" /><span>Low Stock</span><strong>{lowStockProducts}</strong></div>
                <div><i className="ss-dot out" /><span>Out Of Stock</span><strong>{outOfStockProducts}</strong></div>
              </div>
            </div>

            <div className="ss-stock-bars">
              {[
                { key: "total", label: "Inventory", sub: "All products", value: totalProducts },
                { key: "in", label: "In Stock", sub: "Available", value: inStockProducts },
                { key: "low", label: "Low Stock", sub: "Needs restock", value: lowStockProducts },
                { key: "out", label: "Out Of Stock", sub: "Unavailable", value: outOfStockProducts },
              ].map((item) => {
                const percentage = totalProducts
                  ? Math.round((item.value / totalProducts) * 100)
                  : 0;
                const height = Math.max(
                  item.value > 0 ? 10 : 0,
                  (item.value / maxInventoryCount) * 100
                );

                return (
                  <div className="ss-stock-bar-item" key={item.key}>
                    <div className="ss-stock-track">
                      <div
                        className={`ss-stock-fill ${item.key}`}
                        style={{ height: `${height}%` }}
                      >
                        {item.value > 0 && (
                          <span className="ss-stock-badge">↗ {percentage}%</span>
                        )}
                      </div>
                    </div>
                    <strong>{item.label}</strong>
                    <span>{item.sub}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* NEEDS ATTENTION */}
        <div className="ss-card ss-attention-card">
          <div className="ss-card-header">
            <div className="ss-card-title-wrap">
              <div className="ss-section-icon"><AlertTriangle size={18} /></div>
              <div>
                <h2>Needs Attention</h2>
                <p>Actions that protect availability.</p>
              </div>
            </div>
            <div className="ss-header-control">Focus <span>⌄</span></div>
          </div>

          <div className="ss-attention-title">Needs Action</div>
          <div className="ss-attention-list">
            <div className="ss-attention-row">
              <span><Boxes size={14} /> In Stock</span>
              <strong>{inStockProducts}</strong>
            </div>
            <div className="ss-attention-row">
              <span><TrendingDown size={14} /> Low Stock</span>
              <strong>{lowStockProducts}</strong>
            </div>
            <div className="ss-attention-row">
              <span><AlertTriangle size={14} /> Out Of Stock</span>
              <strong>{outOfStockProducts}</strong>
            </div>
            <div className="ss-attention-row">
              <span><ShoppingCart size={14} /> Units Sold</span>
              <strong>{totalUnitsSold}</strong>
            </div>
            <div className="ss-attention-row">
              <span><IndianRupee size={14} /> Avg. Order</span>
              <strong>{money(averageOrderValue)}</strong>
            </div>
          </div>

          {attentionProducts.length > 0 && (
            <div className="ss-attention-products">
              {attentionProducts.slice(0, 3).map((product) => (
                <div className="ss-attention-product" key={product.id}>
                  <ProductThumb product={product} size={31} />
                  <div>
                    <strong>{product.name}</strong>
                    <span>{Number(product.stock || 0)} left · min {Number(product.minStock || 0)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* THREE PANELS */}
      <section className="ss-three-grid">
        {/* TOP SELLERS */}
        <div className="ss-card ss-list-card">
          <div className="ss-card-header">
            <div className="ss-card-title-wrap">
              <div className="ss-section-icon"><TrendingUp size={18} /></div>
              <div><h2>Top Sellers</h2></div>
            </div>
            <TrendingUp size={17} className="ss-orange-icon" />
          </div>

          <div className="ss-ranking-list">
            {topProducts.map((product, index) => (
              <div className="ss-ranking-row" key={product.id}>
                <span className="ss-rank">{index + 1}</span>
                <ProductThumb product={product} size={38} />
                <div className="ss-ranking-copy">
                  <strong>{product.name}</strong>
                  <span>{product.category || "Other"}</span>
                </div>
                <div className="ss-ranking-value">
                  <strong>{Number(product.sold30 || 0)}</strong>
                  <span>sold</span>
                </div>
              </div>
            ))}
            {!topProducts.length && <div className="ss-empty">No products available.</div>}
          </div>
        </div>

        {/* LOW SALES */}
        <div className="ss-card ss-list-card">
          <div className="ss-card-header">
            <div className="ss-card-title-wrap">
              <div className="ss-section-icon"><TrendingDown size={18} /></div>
              <div><h2>Low Sales</h2><p>Stock that may need review.</p></div>
            </div>
            <TrendingDown size={17} className="ss-orange-icon" />
          </div>

          <div className="ss-ranking-list">
            {lowSalesProducts.map((product, index) => (
              <div className="ss-ranking-row" key={product.id}>
                <span className="ss-rank muted">{index + 1}</span>
                <ProductThumb product={product} size={38} />
                <div className="ss-ranking-copy">
                  <strong>{product.name}</strong>
                  <span>{Number(product.stock || 0)} units in stock</span>
                </div>
                <div className="ss-ranking-value">
                  <strong>{Number(product.sold30 || 0)}</strong>
                  <span>sold</span>
                </div>
              </div>
            ))}
            {!lowSalesProducts.length && <div className="ss-empty">No products available.</div>}
          </div>
        </div>

        {/* CATEGORY PERFORMANCE */}
        <div className="ss-card ss-list-card">
          <div className="ss-card-header">
            <div className="ss-card-title-wrap">
              <div className="ss-section-icon"><BarChart3 size={18} /></div>
              <div><h2>Category Performance</h2><p>Unit movement by category.</p></div>
            </div>
            <BarChart3 size={17} className="ss-orange-icon" />
          </div>

          <div className="ss-category-list">
            {categories.map((category) => (
              <div className="ss-category-row" key={category.name}>
                <div className="ss-category-top">
                  <strong>{category.name}</strong>
                  <span>{category.units} units</span>
                </div>
                <div className="ss-category-track">
                  <div
                    className="ss-category-fill"
                    style={{ width: `${(category.units / maxCategoryUnits) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {!categories.length && <div className="ss-empty">No category data.</div>}
          </div>
        </div>
      </section>

      {/* RECENT ORDERS + ACTIVITY */}
      <section className="ss-bottom-grid">
        <div className="ss-card ss-bottom-card">
          <div className="ss-card-header">
            <div className="ss-card-title-wrap">
              <div className="ss-section-icon"><ClipboardList size={18} /></div>
              <div><h2>Recent Orders</h2><p>Latest completed sales.</p></div>
            </div>
            <ClipboardList size={17} className="ss-orange-icon" />
          </div>

          <div className="ss-orders-list">
            {safeOrders.slice(0, 5).map((order) => {
              const product = safeProducts.find(
                (item) => Number(item.id) === Number(order.productId)
              );
              return (
                <div className="ss-order-row" key={order.id}>
                  <ProductThumb product={product} size={39} />
                  <div className="ss-order-copy">
                    <strong>{order.productName}</strong>
                    <span>{order.id} · {order.quantity} units</span>
                  </div>
                  <div className="ss-order-money">
                    <strong>{money(order.total)}</strong>
                    <span>+{money(order.profit)} profit</span>
                  </div>
                  <time>{order.date}</time>
                </div>
              );
            })}
            {!safeOrders.length && <div className="ss-empty">No sales recorded yet.</div>}
          </div>
        </div>

        <div className="ss-card ss-bottom-card">
          <div className="ss-card-header">
            <div className="ss-card-title-wrap">
              <div className="ss-section-icon"><Package size={18} /></div>
              <div><h2>Recent Activity</h2><p>Inventory events in chronological order.</p></div>
            </div>
            <Package size={17} className="ss-orange-icon" />
          </div>

          <div className="ss-activity-list">
            {safeActivities.slice(0, 6).map((activity) => (
              <div className="ss-activity-row" key={activity.id}>
                <span className={`ss-activity-dot ${activity.type || "info"}`} />
                <div>
                  <strong>{activity.message}</strong>
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
            {!safeActivities.length && <div className="ss-empty">No activity yet.</div>}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
