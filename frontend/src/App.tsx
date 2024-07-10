import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Index from "./components/Index";
import Trivia from "./components/Trivia";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Index />} />
        <Route path="/trivia" element={<Trivia />} />
      </Routes>
    </Router>
  );
}

export default App;
