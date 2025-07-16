import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  className 
}) => {
  const colors = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    error: "text-error bg-error/10"
  };

  const trendColors = {
    up: "text-success",
    down: "text-error",
    neutral: "text-gray-500"
  };

  return (
    <Card className={cn("hover:shadow-lg transition-shadow duration-200", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <div className={cn("flex items-center mt-2", trendColors[trend])}>
                <ApperIcon 
                  name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                  size={16} 
                  className="mr-1" 
                />
                <span className="text-sm font-medium">{trendValue}</span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-lg", colors[color])}>
            <ApperIcon name={icon} size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;