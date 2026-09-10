import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  AlertTriangle,
  BarChart3,
  Bell,
  LogOut,
  User,
  PlusCircle,
  FileText,
} from "lucide-react";

import { NavLink } from "react-router";

function Sidebar({
  sidebarOpen,
  user,
  onLogout,
  onGenerateReport,
}) {
  const menu = [
    {
      path: "/",
      label: "Inventory at a Glance",
      icon: LayoutDashboard,
    },
    {
      path: "/products",
      label: "Product Catalogue",
      icon: Package,
    },
    {
      path: "/orders",
      label: "Sales & Orders",
      icon: ShoppingCart,
    },
    {
      path: "/low-stock",
      label: "Restocking Required",
      icon: AlertTriangle,
    },
    {
      path: "/analytics",
      label: "Business Performance",
      icon: BarChart3,
    },
    {
      path: "/notifications",
      label: "Activity & Alerts",
      icon: Bell,
    },
  ];

  return (
    <aside
      className={`sidebar ${
        sidebarOpen ? "" : "collapsed"
      }`}
    >
      <div className="sidebar-brand">
        <div className="sidebar-logo-icon">
          <Package size={23} />
        </div>

        {sidebarOpen && (
          <div>
            <h2>SmartShelf</h2>
            <span>
              Inventory Manager
            </span>
          </div>
        )}
      </div>

      <div className="sidebar-section-title">
        MAIN MENU
      </div>

      <nav className="sidebar-nav">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive
                    ? "active"
                    : ""
                }`
              }
            >
              <Icon size={19} />

              {sidebarOpen && (
                <span>
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-section-title quick-title">
        QUICK ACTIONS
      </div>

      <div className="quick-actions">
        <NavLink
          to="/add-product"
          className="quick-action primary-action"
        >
          <PlusCircle size={19} />

          {sidebarOpen && (
            <span>
              Add New Product
            </span>
          )}
        </NavLink>

        <button
          className="quick-action"
          onClick={onGenerateReport}
        >
          <FileText size={19} />

          {sidebarOpen && (
            <span>
              Generate Inventory
              Report
            </span>
          )}
        </button>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          <User size={18} />
        </div>

        {sidebarOpen && (
          <div className="sidebar-user-info">
            <strong>
              {user?.name || "Manager"}
            </strong>

            <span>
              {user?.role ||
                "Inventory Manager"}
            </span>
          </div>
        )}

        <button
          className="logout-btn"
          onClick={onLogout}
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;