import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { Package, Loader2, Search } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/newarrivals");
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-neutral-50 pt-[100px] pb-8 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-secondary">
                All Products
              </h1>
              <p className="text-neutral-600 mt-1">
                Browse our complete collection of premium photo frames
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-neutral-300 rounded-xl focus:outline-primary focus:ring-2 focus:ring-primary-light transition"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
            <div className="text-center py-20 px-6">
              <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-secondary mb-2">
                {searchQuery ? "No products found" : "No products available"}
              </h3>
              <p className="text-neutral-600">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Check back soon for new products"}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 text-neutral-600">
              Showing {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => {
                const firstSize =
                  product.sizes && product.sizes.length > 0
                    ? product.sizes[0]
                    : null;

                return (
                  <Link
                    key={product._id || index}
                    to={`/newarrivalorderpage/${product._id}`}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group"
                  >
                    {/* Product Image */}
                    <div className="relative bg-neutral-100 aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400?text=No+Image";
                        }}
                      />
                      {index < 3 && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-secondary text-white text-xs font-medium px-2 py-1 rounded">
                            NEW
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-secondary mb-2 line-clamp-2 min-h-[3.5rem]">
                        {product.title}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        {firstSize ? (
                          <>
                            <span className="text-xl font-bold text-primary">
                              ₹{firstSize.price}
                            </span>
                            {firstSize.original &&
                              firstSize.original > firstSize.price && (
                                <span className="text-neutral-400 line-through text-sm">
                                  ₹{firstSize.original}
                                </span>
                              )}
                          </>
                        ) : (
                          <span className="text-error text-sm font-medium">
                            Price not available
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        <div className="flex text-warning">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-sm">
                              {i < Math.round(product.rating || 4) ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                        <span className="text-neutral-500 text-sm ml-2">
                          ({product.rating || 4})
                        </span>
                      </div>

                      {/* Buy Now Button */}
                      <button className="w-full py-2.5 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors">
                        Buy Now
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;

