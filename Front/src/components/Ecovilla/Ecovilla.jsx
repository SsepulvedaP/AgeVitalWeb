import React, { useEffect, useState } from "react";
import { Button, SwipeableDrawer, Typography } from "@mui/material";

//Components
import { mpld3_load_lib } from "./components/mpld3_load_lib";
import mpld3 from "mpld3";

//Styles
import styles from "./Ecovilla.module.css";
import InsertChartOutlinedRoundedIcon from "@mui/icons-material/InsertChartOutlinedRounded";

const Ecovilla = () => {
  const [open, setOpen] = React.useState(false);
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

  return (
    <section className={styles.Section}>
      <button onClick={toggleDrawer(true)} className={styles.toggleDrawer}>
        <ListRoundedIcon />
      </button>
      <img
        src="https://www.upb.edu.co/es/imagenes/img-upbsostenibleaerea-1464235639641.jpeg"
        className={styles.Background}
      />
      <div className={styles.Wrapper}>
        <h1>Ecovilla</h1>
        <script type="module">
          {mpld3_load_lib("https://d3js.org/d3.v7.js", function () {
            mpld3_load_lib(
              "https://mpld3.github.io/js/mpld3.v0.5.10.js",
              function () {
                mpld3.remove_figure(fig_name);
                mpld3.draw_figure(fig_name, json);
              }
            );
          })}
        </script>
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
