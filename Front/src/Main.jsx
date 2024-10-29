import { Route, Routes } from "react-router-dom";

//Componentes
import Navbar from "components/shared/Navbar/Navbar";
import Mapa from "components/Mapa/Mapa";
import Home from "components/Home/Home";
import Admin from "components/Admin/Admin";
import Tresd from "components/Tresd/Tresd";
import Usuarios from "components/Usuarios/Usuarios";
import Login from "components/Login/Login";

function Main() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/mapa" exact element={<Mapa />} />
        <Route path="/admin" exact element={<Admin />} />
        <Route path="/tresd" exact element={<Tresd />} />
        <Route path="/usuarios" exact element={<Usuarios />} />
        <Route path="/login" exact element={<Login />} />
      </Routes>
    </>
  );
}

export default Main;
