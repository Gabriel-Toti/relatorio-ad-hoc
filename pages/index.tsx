import { useState } from "react";
import Formulario  from "./components/formulario";
import { QueryProvider } from "./components/query-provider";
import TableReport from "./components/table-report";


export default function Index() {
  const [onTableReport, setOnTableReport] = useState<boolean>(false);

  return (
    <div>
      <QueryProvider>
        <Formulario openTableReport={() => setOnTableReport(true)}/>
        {onTableReport && <TableReport onClose={() => setOnTableReport(false)}/>}
      </QueryProvider>
    </div>
  );
}
