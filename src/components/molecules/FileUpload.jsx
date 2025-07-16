import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const FileUpload = ({ onFileSelect, acceptedTypes = "image/*,.pdf", className }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files[0]);
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    onFileSelect(file);
    toast.success("Archivo cargado correctamente");
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200",
          isDragOver 
            ? "border-primary bg-primary/5" 
            : "border-gray-300 hover:border-gray-400"
        )}
      >
        <ApperIcon name="Upload" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">
          Arrastra tu comprobante aquí o{" "}
          <label className="text-primary cursor-pointer hover:underline">
            selecciona un archivo
            <input
              type="file"
              accept={acceptedTypes}
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </label>
        </p>
        <p className="text-xs text-gray-500">
          Acepta imágenes (JPG, PNG) y PDF hasta 10MB
        </p>
      </div>

      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Vista previa"
            className="max-w-full h-48 object-cover rounded-lg border"
          />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <ApperIcon name="X" size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;