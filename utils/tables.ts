

export interface IColuna {
    nome: string;
    tipo: string; // e.g., 'string', 'number'
    descricao: string;
  }
  
  export interface IJuncao {
    tabelaDe: string;
    colunaDe: string;
    tabelaPara: string;
    colunaPara: string
  }
  export interface ITabela {
    nome: string;
    tabela: string;
    descricao: string;
    colunas: Array<IColuna>;
    juncoes?: Array<IJuncao>;
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
  
  // As junções (joins) descritas acima em Tabelas refletem os relacionamentos definidos no arquivo de relações do Drizzle ORM.
  // Veja #file:relations.ts para os detalhes dos relacionamentos entre tabelas.
  // Cada junção do tipo objeto em "juncoes" representa uma foreign key explícita, enquanto as junções do tipo string referenciam tabelas relacionadas conforme os relacionamentos "many" definidos no arquivo de relações.
  
  export const Tabelas: ITabela[] = [
    {
      nome: "Desmatamento por Bioma",
      tabela: "desmatamento_bioma",
      descricao: "Desmatamento por bioma no Brasil, incluindo dados de área desmatada e ano.",
      colunas: [
        { nome: "ano", tipo: "number", descricao: "Ano do desmatamento" },
        { nome: "area_desmatada", tipo: "number", descricao: "Área desmatada em hectares" }
      ],
      juncoes: [
        // relations: desmatamentoBiomaRelations (bioma)
        {
          tabelaDe: "desmatamento_bioma",
          colunaDe: "biomaId",
          tabelaPara: "bioma",
          colunaPara: "id",
        }
      ]
    },
    {
      nome: "Desmatamento por Estado",
      tabela: "desmatamento_estado",
      descricao: "Desmatamento por estado no Brasil, incluindo dados de área desmatada e ano.",
      colunas: [
        { nome: "ano", tipo: "number", descricao: "Ano do desmatamento" },
        { nome: "area_desmatada", tipo: "number", descricao: "Área desmatada em hectares" }
      ],
      juncoes: [
        // relations: desmatamentoEstadoRelations (bioma, estado)
        {
          tabelaDe: "desmatamento_estado",
          colunaDe: "biomaId",
          tabelaPara: "bioma",
          colunaPara: "id",
        },
        {
          tabelaDe: "desmatamento_estado",
          colunaDe: "estadoId",
          tabelaPara: "estado",
          colunaPara: "id",
        }
      ]
    },
    {
      nome: "Desmatamento por Município",
      tabela: "desmatamento_municipio",
      descricao: "Desmatamento por município no Brasil, incluindo dados de área desmatada e ano.",
      colunas: [
        { nome: "ano", tipo: "number", descricao: "Ano do desmatamento" },
        { nome: "area_desmatada", tipo: "number", descricao: "Área desmatada em hectares" }
      ],
      juncoes: [
        // relations: desmatamentoMunicipioRelations (bioma, municipio)
        {
          tabelaDe: "desmatamento_municipio",
          colunaDe: "biomaId",
          tabelaPara: "bioma",
          colunaPara: "id",
        },
        {
          tabelaDe: "desmatamento_municipio",
          colunaDe: "municipioId",
          tabelaPara: "municipio",
          colunaPara: "id",
        }
      ]
    },
    {
      nome: "Característica",
      tabela: "caracteristica",
      descricao: "Tipos de características.",
      colunas: [
        { nome: "nome_caracteristica", tipo: "string", descricao: "Nome da Característica" },
        { nome: "categoria", tipo: "string", descricao: "Categoria" }
      ],
      // relations: caracteristicaRelations (caracteristicaMunicipios, caracteristicaBiomas, caracteristicaEstados)
      juncoes: [
        {
          tabelaDe: "caracteristica",
          colunaDe: "id",
          tabelaPara: "caracteristica_bioma",
          colunaPara: "caracteristicaId"
        },
        {
          tabelaDe: "caracteristica",
          colunaDe: "id",
          tabelaPara: "caracteristica_estado",
          colunaPara: "caracteristicaId"
        },
        {
          tabelaDe: "caracteristica",
          colunaDe: "id",
          tabelaPara: "caracteristica_municipio",
          colunaPara: "caracteristicaId"
        }
      ]
    },
    {
      nome: "Característica do Bioma",
      tabela: "caracteristica_bioma",
      descricao: "Características de um bioma.",
      colunas: [
        { nome: "area", tipo: "number", descricao: "Área do bioma com essa característica" },
      ],
      juncoes: [
        // relations: caracteristicaBiomaRelations (caracteristica, bioma)
        {
          tabelaDe: "caracteristica_bioma",
          colunaDe: "caracteristicaId",
          tabelaPara: "caracteristica",
          colunaPara: "id",
        },
        {
          tabelaDe: "caracteristica_bioma",
          colunaDe: "biomaId",
          tabelaPara: "bioma",
          colunaPara: "id",
        }
      ]
    },
    {
      nome: "Característica do Estado",
      tabela: "caracteristica_estado",
      descricao: "Características de um estado.",
      colunas: [
        { nome: "area", tipo: "number", descricao: "Área do bioma com essa característica" },
      ],
      juncoes: [
        // relations: caracteristicaEstadoRelations (caracteristica, estado)
        {
          tabelaDe: "caracteristica_estado",
          colunaDe: "caracteristicaId",
          tabelaPara: "caracteristica",
          colunaPara: "id",
        },
        {
          tabelaDe: "caracteristica_estado",
          colunaDe: "estadoId",
          tabelaPara: "estado",
          colunaPara: "id",
        }
      ]
    },
    {
      nome: "Característica do Município",
      tabela: "caracteristica_municipio",
      descricao: "Características de um município.",
      colunas: [
        { nome: "area", tipo: "number", descricao: "Área do bioma com essa característica" },
      ],
      juncoes: [
        // relations: caracteristicaMunicipioRelations (caracteristica, municipio)
        {
          tabelaDe: "caracteristica_municipio",
          colunaDe: "caracteristicaId",
          tabelaPara: "caracteristica",
          colunaPara: "id",
        },
        {
          tabelaDe: "caracteristica_municipio",
          colunaDe: "municipioId",
          tabelaPara: "municipio",
          colunaPara: "id",
        }
      ]
    },
    {
      nome: "Estado",
      tabela: "estado",
      descricao: "Estados brasileiros.",
      colunas: [
        { nome: "uf", tipo: "string", descricao: "Sigla do estado" },
        { nome: "nome_estado", tipo: "string", descricao: "Nome do estado" }
      ],
      // relations: estadoRelations (biomaEstados, municipios, desmatamentoEstados, caracteristicaEstados)
      juncoes: [
        {
          tabelaDe: "estado",
          colunaDe: "id",
          tabelaPara: "bioma_estado",
          colunaPara: "estadoId"
        },
        {
          tabelaDe: "estado",
          colunaDe: "id",
          tabelaPara: "municipio",
          colunaPara: "estadoId"
        },
        {
          tabelaDe: "estado",
          colunaDe: "id",
          tabelaPara: "desmatamento_estado",
          colunaPara: "estadoId"
        },
        {
          tabelaDe: "estado",
          colunaDe: "id",
          tabelaPara: "caracteristica_estado",
          colunaPara: "estadoId"
        }
      ]
    },
    {
      nome: "Município",
      tabela: "municipio",
      descricao: "Municípios de cada estado brasileiro.",
      colunas: [
        { nome: "nome_municipio", tipo: "string", descricao: "Nome do município" }
      ],
      // relations: municipioRelations (estado, biomaMunicipios, desmatamentoMunicipios, caracteristicaMunicipios)
      juncoes: [
        {
          tabelaDe: "municipio",
          colunaDe: "estadoId",
          tabelaPara: "estado",
          colunaPara: "id"
        },
        {
          tabelaDe: "municipio",
          colunaDe: "id",
          tabelaPara: "bioma_municipio",
          colunaPara: "municipioId"
        },
        {
          tabelaDe: "municipio",
          colunaDe: "id",
          tabelaPara: "desmatamento_municipio",
          colunaPara: "municipioId"
        },
        {
          tabelaDe: "municipio",
          colunaDe: "id",
          tabelaPara: "caracteristica_municipio",
          colunaPara: "municipioId"
        }
      ]
    },
    {
      nome: "Bioma",
      tabela: "bioma",
      descricao: "Biomas brasileiros.",
      colunas: [
        { nome: "nome_bioma", tipo: "string", descricao: "Nome do bioma" }
      ],
      // relations: biomaRelations (biomaEstados, biomaMunicipios, desmatamentoBiomas, desmatamentoEstados, desmatamentoMunicipios, caracteristicaBiomas)
      juncoes: [
        {
          tabelaDe: "bioma",
          colunaDe: "id",
          tabelaPara: "bioma_estado",
          colunaPara: "biomaId"
        },
        {
          tabelaDe: "bioma",
          colunaDe: "id",
          tabelaPara: "bioma_municipio",
          colunaPara: "biomaId"
        },
        {
          tabelaDe: "bioma",
          colunaDe: "id",
          tabelaPara: "desmatamento_bioma",
          colunaPara: "biomaId"
        },
        {
          tabelaDe: "bioma",
          colunaDe: "id",
          tabelaPara: "desmatamento_estado",
          colunaPara: "biomaId"
        },
        {
          tabelaDe: "bioma",
          colunaDe: "id",
          tabelaPara: "desmatamento_municipio",
          colunaPara: "biomaId"
        },
        {
          tabelaDe: "bioma",
          colunaDe: "id",
          tabelaPara: "caracteristica_bioma",
          colunaPara: "biomaId"
        }
      ]
    },
    {
      nome: "Bioma por Estado",
      tabela: "bioma_estado",
      descricao: "Biomas de cada estado brasileiro.",
      colunas: [],
      // relations: biomaEstadoRelations (bioma, estado)
      juncoes: [
        {
          tabelaDe: "bioma_estado",
          colunaDe: "biomaId",
          tabelaPara: "bioma",
          colunaPara: "id"
        },
        {
          tabelaDe: "bioma_estado",
          colunaDe: "estadoId",
          tabelaPara: "estado",
          colunaPara: "id"
        }
      ]
    },
    {
      nome: "Bioma por Município",
      tabela: "bioma_municipio",
      descricao: "Biomas de cada município brasileiro.",
      colunas: [],
      // relations: biomaMunicipioRelations (bioma, municipio)
      juncoes: [
        {
          tabelaDe: "bioma_municipio",
          colunaDe: "biomaId",
          tabelaPara: "bioma",
          colunaPara: "id"
        },
        {
          tabelaDe: "bioma_municipio",
          colunaDe: "municipioId",
          tabelaPara: "municipio",
          colunaPara: "id"
        }
      ]
    }
  ];