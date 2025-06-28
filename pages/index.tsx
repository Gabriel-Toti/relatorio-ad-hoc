import type { Hello } from "../interfaces";
import Formulario  from "./components/formulario";
import useSwr from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Index() {
  const { data, error, isLoading } = useSwr<Hello>("/api/hello", fetcher);

  if (error) return <div>Failed to load hello.</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data) return null;

  return (
    <div>
      <p className="flex text-3xl font-bold text-red-500 justify-center p-5">{data.message}</p>
      <Formulario />
    </div>
  );
}
