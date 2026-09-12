import {
  Search,
  Package,
  Tag,
  IndianRupee,
  Boxes,
  BoxIcon,
  BoxesIcon
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
        String(product.name || "")
          .toLowerCase()
          .includes(search) ||

        String(product.category || "")
          .toLowerCase()
          .includes(search)
      );
    });


  return (
    <div className="page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <h1>
            Product Catalogue
          </h1>

          <p>
            View and monitor every item currently
            managed in your SmartShelf inventory.
          </p>

        </div>

      </div>


      {/* SEARCH STATUS */}

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


      {/* PRODUCT COUNT */}

<div className="products-summary-title">
  <Package size={24} />
  <span>{products.length}</span>
  <span>Products</span>
</div>


      {/* PRODUCTS */}

      {filteredProducts.length > 0 ? (

        <div className="products-grid">

          {filteredProducts.map(
            (product) => {

              const isLowStock =
                Number(product.stock || 0) <
                Number(product.minStock || 0);


              const isOutOfStock =
                Number(product.stock || 0) === 0;


              return (

                <div
                  className="product-card"
                  key={product.id}
                >

                  {/* =================================
                      PRODUCT IMAGE
                      ================================= */}

                  <div className="product-image-wrapper">

                    {product.image ? (

                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"

                        onError={(event) => {

                          event.currentTarget.style.display =
                            "none";

                          const fallback =
                            event.currentTarget
                              .nextElementSibling;

                          if (fallback) {
                            fallback.style.display =
                              "flex";
                          }

                        }}
                      />

                    ) : null}


                    <div
                      className="product-image-fallback"

                      style={{
                        display:
                          product.image
                            ? "none"
                            : "flex"
                      }}
                    >

                      <Package size={42} />

                    </div>

                  </div>


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
                        product.price || 0
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </strong>

                  </div>


                  {/* STOCK */}

                  <div className="product-stock-row">

                    <div>
                      <div className="Box-logo">
                      <BoxesIcon size={20} />
                      </div>
                      <span>
                           Current Stock :  <strong>
                      {product.stock}
                    </strong>
                      </span>

                    </div>

                    

                  </div>


                 


                  {/* SOLD */}

                  <div className="product-detail-row">

                    <span>
                      Sold in 30 days :   <strong>
                      {product.sold30}
                    </strong>
                    </span>

                  

                  </div>


                 

                </div>

              );

            }
          )}

        </div>

      ) : (

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