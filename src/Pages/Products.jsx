import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Package,
  X,
  SlidersHorizontal,
} from "lucide-react";

function Products({
  products = [],
  searchTerm,
  setSearchTerm,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}) {
  const [localSearch, setLocalSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [stockStatus, setStockStatus] = useState("all");
  const [sortBy, setSortBy] = useState("best-selling");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const search =
    typeof searchTerm === "string" ? searchTerm : localSearch;

  const updateSearch = (value) => {
    setLocalSearch(value);
    setSearchTerm?.(value);
  };

  const safeProducts = Array.isArray(products) ? products : [];

  const categories = useMemo(
    () =>
      [...new Set(
        safeProducts
          .map((product) => product.category)
          .filter(Boolean)
      )].sort((a, b) => a.localeCompare(b)),
    [safeProducts]
  );

  const getStockStatus = (product) => {
    const stock = Number(product.stock || 0);
    const minStock = Number(product.minStock || 0);

    if (stock <= 0) return "out";
    if (stock <= minStock) return "low";
    return "in";
  };

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = safeProducts.filter((product) => {
      const matchesSearch =
        String(product.name || "").toLowerCase().includes(query) ||
        String(product.category || "").toLowerCase().includes(query);

      const matchesCategory =
        category === "all" || product.category === category;

      const matchesStatus =
        stockStatus === "all" ||
        getStockStatus(product) === stockStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });

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

      case "name":
        result.sort((a, b) =>
          String(a.name || "").localeCompare(String(b.name || ""))
        );
        break;

      case "best-selling":
      default:
        result.sort(
          (a, b) => Number(b.sold30 || 0) - Number(a.sold30 || 0)
        );
        break;
    }

    return result;
  }, [safeProducts, search, category, stockStatus, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, stockStatus, sortBy, itemsPerPage]);

  const totalPages = Math.ceil(
    filteredProducts.length / itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const clearFilters = () => {
    updateSearch("");
    setCategory("all");
    setStockStatus("all");
    setSortBy("best-selling");
    setCurrentPage(1);
  };

  const firstItem =
    filteredProducts.length === 0 ? 0 : startIndex + 1;

  const lastItem = Math.min(
    startIndex + itemsPerPage,
    filteredProducts.length
  );

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="products-page">
      <div className="products-heading">
        <div>
          <h1>Products</h1>
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

      <section className="products-toolbar">
        <div className="products-search">
          <Search size={20} />

          <input
            type="search"
            placeholder="Search products by name or category..."
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
            aria-label="Search products"
          />

          {search && (
            <button
              type="button"
              className="products-clear-search"
              onClick={() => updateSearch("")}
              aria-label="Clear search"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <label className="products-select">
          <span className="products-sr-only">Category</span>
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
          <ChevronDown size={17} />
        </label>

        <label className="products-select">
          <span className="products-sr-only">Stock status</span>
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
          <ChevronDown size={17} />
        </label>

        <label className="products-select products-sort">
          <span className="products-sr-only">Sort products</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            aria-label="Sort products"
          >
            <option value="best-selling">Sort: Best-Selling</option>
            <option value="name">Name: A to Z</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="stock-low">Stock: Low to High</option>
            <option value="stock-high">Stock: High to Low</option>
          </select>
          <ChevronDown size={17} />
        </label>
      </section>

      <div className="products-results-info">
        <div className="products-results-label">
          <SlidersHorizontal size={16} />
          <span>
            Showing {firstItem}–{lastItem} of {filteredProducts.length} products
          </span>
        </div>

        {(search || category !== "all" || stockStatus !== "all") && (
          <button
            type="button"
            className="products-reset-btn"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        )}
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
              {currentProducts.map((product) => {
                const status = getStockStatus(product);

                return (
                  <tr key={product.id}>
                    <td>
                      <div className="products-name-cell">
                        <div className="products-image">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name || "Product"}
                              loading="lazy"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <Package size={24} />
                          )}
                        </div>
                        <span className="products-product-name">
                          {product.name || "Unnamed product"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="products-category">
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

                    <td>{Number(product.sold30 || 0)}</td>

                    <td>
                      <div className="products-actions">
                        <button
                          type="button"
                          className="products-action-btn edit"
                          title="Edit product"
                          aria-label={`Edit ${product.name}`}
                          onClick={() => onEditProduct?.(product)}
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          className="products-action-btn delete"
                          title="Delete product"
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

              {currentProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="products-empty">
                    <Package size={34} />
                    <strong>No products found</strong>
                    <span>Try another search or change your filters.</span>
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

        <div className="products-pagination">
          <div className="products-page-size">
            <span>Rows per page</span>
            <select
              value={itemsPerPage}
              onChange={(event) =>
                setItemsPerPage(Number(event.target.value))
              }
              aria-label="Rows per page"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>

          <div className="products-page-controls">
            <button
              type="button"
              className="products-page-arrow"
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                type="button"
                key={page}
                className={`products-page-number ${
                  currentPage === page ? "active" : ""
                }`}
                aria-current={currentPage === page ? "page" : undefined}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className="products-page-arrow"
              disabled={totalPages === 0 || currentPage >= totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Products;