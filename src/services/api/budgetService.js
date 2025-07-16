import budgetData from "@/services/mockData/budgetCategories.json";

let budgetCategories = [...budgetData];

export const budgetService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...budgetCategories];
  },

  async getByEventId(eventId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return budgetCategories.filter(cat => cat.eventoId === eventId.toString());
  },

  async create(categoryData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newCategory = {
      ...categoryData,
      Id: Math.max(...budgetCategories.map(c => c.Id)) + 1,
      gastado: 0
    };
    budgetCategories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, categoryData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = budgetCategories.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      budgetCategories[index] = { ...budgetCategories[index], ...categoryData };
      return { ...budgetCategories[index] };
    }
    return null;
  },

  async updateSpentAmount(id, amount) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = budgetCategories.findIndex(c => c.Id === parseInt(id));
    if (index !== -1) {
      budgetCategories[index].gastado += amount;
      return { ...budgetCategories[index] };
    }
    return null;
  }
};