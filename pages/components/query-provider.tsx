import React, { createContext, ReactNode, useContext, useState } from 'react'
import { QueryArguments } from '../../domain/backend/repositories/backend.repository';

const QueryContext = createContext(null);

interface IContextProps {
  children: ReactNode
}

export const QueryProvider = ({ children } : IContextProps) => {
  const [queryPayload, setQueryPayload] = useState<QueryArguments>();
  return (
    <QueryContext.Provider value={{queryPayload, setQueryPayload}}>
      {children}
    </QueryContext.Provider>
  )
}

export const useQuery = (): {queryPayload: QueryArguments | null, setQueryPayload: (payload: QueryArguments) => void} => useContext(QueryContext);