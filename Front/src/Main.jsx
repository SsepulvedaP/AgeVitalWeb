import { Route, Routes } from "react-router-dom";

//Componentes
import Navbar from "components/shared/Navbar/Navbar";
import Mapa from "components/Mapa/Mapa";
import Home from "components/Home/Home";
import Admin from "components/Admin/Admin";

function Main() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/mapa" exact element={<Mapa />} />
        <Route path="/admin" exact element={<Admin />} />
      </Routes>
    </>
  );
}

export default Main;
