import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Dashboard } from "./pages/dashboard";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { DashTweets } from "./pages/dashTweets";
import { DashYoutube } from "./pages/dashYoutube";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Signin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/share/:shareId" element={<Dashboard />} />
      <Route path="/dashboard/tweets" element={<DashTweets />} />
      <Route path="/dashboard/youtube" element={<DashYoutube />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
