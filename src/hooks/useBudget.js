import { useState, useEffect } from "react";
import { budgetService } from "@/services/api/budgetService";

export const useBudget = () => {
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBudgetCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await budgetService.getAll();
      setBudgetCategories(data);
    } catch (err) {
      setError("Error al cargar las categorías presupuestales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgetCategories();
  }, []);

  const createBudgetCategory = async (categoryData) => {
    try {
      const newCategory = await budgetService.create(categoryData);
      setBudgetCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      throw new Error("Error al crear la categoría presupuestal");
    }
  };

  const updateBudgetCategory = async (id, categoryData) => {
    try {
      const updatedCategory = await budgetService.update(id, categoryData);
      setBudgetCategories(prev => 
        prev.map(cat => cat.Id === parseInt(id) ? updatedCategory : cat)
      );
      return updatedCategory;
    } catch (err) {
      throw new Error("Error al actualizar la categoría presupuestal");
    }
  };

  const getBudgetByEventId = (eventId) => {
    return budgetCategories.filter(cat => cat.eventoId === eventId.toString());
  };

  return {
    budgetCategories,
    loading,
    error,
    loadBudgetCategories,
    createBudgetCategory,
    updateBudgetCategory,
    getBudgetByEventId
  };
};