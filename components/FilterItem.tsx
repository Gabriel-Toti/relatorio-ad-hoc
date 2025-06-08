import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';

interface IFilterInfo {
    filter_name: string
}

function FilterItem({ filter_name }: IFilterInfo) {

  return (
    <div className='text-center w-fit'>
        <FontAwesomeIcon className="text-8xl"
         icon={faFile} />
        <p>{filter_name}</p>
    </div>
  )
}

export default FilterItem;