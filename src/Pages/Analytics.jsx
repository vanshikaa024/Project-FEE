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

function Analytics({
  products = [],
  orders = [],
}) {

  const safeProducts = Array.isArray(products)
    ? products
    : [];

  const safeOrders = Array.isArray(orders)
    ? orders
    : [];


  /* --------------------------------
     BASIC CALCULATIONS
  -------------------------------- */

  const totalProducts =
    safeProducts.length;


  const totalStock =
    safeProducts.reduce(
      (total, product) =>
        total + Number(product.stock || 0),
      0
    );


  const totalSalesUnits =
    safeProducts.reduce(
      (total, product) =>
        total + Number(product.sold30 || 0),
      0
    );


  const totalInventoryValue =
    safeProducts.reduce(
      (total, product) =>
        total +
        Number(product.costPrice || 0) *
        Number(product.stock || 0),
      0
    );


  const totalRevenue =
    safeOrders.reduce(
      (total, order) =>
        total + Number(order.total || 0),
      0
    );


  const lowStockProducts =
    safeProducts.filter(
      (product) =>
        Number(product.stock || 0) <
        Number(product.minStock || 0)
    );


  /* --------------------------------
     FAST MOVING
  -------------------------------- */

  const fastMoving = useMemo(() => {

    return [...safeProducts]
      .sort(
        (a, b) =>
          Number(b.sold30 || 0) -
          Number(a.sold30 || 0)
      )
      .slice(0, 5);

  }, [safeProducts]);


  /* --------------------------------
     SLOW MOVING
  -------------------------------- */

  const slowMoving = useMemo(() => {

    return [...safeProducts]
      .sort(
        (a, b) =>
          Number(a.sold30 || 0) -
          Number(b.sold30 || 0)
      )
      .slice(0, 5);

  }, [safeProducts]);


  /* --------------------------------
     CATEGORY SALES
  -------------------------------- */

  const categorySales = useMemo(() => {

    const data = {};

    safeProducts.forEach(
      (product) => {

        if (!data[product.category]) {
          data[product.category] = 0;
        }

        data[product.category] +=
          Number(product.sold30 || 0);
      }
    );


    return Object.entries(data)
      .sort(
        (a, b) => b[1] - a[1]
      );

  }, [safeProducts]);


  const formatMoney = (value) =>
    `₹${Number(value).toLocaleString("en-IN")}`;


  /* --------------------------------
     GRAPH DATA
  -------------------------------- */

  const graphData = useMemo(() => {

    if (safeOrders.length === 0) {

      return [
        {
          label: "Current",
          value: totalSalesUnits,
        },
      ];

    }


    const recentOrders =
      safeOrders
        .slice(0, 6)
        .reverse();


    return recentOrders.map(
      (order, index) => ({

        label:
          `Sale ${index + 1}`,

        value:
          Number(order.quantity || 0),

      })
    );

  }, [safeOrders, totalSalesUnits]);


  const maxGraphValue =
    Math.max(
      ...graphData.map(
        (item) => item.value
      ),
      1
    );


  return (
    <div className="analytics-page">


      {/* HEADER */}

      <div className="page-header">

        <div>

          <h1>
            Business Performance
          </h1>

          <p>
            Understand your sales performance,
            inventory movement and restocking needs.
          </p>

        </div>

      </div>


      {/* SUMMARY */}

      <div className="analytics-summary">

        <div className="analytics-card">

          <div className="analytics-card-icon">
            <Package size={22} />
          </div>

          <div>

            <span>
              Total Products
            </span>

            <strong>
              {totalProducts}
            </strong>

            <small>
              Products currently managed
            </small>

          </div>

        </div>


        <div className="analytics-card">

          <div className="analytics-card-icon">
            <ShoppingCart size={22} />
          </div>

          <div>

            <span>
              Units Sold
            </span>

            <strong>
              {totalSalesUnits}
            </strong>

            <small>
              Units sold in last 30 days
            </small>

          </div>

        </div>


        <div className="analytics-card">

          <div className="analytics-card-icon">
            <IndianRupee size={22} />
          </div>

          <div>

            <span>
              Inventory Value
            </span>

            <strong>
              {formatMoney(
                totalInventoryValue
              )}
            </strong>

            <small>
              Based on current stock cost
            </small>

          </div>

        </div>


        <div className="analytics-card">

          <div className="analytics-card-icon">
            <AlertTriangle size={22} />
          </div>

          <div>

            <span>
              Products Needing Attention
            </span>

            <strong>
              {lowStockProducts.length}
            </strong>

            <small>
              Below minimum stock level
            </small>

          </div>

        </div>

      </div>


      {/* REVENUE */}

      <div className="analytics-panel">

        <div className="panel-heading">

          <div>

            <h2>
              Overall Sales Activity
            </h2>

            <p>
              Units sold through your recorded orders.
            </p>

          </div>

          <div className="sales-total">

            <IndianRupee size={18} />

            {formatMoney(totalRevenue)}

          </div>

        </div>


        <div className="sales-chart">

          <div className="chart-y-axis">

            <span>
              {maxGraphValue}
            </span>

            <span>
              {Math.round(
                maxGraphValue / 2
              )}
            </span>

            <span>
              0
            </span>

          </div>


          <div className="chart-area">

            <div className="chart-grid-line" />
            <div className="chart-grid-line" />
            <div className="chart-grid-line" />


            <div className="chart-bars">

              {graphData.map(
                (item, index) => {

                  const height =
                    Math.max(
                      (item.value /
                        maxGraphValue) *
                        100,
                      5
                    );


                  return (

                    <div
                      className="chart-column"
                      key={index}
                    >

                      <div
                        className="chart-value"
                      >
                        {item.value}
                      </div>

                      <div
                        className="chart-bar"
                        style={{
                          height:
                            `${height}%`,
                        }}
                      />

                      <span>
                        {item.label}
                      </span>

                    </div>

                  );

                }
              )}

            </div>

          </div>

        </div>

      </div>


      {/* FAST / SLOW */}

      <div className="analytics-grid">


        <div className="analytics-panel">

          <div className="panel-heading">

            <div>

              <h2>
                Top Selling Products
              </h2>

              <p>
                Products with the highest sales.
              </p>

            </div>

            <TrendingUp size={24} />

          </div>


          <div className="movement-list">

            {fastMoving.map(
              (product, index) => (

                <div
                  className="movement-row"
                  key={product.id}
                >

                  <div className="rank">
                    {index + 1}
                  </div>

                  <div className="movement-info">

                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      {product.category}
                    </span>

                  </div>

                  <div className="movement-sales">

                    <strong>
                      {product.sold30 || 0}
                    </strong>

                    <span>
                      units sold
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        </div>


        <div className="analytics-panel">

          <div className="panel-heading">

            <div>

              <h2>
                Products With Low Sales
              </h2>

              <p>
                Products that may need promotion.
              </p>

            </div>

            <TrendingDown size={24} />

          </div>


          <div className="movement-list">

            {slowMoving.map(
              (product, index) => (

                <div
                  className="movement-row"
                  key={product.id}
                >

                  <div className="rank">
                    {index + 1}
                  </div>

                  <div className="movement-info">

                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      {product.category}
                    </span>

                  </div>

                  <div className="movement-sales">

                    <strong>
                      {product.sold30 || 0}
                    </strong>

                    <span>
                      units sold
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>


      {/* CATEGORY */}

      <div className="analytics-panel">

        <div className="panel-heading">

          <div>

            <h2>
              Sales Performance by Category
            </h2>

            <p>
              Which product categories are selling the most.
            </p>

          </div>

          <BarChart3 size={24} />

        </div>


        <div className="category-list">

          {categorySales.map(
            ([category, sales]) => {

              const maxSales =
                categorySales[0]?.[1] || 1;

              const percentage =
                (sales / maxSales) * 100;


              return (

                <div
                  className="category-item"
                  key={category}
                >

                  <div className="category-top">

                    <strong>
                      {category}
                    </strong>

                    <span>
                      {sales} units sold
                    </span>

                  </div>


                  <div className="category-bar">

                    <div
                      className="category-bar-fill"
                      style={{
                        width:
                          `${percentage}%`,
                      }}
                    />

                  </div>

                </div>

              );

            }
          )}

        </div>

      </div>


      {/* LOW STOCK */}

      <div className="analytics-panel">

        <div className="panel-heading">

          <div>

            <h2>
              Inventory Replenishment Needs
            </h2>

            <p>
              Products below their minimum stock level.
            </p>

          </div>

          <AlertTriangle size={24} />

        </div>


        {lowStockProducts.length === 0 ? (

          <div className="empty-analysis">

            <Package size={30} />

            <strong>
              Inventory levels are healthy
            </strong>

            <p>
              No products currently require replenishment.
            </p>

          </div>

        ) : (

          <div className="attention-list">

            {lowStockProducts.map(
              (product) => (

                <div
                  className="attention-row"
                  key={product.id}
                >

                  <div>

                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      Minimum required:
                      {" "}
                      {product.minStock}
                      {" "}units
                    </span>

                  </div>


                  <div className="attention-stock">

                    <strong>
                      {product.stock}
                    </strong>

                    <span>
                      units left
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Analytics;