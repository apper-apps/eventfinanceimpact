import expensesData from "@/services/mockData/expenses.json";
import { budgetService } from "./budgetService";

let expenses = [...expensesData];

export const expenseService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...expenses];
  },

  async getByEventId(eventId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return expenses.filter(exp => exp.eventoId === eventId.toString());
  },

  async getPendingApprovals() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return expenses.filter(exp => exp.status === "pendiente");
  },

  async create(expenseData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newExpense = {
      ...expenseData,
      Id: Math.max(...expenses.map(e => e.Id)) + 1,
      status: "pendiente",
      usuarioId: "1" // Simular usuario actual
    };
    expenses.push(newExpense);
    return { ...newExpense };
  },

  async approve(id, comment = "") {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = expenses.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      expenses[index].status = "aprobado";
      expenses[index].comment = comment;
      
      // Actualizar el presupuesto gastado
      await budgetService.updateSpentAmount(expenses[index].rubroId, expenses[index].monto);
      
      return { ...expenses[index] };
    }
    return null;
  },

  async reject(id, comment = "") {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = expenses.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      expenses[index].status = "rechazado";
      expenses[index].comment = comment;
      return { ...expenses[index] };
    }
    return null;
  }
};