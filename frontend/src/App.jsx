import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Tasks from "./Pages/Tasks";

function App() {
  return (
    <BrowserRouter>
      <h1>Routes</h1>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
