import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";
import { SelectedFields } from "drizzle-orm";
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

interface QueryColuna {
    nome: string;
    tabela: string;
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

interface QueryArguments {
    tabelas: string[];
    colunas: QueryColuna[];
    filtros?: QueryFiltro[];
    groupBy?: QueryColuna[];
    orderBy?: QueryColuna[];
    agregacoes?: QueryAgregacao[];
}

export async function executeQuery(args : QueryArguments) {
    const { tabelas, colunas, filtros, groupBy, orderBy, agregacoes } = args;

    // Construct the query using Drizzle ORM
    let querySelectArg = {}
    colunas.forEach((coluna, index) =>{
        querySelectArg = {...querySelectArg, [coluna.nome]: schema[coluna.tabela]}
    })

    agregacoes.forEach(agg => {
        const column = db[agg.coluna.tabela][agg.coluna.nome];
        const alias = agg.alias || `${agg.tipo}_${agg.coluna.nome}`;
        querySelectArg = {...querySelectArg, [alias]:agregacoesLista[agg.tipo](column)};
    });
    // Assume the first table in 'tabelas' is the main table to select from
    let query = db.select(querySelectArg).from(db[tabelas[0]]).$dynamic();

     
    tabelas.slice(1).forEach(tabela => {
        const tabelaDefinicao = Tabelas.find(t => t.nome === tabela);
        const juncaoInfo = tabelaDefinicao?.juncoes.find(juncao => juncao.tabelaDe === tabelas[0] || juncao.tabelaPara === tabelas[0]);
        query = query.innerJoin(schema[tabela], 
            eq(schema[juncaoInfo.tabelaDe][juncaoInfo.colunaDe], 
                schema[juncaoInfo.tabelaPara][juncaoInfo.colunaPara])
        ); // specify join condition
    });

    // Add filters if provided
    if (filtros) {
        filtros.forEach(filtro => {
            query.where(operadores[filtro.operador](schema[filtro.coluna.tabela][filtro.coluna.nome], filtro.valor));
        });
    }

    // Add group by if provided
    if (groupBy) {
        const groupByCols = groupBy.map(col => schema[col.tabela][col.nome]);
        query.groupBy(...groupByCols);
    }

    // Add order by if provided
    if (orderBy) {
        const orderByCols = orderBy.map(col => schema[col.tabela][col.nome]);
        query.orderBy(...orderByCols);
    }

    return await query;
}
{

}