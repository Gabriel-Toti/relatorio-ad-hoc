import { Prisma, PrismaClient } from "@prisma/client";
import prisma, { tableNames } from '../../../utils/prisma-client';
import { Tabelas, IColuna } from "../../../utils/tables";

interface ICampo {
    coluna: IColuna;
    tabela: string;
}

interface IOrderBy {
    campo: ICampo;
    direcao: 'asc' | 'desc';
}

interface IFiltro {
    campo: ICampo;
    operacao: '<' | '<=' | '>' | '>=' | '==' | '!=' | 'contains' | 'startsWith' | 'endsWith';
    valor: any;
}

export async function executeQuery(tables: string[], fields: ICampo[], orderBy: IOrderBy[], groupBy, filtros: IFiltro[]) {
    try {
        const maintable = tables[0];
        const otherTables = tables.slice(1);
        const readTables = []

        const QueryBuilder = (table: string, fields: ICampo[], orderBy: IOrderBy[], groupBy, filtros: IFiltro[]) => {
            const query = {
                select: {},
                where: {},
                orderBy: {},
                include: {},
                groupBy: []
            };
            fields.forEach(field => {
                if (field.tabela === table) {
                    query.select[field.coluna.nome] = true;
                }
            });
            if (filtros && filtros.length > 0) {
                filtros.forEach(filtro => {
                    const { campo, operacao, valor } = filtro;
                    const field = campo.coluna.nome;
                    if (campo.tabela === table) {
                        switch (operacao) {
                            case '<':
                                query.where[field] = { lt: valor };
                                break;
                            case '<=':
                                query.where[field] = { lte: valor };
                                break;
                            case '>':
                                query.where[field] = { gt: valor };
                                break;
                            case '>=':
                                query.where[field] = { gte: valor };
                                break;
                            case '!=':
                                query.where[field] = { not: valor };
                                break;
                            case '==':
                                query.where[field] = valor;
                                break;
                            default:
                                query.where[field] = { [operacao]: valor };
                                break;
                        }
                    }
                });
            }
            if (orderBy && orderBy.length > 0) {
                orderBy.forEach(order => {
                    const field = order.campo.coluna.nome;
                    if (order.campo.tabela === table) {
                        query.orderBy[field] = order.direcao;
                    }
                });
            }
            const dadosTabela = Tabelas.find(t => t.tabela === table);
            if (dadosTabela && dadosTabela.juncoes) {
                dadosTabela.juncoes.forEach(juncao => {
                    if (otherTables.includes(juncao) && !readTables.includes(juncao)) {
                        readTables.push(juncao);
                        query.include[juncao] = QueryBuilder(juncao, fields, orderBy, groupBy, filtros);
                    }
                });
            }
            return query;
        };

        const query = QueryBuilder(maintable, fields, orderBy, groupBy, filtros);
        const result = await (prisma as PrismaClient)[maintable].findMany(query);
        return result;

    } catch (error) {
        throw error;
    }
}