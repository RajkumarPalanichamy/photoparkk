import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import LoadingBar from "../../Components/LoadingBar";
import { Upload, X, Image, Eye, Sparkles, CheckCircle2, Lightbulb } from "lucide-react";
import {
  MAX_UPLOAD_SIZE_BYTES,
  MAX_UPLOAD_SIZE_MB,
} from "../../constants/upload";

const BacklightSquare = () => {
  const [photoData, setPhotoData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = async (file) => {
    if (!file.type.match("image.*")) {
      toast.error("Please select a valid image");
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      toast.error(
        `File size should be less than ${MAX_UPLOAD_SIZE_MB}MB. Your file is ${(
          file.size /
          (1024 * 1024)
        ).toFixed(1)}MB.`
      );
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const res = await axiosInstance.post("/backlightcustomize/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      const imageUrl = res.data.imageUrl || res.data.uploadedImageUrl;
      setPhotoData({
        url: imageUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      });

      toast.success("Image upload successful!");
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
    navigate("/BacklightSquareOrderpage", { state: { photoData } });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="bg-neutral-50 pt-[100px] pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full mb-4">
            <Lightbulb className="w-5 h-5" />
            <span className="font-semibold">Backlight Square Frame</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-3">
            Customize Your Backlight Square
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Upload your favorite photo and see it glow in a beautiful backlit square frame
          </p>
        </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/*"
        className="hidden"
      />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200">
            <div className="bg-primary px-6 py-4">
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
                      ? "border-neutral-200 bg-neutral-50 cursor-not-allowed"
                      : isDragging
                      ? "border-yellow-500 bg-yellow-50 scale-[1.02]"
                      : "border-neutral-300 hover:border-yellow-400 hover:bg-neutral-50"
                  }`}
              >
                  <div className="flex flex-col items-center justify-center space-y-6">
                    {isUploading ? (
                      <>
                  <div className="bg-neutral-100 p-3 rounded-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                        </div>
                        <p className="text-lg font-semibold text-neutral-700">
                          Uploading your image...
                        </p>
                        <div className="w-full max-w-xs">
                          <div className="flex justify-between text-sm text-neutral-600 mb-2">
                            <span>Progress</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={`p-4 rounded-full transition-all ${
                          isDragging ? "bg-yellow-100 scale-110" : "bg-neutral-100"
                        }`}>
                          <Image className={`w-12 h-12 transition-colors ${
                            isDragging ? "text-yellow-600" : "text-neutral-500"
                          }`} />
                  </div>
                        <div>
                          <p className="text-lg font-semibold text-neutral-700 mb-2">
                            Drag and drop your photo here
                  </p>
                          <p className="text-sm text-neutral-500 mb-4">or</p>
                  <button
                    onClick={handleReplaceClick}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                            <Upload className="w-5 h-5" />
                            Browse Files
                  </button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>PNG, JPG, GIF up to 5MB</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-success-light rounded-lg flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-secondary truncate">{photoData.name}</p>
                        <p className="text-sm text-neutral-500">{formatFileSize(photoData.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemovePhoto}
                      className="p-2 rounded-lg text-neutral-400 hover:text-error hover:bg-error-light transition-colors flex-shrink-0 ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                  <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden border-2 border-neutral-200 shadow-inner">
                  <img
                    src={photoData.url}
                    alt="Uploaded preview"
                      className="w-full h-full object-contain"
                  />
                </div>

                  <button
                    onClick={handleReplaceClick}
                    disabled={isUploading}
                    className="w-full py-3 px-4 bg-secondary text-white rounded-lg hover:bg-secondary transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Upload className="w-5 h-5" />
                    Replace Photo
                  </button>
                </div>
              )}
              </div>
            {isUploading && (
            <LoadingBar 
              progress={uploadProgress} 
              isUploading={isUploading} 
              message="Uploading your backlight frame image..."
            />
            )}
          </div>

          {/* Preview Section with Light Toggle */}
          <div className={`rounded-2xl shadow-xl overflow-hidden border border-neutral-200 transition-colors ${
            lightOn ? "bg-gradient-to-br from-gray-900 to-black" : "bg-white"
          }`}>
            <div className={`px-6 py-4 transition-colors ${
              lightOn 
                ? "bg-primary" 
                : "bg-primary"
            }`}>
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
                      ? "bg-white text-primary hover:bg-neutral-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                      : "bg-white/20 text-white/50 cursor-not-allowed"
                }`}
              >
                  View Full Preview
              </button>
              </div>
            </div>

            <div className="p-8 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-sm mb-6">
              {/* Light Toggle */}
                <div className={`flex items-center justify-center gap-3 mb-6 p-4 rounded-xl border ${
                  lightOn 
                    ? "bg-yellow-400/20 border-yellow-400/30" 
                    : "bg-neutral-50 border-neutral-200"
                }`}>
                <Lightbulb className={`w-5 h-5 ${lightOn ? "text-warning" : "text-neutral-400"}`} />
              <label
                htmlFor="lightToggle"
                  className={`text-lg font-medium cursor-pointer ${
                    lightOn ? "text-warning" : "text-neutral-700"
                  }`}
              >
                  {lightOn ? "Light On" : "Light Off"}
              </label>
              <input
                id="lightToggle"
                type="checkbox"
                checked={lightOn}
                onChange={() => setLightOn(!lightOn)}
                  className="w-6 h-6 accent-yellow-400 cursor-pointer"
              />
            </div>
            <div
                  className={`relative aspect-square mx-auto rounded-2xl overflow-hidden transition-all duration-500 ${
                lightOn
                      ? "border-8 border-yellow-300 shadow-[0_0_60px_20px_rgba(253,224,71,0.5)]"
                      : "border-8 border-neutral-secondary shadow-2xl"
              }`}
            >
              {lightOn && (
                    <div className="absolute inset-0 bg-yellow-300 opacity-30 blur-3xl z-0 animate-pulse" />
              )}
              {photoData ? (
                <img
                  src={photoData.url}
                  alt="Square Preview"
                  className="relative z-10 w-full h-full object-cover"
                />
              ) : (
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-neutral-400">
                      <div className="p-4 bg-neutral-200 rounded-full mb-4">
                        <Image className="w-12 h-12" />
                      </div>
                      <p className="text-lg font-medium mb-2">No image selected</p>
                      <p className="text-sm text-center px-4">
                        Upload a photo to see your backlight square preview
                      </p>
                    </div>
                  )}
                </div>
                {photoData && (
                  <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full shadow-lg border ${
                    lightOn 
                      ? "bg-yellow-400 text-secondary border-yellow-500" 
                      : "bg-white text-neutral-700 border-neutral-200"
                  }`}>
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Lightbulb className={`w-4 h-4 ${lightOn ? "text-secondary" : "text-neutral-500"}`} />
                      Backlight Frame
                    </span>
                  </div>
                )}
              </div>

              {photoData && (
                <div className="mt-6 text-center w-full">
                  <p className={`text-sm ${
                    lightOn ? "text-neutral-300" : "text-neutral-600"
                  }`}>
                    <span className={`font-semibold ${
                      lightOn ? "text-white" : "text-secondary"
                    }`}>Ready to proceed?</span> Toggle the light to preview and click "View Full Preview" to continue.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacklightSquare;
