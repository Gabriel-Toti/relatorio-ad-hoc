import type { NextApiRequest, NextApiResponse } from 'next'
import { Error, Hello } from '../../interfaces'
import { handleError } from '../../utils/error-handler'
import { executeQueryService } from '../../domain/backend/services/backend.service';
// import prisma from '../../utils/prisma-client';
 

 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Hello | Error>
) {
  try {
    const args = req.body;
    const data = await executeQueryService(args);
    res.status(200).json(data);
  } catch (error) {
    const err = handleError(error);
    res.status(err.status).json(err.error);
    // throw error;
  }
}