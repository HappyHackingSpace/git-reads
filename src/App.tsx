import { Routes, Route } from "react-router-dom";
import { motion } from "motion/react";
import { RepositoryProvider } from "@/contexts";
import Document from "@/pages/Document";
import Landing from "@/pages/Landing";

function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      <RepositoryProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/document" element={<Document />} />
          <Route path="/document/:sessionId" element={<Document />} />
        </Routes>
      </RepositoryProvider>
    </motion.div>
  );
}

export default App;
