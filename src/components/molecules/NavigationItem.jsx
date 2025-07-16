import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NavigationItem = ({ to, icon, label, onClick, collapsed }) => {
  return (
<NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center rounded-lg text-sm font-medium transition-all duration-200 group relative",
          collapsed ? "px-2 py-2 justify-center" : "px-3 py-2",
          isActive
            ? "bg-primary text-white shadow-lg"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        )
      }
    >
      <ApperIcon 
        name={icon} 
        size={20} 
        className={collapsed ? "" : "mr-3"} 
      />
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
{label}
        </div>
      )}
      {!collapsed && label}
    </NavLink>
  );
};

export default NavigationItem;