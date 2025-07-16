import React from "react";
import { cn } from "@/utils/cn";
import NavigationItem from "@/components/molecules/NavigationItem";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose, collapsed, className }) => {
  const navigationItems = [
    { to: "/", icon: "BarChart3", label: "Dashboard" },
    { to: "/eventos", icon: "Calendar", label: "Eventos" },
    { to: "/gastos", icon: "Receipt", label: "Gastos" },
    { to: "/ingresos", icon: "TrendingUp", label: "Ingresos" },
    { to: "/aprobaciones", icon: "CheckCircle", label: "Aprobaciones" }
  ];

  return (
    <>
{/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:block bg-white border-r border-gray-200 h-full transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}>
        <div className={collapsed ? "p-3" : "p-6"}>
          <div className={cn(
            "flex items-center mb-8",
            collapsed ? "justify-center" : "space-x-3"
          )}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={24} className="text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-xl font-bold text-display text-gray-900">
                  EventFinance
                </h2>
                <p className="text-sm text-gray-500">AI</p>
              </div>
            )}
          </div>
          
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <div className="relative flex flex-col w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Zap" size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-display text-gray-900">
                      EventFinance
                    </h2>
                    <p className="text-sm text-gray-500">AI</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <NavigationItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    onClick={onClose}
                  />
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;