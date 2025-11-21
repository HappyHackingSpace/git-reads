import { Routes, Route } from "react-router-dom";
import Page from "./pages/Document";
import { RepositoryProvider } from "@/contexts/RepositoryProvider";
import Landing from "@/pages/Landing";

function App() {
  return (
    <RepositoryProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/document" element={<Page />} />
        <Route path="/document/:sessionId" element={<Page />} />
      </Routes>
    </RepositoryProvider>
  );
}

export default App;