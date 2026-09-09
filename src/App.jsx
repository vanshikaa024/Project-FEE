import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
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

import "./App.css";


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
    condition: "Good"
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
    condition: "Good"
  },
  {
    id: 3,
    name: "A4 Notebook",
    category: "Stationery",
    price: 80,
    costPrice: 45,
    stock: 7,
    minStock: 10,
    sold30: 4,
    condition: "Good"
  },
  {
    id: 4,
    name: "USB-C Cable",
    category: "Accessories",
    price: 299,
    costPrice: 160,
    stock: 3,
    minStock: 8,
    sold30: 32,
    condition: "Good"
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
    condition: "Good"
  },
  {
    id: 6,
    name: "Mechanical Pencil",
    category: "Stationery",
    price: 45,
    costPrice: 20,
    stock: 40,
    minStock: 10,
    sold30: 26,
    condition: "Good"
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
    condition: "Good"
  },
  {
    id: 8,
    name: "Sticky Notes Pack",
    category: "Stationery",
    price: 120,
    costPrice: 65,
    stock: 60,
    minStock: 15,
    sold30: 18,
    condition: "Good"
  },
  {
    id: 9,
    name: "Noise Cancelling Headphones",
    category: "Electronics",
    price: 4999,
    costPrice: 3200,
    stock: 4,
    minStock: 8,
    sold30: 28,
    condition: "Good"
  },
  {
    id: 10,
    name: "Adjustable Laptop Stand",
    category: "Accessories",
    price: 1299,
    costPrice: 750,
    stock: 18,
    minStock: 8,
    sold30: 3,
    condition: "Good"
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
    condition: "Good"
  },
  {
    id: 12,
    name: "Desk Organizer",
    category: "Furniture",
    price: 899,
    costPrice: 500,
    stock: 35,
    minStock: 8,
    sold30: 2,
    condition: "Good"
  }
];


/* =====================================================
   APP
   ===================================================== */

function App() {

  /* ===================================================
     LOGIN STATE
     =================================================== */

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("smartshelf_user") !== null
  );


  const [user, setUser] = useState(() => {

    try {

      const savedUser =
        localStorage.getItem("smartshelf_user");

      return savedUser
        ? JSON.parse(savedUser)
        : null;

    } catch {

      return null;

    }

  });


  /* ===================================================
     PRODUCTS
     =================================================== */

  const [products, setProducts] = useState(() => {

    try {

      const savedProducts =
        localStorage.getItem("smartshelf_products");

      return savedProducts
        ? JSON.parse(savedProducts)
        : defaultProducts;

    } catch {

      return defaultProducts;

    }

  });


  /* ===================================================
     ACTIVITIES / NOTIFICATIONS
     =================================================== */

  const [activities, setActivities] = useState(() => {

    try {

      const savedActivities =
        localStorage.getItem("smartshelf_activities");

      return savedActivities
        ? JSON.parse(savedActivities)
        : [];

    } catch {

      return [];

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
      email: email
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
     ACTIVITY FUNCTION
     =================================================== */

  const addActivity = (message, type = "info") => {

    const newActivity = {

      id: Date.now(),

      message,

      type,

      time: new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
      })

    };

    setActivities(prev => [
      newActivity,
      ...prev
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

      costPrice: Number(newProduct.costPrice || 0),

      stock: Number(newProduct.stock || 0),

      minStock: Number(newProduct.minStock || 0),

      sold30: Number(newProduct.sold30 || 0),

      condition:
        newProduct.condition || "Good"

    };


    setProducts(prev => [
      product,
      ...prev
    ]);


    addActivity(
      `${product.name} was added to the inventory.`,
      "success"
    );

  };


  /* ===================================================
     GENERATE INVENTORY REPORT
     =================================================== */

  const generateReport = () => {

    const totalStock = products.reduce(
      (total, product) =>
        total + Number(product.stock || 0),
      0
    );


    const totalSold = products.reduce(
      (total, product) =>
        total + Number(product.sold30 || 0),
      0
    );


    const inventoryValue = products.reduce(
      (total, product) =>
        total +
        Number(product.costPrice || 0) *
        Number(product.stock || 0),
      0
    );


    const lowStock = products.filter(
      product =>
        Number(product.stock || 0) <
        Number(product.minStock || 0)
    );


    const fastMoving = [...products]
      .sort(
        (a, b) =>
          Number(b.sold30 || 0) -
          Number(a.sold30 || 0)
      )
      .slice(0, 5);


    const slowMoving = [...products]
      .sort(
        (a, b) =>
          Number(a.sold30 || 0) -
          Number(b.sold30 || 0)
      )
      .slice(0, 5);


    let report = "";

    report += "====================================\n";
    report += "        SMARTSHELF INVENTORY REPORT\n";
    report += "====================================\n\n";

    report += `Generated: ${new Date().toLocaleString("en-IN")}\n\n`;

    report += "SUMMARY\n";
    report += "------------------------------------\n";

    report += `Total Products: ${products.length}\n`;
    report += `Total Stock Units: ${totalStock}\n`;
    report += `Units Sold (30 Days): ${totalSold}\n`;
    report += `Inventory Value: ₹${inventoryValue.toLocaleString("en-IN")}\n`;
    report += `Products Needing Restock: ${lowStock.length}\n\n`;


    report += "LOW STOCK PRODUCTS\n";
    report += "------------------------------------\n";

    if (lowStock.length === 0) {

      report += "No products require restocking.\n";

    } else {

      lowStock.forEach(product => {

        report +=
          `${product.name} - ` +
          `${product.stock} units left ` +
          `(minimum ${product.minStock})\n`;

      });

    }


    report += "\nFAST MOVING PRODUCTS\n";
    report += "------------------------------------\n";

    fastMoving.forEach((product, index) => {

      report +=
        `${index + 1}. ${product.name} - ` +
        `${product.sold30} units sold\n`;

    });


    report += "\nSLOW MOVING PRODUCTS\n";
    report += "------------------------------------\n";

    slowMoving.forEach((product, index) => {

      report +=
        `${index + 1}. ${product.name} - ` +
        `${product.sold30} units sold\n`;

    });


    const blob = new Blob(
      [report],
      {
        type: "text/plain"
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

        {/* SIDEBAR */}

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onGenerateReport={generateReport}
          onLogout={handleLogout}
        />


        {/* MAIN AREA */}

        <div
          className={
            sidebarOpen
              ? "main-area sidebar-open"
              : "main-area sidebar-closed"
          }
        >

          {/* NAVBAR */}

          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={user}
            products={products}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />


          {/* PAGE CONTENT */}

          <main className="page-content">

            <Routes>

              {/* =====================================
                  DASHBOARD
                 ===================================== */}

              <Route
                path="/"
                element={
                  <Dashboard
                    products={products}
                    activities={activities}
                  />
                }
              />


              {/* =====================================
                  PRODUCTS
                 ===================================== */}

              <Route
                path="/products"
                element={
                  <Products
                    products={products}
                    searchTerm={searchTerm}
                  />
                }
              />


              {/* =====================================
                  ADD PRODUCT
                 ===================================== */}

              <Route
                path="/add-product"
                element={
                  <AddProduct
                    onAddProduct={handleAddProduct}
                  />
                }
              />


              {/* =====================================
                  LOW STOCK
                 ===================================== */}

              <Route
                path="/low-stock"
                element={
                  <LowStock
                    products={products}
                    setProducts={setProducts}
                    addActivity={addActivity}
                  />
                }
              />


              {/* =====================================
                  ORDERS
                 ===================================== */}

              <Route
                path="/orders"
                element={
                  <Orders
                    products={products}
                    setProducts={setProducts}
                    addActivity={addActivity}
                  />
                }
              />


              {/* =====================================
                  ANALYTICS
                 ===================================== */}

              <Route
                path="/analytics"
                element={
                  <Analytics
                    products={products}
                  />
                }
              />


              {/* =====================================
                  NOTIFICATIONS
                 ===================================== */}

              <Route
                path="/notifications"
                element={
                  <Notifications
                    activities={activities}
                    products={products}
                  />
                }
              />


              {/* =====================================
                  UNKNOWN PAGE
                 ===================================== */}

              <Route
                path="*"
                element={
                  <Navigate to="/" replace />
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