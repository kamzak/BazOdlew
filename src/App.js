import { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/Home";
import Analiza from "./components/Analiza/Analiza";
import Struktura from "./components/Struktura/Struktura";
import Wlmech from "./components/Wlmech/Wlmech";
import Podsumowanie from "./components/Podsumowanie/Podsumowanie";
import AuthForm from "./components/Auth/AuthForm";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthContext from "./store/auth-context";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        {authCtx.isLoggedIn && <Route path="/analiza" element={<Analiza />} />}
        {authCtx.isLoggedIn && <Route path="/struktura" element={<Struktura />} />}
        {authCtx.isLoggedIn && <Route path="/wlmech" element={<Wlmech />} />}
        {authCtx.isLoggedIn && <Route path="/podsumowanie" element={<Podsumowanie />} />}
        {!authCtx.isLoggedIn && <Route path="/login" element={<AuthForm />} />}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
