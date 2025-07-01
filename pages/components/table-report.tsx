import React, { useEffect, useState } from 'react'
import { useQuery } from './query-provider'
import { QueryReturn } from '../../interfaces';
import { arrayToCSV } from '../../utils/csv-gen';


const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface IControl {
    onClose: () => void;
}

const TableReport = ({onClose}: IControl) => {

    const {queryPayload, setQueryPayload} = useQuery();
    const [reportData, setReportData] = useState<QueryReturn>();
    const [rows, setRows] = useState<any[]>([]);
    const [cols, setCols] = useState<any[]>([]);

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

  const handleDownloadCSV = () => {
    if (!cols.length || !rows.length) return;

    const csv = arrayToCSV(cols, rows.map(r => Object.values(r)));

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'relatorio.csv';
    link.click();

    URL.revokeObjectURL(url);
};


  useEffect(() => {

    sendQuery(queryPayload);

  }, [queryPayload]);

  useEffect(() => {

    if(!reportData || !reportData.data) return;

    const resultingRows = [];
    const resultingCols = [];

    for(let x in reportData.data[0])
    {
      resultingCols.push(x);
    }

    for(let y of reportData.data)
    {
      resultingRows.push(y);
    }

    setRows(resultingRows);
    setCols(resultingCols);
  }, [reportData])

  return (
    <>
        <div className='fixed inset-0 w-full h-full bg-gray-600 opacity-60 flex justify-center items-center'/>
        <div className=' fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-3/4 h-3/4 rounded-2xl bg-white shadow-2xl shadow-blue-400
          flex flex-col gap-1'>
            <button className='absolute z-3 right-0 bg-black text-white rounded-full flex items-center justify-center px-1'
                    onClick={onClose}
            >
                <span className='w-fit h-fit text-4xl leading-none -translate-y-1/6'>&times;</span>
            </button>
            
            <div className='flex-1 overflow-auto px-0'>
                <table className='min-w-full border-collapse'>
                    <thead className='bg-gray-200 sticky top-0'>
                        <tr className='rounded-t-3xl text-center'>
                          {cols.map((column, index) => <th className="table-form" key={index}> {column} </th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                          <tr key={index} className='bg-white rounded-2xl'>
                            {Object.values(row).map((value, index) => <td className="table-form" key={index}>{value as string}</td>)}
                          </tr>
                        ))}
                    </tbody>
                </table>
                
            </div>
            <hr className="border-t border-gray-300" />
            <div className='flex justify-end p-1'>
                <button className='min-w-40 z-3 bg-black text-white rounded-full flex items-center justify-center px-1'
                      onClick={handleDownloadCSV}
              >
                  <span className='w-fit h-fit text-xl leading-none p-3'>Gerar CSV</span>
              </button>
            </div>
        </div>
    </>
    
  )
}

export default TableReport
