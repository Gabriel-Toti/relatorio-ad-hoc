import React, { useEffect, useState } from 'react'
import { useQuery } from './query-provider'
import { QueryReturn } from '../../interfaces';


const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface IControl {
    onClose: () => void;
}

const TableReport = ({onClose}: IControl) => {

    const {queryPayload, setQueryPayload} = useQuery();
    const [reportData, setReportData] = useState<QueryReturn>();

    // const { data, error, mutate } = useSwr<QueryReturn>("/api/backend", fetcher);

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
    setReportData(result);
    console.log(result);
    // mutate(result, false);
  };


  useEffect(() => {

    sendQuery(queryPayload);

    }, [queryPayload]);

  return (
    <>
        <div className='fixed inset-0 w-full h-full bg-gray-600 opacity-60 flex justify-center items-center'/>
        <div className='fixed left-1/2 top-1/2 -translate-1/2 bg-white w-3/4 h-3/4 shadow-2xl shadow-blue-400 opacity-100 rounded-2xl'>
            <button className='fixed right-0 bg-black text-white rounded-full flex items-center justify-center px-1'
                    onClick={onClose}
            >
                <span className='w-fit h-fit text-4xl leading-none -translate-y-1/6'>&times;</span>
            </button>
            <div className='w-full h-full flex justify-center items-center'>
                <table>
                    <thead className='bg-gray-200'>
                        <tr>
                            <th className="table-form">Tabela</th>
                            <th className="table-form">Campo</th>
                            <th className="table-form">Operação</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="table-form">Teste</td>
                            <td className="table-form">Teste</td>
                            <td className="table-form">Teste</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </>
    
  )
}

export default TableReport
