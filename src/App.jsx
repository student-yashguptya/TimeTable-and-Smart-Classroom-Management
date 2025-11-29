import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-6">
      <div className="flex gap-6 mb-6">
        <a href="https://vite.dev" target="_blank">
          <img
            src={viteLogo}
            className="w-20 transition-transform hover:scale-110"
            alt="Vite logo"
          />
        </a>

        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            className="w-20 transition-transform hover:scale-110"
            alt="React logo"
          />
        </a>
      </div>

      <h1 className="text-4xl font-bold mb-4">Vite + React + Tailwind</h1>

      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center gap-4">
        <button
          className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>

        <p className="text-gray-600">
          Edit <code className="text-purple-600">src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="mt-6 text-gray-500">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
