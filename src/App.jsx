import "./App.css";
import "./index.css";

import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router";

import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";

import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import AddProduct from "./Pages/AddProduct";
import LowStock from "./Pages/LowStock";
import Orders from "./Pages/Orders";
import Analytics from "./Pages/Analytics";
import Notifications from "./Pages/Notifications";

/* =====================================================
   DEFAULT PRODUCTS
   ===================================================== */

const defaultProducts = [
  {
    id: 1,
    name: "Wireless Mouse",
    category: "Electronics",
    price: 599,
    costPrice: 350,
    stock: 5,
    minStock: 10,
    sold30: 45,
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Keyboard",
    category: "Electronics",
    price: 999,
    costPrice: 650,
    stock: 25,
    minStock: 10,
    sold30: 38,
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "A4 Notebook",
    category: "Stationery",
    price: 80,
    costPrice: 45,
    stock: 7,
    minStock: 10,
    sold30: 24,
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "USB-C Cable",
    category: "Accessories",
    price: 299,
    costPrice: 160,
    stock: 14,
    minStock: 8,
    sold30: 32,
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Ergonomic Desk Chair",
    category: "Furniture",
    price: 7499,
    costPrice: 5200,
    stock: 12,
    minStock: 5,
    sold30: 6,
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Mechanical Pencil",
    category: "Stationery",
    price: 45,
    costPrice: 20,
    stock: 60,
    minStock: 15,
    sold30: 26,
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    name: "27-inch 4K Monitor",
    category: "Electronics",
    price: 18999,
    costPrice: 14500,
    stock: 8,
    minStock: 5,
    sold30: 12,
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    name: "Sticky Notes Pack",
    category: "Stationery",
    price: 120,
    costPrice: 65,
    stock: 48,
    minStock: 15,
    sold30: 18,
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1586282391129-76a6df230234?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 9,
    name: "Noise Cancelling Headphones",
    category: "Electronics",
    price: 4999,
    costPrice: 3200,
    stock: 12,
    minStock: 8,
    sold30: 28,
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 10,
    name: "Adjustable Laptop Stand",
    category: "Accessories",
    price: 1299,
    costPrice: 750,
    stock: 18,
    minStock: 8,
    sold30: 13,
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1616353071588-6f8f2f4d7f3a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 11,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 2199,
    costPrice: 1400,
    stock: 15,
    minStock: 7,
    sold30: 15,
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 12,
    name: "Desk Organizer",
    category: "Furniture",
    price: 899,
    costPrice: 500,
    stock: 35,
    minStock: 8,
    sold30: 9,
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80",
  },
];

/* =====================================================
   DEMO ORDER HELPER
   ===================================================== */

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =====================================================
   DEMO ORDERS
   These are historical sales.
   They DO NOT decrease current stock.
   ===================================================== */

const demoOrders = [
  {
    id: "ORD-1001",
    productId: 2,
    productName: "Keyboard",
    quantity: 2,
    price: 999,
    total: 1998,
    cost: 1300,
    profit: 698,
    status: "Completed",
    date: daysAgo(1),
  },
  {
    id: "ORD-1002",
    productId: 1,
    productName: "Wireless Mouse",
    quantity: 3,
    price: 599,
    total: 1797,
    cost: 1050,
    profit: 747,
    status: "Completed",
    date: daysAgo(2),
  },
  {
    id: "ORD-1003",
    productId: 4,
    productName: "USB-C Cable",
    quantity: 5,
    price: 299,
    total: 1495,
    cost: 800,
    profit: 695,
    status: "Completed",
    date: daysAgo(3),
  },
  {
    id: "ORD-1004",
    productId: 9,
    productName: "Noise Cancelling Headphones",
    quantity: 2,
    price: 4999,
    total: 9998,
    cost: 6400,
    profit: 3598,
    status: "Completed",
    date: daysAgo(4),
  },
  {
    id: "ORD-1005",
    productId: 7,
    productName: "27-inch 4K Monitor",
    quantity: 1,
    price: 18999,
    total: 18999,
    cost: 14500,
    profit: 4499,
    status: "Completed",
    date: daysAgo(5),
  },
  {
    id: "ORD-1006",
    productId: 6,
    productName: "Mechanical Pencil",
    quantity: 12,
    price: 45,
    total: 540,
    cost: 240,
    profit: 300,
    status: "Completed",
    date: daysAgo(7),
  },
  {
    id: "ORD-1007",
    productId: 11,
    productName: "Bluetooth Speaker",
    quantity: 3,
    price: 2199,
    total: 6597,
    cost: 4200,
    profit: 2397,
    status: "Completed",
    date: daysAgo(9),
  },
  {
    id: "ORD-1008",
    productId: 10,
    productName: "Adjustable Laptop Stand",
    quantity: 2,
    price: 1299,
    total: 2598,
    cost: 1500,
    profit: 1098,
    status: "Completed",
    date: daysAgo(12),
  },
  {
    id: "ORD-1009",
    productId: 3,
    productName: "A4 Notebook",
    quantity: 8,
    price: 80,
    total: 640,
    cost: 360,
    profit: 280,
    status: "Completed",
    date: daysAgo(15),
  },
  {
    id: "ORD-1010",
    productId: 5,
    productName: "Ergonomic Desk Chair",
    quantity: 1,
    price: 7499,
    total: 7499,
    cost: 5200,
    profit: 2299,
    status: "Completed",
    date: daysAgo(18),
  },
];

/* =====================================================
   DEMO ACTIVITIES
   ===================================================== */

const createDemoActivities = () => [
  {
    id: "activity-1",
    message: "Order ORD-1001 completed for Keyboard.",
    type: "success",
    time: daysAgo(1),
  },
  {
    id: "activity-2",
    message: "Wireless Mouse is below its minimum stock level.",
    type: "warning",
    time: daysAgo(2),
  },
  {
    id: "activity-3",
    message: "Order ORD-1004 completed for Noise Cancelling Headphones.",
    type: "success",
    time: daysAgo(4),
  },
  {
    id: "activity-4",
    message: "27-inch 4K Monitor sale recorded.",
    type: "success",
    time: daysAgo(5),
  },
  {
    id: "activity-5",
    message: "USB-C Cable stock requires attention.",
    type: "warning",
    time: daysAgo(3),
  },
];

/* =====================================================
   APP
   ===================================================== */

function App() {
  /* ===================================================
     LOGIN
     =================================================== */

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("smartshelf_user") !== null
  );

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("smartshelf_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  /* ===================================================
     PRODUCTS
     =================================================== */

  const [products, setProducts] = useState(() => {
    try {
      const savedProducts = localStorage.getItem("smartshelf_products");

      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }

      return defaultProducts;
    } catch {
      return defaultProducts;
    }
  });

  /* ===================================================
     ORDERS
     =================================================== */

  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem("smartshelf_orders");

      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }

      return demoOrders;
    } catch {
      return demoOrders;
    }
  });

  /* ===================================================
     ACTIVITIES
     =================================================== */

  const [activities, setActivities] = useState(() => {
    try {
      const savedActivities =
        localStorage.getItem("smartshelf_activities");

      if (savedActivities) {
        const parsed = JSON.parse(savedActivities);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }

      return createDemoActivities();
    } catch {
      return createDemoActivities();
    }
  });

  /* ===================================================
     SEARCH
     =================================================== */

  const [searchTerm, setSearchTerm] = useState("");

  /* ===================================================
     SIDEBAR
     =================================================== */

  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* ===================================================
     SAVE PRODUCTS
     =================================================== */

  useEffect(() => {
    localStorage.setItem(
      "smartshelf_products",
      JSON.stringify(products)
    );
  }, [products]);

  /* ===================================================
     SAVE ORDERS
     =================================================== */

  useEffect(() => {
    localStorage.setItem(
      "smartshelf_orders",
      JSON.stringify(orders)
    );
  }, [orders]);

  /* ===================================================
     SAVE ACTIVITIES
     =================================================== */

  useEffect(() => {
    localStorage.setItem(
      "smartshelf_activities",
      JSON.stringify(activities)
    );
  }, [activities]);

  /* ===================================================
     LOGIN
     =================================================== */

  const handleLogin = (email) => {
    const userData = {
      name: "Manager",
      role: "Inventory Manager",
      email,
    };

    localStorage.setItem(
      "smartshelf_user",
      JSON.stringify(userData)
    );

    setUser(userData);
    setIsLoggedIn(true);
  };

  /* ===================================================
     LOGOUT
     =================================================== */

  const handleLogout = () => {
    localStorage.removeItem("smartshelf_user");

    setUser(null);
    setIsLoggedIn(false);
  };

  /* ===================================================
     ACTIVITY
     =================================================== */

  const addActivity = (message, type = "info") => {
    const newActivity = {
      id: Date.now(),
      message,
      type,
      time: new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    };

    setActivities((prev) => [
      newActivity,
      ...prev,
    ].slice(0, 30));
  };

  /* ===================================================
     ADD PRODUCT
     =================================================== */

  const handleAddProduct = (newProduct) => {
    const product = {
      ...newProduct,

      id: Date.now(),

      price: Number(newProduct.price || 0),

      costPrice: Number(
        newProduct.costPrice || 0
      ),

      stock: Number(
        newProduct.stock || 0
      ),

      minStock: Number(
        newProduct.minStock || 0
      ),

      sold30: Number(
        newProduct.sold30 || 0
      ),

      condition:
        newProduct.condition || "Good",

      image:
        newProduct.image || "",
    };

    setProducts((prev) => [
      product,
      ...prev,
    ]);

    addActivity(
      `${product.name} was added to the inventory.`,
      "success"
    );
  };

  /* ===================================================
     CREATE ORDER / RECORD SALE
     =================================================== */

  const createOrder = (
    productId,
    quantity
  ) => {
    const id = Number(productId);

    const product = products.find(
      (item) => Number(item.id) === id
    );

    const qty = Number(quantity);

    if (!product) {
      return {
        success: false,
        message: "Product not found.",
      };
    }

    if (!Number.isFinite(qty) || qty <= 0) {
      return {
        success: false,
        message: "Please enter a valid quantity.",
      };
    }

    if (qty > Number(product.stock)) {
      return {
        success: false,
        message:
          `Only ${product.stock} units are available.`,
      };
    }

    const total =
      Number(product.price) * qty;

    const cost =
      Number(product.costPrice || 0) * qty;

    const profit = total - cost;

    const orderNumber =
      1000 + orders.length + 1;

    const newOrder = {
      id: `ORD-${orderNumber}`,
      productId: product.id,
      productName: product.name,
      quantity: qty,
      price: Number(product.price),
      total,
      cost,
      profit,
      status: "Completed",
      date: new Date().toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ),
    };

    /* Update inventory */
    setProducts((prev) =>
      prev.map((item) => {
        if (Number(item.id) !== id) {
          return item;
        }

        return {
          ...item,
          stock:
            Number(item.stock) - qty,

          sold30:
            Number(item.sold30 || 0) + qty,
        };
      })
    );

    /* Add order */
    setOrders((prev) => [
      newOrder,
      ...prev,
    ]);

    /* Activity */
    addActivity(
      `${newOrder.id}: ${qty} × ${product.name} sold for ₹${total.toLocaleString("en-IN")}.`,
      "success"
    );

    /* Low stock warning */
    const remainingStock =
      Number(product.stock) - qty;

    if (
      remainingStock <
      Number(product.minStock)
    ) {
      addActivity(
        `${product.name} is now below its minimum stock level.`,
        "warning"
      );
    }

    return {
      success: true,
      order: newOrder,
    };
  };

  /* ===================================================
     RESTOCK
     =================================================== */

  const handleRestock = (
    productId,
    quantity
  ) => {
    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      return;
    }

    const product = products.find(
      (item) =>
        Number(item.id) ===
        Number(productId)
    );

    if (!product) {
      return;
    }

    setProducts((prev) =>
      prev.map((item) => {
        if (
          Number(item.id) !==
          Number(productId)
        ) {
          return item;
        }

        return {
          ...item,
          stock:
            Number(item.stock) + qty,
        };
      })
    );

    addActivity(
      `${product.name} was restocked with ${qty} units.`,
      "success"
    );
  };

  /* ===================================================
     INVENTORY REPORT
     =================================================== */

  const generateReport = () => {
    const totalStock =
      products.reduce(
        (total, product) =>
          total +
          Number(product.stock || 0),
        0
      );

    const totalSold =
      products.reduce(
        (total, product) =>
          total +
          Number(product.sold30 || 0),
        0
      );

    const inventoryValue =
      products.reduce(
        (total, product) =>
          total +
          Number(
            product.costPrice || 0
          ) *
            Number(
              product.stock || 0
            ),
        0
      );

    const totalRevenue =
      orders.reduce(
        (total, order) =>
          total +
          Number(order.total || 0),
        0
      );

    const totalProfit =
      orders.reduce(
        (total, order) =>
          total +
          Number(order.profit || 0),
        0
      );

    const lowStock =
      products.filter(
        (product) =>
          Number(product.stock || 0) <
          Number(product.minStock || 0)
      );

    let report = "";

    report +=
      "====================================\n";
    report +=
      "        SMARTSHELF INVENTORY REPORT\n";
    report +=
      "====================================\n\n";

    report +=
      `Generated: ${new Date().toLocaleString("en-IN")}\n\n`;

    report += "SUMMARY\n";
    report +=
      "------------------------------------\n";

    report +=
      `Total Products: ${products.length}\n`;

    report +=
      `Total Stock Units: ${totalStock}\n`;

    report +=
      `Units Sold (30 Days): ${totalSold}\n`;

    report +=
      `Inventory Value: ₹${inventoryValue.toLocaleString("en-IN")}\n`;

    report +=
      `Total Orders: ${orders.length}\n`;

    report +=
      `Sales Revenue: ₹${totalRevenue.toLocaleString("en-IN")}\n`;

    report +=
      `Gross Profit: ₹${totalProfit.toLocaleString("en-IN")}\n`;

    report +=
      `Products Needing Restock: ${lowStock.length}\n\n`;

    report += "LOW STOCK PRODUCTS\n";
    report +=
      "------------------------------------\n";

    lowStock.forEach((product) => {
      report +=
        `${product.name} - ${product.stock} units left (minimum ${product.minStock})\n`;
    });

    report += "\nORDER HISTORY\n";
    report +=
      "------------------------------------\n";

    orders.forEach((order) => {
      report +=
        `${order.id} | ${order.productName} | ${order.quantity} units | ₹${Number(order.total).toLocaleString("en-IN")} | ${order.date}\n`;
    });

    const blob = new Blob(
      [report],
      {
        type: "text/plain",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "SmartShelf_Inventory_Report.txt";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    addActivity(
      "Inventory report was generated.",
      "info"
    );
  };

  /* ===================================================
     LOGIN SCREEN
     =================================================== */

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={handleLogin}
      />
    );
  }

  /* ===================================================
     MAIN APPLICATION
     =================================================== */

  return (
    <BrowserRouter>
      <div className="app-layout">

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onGenerateReport={generateReport}
          onLogout={handleLogout}
        />

        <div
          className={
            sidebarOpen
              ? "main-area sidebar-open"
              : "main-area sidebar-closed"
          }
        >

          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={user}
            products={products}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <main className="page-content">

            <Routes>

              {/* DASHBOARD */}

              <Route
                path="/"
                element={
                  <Dashboard
                    products={products}
                    orders={orders}
                    activities={activities}
                  />
                }
              />

              {/* PRODUCTS */}

              <Route
                path="/products"
                element={
                  <Products
                    products={products}
                    searchTerm={searchTerm}
                  />
                }
              />

              {/* ADD PRODUCT */}

              <Route
                path="/add-product"
                element={
                  <AddProduct
                    onAddProduct={
                      handleAddProduct
                    }
                  />
                }
              />

              {/* LOW STOCK */}

              <Route
                path="/low-stock"
                element={
                  <LowStock
                    products={products}
                    onRestock={handleRestock}
                  />
                }
              />

              {/* ORDERS */}

              <Route
                path="/orders"
                element={
                  <Orders
                    products={products}
                    orders={orders}
                    createOrder={createOrder}
                  />
                }
              />

              {/* ANALYTICS */}

              <Route
                path="/analytics"
                element={
                  <Analytics
                    products={products}
                    orders={orders}
                  />
                }
              />

              {/* NOTIFICATIONS */}

              <Route
                path="/notifications"
                element={
                  <Notifications
                    activities={activities}
                    products={products}
                  />
                }
              />

              {/* FALLBACK */}

              <Route
                path="*"
                element={
                  <Navigate
                    to="/"
                    replace
                  />
                }
              />

            </Routes>

          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;