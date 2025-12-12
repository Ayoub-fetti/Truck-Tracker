import API from "./api";

export const usersService = {
  getAll: async () => {
    return await API.get("/users");
  },

  delete: async (id) => {
    return await API.delete(`/users/${id}`);
  },
  update: async (id, data) => {
    return await API.put(`/users/${id}`, data);
  },

  // Get drivers from trucks that have chauffeurAssigne populated
  getDriversFromTrucks: async () => {
    const trucksResponse = await API.get("/trucks");
    const trucks = trucksResponse.data;

    // Extract unique drivers from trucks
    const drivers = [];
    const driverIds = new Set();

    trucks.forEach((truck) => {
      if (
        truck.chauffeurAssigne &&
        !driverIds.has(truck.chauffeurAssigne._id)
      ) {
        driverIds.add(truck.chauffeurAssigne._id);
        drivers.push(truck.chauffeurAssigne);
      }
    });

    return { data: drivers };
  },
};
