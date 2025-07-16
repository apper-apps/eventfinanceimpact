import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const NavigationItem = ({ to, icon, label, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary text-white shadow-lg"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        )
      }
    >
      <ApperIcon name={icon} size={20} className="mr-3" />
      {label}
    </NavLink>
  );
};

export default NavigationItem;