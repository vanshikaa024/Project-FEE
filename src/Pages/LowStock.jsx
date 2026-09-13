import { useState } from "react";

import {
  AlertTriangle,
  Package,
  Plus,
  CheckCircle,
  Tag,
  Boxes,
  IndianRupee,
  ShoppingCart,
} from "lucide-react";

function LowStock({
  products = [],
  onRestock,
}) {
  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [quantity, setQuantity] = useState(1);

  const [message, setMessage] = useState("");

  /* =========================================
     LOW STOCK PRODUCTS
  ========================================= */

  const lowStock = products.filter(
    (product) =>
      Number(product.stock || 0) <
      Number(product.minStock || 0)
  );

  /* =========================================
     RESTOCK
  ========================================= */

  const handleRestock = () => {
    if (!selectedProduct) return;

    const amount = Number(quantity);

    if (!amount || amount < 1) {
      return;
    }

    onRestock(
      selectedProduct.id,
      amount
    );

    setMessage(
      `${selectedProduct.name} has been restocked.`
    );

    setTimeout(() => {
      setSelectedProduct(null);
      setMessage("");
      setQuantity(1);
    }, 800);
  };

  return (
    <main className="page low-stock-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            INVENTORY CONTROL
          </p>

          <h1>
            Restocking Required
          </h1>

          <p className="page-subtitle">
            Products that have fallen below their
            minimum inventory level.
          </p>

        </div>

      </div>


      {/* =========================================
          ALERT
      ========================================= */}

      <section className="alert-banner">

        <div className="alert-banner-icon">
          <AlertTriangle size={24} />
        </div>

        <div>

          <strong>
            {lowStock.length}{" "}
            {lowStock.length === 1
              ? "product"
              : "products"}{" "}
            need attention
          </strong>

          <p>
            Restock these products before they become
            unavailable for customers.
          </p>

        </div>

      </section>


      {/* =========================================
          LOW STOCK HEADING
      ========================================= */}

      {lowStock.length > 0 && (

        <div className="stock-section-heading">

          <div>

            <h2>
              Low Stock Products
            </h2>

            <p>
              These products are running low and
              need to be restocked soon.
            </p>

          </div>

        </div>

      )}


      {/* =========================================
          PRODUCT CARDS
      ========================================= */}

      {lowStock.length > 0 && (

        <div className="stock-grid">

          {lowStock.map((product) => {

            const stock =
              Number(product.stock || 0);

            const minimum =
              Number(product.minStock || 0);

            const shortage = Math.max(
              minimum - stock,
              0
            );

            const isOutOfStock =
              stock === 0;

            const percentage =
              minimum > 0
                ? Math.min(
                    (stock / minimum) * 100,
                    100
                  )
                : 0;

            return (

              <div
                className="stock-card"
                key={product.id}
              >

                {/* =================================
                    PRODUCT IMAGE
                ================================= */}

                <div className="stock-image-wrapper">

                  {product.image ? (

                    <img
                      src={product.image}
                      alt={product.name}
                      className="stock-product-image"

                      onError={(event) => {

                        event.currentTarget.style.display =
                          "none";

                        const fallback =
                          event.currentTarget
                            .nextElementSibling;

                        if (fallback) {
                          fallback.style.display =
                            "flex";
                        }

                      }}
                    />

                  ) : null}


                  {/* IMAGE FALLBACK */}

                  <div
                    className="stock-image-fallback"
                    style={{
                      display:
                        product.image
                          ? "none"
                          : "flex",
                    }}
                  >

                    <Package size={42} />

                  </div>


                  {/* STOCK BADGE */}

                  <span
                    className={
                      isOutOfStock
                        ? "stock-status-badge out"
                        : "stock-status-badge low"
                    }
                  >

                    <AlertTriangle size={12} />

                    {isOutOfStock
                      ? "Out of Stock"
                      : "Low Stock"}

                  </span>

                </div>


                {/* =================================
                    PRODUCT NAME
                ================================= */}

                <h3 className="stock-product-name">
                  {product.name}
                </h3>


                {/* =================================
                    CATEGORY
                ================================= */}

                <div className="stock-category">

                  <Tag size={14} />

                  <span>
                    {product.category ||
                      "Other"}
                  </span>

                </div>


                {/* =================================
                    STOCK INFORMATION
                ================================= */}

                <div className="stock-info">

                  <div className="stock-info-row">

                    <div className="stock-info-label">

                      <Boxes size={16} />

                      <span>
                        Current Stock
                      </span>

                    </div>

                    <strong
                      className={
                        isOutOfStock
                          ? "stock-danger"
                          : "stock-warning"
                      }
                    >
                      {stock}
                    </strong>

                  </div>


                  <div className="stock-info-row">

                    <div className="stock-info-label">

                      <Package size={16} />

                      <span>
                        Minimum Stock
                      </span>

                    </div>

                    <strong>
                      {minimum}
                    </strong>

                  </div>


                  <div className="stock-info-row">

                    <div className="stock-info-label">

                      <AlertTriangle size={16} />

                      <span>
                        Shortage
                      </span>

                    </div>

                    <strong className="stock-danger">
                      {shortage}
                    </strong>

                  </div>

                </div>


                {/* =================================
                    STOCK PROGRESS
                ================================= */}

                <div className="stock-progress-section">

                  <div className="stock-progress-label">

                    <span>
                      Stock level
                    </span>

                    <strong>
                      {Math.round(
                        percentage
                      )}%
                    </strong>

                  </div>

                  <div className="stock-progress">

                    <div
                      className={
                        isOutOfStock
                          ? "stock-progress-fill danger"
                          : "stock-progress-fill"
                      }
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>


                {/* =================================
                    BOTTOM PRICE + RESTOCK
                ================================= */}

                <div className="stock-card-footer">

                  <div className="stock-price">

                    <IndianRupee size={17} />

                    <strong>
                      {Number(
                        product.price || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>


                  <button
                    className={
                      isOutOfStock
                        ? "restock-btn critical"
                        : "restock-btn"
                    }

                    onClick={() => {

                      setSelectedProduct(
                        product
                      );

                      setQuantity(
                        Math.max(
                          shortage,
                          1
                        )
                      );

                      setMessage("");

                    }}
                  >

                    <ShoppingCart size={16} />

                    {isOutOfStock
                      ? "Restock Now"
                      : "Restock"}

                  </button>

                </div>

              </div>

            );

          })}

        </div>

      )}


      {/* =========================================
          HEALTHY INVENTORY
      ========================================= */}

      {lowStock.length === 0 && (

        <div className="empty-state large-empty">

          <CheckCircle size={38} />

          <h3>
            Stock levels look healthy
          </h3>

          <p>
            No products are currently below their
            minimum stock level.
          </p>

        </div>

      )}


      {/* =========================================
          RESTOCK MODAL
      ========================================= */}

      {selectedProduct && (

        <div className="modal-overlay">

          <div className="modal-card">

            <h2>
              Restock Product
            </h2>

            <p>
              Add units to{" "}
              <strong>
                {selectedProduct.name}
              </strong>
              .
            </p>


            {/* CURRENT STOCK */}

            <div className="restock-summary">

              <span>
                Current stock
              </span>

              <strong>
                {selectedProduct.stock}
              </strong>

            </div>


            {/* QUANTITY */}

            <div className="form-group">

              <label>
                Quantity to Add
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(event) =>
                  setQuantity(
                    event.target.value
                  )
                }
              />

            </div>


            {/* NEW STOCK */}

            <div className="restock-summary">

              <span>
                New stock
              </span>

              <strong>
                {Number(
                  selectedProduct.stock || 0
                ) +
                  Number(quantity || 0)}
              </strong>

            </div>


            {/* SUCCESS MESSAGE */}

            {message && (

              <div className="success-message">

                <CheckCircle size={18} />

                {message}

              </div>

            )}


            {/* ACTIONS */}

            <div className="modal-actions">

              <button
                className="secondary-btn"
                onClick={() => {

                  setSelectedProduct(null);
                  setQuantity(1);
                  setMessage("");

                }}
              >
                Cancel
              </button>


              <button
                className="primary-btn"
                onClick={handleRestock}
              >
                Confirm Restock
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default LowStock;