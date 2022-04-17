import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import General from "./pages/General";
import Striking from "./pages/Striking";
import Grappling from "./pages/Grappling";
import Equipment from "./pages/Equipment";
import Fights from "./pages/Fights";
import Others from "./pages/Others";
import Login from "./pages/Login";

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/general">General</Link>
        <Link to="/striking">Striking</Link>
        <Link to="/grappling">Grappling</Link>
        <Link to="/equipment">Equipment</Link>
        <Link to="/fights">Fights</Link>
        <Link to="/others">Others</Link>
      </nav>
      <div>
        <Link to="/login">Log In</Link>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/general" element={<General />} />
        <Route path="/striking" element={<Striking />} />
        <Route path="/grappling" element={<Grappling />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/fights" element={<Fights />} />
        <Route path="/others" element={<Others />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
