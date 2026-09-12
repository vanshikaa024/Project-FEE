import { useState } from "react";

import {
  AlertTriangle,
  Package,
  Plus,
  CheckCircle,
} 
from "lucide-react";

function LowStock({ products, onRestock }) {
  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [quantity, setQuantity] = useState(1);

  const [message, setMessage] = useState("");

  const lowStock = products.filter(
    (product) => product.stock < product.minStock
  );

  const handleRestock = () => {
    if (!selectedProduct) return;

    onRestock(
      selectedProduct.id,
      Number(quantity)
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
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            INVENTORY CONTROL
          </p>

          <h1>Restocking Required</h1>

          <p className="page-subtitle">
            Products that have fallen below their
            minimum inventory level.
          </p>
        </div>
      </div>

      <section className="alert-banner">
        <AlertTriangle size={22} />

        <div>
          <strong>
            {lowStock.length} products need attention
          </strong>

          <p>
            Restock these products before they become
            unavailable for customers.
          </p>
        </div>
      </section>

      <div className="stock-grid">
        {lowStock.map((product) => {
          const shortage = Math.max(
            product.minStock - product.stock,
            0
          );

          const percentage =
            product.minStock === 0
              ? 100
              : Math.min(
                  (product.stock /
                    product.minStock) *
                    100,
                  100
                );

          return (
            <div
              className="stock-card"
              key={product.id}
            >
              <div className="stock-card-top">
                <div className="product-icon large">
                  <Package size={21} />
                </div>

                <span
                  className={
                    product.stock === 0
                      ? "critical-badge"
                      : "warning-badge"
                  }
                >
                  {product.stock === 0
                    ? "Critical"
                    : "Low Stock"}
                </span>
              </div>

              <h3>{product.name}</h3>

              <p>{product.category}</p>

              <div className="stock-numbers">
                <div>
                  <span>Available</span>
                  <strong>{product.stock}</strong>
                </div>

                <div>
                  <span>Minimum</span>
                  <strong>{product.minStock}</strong>
                </div>

                <div>
                  <span>Shortage</span>
                  <strong>{shortage}</strong>
                </div>
              </div>

              <div className="stock-progress">
                <div
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>

              <button
                className="primary-btn full-btn"
                onClick={() =>
                  setSelectedProduct(product)
                }
              >
                <Plus size={18} />
                Restock Product
              </button>
            </div>
          );
        })}
      </div>

      {lowStock.length === 0 && (
        <div className="empty-state large-empty">
          <CheckCircle size={38} />
          <h3>Stock levels look healthy</h3>
          <p>
            No products are currently below their
            minimum stock level.
          </p>
        </div>
      )}

      {selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Restock Product</h2>

            <p>
              Add units to{" "}
              <strong>{selectedProduct.name}</strong>.
            </p>

            <div className="restock-summary">
              <span>Current stock</span>
              <strong>
                {selectedProduct.stock}
              </strong>
            </div>

            <div className="form-group">
              <label>Quantity to Add</label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
              />
            </div>

            <div className="restock-summary">
              <span>New stock</span>

              <strong>
                {selectedProduct.stock +
                  Number(quantity)}
              </strong>
            </div>

            {message && (
              <div className="success-message">
                <CheckCircle size={18} />
                {message}
              </div>
            )}

            <div className="modal-actions">
              <button
                className="secondary-btn"
                onClick={() =>
                  setSelectedProduct(null)
                }
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