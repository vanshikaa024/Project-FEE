import {
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  BarChart3,
  Boxes,
  IndianRupee,
  Package,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

function Analytics({
  products = [],
  orders = [],
}) {
  const [range, setRange] =
    useState("30");

  const safeProducts =
    Array.isArray(products)
      ? products
      : [];

  const safeOrders =
    Array.isArray(orders)
      ? orders
      : [];

  const totalStock =
    safeProducts.reduce(
      (s, p) =>
        s + Number(p.stock || 0),
      0
    );

  const inventoryValue =
    safeProducts.reduce(
      (s, p) =>
        s +
        Number(p.costPrice || 0) *
          Number(p.stock || 0),
      0
    );

  const revenue =
    safeOrders.reduce(
      (s, o) =>
        s + Number(o.total || 0),
      0
    );

  const cost =
    safeOrders.reduce(
      (s, o) =>
        s + Number(o.costTotal || 0),
      0
    );

  const profit =
    revenue - cost;

  const margin =
    revenue
      ? (profit / revenue) * 100
      : 0;

  const lowStock =
    safeProducts.filter(
      (p) =>
        Number(p.stock || 0) <
        Number(p.minStock || 0)
    );

  const categories = useMemo(
    () =>
      Object.values(
        safeProducts.reduce(
          (acc, p) => {

            const key =
              p.category ||
              "Other";

            if (!acc[key]) {
              acc[key] = {
                name: key,
                units: 0,
                revenue: 0,
                profit: 0,
                inventory: 0,
              };
            }

            acc[key].units +=
              Number(
                p.sold30 || 0
              );

            acc[key].revenue +=
              Number(
                p.price || 0
              ) *
              Number(
                p.sold30 || 0
              );

            acc[key].profit +=
              (
                Number(
                  p.price || 0
                ) -
                Number(
                  p.costPrice || 0
                )
              ) *
              Number(
                p.sold30 || 0
              );

            acc[key].inventory +=
              Number(
                p.costPrice || 0
              ) *
              Number(
                p.stock || 0
              );

            return acc;
          },
          {}
        )
      ).sort(
        (a, b) =>
          b.revenue - a.revenue
      ),

    [safeProducts]
  );

  const fast =
    [...safeProducts]
      .sort(
        (a, b) =>
          Number(b.sold30 || 0) -
          Number(a.sold30 || 0)
      )
      .slice(0, 6);

  const slow =
    [...safeProducts]
      .sort(
        (a, b) =>
          Number(a.sold30 || 0) -
          Number(b.sold30 || 0)
      )
      .slice(0, 6);

  const turnover =
    inventoryValue
      ? cost / inventoryValue
      : 0;

  const graph =
    safeOrders
      .slice(
        0,
        Number(range) === 7
          ? 7
          : Number(range) === 30
          ? 10
          : 12
      )
      .reverse();

  const maxGraph =
    Math.max(
      ...graph.map(
        (o) =>
          Number(o.total || 0)
      ),
      1
    );

  return (
    <div className="analytics-page">

      <div className="page-header">

        <div>

          <p className="eyebrow">
            BUSINESS ANALYTICS
          </p>

          <h1>
            Performance & Inventory
            Insights
          </h1>

          <p>
            Use sales, margin and stock
            movement to decide what to
            sell, reorder and review.
          </p>

        </div>

        <div className="range-switcher">

          {["7", "30", "90"].map(
            (item) => (

              <button
                key={item}
                className={
                  range === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setRange(item)
                }
              >
                {item}D
              </button>

            )
          )}

        </div>

      </div>

      <div className="analytics-summary">

        <div className="analytics-card">

          <div className="analytics-card-icon">
            <IndianRupee size={20} />
          </div>

          <span>
            Revenue
          </span>

          <strong>
            {money(revenue)}
          </strong>

          <small>
            Recorded sales
          </small>

        </div>

        <div className="analytics-card">

          <div className="analytics-card-icon">
            <TrendingUp size={20} />
          </div>

          <span>
            Gross Profit
          </span>

          <strong>
            {money(profit)}
          </strong>

          <small>
            {margin.toFixed(1)}%
            {" "}
            margin
          </small>

        </div>

        <div className="analytics-card">

          <div className="analytics-card-icon">
            <Boxes size={20} />
          </div>

          <span>
            Inventory Value
          </span>

          <strong>
            {money(inventoryValue)}
          </strong>

          <small>
            {totalStock}
            {" "}
            units on hand
          </small>

        </div>

        <div className="analytics-card">

          <div className="analytics-card-icon">
            <BarChart3 size={20} />
          </div>

          <span>
            Stock Turnover
          </span>

          <strong>
            {turnover.toFixed(1)}x
          </strong>

          <small>
            Based on recorded cost
          </small>

        </div>

      </div>

      <div className="analytics-panel analytics-revenue-panel">

        <div className="panel-heading">

          <div>
            <h2>
              Revenue Trend
            </h2>

            <p>
              Recorded order value over
              the selected window.
            </p>
          </div>

          <strong className="sales-total">
            {money(revenue)}
          </strong>

        </div>

        <div className="sales-chart enhanced-chart">

          {graph.length ? (

            graph.map(
              (order, i) => (

                <div
                  className="chart-column"
                  key={
                    order.id || i
                  }
                >

                  <div className="chart-value">
                    {money(
                      order.total
                    )}
                  </div>

                  <div
                    className="chart-bar"
                    style={{
                      height:
                        `${Math.max(
                          8,
                          (
                            Number(
                              order.total ||
                              0
                            ) /
                            maxGraph
                          ) *
                            100
                        )}%`,
                    }}
                  />

                  <span>
                    {i + 1}
                  </span>

                </div>

              )
            )

          ) : (

            <div className="empty-state">

              <p>
                Record sales to populate
                the revenue trend.
              </p>

            </div>

          )}

        </div>

      </div>

      <div className="analytics-grid">

        <div className="analytics-panel">

          <div className="panel-heading">

            <div>
              <h2>
                Category Performance
              </h2>

              <p>
                Revenue, profit and
                inventory exposure.
              </p>
            </div>

            <BarChart3 size={20} />

          </div>

          <div className="category-table">

            {categories.map(
              (c) => (

                <div
                  className="category-table-row"
                  key={c.name}
                >

                  <div>
                    <strong>
                      {c.name}
                    </strong>

                    <span>
                      {c.units}
                      {" "}
                      units sold
                    </span>
                  </div>

                  <div>
                    <strong>
                      {money(c.revenue)}
                    </strong>

                    <span>
                      revenue
                    </span>
                  </div>

                  <div>
                    <strong>
                      {money(c.profit)}
                    </strong>

                    <span>
                      profit
                    </span>
                  </div>

                  <div>
                    <strong>
                      {money(
                        c.inventory
                      )}
                    </strong>

                    <span>
                      inventory
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
                Replenishment Risk
              </h2>

              <p>
                Prioritize products with
                the highest stock pressure.
              </p>

            </div>

            <AlertTriangle size={20} />

          </div>

          <div className="attention-list">

            {lowStock
              .slice(0, 6)
              .map((p) => (

                <div
                  className="attention-row"
                  key={p.id}
                >

                  <div>

                    <strong>
                      {p.name}
                    </strong>

                    <span>
                      {p.stock}
                      {" "}
                      available · minimum{" "}
                      {p.minStock}
                    </span>

                  </div>

                  <div className="attention-stock">

                    <strong>
                      {Math.max(
                        p.minStock *
                          2 -
                          p.stock,

                        Math.ceil(
                          (p.sold30 ||
                            0) /
                            2
                        )
                      )}
                    </strong>

                    <span>
                      suggested order
                    </span>

                  </div>

                </div>

              ))}

            {!lowStock.length && (

              <div className="empty-state">

                <Package size={28} />

                <h3>
                  No replenishment risk
                </h3>

                <p>
                  All products are above
                  their minimum stock
                  level.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

      <div className="analytics-grid">

        <div className="analytics-panel">

          <div className="panel-heading">

            <div>
              <h2>
                Fast Moving
              </h2>

              <p>
                Protect availability for
                your strongest sellers.
              </p>
            </div>

            <TrendingUp size={20} />

          </div>

          <div className="movement-list">

            {fast.map(
              (p, i) => (

                <div
                  className="movement-row"
                  key={p.id}
                >

                  <div className="rank">
                    {i + 1}
                  </div>

                  <div className="movement-info">

                    <strong>
                      {p.name}
                    </strong>

                    <span>
                      {p.category}
                      {" · stock "}
                      {p.stock}
                    </span>

                  </div>

                  <div className="movement-sales">

                    <strong>
                      {p.sold30 || 0}
                    </strong>

                    <span>
                      units
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
                Slow Moving
              </h2>

              <p>
                Review products tying up
                inventory.
              </p>

            </div>

            <TrendingDown size={20} />

          </div>

          <div className="movement-list">

            {slow.map(
              (p, i) => (

                <div
                  className="movement-row"
                  key={p.id}
                >

                  <div className="rank">
                    {i + 1}
                  </div>

                  <div className="movement-info">

                    <strong>
                      {p.name}
                    </strong>

                    <span>
                      {p.category}
                      {" · "}
                      {p.stock}
                      {" "}
                      units held
                    </span>

                  </div>

                  <div className="movement-sales">

                    <strong>
                      {p.sold30 || 0}
                    </strong>

                    <span>
                      units
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;