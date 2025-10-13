// 📁 src/pages/admin/FrameCustomizeAdmin.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Pencil, Trash2, Plus, Palette, Shapes, Image, Loader, Sparkles } from "lucide-react";
import FrameForm from "./FrameForm";

const FrameCustomizeAdmin = () => {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editFrame, setEditFrame] = useState(null);

  useEffect(() => {
    fetchFrames();
  }, []);

  const fetchFrames = async () => {
    try {
      const res = await axiosInstance.get("/framecustomize");
      console.log("Admin frames data:", res.data);
      const onlyShapeData = res.data.map((item) => ({
        _id: item._id,
        shapeData: item.shapeData,
      }));
      console.log("Processed shape data:", onlyShapeData);
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
    }
  };

  const ShapeGroup = ({ shapeData, id }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Shapes className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{shapeData.shape}</h2>
            <p className="text-sm text-gray-600">
              {shapeData.colorOptions.length} colors • 
              {shapeData.colorOptions.reduce((total, color) => total + color.styles.length, 0)} styles
            </p>
          </div>
        </div>
      </div>

      {/* Color Options */}
      <div className="p-6">
        {shapeData.colorOptions.map((color, colorIdx) => (
          <div key={colorIdx} className="mb-8 last:mb-0">
            {/* Color Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                <Palette className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-gray-700">{color.color}</span>
                <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                  {color.styles.length} styles
                </span>
              </div>
              </div>

            {/* Styles Grid */}
            <div className="grid grid-cols-1 gap-6">
              {color.styles.map((style, styleIdx) => (
                <div key={styleIdx} className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                  {/* Style Header */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-5 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <h3 className="font-semibold text-gray-800">{style.styleName}</h3>
                      <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                        {style.frameImages.length} frames
              </span>
                    </div>
            </div>

            {/* Frame Images Grid */}
                  <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {style.frameImages.filter(frame => frame.imageUrl && frame.imageUrl.trim()).map((frame, frameIdx) => {
                        console.log("Admin frame image URL:", frame.imageUrl);
                        return (
                          <div key={frameIdx} className="group relative bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                            <div className="relative overflow-hidden rounded-md mb-3">
                              <img
                                src={frame.imageUrl}
                                alt={frame.title}
                                className="w-full h-28 object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  console.error("Admin image failed to load:", frame.imageUrl);
                                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5VjE1TTkgMTJIMTUiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+";
                                }}
                              />
                            </div>
                  
                  <div className="space-y-2">
                            <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{frame.title}</h4>
                    
                    <div className="space-y-1">
                      {frame.sizes.slice(0, 2).map((size, sizeIdx) => (
                        <div key={sizeIdx} className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">{size.label}</span>
                          <span className="font-medium text-green-600">₹{size.amount}</span>
                        </div>
                      ))}
                      {frame.sizes.length > 2 && (
                        <div className="text-xs text-gray-500 text-center pt-1">
                          +{frame.sizes.length - 2} more sizes
                        </div>
                      )}
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditFrame({ _id: id, shapeData });
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Pencil className="w-4 h-4" />
            Edit Frame
          </button>
          <button
            onClick={() => deleteFrame(id)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 text-sm font-medium rounded-lg border border-red-200 hover:border-red-500 hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  // ... rest of the component remains the same
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading frames...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Frame Customization
              </h1>
              <p className="text-gray-600">
                Manage your frame shapes, colors, styles, and pricing
              </p>
            </div>
            <button
              onClick={() => {
                setEditFrame(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Add New Frame
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Shapes className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{frames.length}</p>
                <p className="text-gray-600 text-sm">Total Shapes</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Palette className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {frames.reduce((total, frame) => total + frame.shapeData.colorOptions.length, 0)}
                </p>
                <p className="text-gray-600 text-sm">Colors</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {frames.reduce((total, frame) => 
                    total + frame.shapeData.colorOptions.reduce((colorTotal, color) => 
                      colorTotal + color.styles.length, 0
                    ), 0
                  )}
                </p>
                <p className="text-gray-600 text-sm">Styles</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Image className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {frames.reduce((total, frame) => 
                    total + frame.shapeData.colorOptions.reduce((colorTotal, color) => 
                      colorTotal + color.styles.reduce((styleTotal, style) => 
                        styleTotal + style.frameImages.length, 0
                      ), 0
                    ), 0
                  )}
                </p>
                <p className="text-gray-600 text-sm">Total Frames</p>
              </div>
            </div>
          </div>
        </div>

        {/* Frames List */}
        <div className="space-y-6">
          {frames.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <Shapes className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No frames yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first frame customization</p>
                <button
                  onClick={() => {
                    setEditFrame(null);
                    setShowForm(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Create First Frame
                </button>
              </div>
            </div>
          ) : (
            frames.map((item) => (
              <ShapeGroup key={item._id} id={item._id} shapeData={item.shapeData} />
            ))
          )}
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editFrame ? "Edit Frame" : "Add New Frame"}
                </h2>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
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
              
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-white transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FrameCustomizeAdmin;