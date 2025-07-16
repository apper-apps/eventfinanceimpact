import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ title, onMenuToggle, onToggleCollapse, sidebarCollapsed, className }) => {
  return (
    <header className={cn("bg-white border-b border-gray-200 px-4 py-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
<Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={24} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="hidden lg:flex"
          >
            <ApperIcon name={sidebarCollapsed ? "PanelLeftOpen" : "PanelLeftClose"} size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-display text-gray-900">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" size={20} />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">AD</span>
            </div>
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;