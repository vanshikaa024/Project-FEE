import { useState } from "react";
import {
  Menu,
  Bell,
  User,
  Search,
  X,
  Package
} from "lucide-react";

import { Link, useNavigate } from "react-router";

function Navbar({
  sidebarOpen,
  setSidebarOpen,
  user,
  products,
  searchTerm,
  setSearchTerm
}) {
  const navigate = useNavigate();

  const [showResults, setShowResults] = useState(false);

  // Search products by name OR category
  const searchResults = products
    .filter((product) => {
      const search = searchTerm.toLowerCase().trim();

      if (!search) return false;

      return (
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
      );
    })
    .slice(0, 6);

  // When user types
  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchTerm(value);

    if (value.trim() !== "") {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  // Press Enter
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchTerm.trim() !== "") {
      navigate("/products");
      setShowResults(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setShowResults(false);
  };

  // Click a result
  const handleResultClick = () => {
    navigate("/products");
    setShowResults(false);
  };

  return (
    <div className="navbar">

      {/* LEFT SIDE */}
      <div className="navbar-left">

        {/* MENU BUTTON */}
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={22} />
        </button>


        {/* SEARCH AREA */}
        <div className="navbar-search-wrapper">

          <form
            className="navbar-search"
            onSubmit={handleSearchSubmit}
          >

            <Search
              size={19}
              className="search-icon"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchTerm.trim() !== "") {
                  setShowResults(true);
                }
              }}
              placeholder="Search products, categories..."
            />

            {/* CLEAR BUTTON */}
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={clearSearch}
              >
                <X size={17} />
              </button>
            )}

          </form>


          {/* SEARCH DROPDOWN */}
          {showResults && searchTerm.trim() !== "" && (

            <div className="search-dropdown">

              {searchResults.length > 0 ? (

                <>
                  <div className="search-dropdown-title">
                    Products
                  </div>

                  {searchResults.map((product) => (

                    <button
                      key={product.id}
                      className="search-result"
                      onClick={handleResultClick}
                    >

                      <div className="search-product-icon">
                        <Package size={17} />
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
                          in stock
                        </span>

                      </div>

                    </button>

                  ))}

                  <button
                    className="view-all-results"
                    onClick={handleSearchSubmit}
                  >
                    View all matching products →
                  </button>

                </>

              ) : (

                <div className="search-no-results">

                  <Search size={20} />

                  <div>
                    <strong>No products found</strong>

                    <span>
                      Try a different product name or category.
                    </span>
                  </div>

                </div>

              )}

            </div>

          )}

        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="navbar-right">

        {/* NOTIFICATIONS */}
        <Link
          to="/notifications"
          className="notification-icon"
        >
          <Bell size={20} />
        </Link>


        {/* USER */}
        <div className="navbar-user">

          <div className="navbar-user-icon">
            <User size={17} />
          </div>

          <span>
            {user?.name}
          </span>

        </div>

      </div>

    </div>
  );
}

export default Navbar;