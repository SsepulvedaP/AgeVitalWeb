import React, { useState } from "react";
import { SwipeableDrawer, Typography } from "@mui/material";

//Styles
import styles from "./Ecovilla.module.css";
import InsertChartOutlinedRoundedIcon from "@mui/icons-material/InsertChartOutlinedRounded";

const Ecovilla = () => {
  const [pisoActual, setPisoActual] = useState("Primer Piso");
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <section className={styles.Section}>
        <button onClick={toggleDrawer(true)} className={styles.toggleDrawer}>
            <InsertChartOutlinedRoundedIcon/>
        </button>
      <img
        src="https://www.upb.edu.co/es/imagenes/img-upbsostenibleaerea-1464235639641.jpeg"
        className={styles.Background}
      />
      <div className={styles.Wrapper}>
        <h1>{pisoActual}</h1>
      <SwipeableDrawer
        anchor="right"
        open={open}
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
