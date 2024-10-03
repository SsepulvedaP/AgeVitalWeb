import { Route, Routes } from "react-router-dom";

//Componentes
import Navbar from "components/shared/Navbar/Navbar";
import Mapa from "components/Mapa/Mapa";
import Home from "components/Home/Home";

function Main() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/mapa" exact element={<Mapa />} />
      </Routes>
    </>
  );
}

export default Main;
