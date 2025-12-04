import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

const SpecialOffersProducts = () => {
  const [specialoffersItems, setSpecialoffersItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSizes, setSelectedSizes] = useState({});

  useEffect(() => {
    const fetchSpecialOffers = async () => {
      try {
        const response = await axios.get(
          "https://api.photoparkk.com/api/specialoffers"
        );
        setSpecialoffersItems(
          Array.isArray(response.data) ? response.data : []
        );
      } catch (error) {
        console.error("Failed to fetch special offers:", error);
        setSpecialoffersItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialOffers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await axios.delete(`https://api.photoparkk.com/api/specialoffers/${id}`);
      setSpecialoffersItems((prevItems) =>
        prevItems.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleSizeClick = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  // Filter products based on search query
  const filteredProducts = specialoffersItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title?.toLowerCase().includes(query) ||
      item.content?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 text-slate-900 rounded-lg focus:outline-indigo-600 focus:ring-2 focus:ring-indigo-200 transition"
          />
        </div>
        <Link to="/admin/specialoffersaddform">
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition shadow-sm">
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </Link>
      </div>

      {/* Products Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredProducts.length} of {specialoffersItems.length}{" "}
        products
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            {searchQuery
              ? "No products found matching your search"
              : "No products available"}
          </p>
          {!searchQuery && (
            <Link to="/admin/specialoffersaddform">
              <button className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium">
                Add your first product →
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((item) => {
            const selectedSize = selectedSizes[item._id] || item.sizes?.[0];
            return (
              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Product Image */}
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-full flex items-center justify-center bg-gray-100"
                    style={{ display: item.image ? "none" : "flex" }}
                  >
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.content}
                  </p>

                  {/* Price */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-indigo-600">
                        ₹{selectedSize?.price || 0}
                      </span>
                      {selectedSize?.original && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{selectedSize.original}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Thickness */}
                  {item.thickness && (
                    <p className="text-xs text-gray-600 mb-3">
                      Thickness:{" "}
                      <span className="font-medium">{item.thickness}</span>
                    </p>
                  )}

                  {/* Sizes */}
                  {item.sizes && item.sizes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.sizes.map((size, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSizeClick(item._id, size)}
                          className={`text-xs px-2.5 py-1 border rounded-md transition ${
                            selectedSize?.label === size.label
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Stock */}
                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        item.stock === "In Stock"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.stock || "In Stock"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto flex gap-2">
                    <Link
                      to={`/admin/specialoffersupdateform/${item._id}`}
                      className="flex-1"
                    >
                      <button className="w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 py-2 rounded-lg hover:bg-indigo-100 transition font-medium text-sm">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition font-medium text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SpecialOffersProducts;
