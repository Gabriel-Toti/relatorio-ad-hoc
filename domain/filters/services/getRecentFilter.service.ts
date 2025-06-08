import { getRecentFilters } from "../repositories/filter.repository";

export async function getRecentFiltersService() {
    try{
        return getRecentFilters();
    } catch (error) {
        throw error;
    }
}