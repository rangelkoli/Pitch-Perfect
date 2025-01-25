import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/Login";
import WebcamStream from "./components/AiPresentation";
import Header from "./components/Header";
import PresentationFileUpload from "./components/PresentationFileUpload";
import LandingPage from "./components/LandingPage";
import { FooterDemo } from "./components/Footer";

function App() {
  const [count, setCount] = useState(0);
  const [isLoggedin, setIsLoggedIn] = useState(true);

  return (
    <div className='min-w-screen min-h-screen'>
      <Header />
      <div className='flex flex-col items-center justify-center align-middle h-full min-h-screen'>
        {isLoggedin ? (
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<WebcamStream />} />
              <Route
                path='/presentation'
                element={<PresentationFileUpload />}
              />
            </Routes>
          </BrowserRouter>
        ) : (
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route path='/signup' element={<LoginPage />} />
            </Routes>
          </BrowserRouter>
        )}
      </div>
      <FooterDemo />
    </div>
  );
}

export default App;
