

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
  juncoes?: Array<string>; // Optional, for tables that can be joined
}

export const tableNames = [
  'bioma',
  'bioma_estado',
  'bioma_municipio',
  'caracteristica',
  'caracteristica_bioma',
  'caracteristica_estado',
  'caracteristica_municipio',
  'desmatamento_bioma',
  'desmatamento_estado',
  'desmatamento_municipio',
  'estado',
  'municipio'
];

export const Tabelas: ITabela[] = [
  {
    nome: "Desmatamento por Bioma",
    tabela: "desmatamento_bioma",
    descricao: "Desmatamento por bioma no Brasil, incluindo dados de área desmatada e ano.",
    colunas: [
      { nome: "ano", tipo: "number", descricao: "Ano do desmatamento" },
      { nome: "area_desmatada", tipo: "number", descricao: "Área desmatada em hectares" }
    ],
    juncoes: ["bioma"]
  },
  {
    nome: "Desmatamento por Estado",
    tabela: "desmatamento_estado",
    descricao: "Desmatamento por estado no Brasil, incluindo dados de área desmatada e ano.",
    colunas: [
      { nome: "ano", tipo: "number", descricao: "Ano do desmatamento" },
      { nome: "area_desmatada", tipo: "number", descricao: "Área desmatada em hectares" }
    ],
    juncoes: ["estado"]
  },
  {
    nome: "Desmatamento por Município",
    tabela: "desmatamento_municipio",
    descricao: "Desmatamento por município no Brasil, incluindo dados de área desmatada e ano.",
    colunas: [
      { nome: "ano", tipo: "number", descricao: "Ano do desmatamento" },
      { nome: "area_desmatada", tipo: "number", descricao: "Área desmatada em hectares" }
    ],
    juncoes: ["municipio"]
  },
  {
    nome: "Característica",
    tabela: "caracteristica",
    descricao: "Tipos de características.",
    colunas: [
      { nome: "nome_caracteristica", tipo: "string", descricao: "Nome da Característica" },
      { nome: "categoria", tipo: "string", descricao: "Categoria" }
    ]
  },
  {
    nome: "Característica do Bioma",
    tabela: "caracteristica_bioma",
    descricao: "Características de um bioma.",
    colunas: [
      { nome: "area", tipo: "number", descricao: "Área do bioma com essa característica" },
    ],
    juncoes: ["bioma", "caracteristica"]
  },
  {
    nome: "Característica do Estado",
    tabela: "caracteristica_estado",
    descricao: "Características de um estado.",
    colunas: [
      { nome: "area", tipo: "number", descricao: "Área do bioma com essa característica" },
    ],
    juncoes: ["estado", "caracteristica"]
  },
  {
    nome: "Característica do Município",
    tabela: "caracteristica_municipio",
    descricao: "Características de um município.",
    colunas: [
      { nome: "area", tipo: "number", descricao: "Área do bioma com essa característica" },
    ],
    juncoes: ["municipio", "caracteristica"]
  },
  {
    nome: "Estado",
    tabela: "estado",
    descricao: "Estados brasileiros.",
    colunas: [
      { nome: "uf", tipo: "string", descricao: "Sigla do estado" },
      { nome: "nome_estado", tipo: "string", descricao: "Nome do estado" }
    ],
    juncoes: [ "bioma_estado", "municipio", "desmatamento_estado", "caracteristica_estado" ]
  },
  {
    nome: "Município",
    tabela: "municipio",
    descricao: "Municípios de cada estado brasileiro.",
    colunas: [
      { nome: "nome_municipio", tipo: "string", descricao: "Nome do município" }
    ],
    juncoes: ["estado", "bioma_municipio", "desmatamento_municipio", "caracteristica_municipio"]
  },
  {
    nome: "Bioma",
    tabela: "bioma",
    descricao: "Biomas brasileiros.",
    colunas: [
      { nome: "nome_bioma", tipo: "string", descricao: "Nome do bioma" }
    ],
    juncoes: ["bioma_estado", "bioma_municipio", "desmatamento_bioma", "caracteristica_bioma"]
  },
  {
    nome: "Bioma por Estado",
    tabela: "bioma_estado",
    descricao: "Biomas de cada estado brasileiro.",
    colunas: [
    ],
    juncoes: ["bioma", "estado"]
  },
  {
    nome: "Bioma por Município",
    tabela: "bioma_municipio",
    descricao: "Biomas de cada município brasileiro.",
    colunas: [
    ],
    juncoes: ["bioma", "municipio"] 
  }
]