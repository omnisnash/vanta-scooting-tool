import { AppHistory } from "../models/History";
import AppConfiguration from "../models/Config";
import GroupedData from "../models/GroupedData";

const HISTORY_MAX_ITEM = 10;
const KEY_CONFIG = "app-configuration";
const KEY_HISTORY = "app-history";

export function getStoredAppConfiguration(): AppConfiguration {
  const value = localStorage.getItem(KEY_CONFIG);

  if (!value) {
    return AppConfiguration.getDefaultConfiguration();
  }

  return JSON.parse(value) as AppConfiguration;
}

export function storeAppConfiguration(
  appConfiguration: AppConfiguration
): void {
  localStorage.setItem(KEY_CONFIG, JSON.stringify(appConfiguration));
}

export function getStoredAppHistory(): AppHistory {
  const value = localStorage.getItem(KEY_HISTORY);

  if (!value) {
    return [];
  }

  const history = JSON.parse(value) as AppHistory;
  history.forEach((item) => {
    item.createdAt = new Date(item.createdAt);
    item.updatedAt = item.updatedAt ? new Date(item.updatedAt) : undefined;
  });

  return history;
}

export function addMeasurerToHistory(measure: GroupedData): void {
  let history = getStoredAppHistory();

  if (!history) {
    history = [];
  }

  const existingIndex = history.findIndex((model) => model.id === measure.id);
  if (existingIndex !== -1) {
    history.splice(existingIndex, 1);
    measure.updatedAt = new Date();
  }

  if (history.length + 1 > HISTORY_MAX_ITEM) {
    history.pop();
  }

  history.unshift(measure);

  localStorage.setItem(KEY_HISTORY, JSON.stringify(history));
}

export function clearLocalStorage() {
  localStorage.clear();
}
