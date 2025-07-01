import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";
import { SelectedFields, sql } from "drizzle-orm";
import { Tabelas } from "../../../utils/tables";
import { eq, gt, lt, gte, lte, ne, like, ilike, and, or, sum, min, max, avg, count } from 'drizzle-orm';
import { getOrderByOperators } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!)

const operadores = {
    '=': eq,
    '>': gt,
    '<': lt,
    '>=': gte,
    '<=': lte,
    '!=': ne,
    'LIKE': like,
    'ILIKE': ilike,
    'AND': and,
    'OR': or,
};

const agregacoesLista = {
    'SUM': sum,
    'MIN': min,
    'MAX': max,
    'AVG': avg,
    'COUNT': count,
};


interface QueryColuna {
    nome: string;
    tabela: string;
    alias?: string; // Optional alias for the column
}

interface QueryAgregacao {
    tipo: string; // e.g., 'SUM', 'AVG', 'COUNT'
    coluna: QueryColuna;
    alias?: string; // Optional alias for the aggregated column
}

interface QueryFiltro {
    coluna: QueryColuna;
    operador: string; // e.g., '=', '>', '<', 'LIKE'
    valor: string; 
}

interface QueryOrdering {
    nome: string;
    tabela: string;
    alias?: string; // Optional alias for the column
    ordem: 'asc' | 'desc';
}

export interface QueryArguments {
    tabelas: string[];
    colunas: QueryColuna[];
    filtros?: QueryFiltro[];
    groupBy?: QueryColuna[];
    orderBy?: QueryOrdering[];
    agregacoes?: QueryAgregacao[];
}

function camelToSnake(str: string): string {
    return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}
const toCamelCase = (str: string) =>
    str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

export async function executeQuery(args : QueryArguments) {
    const { tabelas, colunas, filtros, groupBy, orderBy, agregacoes } = args;

    console.log("Executing query with arguments:", args, agregacoes[0].coluna);

    // Construct the query using Drizzle ORM
    let querySelectArg = {}
    colunas.forEach((coluna, index) =>{
        querySelectArg = {...querySelectArg, [coluna.nome]: schema[coluna.tabela][coluna.nome]}
    })


    if (agregacoes) {
        agregacoes.forEach(agg => {
            console.log(agregacoesLista[agg.tipo], agg.tipo)
            const column = schema[agg.coluna.tabela][agg.coluna.nome];
            const alias = agg.alias || `${agg.tipo}_${agg.coluna.nome}`;
            querySelectArg = {...querySelectArg, [alias]:sql`${agregacoesLista[agg.tipo](column)} as ${sql.raw(alias)}`};
        });
    }
    // Assume the first table in 'tabelas' is the main table to select from
    let query = db.select(querySelectArg).from(schema[tabelas[0]]).$dynamic();

    let includedTables = [tabelas[0]];
     
    tabelas.slice(1).forEach(tabela => {
        const tabelaDefinicao = Tabelas.find(t => t.tabela === tabela);
        if (!tabelaDefinicao) {
            return
        }
        const tabelaAlvo = camelToSnake(tabela)
        const juncaoInfo = tabelaDefinicao?.juncoes.find((juncao) => {
            return includedTables.some(
            included =>
                camelToSnake(juncao.tabelaDe) === camelToSnake(included) ||
                camelToSnake(juncao.tabelaPara) === camelToSnake(included)
            );
        });
        query = query.innerJoin(schema[tabela], 
            eq(schema[toCamelCase(juncaoInfo.tabelaDe)][toCamelCase(juncaoInfo.colunaDe)], 
                schema[toCamelCase(juncaoInfo.tabelaPara)][toCamelCase(juncaoInfo.colunaPara)])
        );
        
    });

    // Add filters if provided
    if (filtros) {
        
        const filtroOp = filtros.map(filtro => {
            return operadores[filtro.operador](schema[filtro.coluna.tabela][filtro.coluna.nome], filtro.valor)
            
        });

        query.where(and(...filtroOp));
    }

    // Add group by if provided
    if (groupBy) {
        const groupByCols = groupBy.map(col => schema[col.tabela][col.nome]);
        query.groupBy(...groupByCols);
    }

    // Add order by if provided
    if (orderBy) {
        const orderByCols = orderBy.map((col) => {
            const coluna = schema[col.tabela][col.nome]
            if (!coluna /*|| true*/ ) {
                return sql`${col.nome}`; // Fallback to raw SQL if not found
            }
            return getOrderByOperators()[col.ordem](coluna)
        });
        query.orderBy(...orderByCols);
    }
    console.log("Final query:", query.toSQL());
    return await query;
}