import React, { useState, useEffect, useRef } from 'react';
import * as Plot from "@observablehq/plot";
import { useQuery } from './query-provider'
import { QueryReturn } from '../../interfaces';

interface IGraphData {
    x: string;
    y: string;
    sort?: {
        attr?: string;
        reverse?: boolean;
    };
}

interface IControl {
    onClose: () => void;
}

export default function Grafico({onClose}: IControl) {
    const headerRef = useRef<HTMLDivElement>();
    const {queryPayload, setQueryPayload} = useQuery();
    const [dataReport, setDataReport] = useState<QueryReturn>({
            data: [],
            message: "Carregando..."
          });
    const [jsonStructure, setJsonStructure] = useState<string[]>([]);
    const [graphStructure, setGraphStructure] = useState<IGraphData>();

    const sendQuery = async (queryArguments) => {

      if(!queryPayload) return;

      const response = await fetch("/api/backend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryArguments),
      });
      const result = await response.json();
      setDataReport(result);
      console.log(result);
      // mutate(result, false);
      setJsonStructure(Object.keys(result.data[0] || {}));
      setGraphStructure({
        x: Object.keys(result.data[0] || {})[0],
        y: Object.keys(result.data[0] || {})[1], 
        sort: {
          attr: Object.keys(result.data[0] || {})[0],
          reverse: false
        }
      });
      console.log(result);
      // mutate(result, false);
    };

    useEffect(() => {
    
        sendQuery(queryPayload);
    
      }, [queryPayload]);
    
    useEffect(() => {
        console.log(dataReport)
        if(!dataReport || !dataReport.data) return;
        if(graphStructure === undefined) {
            setGraphStructure({
                x: Object.keys(dataReport.data[0] || {})[0],
                y: Object.keys(dataReport.data[0] || {})[1], 
                sort: {
                    attr: Object.keys(dataReport.data[0] || {})[0],
                    reverse: false
                }
            });
        }

        if (dataReport.data === undefined || 
            dataReport.data[0] === undefined) return;
          
        const isXNumber = dataReport.data[0][graphStructure.x] !== undefined && !Number.isNaN(Number(dataReport.data[0][graphStructure.x]));
        const isYNumber = dataReport.data[0][graphStructure.y] !== undefined && !Number.isNaN(Number(dataReport.data[0][graphStructure.y]));
        console.log(isXNumber, isYNumber, graphStructure.x, graphStructure.y);
        const graphType = isXNumber && !isYNumber ? Plot.barX : isXNumber && isYNumber ? Plot.barX :Plot.barY;
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
                graphType(dataReport.data, {
                        x: graphStructure.x, 
                        y: graphStructure.y, 
                        sort: {
                            x:"x",
                            y: "y",
                            reverse: graphStructure.sort.reverse
                        }
                    }),
            ]
        });
        if(headerRef.current) headerRef.current.append(chart);
        return () => chart.remove();
    }, [dataReport,graphStructure]);
    return (
    <div className='mx-full flex flex-row items-start justify-center'>
      <button className='absolute z-3 right-0 bg-black text-white rounded-full flex items-center justify-center px-1'
                    onClick={onClose}
            ></button>
        <div id='graph-container'>
            {headerRef && <div ref={headerRef}/>}
            <div id='field-selector' className='flex flex-row items-center justify-center my-2'>
                <div id='field-selector-x'>
                    X:
                    <select
                        className="table-form mx-2"
                        onChange={(e) => {
                            if(graphStructure?.y === undefined) {
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
                        {jsonStructure.map((tabela, index) => {return tabela !== graphStructure?.y && (
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
                            if(graphStructure?.x === undefined) {
                                setGraphStructure({
                                    ...graphStructure,
                                    y: e.target.value,
                                    x: jsonStructure.find((col) => col !== e.target.value) || ''
                                });
                            }
                            else{
                                setGraphStructure({
                                    ...graphStructure,
                                    y: e.target.value
                                });
                            }
                    }}
                        defaultValue={graphStructure?.y || jsonStructure[1] || ''}
                >

                    {jsonStructure.map((tabela, index) => {return tabela !== graphStructure?.x && (
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
                {dataReport.data.map((row, index) => (
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