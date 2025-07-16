import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" size={32} className="text-red-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Error al cargar los datos
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message || "Ha ocurrido un error inesperado. Por favor, intenta nuevamente."}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} className="flex items-center space-x-2">
          <ApperIcon name="RefreshCw" size={16} />
          <span>Reintentar</span>
        </Button>
      )}
    </div>
  );
};

export default Error;