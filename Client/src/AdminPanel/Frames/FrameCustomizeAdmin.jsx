// 📁 src/pages/admin/FrameCustomizeAdmin.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  Pencil,
  Trash2,
  Plus,
  Palette,
  Shapes,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Frame,
  Search,
  X,
} from "lucide-react";
import FrameForm from "./FrameForm";

const FrameCustomizeAdmin = () => {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editFrame, setEditFrame] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFrames();
  }, []);

  const fetchFrames = async () => {
    try {
      const res = await axiosInstance.get("/framecustomize");
      const onlyShapeData = res.data.map((item) => ({
        _id: item._id,
        shapeData: item.shapeData,
      }));
      setFrames(onlyShapeData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteFrame = async (id) => {
    if (!window.confirm("Are you sure you want to delete this frame?")) return;
    try {
      await axiosInstance.delete(`/framecustomize/${id}`);
      fetchFrames();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete frame. Please try again.");
    }
  };

  // Filter frames based on search
  const filteredFrames = frames.filter((frame) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      frame.shapeData.shape?.toLowerCase().includes(query) ||
      frame.shapeData.colorOptions?.some((color) =>
        color.color?.toLowerCase().includes(query)
      )
    );
  });

  const ShapeGroup = ({ shapeData, id }) => (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden mb-6 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-lg">
              <Shapes className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary">
                {shapeData.shape}
              </h2>
              <p className="text-sm text-neutral-600 mt-0.5">
                {shapeData.colorOptions.length} colors •{" "}
                {shapeData.colorOptions.reduce(
                  (total, color) => total + color.styles.length,
                  0
                )}{" "}
                styles
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditFrame({ _id: id, shapeData });
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 text-secondary text-sm font-medium rounded-lg hover:bg-neutral-50 hover:border-primary transition"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => deleteFrame(id)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-300 text-error text-sm font-medium rounded-lg hover:bg-error-light transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Color Options */}
      <div className="p-6">
        {shapeData.colorOptions.map((color, colorIdx) => (
          <div key={colorIdx} className="mb-8 last:mb-0">
            {/* Color Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-lg border border-neutral-200">
                <Palette className="w-4 h-4 text-secondary" />
                <span className="font-semibold text-secondary">
                  {color.color}
                </span>
                <span className="text-xs text-neutral-600 bg-white px-2 py-1 rounded-full border border-neutral-200">
                  {color.styles.length} styles
                </span>
              </div>
            </div>

            {/* Styles Grid */}
            <div className="grid grid-cols-1 gap-4">
              {color.styles.map((style, styleIdx) => (
                <div
                  key={styleIdx}
                  className="border border-neutral-200 rounded-lg bg-white overflow-hidden"
                >
                  {/* Style Header */}
                  <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-secondary" />
                      <h3 className="font-semibold text-secondary">
                        {style.styleName}
                      </h3>
                      <span className="text-xs text-neutral-600 bg-white px-2 py-1 rounded-full border border-neutral-200">
                        {style.frameImages.length} frames
                      </span>
                    </div>
                  </div>

                  {/* Frame Images Grid */}
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {style.frameImages
                        .filter(
                          (frame) => frame.imageUrl && frame.imageUrl.trim()
                        )
                        .map((frame, frameIdx) => (
                          <div
                            key={frameIdx}
                            className="group relative bg-white rounded-lg p-3 border border-neutral-200 hover:border-neutral-300 transition-all duration-200 hover:shadow-md"
                          >
                            <div className="relative overflow-hidden rounded-md mb-3">
                              <img
                                src={frame.imageUrl}
                                alt={frame.title}
                                className="w-full h-32 object-cover rounded-md transition-transform duration-200 group-hover:scale-105"
                                onError={(e) => {
                                  e.target.src =
                                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5VjE1TTkgMTJIMTUiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+";
                                }}
                              />
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium text-secondary text-sm line-clamp-1">
                                {frame.title}
                              </h4>

                              <div className="space-y-1">
                                {frame.sizes
                                  .slice(0, 2)
                                  .map((size, sizeIdx) => (
                                    <div
                                      key={sizeIdx}
                                      className="flex justify-between items-center text-xs"
                                    >
                                      <span className="text-neutral-600">
                                        {size.label}
                                      </span>
                                      <span className="font-medium text-secondary">
                                        ₹{size.amount}
                                      </span>
                                    </div>
                                  ))}
                                {frame.sizes.length > 2 && (
                                  <div className="text-xs text-neutral-500 text-center pt-1">
                                    +{frame.sizes.length - 2} more sizes
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-neutral-600">Loading frames...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-neutral-100 rounded-lg">
            <Frame className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary">
              Frame Management
            </h1>
            <p className="text-neutral-500 mt-1">
              Manage your frame shapes, colors, styles, and pricing
            </p>
          </div>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by shape or color..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-300 text-slate-900 rounded-lg focus:outline-primary focus:ring-2 focus:ring-primary-light transition"
          />
        </div>
        <button
          onClick={() => {
            setEditFrame(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-hover transition shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add New Frame
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neutral-100 rounded-lg">
              <Shapes className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">
                {frames.length}
              </p>
              <p className="text-neutral-600 text-sm">Total Shapes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success-light rounded-lg">
              <Palette className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">
                {frames.reduce(
                  (total, frame) => total + frame.shapeData.colorOptions.length,
                  0
                )}
              </p>
              <p className="text-neutral-600 text-sm">Colors</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neutral-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">
                {frames.reduce(
                  (total, frame) =>
                    total +
                    frame.shapeData.colorOptions.reduce(
                      (colorTotal, color) => colorTotal + color.styles.length,
                      0
                    ),
                  0
                )}
              </p>
              <p className="text-neutral-600 text-sm">Styles</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning-light rounded-lg">
              <ImageIcon className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">
                {frames.reduce(
                  (total, frame) =>
                    total +
                    frame.shapeData.colorOptions.reduce(
                      (colorTotal, color) =>
                        colorTotal +
                        color.styles.reduce(
                          (styleTotal, style) =>
                            styleTotal + style.frameImages.length,
                          0
                        ),
                      0
                    ),
                  0
                )}
              </p>
              <p className="text-neutral-600 text-sm">Total Frames</p>
            </div>
          </div>
        </div>
      </div>

      {/* Frames Count */}
      <div className="mb-4 text-sm text-neutral-600">
        Showing {filteredFrames.length} of {frames.length} frame shapes
      </div>

      {/* Frames List */}
      <div className="space-y-6">
        {filteredFrames.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-300">
            <Shapes className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary mb-2">
              {searchQuery
                ? "No frames found matching your search"
                : "No frames yet"}
            </h3>
            <p className="text-neutral-600 mb-6">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Get started by creating your first frame customization"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => {
                  setEditFrame(null);
                  setShowForm(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition"
              >
                <Plus className="w-5 h-5" />
                Create First Frame
              </button>
            )}
          </div>
        ) : (
          filteredFrames.map((item) => (
            <ShapeGroup
              key={item._id}
              id={item._id}
              shapeData={item.shapeData}
            />
          ))
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-100 rounded-lg">
                  {editFrame ? (
                    <Pencil className="w-5 h-5 text-secondary" />
                  ) : (
                    <Plus className="w-5 h-5 text-secondary" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-secondary">
                    {editFrame ? "Edit Frame" : "Add New Frame"}
                  </h2>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    {editFrame
                      ? "Update frame details and settings"
                      : "Create a new frame customization"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto flex-1 p-6 bg-neutral-50">
              <FrameForm
                initialData={
                  editFrame
                    ? { ...editFrame.shapeData, _id: editFrame._id }
                    : null
                }
                onSuccess={() => {
                  fetchFrames();
                  setShowForm(false);
                }}
                onClose={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrameCustomizeAdmin;
