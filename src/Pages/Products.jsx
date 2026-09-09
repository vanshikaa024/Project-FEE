import {
  Search,
  Package,
  Tag,
  IndianRupee,
  Boxes
} from "lucide-react";


function Products({
  products = [],
  searchTerm = ""
}) {


  const filteredProducts =
    products.filter((product) => {

      const search =
        searchTerm
          .toLowerCase()
          .trim();


      if (!search) {
        return true;
      }


      return (
        product.name
          .toLowerCase()
          .includes(search) ||

        product.category
          .toLowerCase()
          .includes(search)
      );

    });


  return (

    <div className="page">


      {/* ============================================
          HEADER
      ============================================ */}

      <div className="page-header">

        <div>

          <h1>
            Product Catalogue
          </h1>

          <p>
            View and monitor every item currently managed
            in your SmartShelf inventory.
          </p>

        </div>

      </div>


      {/* ============================================
          SEARCH STATUS
      ============================================ */}

      {searchTerm.trim() && (

        <div className="product-search-info">

          <Search size={17} />

          <span>

            Showing results for:

            <strong>
              {" "}
              "{searchTerm}"
            </strong>

          </span>

          <span className="result-count">

            {filteredProducts.length} product
            {filteredProducts.length !== 1
              ? "s"
              : ""}

          </span>

        </div>

      )}


      {/* ============================================
          PRODUCT COUNT
      ============================================ */}

      <div className="products-summary">

        <div>

          <Package size={20} />

          <span>
            {filteredProducts.length} Products
          </span>

        </div>

      </div>


      {/* ============================================
          PRODUCTS
      ============================================ */}

      {filteredProducts.length > 0 ? (

        <div className="products-grid">

          {filteredProducts.map(
            (product) => {


              const isLowStock =
                Number(product.stock) <
                Number(product.minStock);


              const isOutOfStock =
                Number(product.stock) === 0;


              return (

                <div
                  className="product-card"
                  key={product.id}
                >


                  {/* PRODUCT TOP */}

                  <div className="product-card-top">

                    <div className="product-icon">

                      <Package size={22} />

                    </div>


                    <span
                      className={`stock-badge ${
                        isOutOfStock
                          ? "out"
                          : isLowStock
                          ? "low"
                          : "good"
                      }`}
                    >

                      {isOutOfStock
                        ? "Out of Stock"
                        : isLowStock
                        ? "Low Stock"
                        : "In Stock"}

                    </span>

                  </div>


                  {/* PRODUCT NAME */}

                  <h3>
                    {product.name}
                  </h3>


                  {/* CATEGORY */}

                  <div className="product-category">

                    <Tag size={15} />

                    <span>
                      {product.category}
                    </span>

                  </div>


                  {/* PRICE */}

                  <div className="product-price">

                    <IndianRupee
                      size={17}
                    />

                    <strong>
                      {Number(
                        product.price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>


                  {/* STOCK */}

                  <div className="product-stock-row">

                    <div>

                      <Boxes size={16} />

                      <span>
                        Current Stock
                      </span>

                    </div>

                    <strong>
                      {product.stock}
                    </strong>

                  </div>


                  {/* MIN STOCK */}

                  <div className="product-detail-row">

                    <span>
                      Minimum Level
                    </span>

                    <strong>
                      {product.minStock}
                    </strong>

                  </div>


                  {/* SOLD */}

                  <div className="product-detail-row">

                    <span>
                      Sold in 30 days
                    </span>

                    <strong>
                      {product.sold30}
                    </strong>

                  </div>


                  {/* CONDITION */}

                  <div className="product-detail-row">

                    <span>
                      Condition
                    </span>

                    <strong>
                      {product.condition}
                    </strong>

                  </div>

                </div>

              );

            }
          )}

        </div>

      ) : (

        /* ==========================================
           NO RESULTS
        ========================================== */

        <div className="no-products">

          <Search size={36} />

          <h2>
            No matching products
          </h2>

          <p>
            We couldn't find a product matching
            "{searchTerm}".
          </p>

        </div>

      )}

    </div>

  );

}


export default Products;