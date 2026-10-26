import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  Package,
  SlidersHorizontal,
  X,
} from "lucide-react";

function Products({
  products = [],
  searchTerm: navbarSearchTerm = "",
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}) {
  const [search, setSearch] = useState(navbarSearchTerm);
  const [category, setCategory] = useState("all");
  const [stockStatus, setStockStatus] = useState("all");
  const [sortBy, setSortBy] = useState("best-selling");

  useEffect(() => {
    setSearch(navbarSearchTerm);
  }, [navbarSearchTerm]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const getStockStatus = (product) => {
    const stock = Number(product.stock || 0);
    const minStock = Number(product.minStock || 0);

    if (stock <= 0) return "out";
    if (stock <= minStock) return "low";

    return "in";
  };

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = products.filter((product) => {
      const matchesSearch =
        String(product.name || "")
          .toLowerCase()
          .includes(query) ||
        String(product.category || "")
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "all" || product.category === category;

      const status = getStockStatus(product);

      const matchesStatus =
        stockStatus === "all" || status === stockStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    result = [...result];

    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) => Number(a.price || 0) - Number(b.price || 0)
        );
        break;

      case "price-high":
        result.sort(
          (a, b) => Number(b.price || 0) - Number(a.price || 0)
        );
        break;

      case "stock-low":
        result.sort(
          (a, b) => Number(a.stock || 0) - Number(b.stock || 0)
        );
        break;

      case "stock-high":
        result.sort(
          (a, b) => Number(b.stock || 0) - Number(a.stock || 0)
        );
        break;

      case "best-selling":
        result.sort(
          (a, b) => Number(b.sold30 || 0) - Number(a.sold30 || 0)
        );
        break;

      case "name":
        result.sort((a, b) =>
          String(a.name || "").localeCompare(String(b.name || ""))
        );
        break;

      default:
        break;
    }

    return result;
  }, [products, search, category, stockStatus, sortBy]);

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setStockStatus("all");
    setSortBy("best-selling");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "all" ||
    stockStatus !== "all" ||
    sortBy !== "best-selling";

  const lowStockCount = products.filter(
    (product) => getStockStatus(product) === "low"
  ).length;

  const outOfStockCount = products.filter(
    (product) => getStockStatus(product) === "out"
  ).length;

  const inStockCount = products.filter(
    (product) => getStockStatus(product) === "in"
  ).length;

  return (
    <div className="products-page">
      <div className="products-heading">
        <div>
          <div className="products-title-row">
            <h1>Products</h1>
            <span className="products-count-badge">
              {products.length} items
            </span>
          </div>

          <p>Manage and organize your inventory</p>
        </div>

        <button
          type="button"
          className="products-add-btn"
          onClick={onAddProduct}
        >
          <Plus size={19} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="products-overview">
        <div className="products-overview-card">
          <div className="products-overview-icon total">
            <Package size={20} />
          </div>

          <div>
            <span>Total Products</span>
            <strong>{products.length}</strong>
          </div>
        </div>

        <div className="products-overview-card">
          <div className="products-overview-icon available">
            <Package size={20} />
          </div>

          <div>
            <span>In Stock</span>
            <strong>{inStockCount}</strong>
          </div>
        </div>

        <div className="products-overview-card">
          <div className="products-overview-icon warning">
            <Package size={20} />
          </div>

          <div>
            <span>Low Stock</span>
            <strong>{lowStockCount}</strong>
          </div>
        </div>

        <div className="products-overview-card">
          <div className="products-overview-icon danger">
            <Package size={20} />
          </div>

          <div>
            <span>Out of Stock</span>
            <strong>{outOfStockCount}</strong>
          </div>
        </div>
      </div>

      <section className="products-filter-card">
        <div className="products-filter-heading">
          <div className="products-filter-heading-icon">
            <SlidersHorizontal size={18} />
          </div>

          <div>
            <h2>Find Products</h2>
            <p>Search, filter, and sort your inventory.</p>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="products-reset-btn"
              onClick={clearFilters}
            >
              <X size={15} />
              Reset filters
            </button>
          )}
        </div>

        <div className="products-toolbar">
          <label className="products-search">
            <Search size={19} />

            <input
              type="search"
              placeholder="Search by product name or category..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search products"
            />

            {search && (
              <button
                type="button"
                className="products-clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </label>

          <label className="products-select">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <ChevronDown size={16} />
          </label>

          <label className="products-select">
            <select
              value={stockStatus}
              onChange={(event) => setStockStatus(event.target.value)}
              aria-label="Filter by stock status"
            >
              <option value="all">All Stock Status</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>

            <ChevronDown size={16} />
          </label>

          <label className="products-select products-sort">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort products"
            >
              <option value="best-selling">Best-Selling</option>
              <option value="name">Name: A to Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock-low">Stock: Low to High</option>
              <option value="stock-high">Stock: High to Low</option>
            </select>

            <ChevronDown size={16} />
          </label>
        </div>
      </section>

      <div className="products-results-info">
        <div>
          <h2>All Products</h2>
          <p>
            Showing{" "}
            <strong>{filteredProducts.length}</strong>{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        <span className="products-results-label">
          {filteredProducts.length} results
        </span>
      </div>

      <section className="products-table-card">
        <div className="products-table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STATUS</th>
                <th>SOLD</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => {
                const status = getStockStatus(product);

                return (
                  <tr key={product.id}>
                    <td>
                      <div className="products-name-cell">
                        <div className="products-image">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              loading="lazy"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <Package size={24} />
                          )}
                        </div>

                        <div className="products-name-details">
                          <span className="products-name">
                            {product.name}
                          </span>

                          <span className="products-id">
                            ID: {product.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`products-category products-category-${String(
                          product.category || "other"
                        )
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")}`}
                      >
                        {product.category || "Uncategorized"}
                      </span>
                    </td>

                    <td className="products-price">
                      {formatPrice(product.price)}
                    </td>

                    <td>
                      <span className="products-stock-number">
                        {Number(product.stock || 0)}
                      </span>
                    </td>

                    <td>
                      <span className={`products-status ${status}`}>
                        <span className="products-status-dot" />

                        {status === "in" && "In Stock"}
                        {status === "low" && "Low Stock"}
                        {status === "out" && "Out of Stock"}
                      </span>
                    </td>

                    <td>
                      <span className="products-sold">
                        {Number(product.sold30 || 0)}
                      </span>
                    </td>

                    <td>
                      <div className="products-actions">
                       

                        <button
                          type="button"
                          className="products-action-btn delete"
                          title={`Delete ${product.name}`}
                          aria-label={`Delete ${product.name}`}
                          onClick={() => onDeleteProduct?.(product)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="products-empty">
                    <div className="products-empty-icon">
                      <Package size={30} />
                    </div>

                    <strong>No products found</strong>

                    <span>
                      Try a different search term or change your filters.
                    </span>

                    <button
                      type="button"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="products-table-footer">
          <span>
            Displaying all {filteredProducts.length} matching products
          </span>

          <span className="products-footer-status">
            <span />
            Inventory updated
          </span>
        </div>
      </section>
    </div>
  );
}

export default Products;