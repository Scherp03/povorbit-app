const LS_KEY = "povorbit_v2";

/**
 * Load all players from localStorage
 * @returns {array} Array of player objects
 */
export const loadPlayers = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || [];
  } catch {
    return [];
  }
};

/**
 * Save players to localStorage
 * @param {array} players - Array of player objects
 */
export const savePlayers = (players) =>
  localStorage.setItem(LS_KEY, JSON.stringify(players));

/**
 * Insert or update a player in the array
 * @param {array} players - Current players array
 * @param {object} entry - Player entry to insert/update
 * @returns {array} Updated players array
 */
export const upsertPlayer = (players, entry) => {
  const updated = players.filter((p) => p.name !== entry.name);
  updated.push(entry);
  updated.sort((a, b) => b.laps - a.laps || b.distKm - a.distKm);
  savePlayers(updated);
  return updated;
};

export { LS_KEY };
