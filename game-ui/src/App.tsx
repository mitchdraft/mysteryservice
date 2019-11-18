import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { ClueApp } from "clueapp/app";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <ClueApp />
      </BrowserRouter>
    </div>
  );
};

export default App;
