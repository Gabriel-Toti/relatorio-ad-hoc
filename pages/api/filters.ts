import type { NextApiRequest, NextApiResponse } from 'next'
import { Filter, Error } from '../../interfaces';
import { getRecentFiltersService } from '../../domain/filters/services/getRecentFilter.service';
import { handleError } from '../../utils/error-handler';
import { addUsedFilterService } from '../../domain/filters/services/addUsedFilter.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Filter[] | Filter | Error>
) {
  try {
    console.log("filter no back", req.method);
    
    if(req.method === `POST`) {
        await addUsedFilterService(req.body);
        res.status(200).json(req.body);
    } else 
    {
        const filters = await getRecentFiltersService();
        console.log("filter no back", filters);
        res.status(200).json(filters);
    }
  } catch (error) {
    const err = handleError(error);
    res.status(err.status).json(err.error);
  }
}