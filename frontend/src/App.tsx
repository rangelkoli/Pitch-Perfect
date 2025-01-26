import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/Login";
import WebcamStream from "./components/AiPresentation";
import Header from "./components/Header";
import PresentationFileUpload from "./components/PresentationFileUpload";
import LandingPage from "./components/LandingPage";
import { FooterDemo } from "./components/Footer";
import PresentationResults from "./components/PresentationResults";
import PresentationPractice from "./components/PresentationPractice";
import { ToastContainer, toast } from "react-toastify";
import { PresentationLayout } from "./components/presentation-layout";
import { useParams } from "react-router";
import { useuseHeaderStore } from "./stores/header";

function App() {
  const [count, setCount] = useState(0);
  const [isLoggedin, setIsLoggedIn] = useState(true);
  const url = useuseHeaderStore((state) => state.url);
  return (
    <div className='min-w-screen min-h-screen bg-black'>
      {/* {url == "/presentation-test" ? <div></div> : <Header />} */}
      <div
        className={`flex flex-col items-center justify-center align-middle h-full min-h-screen ${
          url == "/presentation-test" ? "bg-black p-0" : "bg-zinc-900 pt-0"
        }`}
      >
        {isLoggedin ? (
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<WebcamStream />} />
              <Route
                path='/presentation'
                element={<PresentationFileUpload />}
              />
              <Route
                path='/presentation-results'
                element={<PresentationResults />}
              />
              <Route
                path='/presentation-practice'
                element={<PresentationPractice />}
              />
              <Route
                path='/presentation-test'
                element={<PresentationLayout />}
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
        <ToastContainer />
      </div>
      <FooterDemo />
    </div>
  );
}

export default App;
