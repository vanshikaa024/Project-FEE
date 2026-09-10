import {
  Menu,
  Search,
  X,
  Bell,
  User,
  Package,
  AlertTriangle,
} from "lucide-react";

import { useMemo } from "react";
import { useNavigate } from "react-router";

function Navbar({
  sidebarOpen,
  setSidebarOpen,
  user,
  products = [],
  searchTerm,
  setSearchTerm,
}) {
  const navigate = useNavigate();

  const safeProducts = Array.isArray(
    products
  )
    ? products
    : [];

  const results = useMemo(() => {
    if (!searchTerm?.trim()) {
      return [];
    }

    const query =
      searchTerm.toLowerCase();

    return safeProducts
      .filter(
        (product) =>
          product.name
            ?.toLowerCase()
            .includes(query) ||
          product.category
            ?.toLowerCase()
            .includes(query)
      )
      .slice(0, 5);
  }, [safeProducts, searchTerm]);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="menu-btn"
          onClick={() =>
            setSidebarOpen(
              !sidebarOpen
            )
          }
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="navbar-search-wrapper">
          <div className="navbar-search">
            <Search
              size={16}
              className="search-icon"
            />

            <input
              type="text"
              placeholder="Search products, categories..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

            {searchTerm && (
              <button
                className="search-clear-btn"
                onClick={() =>
                  setSearchTerm("")
                }
              >
                <X size={14} />
              </button>
            )}
          </div>

          {searchTerm && (
            <div className="search-dropdown">
              {results.length ? (
                <>
                  <div className="search-dropdown-title">
                    Products
                  </div>

                  {results.map(
                    (product) => (
                      <button
                        className="search-result"
                        key={product.id}
                        onClick={() => {
                          navigate(
                            "/products"
                          );
                          setSearchTerm(
                            ""
                          );
                        }}
                      >
                        <div className="search-product-icon">
                          <Package
                            size={15}
                          />
                        </div>

                        <div className="search-product-info">
                          <strong>
                            {product.name}
                          </strong>

                          <span>
                            {product.category}
                          </span>
                        </div>

                        <div className="search-product-stock">
                          <strong>
                            {product.stock}
                          </strong>

                          <span>
                            stock
                          </span>
                        </div>
                      </button>
                    )
                  )}

                  <button
                    className="view-all-results"
                    onClick={() => {
                      navigate(
                        "/products"
                      );
                      setSearchTerm("");
                    }}
                  >
                    View all products
                  </button>
                </>
              ) : (
                <div className="search-no-results">
                  <AlertTriangle
                    size={17}
                  />

                  <div>
                    <strong>
                      No products found
                    </strong>

                    <span>
                      Try another product
                      or category.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="navbar-right">
        <button
          className="notification-icon"
          onClick={() =>
            navigate(
              "/notifications"
            )
          }
          title="Notifications"
        >
          <Bell size={17} />
        </button>

        <div className="navbar-user">
          <div className="navbar-user-icon">
            <User size={16} />
          </div>

          <span>
            {user?.name || "Manager"}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;