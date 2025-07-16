import { useState, useEffect } from "react";
import { expenseService } from "@/services/api/expenseService";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await expenseService.getAll();
      setExpenses(data);
    } catch (err) {
      setError("Error al cargar los gastos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const createExpense = async (expenseData) => {
    try {
      const newExpense = await expenseService.create(expenseData);
      setExpenses(prev => [...prev, newExpense]);
      return newExpense;
    } catch (err) {
      throw new Error("Error al crear el gasto");
    }
  };

  const approveExpense = async (id, comment) => {
    try {
      const updatedExpense = await expenseService.approve(id, comment);
      setExpenses(prev => 
        prev.map(exp => exp.Id === id ? updatedExpense : exp)
      );
      return updatedExpense;
    } catch (err) {
      throw new Error("Error al aprobar el gasto");
    }
  };

  const rejectExpense = async (id, comment) => {
    try {
      const updatedExpense = await expenseService.reject(id, comment);
      setExpenses(prev => 
        prev.map(exp => exp.Id === id ? updatedExpense : exp)
      );
      return updatedExpense;
    } catch (err) {
      throw new Error("Error al rechazar el gasto");
    }
  };

  return {
    expenses,
    loading,
    error,
    loadExpenses,
    createExpense,
    approveExpense,
    rejectExpense
  };
};