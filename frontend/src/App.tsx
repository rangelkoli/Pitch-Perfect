import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/Login";
import WebcamStream from "./components/AiPresentation";

function App() {
  const [count, setCount] = useState(0);
  const [isLoggedin, setIsLoggedIn] = useState(true);

  return (
    <>
      {isLoggedin ? (
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<WebcamStream />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/signup' element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
