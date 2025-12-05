import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Tambah from "./Tambah";
import Edit from "./Edit";
import "./style.css"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  //  Using router to help route for the pages
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/tambah" element={<Tambah />} />
      <Route path="/edit/:id" element={<Edit />} />
    </Routes>
  </BrowserRouter>
);
