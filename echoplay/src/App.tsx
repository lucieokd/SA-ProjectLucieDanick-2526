import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Search from "./pages/Search";
import MainLayout from "./layouts/MainLayout";
import Signup from "./pages/SignUp";
import RequestCode from "./pages/RequestCode";
import VerifyCode from "./pages/VerifyCode";
import Profile from "./pages/Profile";
import UploadSongPage from "./pages/UploadSongPage";
<<<<<<<<< Temporary merge branch 1
import CreatePlaylistPage from "./pages/CreatePlaylistPage";
import { ThemeContext } from "./components/Profile/theme-context";
=========
import { ThemeContext } from './components/Profile/theme-context';
import ArtistInfo from "./pages/ArtistInfo";

function App() {
  const [theme, setTheme] = useState<string>(() => {
    // Laad theme preference uit localStorage bij initialisatie
    const savedTheme = localStorage.getItem("theme");
    console.log("Gelezen theme uit localStorage:", savedTheme);
    const initialTheme = savedTheme || "light";
    // Voeg class direct toe bij initialisatie
    document.documentElement.className = `theme-${initialTheme}`;
    return initialTheme;
  });

  // Update document.documentElement class wanneer theme verandert
  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
    // Sla theme preference op in localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Router>
        <Routes>
          {/* Login-pagina zonder layout */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/requestcode" element={<RequestCode />} />
          <Route path="/verifycode" element={<VerifyCode />} />

          {/* Alle andere routes gebruiken de layout mét player */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/upload" element={<UploadSongPage />} />
<<<<<<<<< Temporary merge branch 1
            <Route path="/create-playlist" element={<CreatePlaylistPage />} />
=========
            <Route path="/Artistinfo" element={<ArtistInfo />} />
>>>>>>>>> Temporary merge branch 2
          </Route>
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;
