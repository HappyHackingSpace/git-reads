import "./App.css";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Document from "./pages/Document/Document";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Landing />} />
        <Route path="/document" element={<Document />} />
      </Routes>
    </>
  );
}

export default App;
