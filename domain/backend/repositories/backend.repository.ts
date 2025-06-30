import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";
import { SelectedFields, sql } from "drizzle-orm";
import { Tabelas } from "../../../utils/tables";
import { eq, gt, lt, gte, lte, ne, like, ilike, and, or, sum, min, max, avg, count } from 'drizzle-orm';

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

const traducaoTabela = {
    'desmatamento_estado': schema.desmatamentoEstado,
    'desmatamento_municipio': schema.desmatamentoMunicipio,
    'desmatamento_bioma': schema.desmatamentoBioma,
    'bioma': schema.bioma,
    'estado': schema.estado,
    'municipio': schema.municipio,
    'caracteristica': schema.caracteristica,
    'caracteristica_municipio': schema.caracteristicaMunicipio,
    'caracteristica_estado': schema.caracteristicaEstado,
    'caracteristica_bioma': schema.caracteristicaBioma,
    'bioma_estado': schema.biomaEstado,
    'bioma_municipio': schema.biomaMunicipio,
}

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

export interface QueryArguments {
    tabelas: string[];
    colunas: QueryColuna[];
    filtros?: QueryFiltro[];
    groupBy?: QueryColuna[];
    orderBy?: QueryColuna[];
    agregacoes?: QueryAgregacao[];
}

export async function executeQuery(args : QueryArguments) {
    const { tabelas, colunas, filtros, groupBy, orderBy, agregacoes } = args;

    console.log("Executing query with arguments:", args);

    // Construct the query using Drizzle ORM
    let querySelectArg = {}
    colunas.forEach((coluna, index) =>{
        console.log("Processing column:", coluna);
        querySelectArg = {...querySelectArg, [coluna.nome]: traducaoTabela[coluna.tabela][coluna.nome]}
    })
    console.log("Query Select Arguments:", querySelectArg);


    if (agregacoes) {
        agregacoes.forEach(agg => {
            const column = traducaoTabela[agg.coluna.tabela][agg.coluna.nome];
            const alias = agg.alias || `${agg.tipo}_${agg.coluna.nome}`;
            querySelectArg = {...querySelectArg, [alias]:agregacoesLista[agg.tipo](column)};
        });
    }
    // Assume the first table in 'tabelas' is the main table to select from
    let query = db.select(querySelectArg).from(traducaoTabela[tabelas[0]]).$dynamic();
     
    tabelas.slice(1).forEach(tabela => {
        const tabelaDefinicao = Tabelas.find(t => t.tabela === tabela);
        if (!tabelaDefinicao) {
            return
        }
        const juncaoInfo = tabelaDefinicao?.juncoes.find(juncao => juncao.tabelaDe === tabelas[0] || juncao.tabelaPara === tabelas[0]);
        console.log("Juncao Info:", juncaoInfo);
        query = query.innerJoin(traducaoTabela[tabela], 
            eq(traducaoTabela[juncaoInfo.tabelaDe][juncaoInfo.colunaDe], 
                traducaoTabela[juncaoInfo.tabelaPara][juncaoInfo.colunaPara])
        );
        
    });

    // Add filters if provided
    if (filtros) {
        filtros.forEach(filtro => {
            query.where(operadores[filtro.operador](traducaoTabela[filtro.coluna.tabela][filtro.coluna.nome], filtro.valor));
        });
    }

    // Add group by if provided
    if (groupBy) {
        const groupByCols = groupBy.map(col => traducaoTabela[col.tabela][col.nome]);
        query.groupBy(...groupByCols);
    }

    // Add order by if provided
    if (orderBy) {
        const orderByCols = orderBy.map((col) => {
            const coluna = traducaoTabela[col.tabela][col.nome]
            if (!coluna || true ) {
                return sql`${col.nome}`; // Fallback to raw SQL if not found
            }
            return coluna
        });
        query.orderBy(...orderByCols);
    }
    console.log("Final query:", query.toSQL());
    return await query;
}
{

}