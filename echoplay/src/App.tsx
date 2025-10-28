import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Search from "./pages/Search";
import MainLayout from "./layouts/MainLayout";
import Signup from "./pages/SignUp";
import RequestCode from "./pages/RequestCode";
import VerifyCode from "./pages/VerifyCode";

function App() {
  return (
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
