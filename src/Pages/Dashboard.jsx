import {
  Package,
  ShoppingCart,
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  ClipboardList,
  Boxes,
} from "lucide-react";

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


  /* -----------------------------
     CALCULATIONS
  ----------------------------- */

  const totalProducts = safeProducts.length;


  const totalStock = safeProducts.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  );


  const totalUnitsSold = safeProducts.reduce(
    (total, product) =>
      total + Number(product.sold30 || 0),
    0
  );


  const inventoryValue = safeProducts.reduce(
    (total, product) =>
      total +
      Number(product.costPrice || 0) *
      Number(product.stock || 0),
    0
  );


  const totalRevenue = safeOrders.reduce(
    (total, order) =>
      total + Number(order.total || 0),
    0
  );


  const lowStockProducts = safeProducts.filter(
    (product) =>
      Number(product.stock || 0) <
      Number(product.minStock || 0)
  );


  const topProducts = [...safeProducts]
    .sort(
      (a, b) =>
        Number(b.sold30 || 0) -
        Number(a.sold30 || 0)
    )
    .slice(0, 5);


  const formatMoney = (value) =>
    `₹${Number(value).toLocaleString("en-IN")}`;


  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <h1>Inventory at a Glance</h1>

          <p>
            Track your stock, sales, orders and
            inventory performance from one place.
          </p>

        </div>

      </div>


      {/* SUMMARY */}

      <div className="dashboard-stats">

        <div className="stat-card">

          <div className="stat-icon">
            <Package size={22} />
          </div>

          <div>
            <span>Total Products</span>

            <strong>
              {totalProducts}
            </strong>

            <small>
              Products currently managed
            </small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <Boxes size={22} />
          </div>

          <div>
            <span>Stock Units</span>

            <strong>
              {totalStock}
            </strong>

            <small>
              Units currently available
            </small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <ShoppingCart size={22} />
          </div>

          <div>
            <span>Units Sold</span>

            <strong>
              {totalUnitsSold}
            </strong>

            <small>
              Sales recorded in 30 days
            </small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <IndianRupee size={22} />
          </div>

          <div>
            <span>Inventory Value</span>

            <strong>
              {formatMoney(inventoryValue)}
            </strong>

            <small>
              Current stock cost value
            </small>
          </div>

        </div>

      </div>


      {/* SECOND ROW */}

      <div className="dashboard-stats">

        <div className="stat-card">

          <div className="stat-icon">
            <IndianRupee size={22} />
          </div>

          <div>
            <span>Sales Revenue</span>

            <strong>
              {formatMoney(totalRevenue)}
            </strong>

            <small>
              Revenue from recorded orders
            </small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <ClipboardList size={22} />
          </div>

          <div>
            <span>Total Orders</span>

            <strong>
              {safeOrders.length}
            </strong>

            <small>
              Orders recorded
            </small>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <AlertTriangle size={22} />
          </div>

          <div>
            <span>Restocking Required</span>

            <strong>
              {lowStockProducts.length}
            </strong>

            <small>
              Products below minimum level
            </small>
          </div>

        </div>

      </div>


      {/* MAIN GRID */}

      <div className="dashboard-grid">


        {/* TOP SELLERS */}

        <div className="dashboard-panel">

          <div className="panel-heading">

            <div>

              <h2>Top Selling Products</h2>

              <p>
                Products generating the most recent sales.
              </p>

            </div>

            <TrendingUp size={22} />

          </div>


          <div className="dashboard-list">

            {topProducts.length === 0 ? (

              <p>No sales data available.</p>

            ) : (

              topProducts.map(
                (product, index) => (

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
                        units sold
                      </span>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </div>


        {/* LOW STOCK */}

        <div className="dashboard-panel">

          <div className="panel-heading">

            <div>

              <h2>Restocking Required</h2>

              <p>
                Products that need your attention.
              </p>

            </div>

            <AlertTriangle size={22} />

          </div>


          <div className="dashboard-list">

            {lowStockProducts.length === 0 ? (

              <div className="empty-analysis">

                <Package size={30} />

                <strong>
                  Inventory levels are healthy
                </strong>

                <p>
                  No products need restocking.
                </p>

              </div>

            ) : (

              lowStockProducts
                .slice(0, 5)
                .map((product) => (

                  <div
                    className="dashboard-list-row"
                    key={product.id}
                  >

                    <div className="dashboard-product-icon">
                      <AlertTriangle size={18} />
                    </div>

                    <div>

                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        Minimum: {product.minStock}
                      </span>

                    </div>

                    <div className="list-value">

                      <strong>
                        {product.stock}
                      </strong>

                      <span>
                        units left
                      </span>

                    </div>

                  </div>

                ))

            )}

          </div>

        </div>

      </div>


      {/* RECENT ACTIVITY */}

      <div className="dashboard-panel">

        <div className="panel-heading">

          <div>

            <h2>Recent Inventory Activity</h2>

            <p>
              Latest sales, stock and inventory updates.
            </p>

          </div>

        </div>


        <div className="activity-list">

          {safeActivities.length === 0 ? (

            <p>
              No recent activity.
            </p>

          ) : (

            safeActivities
              .slice(0, 6)
              .map((activity) => (

                <div
                  className="activity-row"
                  key={activity.id}
                >

                  <div className="activity-dot" />

                  <div>

                    <strong>
                      {activity.message}
                    </strong>

                    <span>
                      {activity.time}
                    </span>

                  </div>

                </div>

              ))

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;