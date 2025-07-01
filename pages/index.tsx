
import { useState } from "react";
import Formulario  from "./components/formulario";
import { QueryProvider } from "./components/query-provider";
import TableReport from "./components/table-report";
import Grafico from "./components/grafico";


export default function Index() {
  const [onTableReport, setOnTableReport] = useState<boolean>(false);
  const [onGraphReport, setOnGraphReport] = useState<boolean>(false);

  return (
    <div>
      <QueryProvider>
        <Formulario openTableReport={() => setOnTableReport(true)} openGraphReport={() => setOnGraphReport(true)}/>
        {onTableReport && <TableReport onClose={() => setOnTableReport(false)}/>}
        {onGraphReport && <Grafico onClose={() => setOnGraphReport(false)}/>}
      </QueryProvider>
    </div>
  );
}

