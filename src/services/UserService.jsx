import { findById, update } from "./BaseService";

export async function getSearchHistoryByUserId(userId) {
  const userData = await findById("users", userId);
  return userData.searchHistory;
}

export async function addDataToSearchHistory(userId, newSearch) {
  const userData = await findById("users", userId);
  userData.searchHistory.unshift(newSearch.trim());
  update("users", userId, { searchHistory: userData.searchHistory });
}
