import incomesData from "@/services/mockData/incomes.json";

let incomes = [...incomesData];

export const incomeService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...incomes];
  },

  async getByEventId(eventId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return incomes.filter(inc => inc.eventoId === eventId.toString());
  },

  async create(incomeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newIncome = {
      ...incomeData,
      Id: Math.max(...incomes.map(i => i.Id)) + 1
    };
    incomes.push(newIncome);
    return { ...newIncome };
  },

  async update(id, incomeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = incomes.findIndex(i => i.Id === parseInt(id));
    if (index !== -1) {
      incomes[index] = { ...incomes[index], ...incomeData };
      return { ...incomes[index] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = incomes.findIndex(i => i.Id === parseInt(id));
    if (index !== -1) {
      incomes.splice(index, 1);
      return true;
    }
    return false;
  }
};