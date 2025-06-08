import { Filter } from "../../../interfaces";
import { addUsedFilter } from "../repositories/filter.repository";

export async function addUsedFilterService(filter: Filter) {
    try{
        return addUsedFilter(filter);
    } catch (error) {
        throw error;
    }
}