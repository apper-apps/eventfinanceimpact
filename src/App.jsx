import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Events from "@/components/pages/Events";
import Expenses from "@/components/pages/Expenses";
import Incomes from "@/components/pages/Incomes";
import Approvals from "@/components/pages/Approvals";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="eventos" element={<Events />} />
          <Route path="gastos" element={<Expenses />} />
          <Route path="ingresos" element={<Incomes />} />
          <Route path="aprobaciones" element={<Approvals />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </>
  );
}

export default App;