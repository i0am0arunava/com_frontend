
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

import Register from "./pages/Register";
import Chat from "./pages/Chat";
import SetAvatar from "./components/setAvatar";
import Contacts from "./components/Contact";
import Welcome from "./components/welcome";
import Qrcode from "./components/Qrcode";
import Scanner from "./components/Scanner";
import Success from "./components/Success";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Register/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/qr" element={<Qrcode />} />
        <Route path="/scanner" element={<Scanner/>} />
        <Route path="/success" element={<Success/>} />
      </Routes>

      
    </BrowserRouter>
  );
}
