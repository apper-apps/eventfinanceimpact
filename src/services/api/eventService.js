import eventsData from "@/services/mockData/events.json";

let events = [...eventsData];

export const eventService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...events];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const event = events.find(e => e.Id === parseInt(id));
    return event ? { ...event } : null;
  },

  async create(eventData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newEvent = {
      ...eventData,
      Id: Math.max(...events.map(e => e.Id)) + 1,
      status: "planeado"
    };
    events.push(newEvent);
    return { ...newEvent };
  },

  async update(id, eventData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = events.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      events[index] = { ...events[index], ...eventData };
      return { ...events[index] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = events.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      events.splice(index, 1);
      return true;
    }
    return false;
  }
};