

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
  },
  {
    nome: "Desmatamento por Município",
    tabela: "desmatamento_municipio",
    descricao: "Desmatamento por município no Brasil, incluindo dados de área desmatada e ano.",
    colunas: [
      { nome: "municipio", tipo: "string", descricao: "Nome do Municipio" },
      { nome: "ano", tipo: "number", descricao: "Ano do desmatamento" },
      { nome: "area_desmatada", tipo: "number", descricao: "Área desmatada em hectares" }
    ]
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
      { nome: "nome_caracteristica", tipo: "string", descricao: "Nome da característica" },
      { nome: "area", tipo: "number", descricao: "Área do bioma com essa característica" },
      { nome: "bioma", tipo: "string", descricao: "Nome do bioma com essa característica" },
      { nome: "caracteristica", tipo: "string", descricao: "Nome da característica" }
    ]
  },
  {
    nome: "Característica do Estado",
    tabela: "caracteristica_estado",
    descricao: "Características de um estado.",
    colunas: [
      { nome: "area", tipo: "number", descricao: "Área do bioma com essa característica" },
      { nome: "estado", tipo: "string", descricao: "Nome do estado com essa característica" },
      { nome: "caracteristica", tipo: "string", descricao: "Nome da característica" }
    ]
  },
  {
    nome: "Característica do Município",
    tabela: "caracteristica_municipio",
    descricao: "Características de um município.",
    colunas: [
      { nome: "area", tipo: "number", descricao: "Área do bioma com essa característica" },
      { nome: "muncipio", tipo: "string", descricao: "Nome do município com essa característica" },
      { nome: "caracteristica", tipo: "string", descricao: "Nome da característica" }
    ]
  },
  {
    nome: "Estado",
    tabela: "estado",
    descricao: "Estados brasileiros.",
    colunas: [
      { nome: "uf", tipo: "string", descricao: "Sigla do estado" },
      { nome: "nome_estado", tipo: "string", descricao: "Nome do estado" }
    ]
  },
  {
    nome: "Município",
    tabela: "municipio",
    descricao: "Municípios de cada estado brasileiro.",
    colunas: [
      { nome: "estado", tipo: "string", descricao: "Nome do estado à que pertence" },
      { nome: "nome_municipio", tipo: "string", descricao: "Nome do município" }
    ]
  },
  {
    nome: "Bioma",
    tabela: "bioma",
    descricao: "Biomas brasileiros.",
    colunas: [
      { nome: "nome_bioma", tipo: "string", descricao: "Nome do bioma" }
    ]
  },
  {
    nome: "Bioma por Estado",
    tabela: "bioma_estado",
    descricao: "Biomas de cada estado brasileiro.",
    colunas: [
      { nome: "bioma", tipo: "string", descricao: "Nome do bioma" },
      { nome: "estado", tipo: "string", descricao: "Nome do estado que possui esse bioma" }
    ]
  },
  {
    nome: "Bioma por Município",
    tabela: "bioma_municipio",
    descricao: "Biomas de cada município brasileiro.",
    colunas: [
      { nome: "bioma", tipo: "string", descricao: "Nome do bioma" },
      { nome: "municipio", tipo: "string", descricao: "Nome do município que possui esse bioma" }
    ]
  }
]