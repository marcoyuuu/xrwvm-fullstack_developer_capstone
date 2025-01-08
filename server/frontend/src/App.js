// src/App.js
import React from 'react';
import { Routes, Route } from "react-router-dom";

// Import all necessary components
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Dealers from './components/Dealers/Dealers';
import Dealer from "./components/Dealers/Dealer";
import PostReview from "./components/Dealers/PostReview";
import LoginPanel from "./components/Login/Login";
import Register from "./components/Register/Register";
import NotFound from "./components/NotFound/NotFound";

function App() {
  return (
    <Routes>
      {/* Home Route */}
      <Route path="/" element={<Home />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<Register />} />

      {/* About and Contact Routes */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Dealers Routes */}
      <Route path="/dealers" element={<Dealers />} />
      <Route path="/dealer/:id" element={<Dealer />} />
      <Route path="/postreview/:id" element={<PostReview />} />

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
