import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { Dashboard } from "./pages/dashboard";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { DashNotes } from "./pages/dashNotes";
import { DashTweets } from "./pages/dashTweets";
import { DashYoutube } from "./pages/dashYoutube";
import { GOOGLE_CLIENT_ID } from "./config";
import { UserProvider } from "./hooks/useUser";
import { FolderProvider } from "./hooks/useFolders";
import { DashFolder } from "./pages/dashFolder";

function AppRoutes() {
  return (
    <UserProvider>
      <FolderProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Signin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/share/:shareId" element={<Dashboard />} />
            <Route path="/dashboard/notes" element={<DashNotes />} />
            <Route path="/dashboard/tweets" element={<DashTweets />} />
            <Route path="/dashboard/youtube" element={<DashYoutube />} />
            <Route path="/dashboard/folders/:id" element={<DashFolder />} />
          </Routes>
        </BrowserRouter>
      </FolderProvider>
    </UserProvider>
  );
}

function App() {
  if (!GOOGLE_CLIENT_ID) {
    return <AppRoutes />;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppRoutes />
    </GoogleOAuthProvider>
  );
}

export default App;
