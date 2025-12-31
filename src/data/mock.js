export const mockPlayers = [
  { id: 1, name: "Ana", status: 'active', bank: 0 },
  { id: 2, name: "Carlos", status: 'active', bank: 0 },
  { id: 3, name: "Elena", status: 'eliminated', bank: 0 },
  { id: 4, name: "David", status: 'active', bank: 0 },
  { id: 5, name: "Sofia", status: 'active', bank: 0 },
  { id: 6, name: "Jorge", status: 'active', bank: 0 },
  { id: 7, name: "Lucia", status: 'active', bank: 0 },
  { id: 8, name: "Miguel", status: 'active', bank: 0 },
];

export const mockMoneyChain = [
  { level: 1, value: 1000 },
  { level: 2, value: 2000 },
  { level: 3, value: 5000 },
  { level: 4, value: 10000 },
  { level: 5, value: 20000 },
  { level: 6, value: 50000 },
  { level: 7, value: 100000 },
  { level: 8, value: 200000 }, // Max prize
].reverse(); // Highest on top usually for visual ladder

export const mockQuestion = {
  text: "¿Cuál es el planeta más cercano al Sol?",
  answer: "Mercurio",
};

export const mockGameState = {
  currentMoneyLevel: 2, // e.g. currently playing for 5000 (after answering for 2000) - index based or value based
  bankedMoney: 15000,
  timer: 45,
};
