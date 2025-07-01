import React, { useState, useEffect, useRef } from 'react';
import * as Plot from "@observablehq/plot";
const exampledata = `{
  "data": [
    {
      "nomeEstado": "Maranhão",
      "totalDesmatado": "42066.51"
    },
    {
      "nomeEstado": "Rio de Janeiro",
      "totalDesmatado": "248.93"
    },
    {
      "nomeEstado": "Paraíba",
      "totalDesmatado": "3098.70"
    },
    {
      "nomeEstado": "São Paulo",
      "totalDesmatado": "994.16"
    },
    {
      "nomeEstado": "Sergipe",
      "totalDesmatado": "1131.67"
    },
    {
      "nomeEstado": "Mato Grosso do Sul",
      "totalDesmatado": "14045.78"
    },
    {
      "nomeEstado": "Rio Grande do Norte",
      "totalDesmatado": "2937.41"
    },
    {
      "nomeEstado": "Ceará",
      "totalDesmatado": "11045.94"
    },
    {
      "nomeEstado": "Santa Catarina",
      "totalDesmatado": "2467.25"
    },
    {
      "nomeEstado": "Alagoas",
      "totalDesmatado": "940.10"
    },
    {
      "nomeEstado": "Goiás",
      "totalDesmatado": "18774.62"
    },
    {
      "nomeEstado": "Amazonas",
      "totalDesmatado": "32973.86"
    },
    {
      "nomeEstado": "Minas Gerais",
      "totalDesmatado": "26640.09"
    },
    {
      "nomeEstado": "Paraná",
      "totalDesmatado": "2241.10"
    },
    {
      "nomeEstado": "Rondônia",
      "totalDesmatado": "30906.51"
    },
    {
      "nomeEstado": "Roraima",
      "totalDesmatado": "8893.49"
    },
    {
      "nomeEstado": "Mato Grosso",
      "totalDesmatado": "65856.25"
    },
    {
      "nomeEstado": "Bahia",
      "totalDesmatado": "37981.80"
    },
    {
      "nomeEstado": "Espírito Santo",
      "totalDesmatado": "359.62"
    },
    {
      "nomeEstado": "Rio Grande do Sul",
      "totalDesmatado": "19774.17"
    },
    {
      "nomeEstado": "Pernambuco",
      "totalDesmatado": "5449.15"
    },
    {
      "nomeEstado": "Amapá",
      "totalDesmatado": "1028.38"
    },
    {
      "nomeEstado": "Pará",
      "totalDesmatado": "87679.12"
    },
    {
      "nomeEstado": "Acre",
      "totalDesmatado": "13028.69"
    },
    {
      "nomeEstado": "Distrito Federal",
      "totalDesmatado": "140.57"
    },
    {
      "nomeEstado": "Piauí",
      "totalDesmatado": "21382.02"
    },
    {
      "nomeEstado": "Tocantins",
      "totalDesmatado": "36023.21"
    }
  ],
  "message": "Query executed successfully"
}`;

interface IGraphData {
    x: string;
    y: string;
    sort?: {
        attr?: string;
        reverse?: boolean;
    };
}

export default function Grafico() {
    const headerRef = useRef();
    const dataParsed = JSON.parse(exampledata).data;
    dataParsed.forEach((item) => {
        Object.keys(item).forEach((key) => {
            const value = item[key];
            const num = Number(value);
            if (!isNaN(num)) {
                item[key] = num;
            }
        });
    });
    const [data, setData] = useState(dataParsed);
    const structure = data[0] ? Object.keys(data[0]) : [];
    const [graphStructure, setGraphStructure] = useState<IGraphData>(
        {
            x: structure[0],
            y: structure[1],
            sort: {
                attr: "y",
                reverse: false
            }
        }
    );
    useEffect(() => {
        if (data === undefined || headerRef.current === undefined) return;
        const isXNumber = data[0][graphStructure.x] !== undefined && typeof data[0][graphStructure.x] === "number";
        const isYNumber = data[0][graphStructure.y] !== undefined && typeof data[0][graphStructure.y] === "number";
        const graphType = isXNumber && !isYNumber ? Plot.barX : Plot.barY;
        const chart = Plot.plot({
            margin: 100,
            marginTop: 20,
            style: {
                background: "transparent",
            },
            x: {
                grid: true,
                tickRotate: -45,
                label: graphStructure.x,
            },
            y: {
                grid: true
            },
            color: {
                type: "diverging",
                scheme: "burd"
            },
            marks: [
                graphType(data, {
                        x: graphStructure.x, 
                        y: graphStructure.y, 
                        sort: {
                            x: graphStructure.sort.attr,
                            y: graphStructure.sort.attr,
                            reverse: graphStructure.sort.reverse
                        }
                    }),
            ]
        });
        headerRef.current.append(chart);
        return () => chart.remove();
    }, [data,graphStructure]);
    return (
    <div className='mx-full flex flex-col items-center justify-center'>
        <div ref={headerRef}>
        </div>
        X:
        <select
            className="table-form mx-2"
            onChange={(e) => {
                setGraphStructure({
                    ...graphStructure,
                    x: e.target.value
                });
            }}
        >
            {structure.map((tabela, index) => {return tabela !== graphStructure.y && (
                <option key={index} value={tabela}>
                    {tabela}
                </option>
            )})}
        </select>
        Y:
        <select
            className="table-form mx-2"
            onChange={(e) => {
                setGraphStructure({
                    ...graphStructure,
                    y: e.target.value
                });
            }}
        >

            {structure.map((tabela, index) => {return tabela !== graphStructure.x && (
                <option key={index} value={tabela}>
                    {tabela}
                </option>
            )})}
        </select>
        <button
            className="table-form mx-2"
            onClick={() => {
                setGraphStructure({
                    ...graphStructure,
                    x: graphStructure.y,
                    y: graphStructure.x,
                });
            }}
        >
            Trocar
        </button>
        Ordernar Por:
        <select
            className="table-form mx-2"
            onChange={(e) => {
                setGraphStructure({
                    ...graphStructure,
                    sort: {
                        ...graphStructure.sort,
                        attr: e.target.value,
                    }
                });
            }}
        >
            <option key={0} value="x">
                X
            </option>
            <option key={1} value="y">
                Y
            </option>
        </select>
        Inverter:
        <input
            className="table-form mx-2"
            type="checkbox"
            onChange={(e) => {
                setGraphStructure({
                    ...graphStructure,
                    sort: {
                        ...graphStructure.sort,
                        reverse: e.target.checked,
                    }
                });
            }}
        />
        <table className='table-form'>
            <thead>
                <tr className='table-form'>
                    {structure.map((coluna, index) => (
                        <th className='table-form' key={index}>{coluna}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        {structure.map((coluna, colIndex) => (
                            <td className='table-form' key={colIndex}>{row[coluna]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    );
}