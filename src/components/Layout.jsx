import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
<Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
        />
        
        <div className={`flex-1 flex flex-col overflow-hidden ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
          <Header 
            title="EventFinance AI"
            onMenuToggle={() => setSidebarOpen(true)}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            sidebarCollapsed={sidebarCollapsed}
          />
          
<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;