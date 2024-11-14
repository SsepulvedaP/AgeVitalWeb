import React, { useState, useEffect } from "react";
import { SwipeableDrawer, Typography } from "@mui/material";

// Components
import { mpld3_load_lib } from "./components/mpld3_load_lib";
import mpld3 from "mpld3";

// Styles
import styles from "./Ecovilla.module.css";
import ListRoundedIcon from "@mui/icons-material/ListRounded";
import PrimerPlanta from "assets/PrimerPlanta.png";
import SegundaPlanta from "assets/SegundaPlanta.png";

const Ecovilla = () => {
  const [pisoActual, setPisoActual] = useState("Primer Piso");
  const ImagenPlanta = pisoActual === "Primer Piso" ? PrimerPlanta : SegundaPlanta;
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const fig_name = "fig_el427345810798888193429725";
  const [medida, setMedida] = useState("Temperatura");
  const [json, setJson] = useState(require(`assets/interpolaciones/interpolation_1_floor_1`));
  useEffect(() => {
    if(medida === "Temperatura") { 
      var valor = 1;
    } else if(medida === "Humedad") {
      var valor = 2;
    } else {
      var valor = 3;
    }
    setJson(require(`assets/interpolaciones/interpolation_${valor}_floor_1`));
    mpld3.remove_figure(fig_name);
    mpld3.draw_figure(fig_name, json);
  }, [medida]);

  useEffect(() => {
    mpld3_load_lib("https://d3js.org/d3.v5.js", function () {
      mpld3_load_lib("https://mpld3.github.io/js/mpld3.v0.5.8.js", function () {
        mpld3.remove_figure(fig_name);
        mpld3.draw_figure(fig_name, json);
      });
    });
  }, [fig_name]);

  return (
    <section className={styles.Section}>
      <button onClick={toggleDrawer(true)} className={styles.toggleDrawer}>
        <ListRoundedIcon />
      </button>
      <img
        src={ImagenPlanta}
        alt={pisoActual}
        className={styles.Background}
      />
      <div className={styles.Wrapper}>
        <h1>{pisoActual}</h1>
        <div className={styles.Graph} id={fig_name}></div>
        <SwipeableDrawer
          anchor="right"
          open={open}
          sx={{ padding: "2rem" }}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <Button onClick={() => setMedida("Temperatura")} variant="text">Temperatura</Button>
          <Button onClick={() => setMedida("Humedad")} variant="text">Humedad</Button>
          <Button onClick={() => setMedida("Ruido")} variant="text">Ruido</Button>
        </SwipeableDrawer>
      </div>
    </section>
  );
};

export default Ecovilla;
