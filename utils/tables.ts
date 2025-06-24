
export interface IColuna {
  nome: string;
  tipo: string; // e.g., 'string', 'number'
  descricao: string;
}
export interface ITabela {
  nome: string;
  tabela: string;
  descricao: string;
  colunas: Array<IColuna>;
}

export const Tabelas: ITabela[] = [
  {
    nome: "Desmatamento por Bioma",
    tabela: "desmatamento_bioma",
    descricao: "Desmatamento por bioma no Brasil, incluindo dados de área desmatada e ano.",
    colunas: [
      { nome: "bioma", tipo: "string", descricao: "Nome do bioma" },
      { nome: "ano", tipo: "number", descricao: "Ano do desmatamento" },
      { nome: "area_desmatada", tipo: "number", descricao: "Área desmatada em hectares" }
    ]
  },
  {
    nome: "Desmatamento por Estado",
    tabela: "desmatamento_estado",
    descricao: "Desmatamento por estado no Brasil, incluindo dados de área desmatada e ano.",
    colunas: [
      { nome: "estado", tipo: "string", descricao: "Nome do estado" },
      { nome: "ano", tipo: "number", descricao: "Ano do desmatamento" },
      { nome: "area_desmatada", tipo: "number", descricao: "Área desmatada em hectares" }
    ]
  }
]