import { useState, useEffect } from "react";
import { incomeService } from "@/services/api/incomeService";

export const useIncomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadIncomes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await incomeService.getAll();
      setIncomes(data);
    } catch (err) {
      setError("Error al cargar los ingresos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncomes();
  }, []);

  const createIncome = async (incomeData) => {
    try {
      const newIncome = await incomeService.create(incomeData);
      setIncomes(prev => [...prev, newIncome]);
      return newIncome;
    } catch (err) {
      throw new Error("Error al crear el ingreso");
    }
  };

  const updateIncome = async (id, incomeData) => {
    try {
      const updatedIncome = await incomeService.update(id, incomeData);
      setIncomes(prev => 
        prev.map(income => income.Id === parseInt(id) ? updatedIncome : income)
      );
      return updatedIncome;
    } catch (err) {
      throw new Error("Error al actualizar el ingreso");
    }
  };

  const deleteIncome = async (id) => {
    try {
      await incomeService.delete(id);
      setIncomes(prev => prev.filter(income => income.Id !== parseInt(id)));
    } catch (err) {
      throw new Error("Error al eliminar el ingreso");
    }
  };

  return {
    incomes,
    loading,
    error,
    loadIncomes,
    createIncome,
    updateIncome,
    deleteIncome
  };
};