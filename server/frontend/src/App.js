import { Routes, Route } from "react-router-dom";
import LoginPanel from "./components/Login/Login";
import Register from "./components/Register/Register";
import Dealers from "./components/Dealers/Dealers";

function App() {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<Register />} />

      {/* Dealers List Route */}
      <Route path="/dealers" element={<Dealers />} />

      {/* Dealer Details and Reviews Route */}
      

      
    </Routes>
  );
}

export default App;
