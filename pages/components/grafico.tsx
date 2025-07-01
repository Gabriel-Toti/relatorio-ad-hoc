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

export default function Grafico({ payload }: { payload: any }) {
    const headerRef = useRef();
    const [data, setData] = useState<any[]>([]);
    const [jsonStructure, setJsonStructure] = useState<string[]>([]);
    const [graphStructure, setGraphStructure] = useState<IGraphData|undefined>();
    useEffect(() => {
      fetch('/api/backend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(json => {
        const dataParsed = json.data;
        dataParsed.forEach((item: any) => {
          Object.keys(item).forEach((key) => {
            const value = item[key];
            const num = Number(value);
            if (!isNaN(num)) {
            item[key] = num;
            }
          });
        });
        setData(dataParsed);
        const structure = Object.keys(dataParsed[0] || {});
        setJsonStructure(structure);
        if(structure.length < 2) {
            console.error("Not enough data to create a graph. At least two fields are required.");
            return;
        }
        setGraphStructure({
            x: jsonStructure[0],
            y: jsonStructure[1],
            sort: {
                attr: "y",
                reverse: false
            }
        });
      });
    }, [payload]);
    useEffect(() => {
        console.log("Graph structure changed", graphStructure);
        if (data === undefined || 
            graphStructure === undefined || graphStructure.x === undefined || graphStructure.y === undefined ||
            data[0] === undefined || headerRef.current === undefined) return;
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
    <div className='mx-full flex flex-row items-start justify-center'>
        <div id='graph-container'>
            <div ref={headerRef}/>
            <div id='field-selector' className='flex flex-row items-center justify-center my-2'>
                <div id='field-selector-x'>
                    X:
                    <select
                        className="table-form mx-2"
                        onChange={(e) => {
                            if(graphStructure.y === undefined) {
                                setGraphStructure({
                                    ...graphStructure,
                                    x: e.target.value,
                                    y: jsonStructure.find((col) => col !== e.target.value) || ''
                                });
                            }
                            else{
                                setGraphStructure({
                                    ...graphStructure,
                                    x: e.target.value
                                });
                            }
                        }}
                        defaultValue={graphStructure?.x || jsonStructure[0] || ''}
                    >
                        {jsonStructure.map((tabela, index) => {return tabela !== graphStructure.y && (
                            <option key={index} value={tabela}>
                                {tabela}
                            </option>
                        )})}
                    </select>
                </div>
            
                <div id='field-selector-y'>
                Y:
                <select
                    className="table-form mx-2"
                    onChange={(e) => {
                        setGraphStructure({
                            ...graphStructure,
                            y: e.target.value
                        });
                    }}
                        defaultValue={graphStructure?.y || jsonStructure[1] || ''}
                >

                    {jsonStructure.map((tabela, index) => {return tabela !== graphStructure.x && (
                        <option key={index} value={tabela}>
                            {tabela}
                        </option>
                    )})}
                </select>
                </div>

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
            </div>
            <div id='field-sorter' className='flex flex-row items-center justify-center my-2'>
                <div id='field-sorter-x' className='flex flex-row items-center justify-center'>
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
                </div>
                <div id='field-sorter-reverse' className='flex flex-row items-center justify-center'>
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
                </div>
            </div>
        </div>
        


        <table className='table-form'>
            <thead>
                <tr className='table-form'>
                    {jsonStructure.map((coluna, index) => (
                        <th className='table-form' key={index}>{coluna}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        {jsonStructure.map((coluna, colIndex) => (
                            <td className='table-form' key={colIndex}>{row[coluna]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    );
}