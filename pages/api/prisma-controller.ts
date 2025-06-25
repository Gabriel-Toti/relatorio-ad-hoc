import type { NextApiRequest, NextApiResponse } from 'next';
import prisma, { tableNames } from '../../utils/prisma-client';

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
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { tabelas, tabela, camposSelecionados, filtros, orderBy, groupBy } = req.body;

        // If 'tabelas' is provided, build include for joins
        let include: any = undefined;
        if (Array.isArray(tabelas) && tabelas.length > 1) {
            include = {};
            tabelas.forEach((tbl: string) => {
            if (tbl !== tabela) {
                include[tbl] = true;
            }
            });
        }

        if (!tabela || !tableNames.includes(tabela)) {
            res.status(400).json({ error: 'Invalid table' });
            return;
        }

        // Build select
        const select: any = {};
        if (Array.isArray(camposSelecionados) && camposSelecionados.length > 0) {
            camposSelecionados.forEach((campo: any) => {
                select[campo.campo.nome] = true;
            });
        }

        // Build where
        const where = filtros ? buildWhereClause(filtros) : undefined;

        // Build orderBy
        let orderByClause: any = undefined;
        if (Array.isArray(orderBy) && orderBy.length > 0) {
            orderByClause = orderBy.map((ord: any) => ({
                [ord.campo.campo.nome]: ord.direction || 'asc'
            }));
        }

        // Build groupBy
        let groupByClause: any = undefined;
        if (Array.isArray(groupBy) && groupBy.length > 0) {
            groupByClause = groupBy.map((campo: any) => campo.campo.nome);
        }

        // Dynamic access to prisma client
        const model = (prisma as any)[tabela];

        if (!model) {
            res.status(400).json({ error: 'Table not found in Prisma client' });
            return;
        }

        let result;
        if (groupByClause) {
            result = await model.groupBy({
                by: groupByClause,
                where,
                orderBy: orderByClause,
            });
        } else {
            result = await model.findMany({
                where,
                select: Object.keys(select).length > 0 ? select : undefined,
                orderBy: orderByClause,
            });
        }

        res.status(200).json({ data: result });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
}