import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Upload, X, Image, Eye, Sparkles, CheckCircle2 } from "lucide-react";
import LoadingBar from "../../Components/LoadingBar";
import { toast } from "react-toastify";

const AcrylicSquare = () => {
  const [photoData, setPhotoData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = async (file) => {
    if (!file.type.match("image.*")) {
      toast.error("Please select a valid image");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "/api/acryliccustomize/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      const imageUrl = res.data.imageUrl || res.data.uploadedImageUrl;

      setPhotoData({
        url: imageUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      });
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleReplaceClick = () => {
    fileInputRef.current.click();
  };

  const handleRemovePhoto = () => {
    setPhotoData(null);
  };

  const handlePreviewClick = () => {
    if (!photoData) {
      toast.error("Please upload a photo first.");
      return;
    }
    navigate("/AcrylicSquareOrder", { state: { photoData } });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Acrylic Square Frame</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Customize Your Acrylic Square
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your favorite photo and see it come to life in a beautiful acrylic square frame
          </p>
        </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/*"
        className="hidden"
      />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Image className="w-6 h-6" />
                Upload Your Photo
            </h2>
            </div>
            
            <div className="p-6">
            {!photoData ? (
                             <div
                  onDragOver={handleDragOver}
                 onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                   isUploading
                     ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                     : isDragging
                      ? "border-blue-500 bg-blue-50 scale-[1.02]"
                      : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                 }`}
               >
                  <div className="flex flex-col items-center justify-center space-y-6">
                   {isUploading ? (
                     <>
                       <div className="bg-gray-100 p-3 rounded-full">
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                       </div>
                        <p className="text-lg font-semibold text-gray-700">
                         Uploading your image...
                       </p>
                       <div className="w-full max-w-xs">
                         <div className="flex justify-between text-sm text-gray-600 mb-2">
                           <span>Progress</span>
                           <span>{uploadProgress}%</span>
                         </div>
                         <div className="w-full bg-gray-200 rounded-full h-2">
                           <div
                             className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                             style={{ width: `${uploadProgress}%` }}
                           ></div>
                         </div>
                       </div>
                     </>
                   ) : (
                     <>
                        <div className={`p-4 rounded-full transition-all ${
                          isDragging ? "bg-blue-100 scale-110" : "bg-gray-100"
                        }`}>
                          <Image className={`w-12 h-12 transition-colors ${
                            isDragging ? "text-blue-600" : "text-gray-500"
                          }`} />
                       </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-700 mb-2">
                            Drag and drop your photo here
                       </p>
                          <p className="text-sm text-gray-500 mb-4">or</p>
                       <button
                         onClick={handleReplaceClick}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                       >
                            <Upload className="w-5 h-5" />
                            Browse Files
                       </button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>PNG, JPG, GIF up to 10MB</span>
                        </div>
                     </>
                   )}
                 </div>
              </div>
            ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                      <div>
                        <p className="font-semibold text-gray-900">{photoData.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(photoData.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemovePhoto}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                  <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner">
                     <img
                       src={photoData.url}
                       alt="Uploaded preview"
                      className="w-full h-full object-contain"
                     />
                 </div>

                                     <button
                     onClick={handleReplaceClick}
                     disabled={isUploading}
                    className="w-full py-3 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Upload className="w-5 h-5" />
                         Replace Photo
                   </button>
                </div>
              )}
              </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Eye className="w-6 h-6" />
                  Live Preview
              </h2>
              <button
                onClick={handlePreviewClick}
                disabled={!photoData}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  photoData
                      ? "bg-white text-purple-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                      : "bg-white/20 text-white/50 cursor-not-allowed"
                }`}
              >
                  View Full Preview
              </button>
              </div>
            </div>

            <div className="p-8">
              <div className="relative w-full max-w-sm mx-auto">
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-2xl border-8 border-gray-800">
              {photoData ? (
                <img
                  src={photoData.url}
                  alt="Square Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <div className="p-4 bg-gray-200 rounded-full mb-4">
                        <Image className="w-12 h-12" />
                      </div>
                      <p className="text-lg font-medium mb-2">No image selected</p>
                      <p className="text-sm text-center px-4">
                        Upload a photo to see your acrylic square preview
                      </p>
                    </div>
                  )}
                </div>
                {photoData && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Square Frame</span>
                  </div>
                )}
              </div>

              {photoData && (
                <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-gray-700 text-center">
                    <span className="font-semibold">Ready to proceed?</span> Click "View Full Preview" to continue with your order.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isUploading && <LoadingBar progress={uploadProgress} />}
    </div>
  );
};

export default AcrylicSquare;
