export const cabs = {
  Cab1: { price: 5, startTime: "12:00" },
  Cab2: { price: 6, startTime: "12:50" },
  Cab3: { price: 4, startTime: "13:40" },
  Cab4: { price: 1, startTime: "14:30" },
  Cab5: { price: 2, startTime: "15:20" },
};

export const graph = {
  A: { B: 5, C: 7 },
  B: { A: 5, D: 15, E: 20 },
  C: { A: 7, D: 5, E: 35 },
  D: { B: 15, C: 5, F: 20 },
  E: { B: 20, C: 35, F: 10 },
  F: { D: 20, E: 10 },
};
