import type { MetaFunction } from "react-router";
import { Welcome } from "../welcome/welcome";

export const meta: MetaFunction = () => [
  { title: "New React Router App" },
  { name: "description", content: "Welcome to React Router!" },
];

export default function Home() {
  return <Welcome />;
}
