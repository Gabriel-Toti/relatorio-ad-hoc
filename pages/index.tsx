import type { Filter } from "../interfaces";
import FilterItem from "../components/FilterItem";
import { get, post } from "../utils/fetcher";
import { useEffect, useState } from "react";
import CreateReportButton from "../components/CreateReportButton";

export default function Index() {

  const [filters, setFilters] = useState<Filter[]>([]);

  useEffect(() => {
    (async() => await post({ id: 1, name: "Teste" })("/api/filters"))();
    (
      async() => {
        const response = await get("/api/filters");
        console.log("response", response);
        setFilters(response);
      }
    )();
  }, []);



  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center gap-5">
      <section className="w-1/2 mx-auto">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] justify-items-center-safe columns-1">
          {
            filters.map((filter, index) => {
              return (
                <FilterItem key={index} filter_name={filter.name}/>
              )
            })
          }
        </div>
      </section>
      <CreateReportButton onClick={() => null}/>
    </main>
  );
}
