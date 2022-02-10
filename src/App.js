import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import Analiza from "./components/Analiza/Analiza";
import Struktura from "./components/Struktura/Struktura";
import Wlmech from "./components/Wlmech/Wlmech";
import Podsumowanie from "./components/Podsumowanie/Podsumowanie";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function App() {
  return (
    <Router>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/analiza" element={<Analiza />} />
            <Route path="/struktura" element={<Struktura />} />
            <Route path="/wlmech" element={<Wlmech />} />
            <Route path="/podsumowanie" element={<Podsumowanie />} />
            <Route path="*" element={<Home />} />
          </Routes>
    </Router>
  );
}

export default App;
