import "./App.css";
import "./index.css";

import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
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
   PRODUCT IMAGE LINKS
   ===================================================== */

const productImages = {
  "Wireless Mouse":
    "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85",

  Keyboard:
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85",

  "A4 Notebook":
    "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=85",

  "USB-C Cable":
    "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=85",

  "Ergonomic Desk Chair":
    "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=85",

  "Mechanical Pencil":
    "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=85",

  "27-inch 4K Monitor":
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=85",

  "Sticky Notes Pack":
    "https://images.unsplash.com/photo-1586282391129-76a6df230234?auto=format&fit=crop&w=900&q=85",

  "Noise Cancelling Headphones":
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",

  "Adjustable Laptop Stand":
    "https://media-ik.croma.com/Croma%20Assets/Computers%20Peripherals/Computer%20Accessories%20and%20Tablets%20Accessories/Images/311004_tsbrye.png",

  "Bluetooth Speaker":
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85",

  "Desk Organizer":
    "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=85",
};

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
    image: productImages["Wireless Mouse"],
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
    image: productImages["Keyboard"],
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
    image: productImages["A4 Notebook"],
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
    condition: "Good",
    image: productImages["USB-C Cable"],
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
    image: productImages["Ergonomic Desk Chair"],
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
    condition: "Good",
    image: productImages["Mechanical Pencil"],
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
    image: productImages["27-inch 4K Monitor"],
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
    image: productImages["Sticky Notes Pack"],
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
    condition: "Good",
    image: productImages["Noise Cancelling Headphones"],
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
    image: productImages["Adjustable Laptop Stand"],
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
    image: productImages["Bluetooth Speaker"],
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
    image: productImages["Desk Organizer"],
  },
];


/* =====================================================
   SAFE LOCAL STORAGE READER
   ===================================================== */

function readStorage(key, fallback) {
  try {
    const saved =
      localStorage.getItem(key);

    if (!saved) {
      return fallback;
    }

    return JSON.parse(saved);

  } catch {
    return fallback;
  }
}


/* =====================================================
   DEMO DATE
   ===================================================== */

function demoDate(daysAgo) {
  const date =
    new Date();

  date.setDate(
    date.getDate() - daysAgo
  );

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


/* =====================================================
   DEMO ORDERS
   These are historical demo sales.
   They are NOT deducted from current stock.
   ===================================================== */

function makeDemoOrders() {
  return [
    {
      id: "ORD-1001",
      productId: 2,
      productName: "Keyboard",
      quantity: 2,
      total: 1998,
      cost: 1300,
      profit: 698,
      date: demoDate(5),
    },

    {
      id: "ORD-1002",
      productId: 1,
      productName: "Wireless Mouse",
      quantity: 3,
      total: 1797,
      cost: 1050,
      profit: 747,
      date: demoDate(4),
    },

    {
      id: "ORD-1003",
      productId: 4,
      productName: "USB-C Cable",
      quantity: 5,
      total: 1495,
      cost: 800,
      profit: 695,
      date: demoDate(3),
    },

    {
      id: "ORD-1004",
      productId: 9,
      productName: "Noise Cancelling Headphones",
      quantity: 2,
      total: 9998,
      cost: 6400,
      profit: 3598,
      date: demoDate(2),
    },

    {
      id: "ORD-1005",
      productId: 7,
      productName: "27-inch 4K Monitor",
      quantity: 1,
      total: 18999,
      cost: 14500,
      profit: 4499,
      date: demoDate(1),
    },

    {
      id: "ORD-1006",
      productId: 6,
      productName: "Mechanical Pencil",
      quantity: 12,
      total: 540,
      cost: 240,
      profit: 300,
      date: demoDate(0),
    },
  ];
}


/* =====================================================
   DEMO ACTIVITIES
   ===================================================== */

const demoActivities = [
  {
    id: "demo-activity-1",
    message:
      "Order ORD-1001 completed for Keyboard.",
    type: "success",
    time: demoDate(5),
  },

  {
    id: "demo-activity-2",
    message:
      "Wireless Mouse is below its minimum stock level.",
    type: "warning",
    time: demoDate(4),
  },

  {
    id: "demo-activity-3",
    message:
      "Order ORD-1004 completed for Noise Cancelling Headphones.",
    type: "success",
    time: demoDate(2),
  },

  {
    id: "demo-activity-4",
    message:
      "27-inch 4K Monitor sale recorded.",
    type: "success",
    time: demoDate(1),
  },
];


/* =====================================================
   MAIN APPLICATION
   ===================================================== */

function SmartShelfApp() {

  const navigate =
    useNavigate();


  /* ===================================================
     LOGIN
     =================================================== */

  const [isLoggedIn, setIsLoggedIn] =
    useState(
      () =>
        localStorage.getItem(
          "smartshelf_user"
        ) !== null
    );


  const [user, setUser] =
    useState(() =>
      readStorage(
        "smartshelf_user",
        null
      )
    );

  /* ===================================================
     PRODUCTS
     =================================================== */

  const [products, setProducts] =
    useState(() => {

      const saved =
        readStorage(
          "smartshelf_products",
          null
        );


      if (
        !Array.isArray(saved) ||
        saved.length === 0
      ) {

        return defaultProducts;

      }


      /*
        Merge saved products with defaults.

        This is important because your old
        localStorage products may not contain
        image URLs.
      */

      return saved.map(
        (product, index) => {

          const matchingDefault =
            defaultProducts.find(
              (item) =>
                item.id ===
                  product.id ||
                item.name ===
                  product.name
            ) ||
            defaultProducts[
              index %
                defaultProducts.length
            ];


          return {

            ...matchingDefault,

            ...product,

            price:
              Number(
                product.price ??
                  matchingDefault.price ??
                  0
              ),

            costPrice:
              Number(
                product.costPrice ??
                  matchingDefault.costPrice ??
                  0
              ),

            stock:
              Number(
                product.stock ??
                  0
              ),

            minStock:
              Number(
                product.minStock ??
                  matchingDefault.minStock ??
                  0
              ),

            sold30:
              Number(
                product.sold30 ??
                  matchingDefault.sold30 ??
                  0
              ),

            condition:
              product.condition ||
              matchingDefault.condition ||
              "Good",

            image:
              product.image ||
              matchingDefault.image ||
              "",
          };
        }
      );

    });


  /* ===================================================
     ORDERS
     =================================================== */

  const [orders, setOrders] =
    useState(() => {

      const saved =
        readStorage(
          "smartshelf_orders",
          null
        );


      /*
        If there are no saved orders,
        automatically load demo orders.
      */

      if (
        !Array.isArray(saved) ||
        saved.length === 0
      ) {

        return makeDemoOrders();

      }


      return saved;

    });


  /* ===================================================
     ACTIVITIES
     =================================================== */

  const [activities, setActivities] =
    useState(() => {

      const saved =
        readStorage(
          "smartshelf_activities",
          null
        );


      if (
        !Array.isArray(saved) ||
        saved.length === 0
      ) {

        return demoActivities;

      }


      return saved;

    });


  /* ===================================================
     SEARCH
     =================================================== */

  const [searchTerm, setSearchTerm] =
    useState("");


  /* ===================================================
     SIDEBAR
     =================================================== */

  const [sidebarOpen, setSidebarOpen] =
    useState(true);


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

  const handleLogin =
    (email) => {

      const userData = {

        name:
          "Manager",

        role:
          "Inventory Manager",

        email:
          email,

      };


      localStorage.setItem(
        "smartshelf_user",
        JSON.stringify(userData)
      );


      setUser(
        userData
      );


      setIsLoggedIn(
        true
      );


      /*
        Always go to Dashboard
        after successful login.
      */

      navigate(
        "/",
        {
          replace: true,
        }
      );

    };


  /* ===================================================
     LOGOUT
     =================================================== */

  const handleLogout =
    () => {

      /*
        Remove authentication.
      */

      localStorage.removeItem(
        "smartshelf_user"
      );


      setUser(null);

      setIsLoggedIn(false);

      setSearchTerm("");


      /*
        IMPORTANT:
        Change the browser URL too.

        This fixes:
        /orders → logout → still /orders
      */

      navigate(
        "/",
        {
          replace: true,
        }
      );

    };


  /* ===================================================
     ACTIVITY
     =================================================== */

  const addActivity =
    (
      message,
      type = "info"
    ) => {

      const activity = {

        id:
          Date.now(),

        message:
          message,

        type:
          type,

        time:
          new Date().toLocaleString(
            "en-IN",
            {
              dateStyle:
                "medium",

              timeStyle:
                "short",
            }
          ),

      };


      setActivities(
        (previous) => [

          activity,

          ...previous,

        ].slice(0, 30)
      );

    };


  /* ===================================================
     ADD PRODUCT
     =================================================== */

  const handleAddProduct =
    (newProduct) => {

      const product = {

        ...newProduct,

        id:
          Date.now(),

        price:
          Number(
            newProduct.price ||
              0
          ),

        costPrice:
          Number(
            newProduct.costPrice ||
              0
          ),

        stock:
          Number(
            newProduct.stock ||
              0
          ),

        minStock:
          Number(
            newProduct.minStock ||
              0
          ),

        sold30:
          0,

        condition:
          newProduct.condition ||
          "Good",

        image:
          newProduct.image ||
          "",

      };


      setProducts(
        (previous) => [

          product,

          ...previous,

        ]
      );


      addActivity(
        `${product.name} was added to the inventory.`,
        "success"
      );

    };


  /* ===================================================
     CREATE SALE / ORDER
     =================================================== */

  const createOrder =
    (
      productId,
      quantity
    ) => {

      const numericProductId =
        Number(productId);

      const numericQuantity =
        Number(quantity);


      /* Validate quantity */

      if (
        !Number.isFinite(
          numericQuantity
        ) ||
        numericQuantity < 1
      ) {

        return {

          success:
            false,

          message:
            "Quantity must be at least 1.",

        };

      }


      /* Find product */

      const selectedProduct =
        products.find(
          (product) =>
            Number(product.id) ===
            numericProductId
        );


      if (
        !selectedProduct
      ) {

        return {

          success:
            false,

          message:
            "Product not found.",

        };

      }


      /* Available stock */

      const availableStock =
        Number(
          selectedProduct.stock ||
            0
        );


      /* Prevent overselling */

      if (
        numericQuantity >
        availableStock
      ) {

        return {

          success:
            false,

          message:
            `Only ${availableStock} units are available.`,

        };

      }


      /* Calculate sale */

      const total =
        Number(
          selectedProduct.price ||
            0
        ) *
        numericQuantity;


      const cost =
        Number(
          selectedProduct.costPrice ||
            0
        ) *
        numericQuantity;


      const profit =
        total -
        cost;


      /* Generate next order number */

      const highestOrderNumber =
        orders.reduce(
          (
            highest,
            order
          ) => {

            const match =
              String(
                order.id || ""
              ).match(
                /(\d+)$/
              );


            if (!match) {

              return highest;

            }


            return Math.max(
              highest,
              Number(
                match[1]
              )
            );

          },

          1000
        );


      const nextOrderNumber =
        highestOrderNumber +
        1;


      /* Create order */

      const order = {

        id:
          `ORD-${nextOrderNumber}`,

        productId:
          selectedProduct.id,

        productName:
          selectedProduct.name,

        quantity:
          numericQuantity,

        total:
          total,

        cost:
          cost,

        profit:
          profit,

        date:
          new Date().toLocaleDateString(
            "en-IN",
            {
              day:
                "2-digit",

              month:
                "short",

              year:
                "numeric",
            }
          ),

      };


      /* =============================================
         UPDATE STOCK
         ============================================= */

      setProducts(
        (previous) =>
          previous.map(
            (product) => {

              if (
                Number(
                  product.id
                ) !==
                numericProductId
              ) {

                return product;

              }


              return {

                ...product,

                stock:
                  Number(
                    product.stock ||
                      0
                  ) -
                  numericQuantity,

                sold30:
                  Number(
                    product.sold30 ||
                      0
                  ) +
                  numericQuantity,

              };

            }
          )
      );


      /* =============================================
         ADD ORDER
         ============================================= */

      setOrders(
        (previous) => [

          order,

          ...previous,

        ]
      );


      /* =============================================
         ADD ACTIVITY
         ============================================= */

      addActivity(

        `${order.id}: ${numericQuantity} × ${selectedProduct.name} sold for ₹${total.toLocaleString("en-IN")}.`,

        "success"

      );


      /* =============================================
         LOW STOCK WARNING
         ============================================= */

      const remainingStock =
        availableStock -
        numericQuantity;


      if (
        remainingStock <
        Number(
          selectedProduct.minStock ||
            0
        )
      ) {

        addActivity(

          `${selectedProduct.name} is now below its minimum stock level.`,

          "warning"

        );

      }


      return {

        success:
          true,

        order:
          order,

      };

    };


  /* ===================================================
     RESTOCK
     =================================================== */

  const handleRestock =
    (
      productId,
      quantity
    ) => {

      const qty =
        Number(quantity);


      if (
        !Number.isFinite(qty) ||
        qty <= 0
      ) {

        return;

      }


      const product =
        products.find(
          (item) =>
            Number(item.id) ===
            Number(productId)
        );


      if (!product) {

        return;

      }


      setProducts(
        (previous) =>
          previous.map(
            (item) => {

              if (
                Number(item.id) !==
                Number(productId)
              ) {

                return item;

              }


              return {

                ...item,

                stock:
                  Number(
                    item.stock ||
                      0
                  ) +
                  qty,

              };

            }
          )
      );


      addActivity(

        `${product.name} was restocked with ${qty} units.`,

        "success"

      );

    };


  /* ===================================================
     INVENTORY REPORT
     =================================================== */

  const generateReport =
    () => {

      const totalStock =
        products.reduce(
          (
            total,
            product
          ) =>
            total +
            Number(
              product.stock ||
                0
            ),

          0
        );


      const totalSold =
        products.reduce(
          (
            total,
            product
          ) =>
            total +
            Number(
              product.sold30 ||
                0
            ),

          0
        );


      const inventoryValue =
        products.reduce(
          (
            total,
            product
          ) =>
            total +

            Number(
              product.costPrice ||
                0
            ) *

            Number(
              product.stock ||
                0
            ),

          0
        );


      const revenue =
        orders.reduce(
          (
            total,
            order
          ) =>
            total +
            Number(
              order.total ||
                0
            ),

          0
        );


      const profit =
        orders.reduce(
          (
            total,
            order
          ) =>
            total +
            Number(
              order.profit ||
                0
            ),

          0
        );


      const lowStock =
        products.filter(
          (product) =>
            Number(
              product.stock ||
                0
            ) <
            Number(
              product.minStock ||
                0
            )
        );


      const report = [

        "SMARTSHELF INVENTORY REPORT",

        "========================================",

        `Generated: ${new Date().toLocaleString(
          "en-IN"
        )}`,

        "",

        `Total Products: ${products.length}`,

        `Stock Units: ${totalStock}`,

        `Units Sold (30 Days): ${totalSold}`,

        `Inventory Value: ₹${inventoryValue.toLocaleString(
          "en-IN"
        )}`,

        `Total Orders: ${orders.length}`,

        `Sales Revenue: ₹${revenue.toLocaleString(
          "en-IN"
        )}`,

        `Gross Profit: ₹${profit.toLocaleString(
          "en-IN"
        )}`,

        `Restocking Required: ${lowStock.length}`,

        "",

        "LOW STOCK PRODUCTS",

        "----------------------------------------",

        ...lowStock.map(
          (product) =>
            `${product.name}: ${product.stock} units left / minimum ${product.minStock}`
        ),

      ].join("\n");


      const blob =
        new Blob(
          [report],
          {
            type:
              "text/plain;charset=utf-8",
          }
        );


      const url =
        URL.createObjectURL(
          blob
        );


      const link =
        document.createElement(
          "a"
        );


      link.href =
        url;


      link.download =
        "SmartShelf_Inventory_Report.txt";


      document.body.appendChild(
        link
      );


      link.click();


      document.body.removeChild(
        link
      );


      URL.revokeObjectURL(
        url
      );


      addActivity(
        "Inventory report was generated.",
        "info"
      );

    };


  /* ===================================================
     LOGGED-OUT ROUTING
     =================================================== */

  if (!isLoggedIn) {

    return (

      <Routes>

        <Route
          path="/"
          element={
            <Login
              onLogin={
                handleLogin
              }
            />
          }
        />


        {/*
          Any route entered while logged out
          goes back to the login page at "/".
        */}

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

    );

  }


  /* ===================================================
     LOGGED-IN APPLICATION
     =================================================== */

  return (

    <div className="app-layout">


      {/* =============================================
          SIDEBAR
          ============================================= */}

      <Sidebar
        sidebarOpen={
          sidebarOpen
        }

        user={
          user
        }

        onLogout={
          handleLogout
        }

        onGenerateReport={
          generateReport
        }
      />


      {/* =============================================
          MAIN AREA
          ============================================= */}

      <div
        className={
          sidebarOpen
            ? "main-area sidebar-open"
            : "main-area sidebar-closed"
        }
      >


        {/* ===========================================
            NAVBAR
            =========================================== */}

        <Navbar
          sidebarOpen={
            sidebarOpen
          }

          setSidebarOpen={
            setSidebarOpen
          }

          user={
            user
          }

          products={
            products
          }

          searchTerm={
            searchTerm
          }

          setSearchTerm={
            setSearchTerm
          }
        />


        {/* ===========================================
            PAGE CONTENT
            =========================================== */}

        <main className="page-content">

          <Routes>


            {/* =======================================
                DASHBOARD
                ======================================= */}

            <Route
              path="/"
              element={

                <Dashboard

                  products={
                    products
                  }

                  orders={
                    orders
                  }

                  activities={
                    activities
                  }

                />

              }
            />


            {/* =======================================
                PRODUCTS
                ======================================= */}

            <Route
              path="/products"
              element={

                <Products

                  products={
                    products
                  }

                  searchTerm={
                    searchTerm
                  }

                />

              }
            />


            {/* =======================================
                ADD PRODUCT
                ======================================= */}

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


            {/* =======================================
                LOW STOCK
                ======================================= */}

            <Route
              path="/low-stock"
              element={

                <LowStock

                  products={
                    products
                  }

                  setProducts={
                    setProducts
                  }

                  addActivity={
                    addActivity
                  }

                />

              }
            />


            {/* =======================================
                ORDERS
                ======================================= */}

            <Route
              path="/orders"
              element={

                <Orders

                  products={
                    products
                  }

                  orders={
                    orders
                  }

                  createOrder={
                    createOrder
                  }

                />

              }
            />


            {/* =======================================
                ANALYTICS
                ======================================= */}

            <Route
              path="/analytics"
              element={

                <Analytics

                  products={
                    products
                  }

                  orders={
                    orders
                  }

                />

              }
            />


            {/* =======================================
                NOTIFICATIONS
                ======================================= */}

            <Route
              path="/notifications"
              element={

                <Notifications

                  activities={
                    activities
                  }

                  products={
                    products
                  }

                />

              }
            />


            {/* =======================================
                UNKNOWN AUTHENTICATED ROUTE
                ======================================= */}

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

  );

}


/* =====================================================
   ROOT APP

   BrowserRouter is ALWAYS mounted.

   This is the important logout fix.
   ===================================================== */

function App() {

  return (

    <BrowserRouter>

      <SmartShelfApp />

    </BrowserRouter>

  );

}


export default App;