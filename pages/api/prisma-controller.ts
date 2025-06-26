import type { NextApiRequest, NextApiResponse } from 'next';

// filepath: /home/zinolath/projects/relatorio-ad-hoc/pages/api/prisma-controller.ts

// Helper to build Prisma where clause from filtros
function buildWhereClause(filtros: any[]) {
    const where: any = {};
    filtros.forEach(filtro => {
        const { campo, operacao, valor } = filtro;
        const field = campo.campo.nome;

        // Only support direct table queries for now
        if (!where[field]) {
            switch (operacao) {
                case '<':
                    where[field] = { lt: valor };
                    break;
                case '<=':
                    where[field] = { lte: valor };
                    break;
                case '>':
                    where[field] = { gt: valor };
                    break;
                case '>=':
                    where[field] = { gte: valor };
                    break;
                case '!=':
                    where[field] = { not: valor };
                    break;
                case '==':
                default:
                    where[field] = valor;
            }
        }
    });
    return where;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

}