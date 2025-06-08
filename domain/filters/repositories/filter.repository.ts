import { Filter } from "../../../interfaces";

const recentFilters: Filter[] = []

export async function addUsedFilter(filter: Filter) {
  recentFilters.push(filter);
}

export async function getRecentFilters() {
  return recentFilters;
}
