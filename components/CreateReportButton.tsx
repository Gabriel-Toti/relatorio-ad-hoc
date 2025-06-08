import React from 'react'

interface IButton {
  onClick: () => void;
}

const CreateReportButton = ({ onClick }: IButton) => {
  return (
    <button className='text-center bg-neutral-500 px-10 py-2 rounded-md text-2xl uppercase font-bold' onClick={onClick}>
      Gerar Relatório
    </button>
  )
}

export default CreateReportButton