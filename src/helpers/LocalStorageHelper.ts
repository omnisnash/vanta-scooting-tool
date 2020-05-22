import { AppHistory } from "../models/History";
import AppConfiguration from "../models/Config";
import GroupedData from "../models/GroupedData";

const HISTORY_MAX_ITEM = 10;
const KEY_CONFIG = "app-configuration";
const KEY_HISTORY = "app-history";
const KEY_SCROLL = "app-scroll";

export interface ScrollPosition {
  top: number;
  left: number;
}

export function getStoredScrollPosition(positionId: string): ScrollPosition {
  const value = localStorage.getItem(KEY_SCROLL);

  if (!value) {
    return {top: 0, left: 0};
  }

  const positions = new Map<string, ScrollPosition>(JSON.parse(value));
  const scrollPosition = positions.get(positionId);

  if (!scrollPosition) {
    return {top: 0, left: 0};
  }

  return scrollPosition;
}

export function setScrollPosition(positionId: string, scrollPosition: ScrollPosition) {
  const value = localStorage.getItem(KEY_SCROLL);
  
  const map: Map<string, ScrollPosition> = value ? new Map(JSON.parse(value)) : new Map();
  
  map.set(positionId, scrollPosition)

  localStorage.setItem(KEY_SCROLL, JSON.stringify(Array.from(map.entries())));
}

export function resetScrollPositions() {
  localStorage.removeItem(KEY_SCROLL);
}

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
