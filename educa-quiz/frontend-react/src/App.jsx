import { useState } from "react";
import Welcome from "./pages/Welcome.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  const [started, setStarted] = useState(false);

  return started ? <Dashboard /> : <Welcome onStart={() => setStarted(true)} />;
}
