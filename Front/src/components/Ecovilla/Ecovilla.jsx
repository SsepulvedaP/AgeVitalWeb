import React, { useState } from "react";
import { SwipeableDrawer, Typography } from "@mui/material";

//Components
import { mpld3_load_lib } from "./components/mpld3_load_lib";
import mpld3 from "mpld3";
import json from "assets/interpolaciones/interpolation_1_floor_1";

//Styles
import styles from "./Ecovilla.module.css";
import InsertChartOutlinedRoundedIcon from "@mui/icons-material/InsertChartOutlinedRounded";

const Ecovilla = () => {
  const [pisoActual, setPisoActual] = useState("Primer Piso");
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const fig_name = "fig_el427345810798888193429725";

  return (
    <section className={styles.Section}>
      <button onClick={toggleDrawer(true)} className={styles.toggleDrawer}>
        <InsertChartOutlinedRoundedIcon />
      </button>
      <img
        src="https://www.upb.edu.co/es/imagenes/img-upbsostenibleaerea-1464235639641.jpeg"
        className={styles.Background}
      />
      <div className={styles.Wrapper}>
        <h1>{pisoActual}</h1>
        <script type="module">
          {mpld3_load_lib("https://d3js.org/d3.v7.js", function ()
          {mpld3_load_lib(
            "https://mpld3.github.io/js/mpld3.v0.5.10.js",
            function () {
              mpld3.remove_figure(fig_name);
              mpld3.draw_figure(fig_name, json);
            }
          )}
          )}
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
          <button onClick={() => setPisoActual("Primer Piso")}>
            <Typography>Primer Piso</Typography>
          </button>
          <button onClick={() => setPisoActual("Segundo Piso")}>
            <Typography>Segundo Piso</Typography>
          </button>
        </SwipeableDrawer>
      </div>
    </section>
  );
};

export default Ecovilla;
