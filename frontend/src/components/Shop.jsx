import React, { useEffect, useState } from "react";
import Layout from "./common/Layout";
import { Link, useSearchParams } from "react-router-dom";
import { apiUrl } from "../components/common/http";

const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [catChecked, setCatChecked] = useState(() => {
    const category = searchParams.getAll("category[]");
    return category.length > 0 ? category : [];
  });

  const [brandChecked, setBrandChecked] = useState(() => {
    const brand = searchParams.getAll("brand[]");
    return brand.length > 0 ? brand : [];
  });

  const fetchProducts = () => {
    let params = new URLSearchParams();

    // Add category parameters
    if (catChecked.length > 0) {
      catChecked.forEach((categoryId) => {
        params.append("category[]", categoryId);
      });
    }

    // Add brand parameters
    if (brandChecked.length > 0) {
      brandChecked.forEach((brandId) => {
        params.append("brand[]", brandId);
      });
    }

    setSearchParams(params);

    fetch(`${apiUrl}/get-products?${params}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setProducts(result.data);
        } else {
          console.log("Something went wrong!");
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const fetchCategories = () => {
    fetch(`${apiUrl}/get-categories`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setCategories(result.data);
        } else {
          console.log("Something went wrong!");
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  const fetchBrands = () => {
    fetch(`${apiUrl}/get-brands`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          setBrands(result.data);
        } else {
          console.log("Something went wrong!");
        }
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  };

  const handleCategory = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setCatChecked((pre) => [...pre, value]);
    } else {
      setCatChecked(catChecked.filter((id) => id !== value));
    }
  };

  const handleBrand = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setBrandChecked((pre) => [...pre, value]);
    } else {
      setBrandChecked(brandChecked.filter((id) => id !== value));
    }
  };

  const clearFilters = () => {
    setCatChecked([]);
    setBrandChecked([]);
    setSearchParams({});
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [catChecked, brandChecked]);

  return (
    <Layout>
      <div className="container-fluid px-5">
        <nav aria-label="breadcrumb" className="py-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Shop
            </li>
          </ol>
        </nav>
      </div>

      <div className="container-fluid px-5">
        <div className="row">
          <div className="col-md-3">
            <div className="card shadow border-0 mb-3">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="mb-0">Categories</h3>
                  {(catChecked.length > 0 || brandChecked.length > 0) && (
                    <button
                      onClick={clearFilters}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <ul className="list-unstyled">
                  {categories &&
                    categories.map((category) => (
                      <li className="mb-2" key={`cat-${category.id}`}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            checked={catChecked.includes(
                              category.id.toString()
                            )}
                            type="checkbox"
                            value={category.id}
                            onChange={handleCategory}
                            id={`category-${category.id}`}
                          />
                          <label
                            className="form-check-label ps-2"
                            htmlFor={`category-${category.id}`}
                          >
                            {category.name}
                          </label>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div className="card shadow border-0 mb-3">
              <div className="card-body p-4">
                <h3 className="mb-3">Brands</h3>
                <ul className="list-unstyled">
                  {brands &&
                    brands.map((brand) => (
                      <li className="mb-2" key={`brand-${brand.id}`}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            checked={brandChecked.includes(brand.id.toString())}
                            type="checkbox"
                            value={brand.id}
                            onChange={handleBrand}
                            id={`brand-${brand.id}`}
                          />
                          <label
                            className="form-check-label ps-2"
                            htmlFor={`brand-${brand.id}`}
                          >
                            {brand.name}
                          </label>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-9">
            {(catChecked.length > 0 || brandChecked.length > 0) && (
              <div className="alert alert-info mb-4">
                <strong>Active Filters:</strong>
                {catChecked.length > 0 && (
                  <span className="ms-2">Categories: {catChecked.length}</span>
                )}
                {brandChecked.length > 0 && (
                  <span className="ms-2">Brands: {brandChecked.length}</span>
                )}
              </div>
            )}

            <div className="row pb-5">
              {products && products.length > 0 ? (
                products.map((product) => (
                  <div
                    className="col-md-4 col-6 mb-4"
                    key={`product-${product.id}`}
                  >
                    <div className="product card border-0 h-100">
                      <div className="card-img">
                        <Link to={`/product/${product.id}`}>
                          <img
                            src={product.image_url || "/placeholder-image.jpg"}
                            alt={product.title}
                            className="w-100"
                            style={{ height: "250px", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.src = "/placeholder-image.jpg";
                            }}
                          />
                        </Link>
                      </div>
                      <div className="card-body pt-3">
                        <Link
                          to={`/product/${product.id}`}
                          className="text-decoration-none text-dark"
                        >
                          <h6 className="card-title">{product.title}</h6>
                        </Link>
                        <div className="price mt-2 fw-bold">
                          ${product.price}
                          {product.compare_price && (
                            <span className="text-decoration-line-through ms-2 text-muted small">
                              ${product.compare_price}
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <Link
                            to={`/product/${product.id}`}
                            className="btn btn-primary btn-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="text-center py-5">
                    <h4>No products found</h4>
                    <p className="text-muted">
                      {catChecked.length > 0 || brandChecked.length > 0
                        ? "Try adjusting your filters"
                        : "No products available at the moment"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
