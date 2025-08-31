import React, { useEffect, useState } from "react";
import ProductImg from "../../assets/images/eight.jpg";
import { apiUrl } from "../common/http";
import { Link } from "react-router-dom";

const LatestProducts = () => {
  // NO async keyword here!

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const latestProducts = () => {
      fetch(apiUrl + "/get-latest-products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((result) => {
          setProducts(result.data || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setLoading(false);
        });
    };

    latestProducts();
  }, []);

  if (loading) {
    return (
      <section className="section-2 pt-5">
        <div className="container-fluid px-5">
          <h2>New Arrivals</h2>
          <div className="row mt-4">
            <div className="col-12">Loading products...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-2 pt-5">
      <div className="container-fluid px-5">
        <h2>New Arrivals</h2>
        <div className="row mt-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div className="col-md-3 col-6" key={`product-${product.id}`}>
                <div className="product card border-0">
                  <div className="card-img">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image_url || ProductImg}
                        alt={product.title || "Product"}
                        className="w-100"
                        onError={(e) => {
                          e.target.src = ProductImg;
                        }}
                      />
                    </Link>
                  </div>
                  <div className="card-body pt-3">
                    <Link to={`/product/${product.id}`}>
                      {product.title || "Untitled Product"}
                    </Link>
                    <div className="price mt-2">
                      ${product.price || "0.00"}
                      {product.compare_price && (
                        <span className="text-decoration-line-through ms-2">
                          ${product.compare_price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestProducts;
