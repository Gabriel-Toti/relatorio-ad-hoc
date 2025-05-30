import type { NextApiRequest, NextApiResponse } from 'next'
import { Error, Hello } from '../../interfaces'
import { handleError } from '../../utils/error-handler'
import { helloService } from '../../domain/hello/services/hello.service';
// import prisma from '../../utils/prisma-client';
 

 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Hello | Error>
) {
  try {
    const hello = await helloService();
    res.status(200).json(hello);
  } catch (error) {
    const err = handleError(error);
    res.status(err.status).json(err.error);
  }
}