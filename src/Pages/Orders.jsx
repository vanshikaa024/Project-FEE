import { useState } from "react";
import {
  ShoppingCart,
  Package,
  IndianRupee,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

function Orders({
  products = [],
  orders = [],
  createOrder,
}) {

  const [selectedProduct, setSelectedProduct] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");


  const safeProducts = Array.isArray(products)
    ? products
    : [];

  const safeOrders = Array.isArray(orders)
    ? orders
    : [];


  const selected = safeProducts.find(
    (product) =>
      product.id === Number(selectedProduct)
  );


  const handleSubmit = (e) => {

    e.preventDefault();

    setMessage("");

    if (!selectedProduct) {

      setMessage("Please select a product.");

      setMessageType("error");

      return;
    }


    const result = createOrder(
      selectedProduct,
      quantity
    );


    if (result?.success) {

      setMessage(
        "Order created successfully! Stock and sales have been updated."
      );

      setMessageType("success");

      setSelectedProduct("");

      setQuantity(1);

    } else {

      setMessage(
        result?.message ||
        "Unable to create order."
      );

      setMessageType("error");
    }
  };


  const totalRevenue = safeOrders.reduce(
    (total, order) =>
      total + Number(order.total || 0),
    0
  );


  const totalUnitsSold = safeOrders.reduce(
    (total, order) =>
      total + Number(order.quantity || 0),
    0
  );


  return (
    <div className="orders-page">


      {/* HEADER */}

      <div className="page-header">

        <div>

          <h1>Sales & Orders</h1>

          <p>
            Record sales, update stock automatically
            and track your order history.
          </p>

        </div>

      </div>


      {/* SUMMARY */}

      <div className="dashboard-stats">

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
            <ShoppingCart size={22} />
          </div>

          <div>

            <span>Units Sold</span>

            <strong>
              {totalUnitsSold}
            </strong>

            <small>
              Units sold through orders
            </small>

          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <IndianRupee size={22} />
          </div>

          <div>

            <span>Total Revenue</span>

            <strong>
              ₹{totalRevenue.toLocaleString("en-IN")}
            </strong>

            <small>
              Revenue from orders
            </small>

          </div>

        </div>

      </div>


      {/* CREATE ORDER */}

      <div className="order-create-panel">

        <div className="panel-heading">

          <div>

            <h2>Record a New Sale</h2>

            <p>
              Select a product and quantity to record
              a sale.
            </p>

          </div>

          <ShoppingCart size={24} />

        </div>


        <form
          className="order-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>
              Product
            </label>

            <select
              value={selectedProduct}
              onChange={(e) =>
                setSelectedProduct(e.target.value)
              }
            >

              <option value="">
                Select product
              </option>

              {safeProducts.map(
                (product) => (

                  <option
                    key={product.id}
                    value={product.id}
                    disabled={
                      Number(product.stock) <= 0
                    }
                  >

                    {product.name} —
                    Stock: {product.stock}

                  </option>

                )
              )}

            </select>

          </div>


          <div className="form-group">

            <label>
              Quantity Sold
            </label>

            <input
              type="number"
              min="1"
              max={selected?.stock || 1}
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
            />

          </div>


          {selected && (

            <div className="selected-product-info">

              <Package size={20} />

              <div>

                <strong>
                  {selected.name}
                </strong>

                <span>
                  ₹{Number(
                    selected.price
                  ).toLocaleString("en-IN")} per unit
                  {" • "}
                  {selected.stock} available
                </span>

              </div>

            </div>

          )}


          <button
            className="primary-btn"
            type="submit"
          >

          <ShoppingCart size={18} />
             Record Sale
          </button>

        </form>


        {message && (

          <div
            className={
              messageType === "success"
                ? "success-message"
                : "error-message"
            }
          >

            {messageType === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertTriangle size={18} />
            )}

            {message}

          </div>

        )}

      </div>


      {/* ORDER HISTORY */}

      <div className="analytics-panel">

        <div className="panel-heading">

          <div>

            <h2>Order History</h2>

            <p>
              Recent sales recorded in SmartShelf.
            </p>

          </div>

          <ClipboardList size={24} />

        </div>


        {safeOrders.length === 0 ? (

          <div className="empty-analysis">

            <ShoppingCart size={32} />

            <strong>
              No orders yet
            </strong>

            <p>
              Record your first sale above.
            </p>

          </div>

        ) : (

          <div className="orders-table">

            <div className="orders-table-header">

              <span>Order</span>
              <span>Product</span>
              <span>Quantity</span>
              <span>Total</span>
              <span>Date</span>

            </div>


            {safeOrders.map(
              (order) => (

                <div
                  className="orders-table-row"
                  key={order.id}
                >

                  <strong>
                    {order.id}
                  </strong>

                  <span>
                    {order.productName}
                  </span>

                  <span>
                    {order.quantity}
                  </span>

                  <strong>
                    ₹{Number(
                      order.total || 0
                    ).toLocaleString("en-IN")}
                  </strong>

                  <span>
                    {order.date}
                  </span>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Orders;