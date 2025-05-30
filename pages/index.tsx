import type { Hello } from "../interfaces";
import useSwr from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Index() {
  const { data, error, isLoading } = useSwr<Hello>("/api/hello", fetcher);

  if (error) return <div>Failed to load hello.</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data) return null;

  return (
    <div>
      <p>{data.message}</p>
    </div>
  );
}
