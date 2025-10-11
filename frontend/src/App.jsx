import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import DistrictPage from "./components/DistrictPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/district/:id" element={<DistrictPage />} />
      </Routes>
    </Router>
  );
}

export default App;
