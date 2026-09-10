import { useState } from "react";

import {
  PackagePlus,
  IndianRupee,
  Boxes,
  Tag,
  CheckCircle,
  Image as ImageIcon
} from "lucide-react";

import { useNavigate } from "react-router";


function AddProduct({
  onAddProduct
}) {

  const navigate =
    useNavigate();


  const [form, setForm] =
    useState({

      name: "",

      category:
        "Electronics",

      price: "",

      costPrice: "",

      stock: "",

      minStock: "",

      condition:
        "Good",

      image: ""

    });


  const [message, setMessage] =
    useState("");


  const handleChange =
    (event) => {

      setForm({
        ...form,

        [event.target.name]:
          event.target.value
      });

    };


  const handleSubmit =
    (event) => {

      event.preventDefault();


      if (
        !form.name ||
        !form.price ||
        !form.costPrice ||
        !form.stock ||
        !form.minStock
      ) {

        setMessage(
          "Please fill all required fields."
        );

        return;
      }


      onAddProduct({

        ...form,

        price:
          Number(form.price),

        costPrice:
          Number(form.costPrice),

        stock:
          Number(form.stock),

        minStock:
          Number(form.minStock),

        sold30: 0,

        image:
          form.image.trim()

      });


      setMessage(
        `${form.name} has been successfully added.`
      );


      setTimeout(() => {

        navigate(
          "/products"
        );

      }, 1000);

    };


  return (

    <main className="page">

      {/* HEADER */}

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            PRODUCT REGISTRATION
          </p>

          <h1>
            Register a New Product
          </h1>

          <p className="page-subtitle">
            Add a product to SmartShelf and define
            how much stock should normally be maintained.
          </p>

        </div>

      </div>


      {/* FORM CARD */}

      <section className="form-card">

        <div className="form-card-header">

          <div className="large-form-icon">

            <PackagePlus
              size={26}
            />

          </div>


          <div>

            <h2>
              Product Information
            </h2>

            <p>
              Enter the basic details used to
              track this product.
            </p>

          </div>

        </div>


        <form
          onSubmit={handleSubmit}
        >

          <div className="form-grid">

            {/* PRODUCT NAME */}

            <div className="form-group">

              <label>
                Product Name *
              </label>

              <div className="input-with-icon">

                <PackagePlus
                  size={18}
                />

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Wireless Mouse"
                  required
                />

              </div>

            </div>


            {/* CATEGORY */}

            <div className="form-group">

              <label>
                Category *
              </label>

              <div className="input-with-icon">

                <Tag
                  size={18}
                />

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >

                  <option>
                    Electronics
                  </option>

                  <option>
                    Accessories
                  </option>

                  <option>
                    Stationery
                  </option>

                  <option>
                    Furniture
                  </option>

                  <option>
                    Other
                  </option>

                </select>

              </div>

            </div>


            {/* SELLING PRICE */}

            <div className="form-group">

              <label>
                Selling Price *
              </label>

              <div className="input-with-icon">

                <IndianRupee
                  size={18}
                />

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="599"
                  min="0"
                  required
                />

              </div>

            </div>


            {/* COST PRICE */}

            <div className="form-group">

              <label>
                Cost Price *
              </label>

              <div className="input-with-icon">

                <IndianRupee
                  size={18}
                />

                <input
                  type="number"
                  name="costPrice"
                  value={form.costPrice}
                  onChange={handleChange}
                  placeholder="350"
                  min="0"
                  required
                />

              </div>

            </div>


            {/* INITIAL STOCK */}

            <div className="form-group">

              <label>
                Initial Stock *
              </label>

              <div className="input-with-icon">

                <Boxes
                  size={18}
                />

                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="25"
                  min="0"
                  required
                />

              </div>

            </div>


            {/* MIN STOCK */}

            <div className="form-group">

              <label>
                Minimum Stock Level *
              </label>

              <div className="input-with-icon">

                <Boxes
                  size={18}
                />

                <input
                  type="number"
                  name="minStock"
                  value={form.minStock}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                  required
                />

              </div>

            </div>


            {/* CONDITION */}

            <div className="form-group">

              <label>
                Product Condition
              </label>

              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
              >

                <option>
                  Good
                </option>

                <option>
                  New
                </option>

                <option>
                  Damaged
                </option>

                <option>
                  Returned
                </option>

              </select>

            </div>


            {/* IMAGE URL */}

            <div className="form-group">

              <label>
                Product Image URL
              </label>

              <div className="input-with-icon">

                <ImageIcon
                  size={18}
                />

                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/product.jpg"
                />

              </div>

            </div>


            {/* IMAGE PREVIEW */}

            {form.image && (

              <div className="form-group full-width">

                <label>
                  Image Preview
                </label>

                <div className="add-product-image-preview">

                  <img
                    src={form.image}
                    alt="Product preview"

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


                  <div
                    className="image-preview-fallback"
                    style={{
                      display: "none"
                    }}
                  >

                    <ImageIcon
                      size={40}
                    />

                    <span>
                      Image could not be loaded
                    </span>

                  </div>

                </div>

              </div>

            )}

          </div>


          {/* MESSAGE */}

          {message && (

            <div className="success-message">

              <CheckCircle
                size={18}
              />

              {message}

            </div>

          )}


          {/* ACTIONS */}

          <div className="form-actions">

            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                navigate("/products")
              }
            >
              Cancel
            </button>


            <button
              type="submit"
              className="primary-btn"
            >

              <PackagePlus
                size={18}
              />

              Add Product

            </button>

          </div>

        </form>

      </section>

    </main>
  );
}


export default AddProduct;