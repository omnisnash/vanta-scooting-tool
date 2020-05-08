import { AppHistory } from '@/models/History';
import AppConfiguration from '@/models/Config';
import GroupedData from '@/models/GroupedData';

const HISTORY_MAX_ITEM = 10;
const KEY_CONFIG = "app-configuration";
const KEY_HISTORY = "app-history";

export function getStoredAppConfiguration(): null | AppConfiguration {
  const value = localStorage.getItem(KEY_CONFIG);

  if (!value) {
    return null;
  }

  return JSON.parse(value) as AppConfiguration;
}

export function storeAppConfiguration(appConfiguration: AppConfiguration): void {
  localStorage.setItem(KEY_CONFIG, JSON.stringify(appConfiguration));
}

export function getStoredAppHistory(): null | AppHistory {
  const value = localStorage.getItem(KEY_HISTORY);

  if (!value) {
    return null;
  }

  return JSON.parse(value) as AppHistory;
}

export function addMeasurerToHistory(measure: GroupedData): void {
  let history = getStoredAppHistory();

  if (!history) {
    history = [];
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
