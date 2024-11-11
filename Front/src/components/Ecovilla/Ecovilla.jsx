import React, { useState } from "react";
import { Box, Button, SwipeableDrawer, Typography } from "@mui/material";

//Styles
import styles from "./Ecovilla.module.css";

const Ecovilla = () => {
  const [pisoActual, setPisoActual] = useState("Primer Piso");
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <section>
      <img
        src="https://www.upb.edu.co/es/imagenes/img-upbsostenibleaerea-1464235639641.jpeg"
        className={styles.Background}
      />
      <div className={styles.Wrapper}>
        <h1>{pisoActual}</h1>
        <Box sx={{ textAlign: "center", pt: 1 }}>
        <Button onClick={toggleDrawer(true)}>Open</Button>
      </Box>
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
        <Typography
          sx={{
            p: 2,
            color: "text.secondary",
          }}
        >
          51 results
        </Typography>
        <Typography sx={{ p: 2, color: "text.secondary" }}>
          51 results
        </Typography>
        <Typography sx={{ p: 2, color: "text.secondary" }}>
          51 results
        </Typography>
        <Typography sx={{ p: 2, color: "text.secondary" }}>
          51 results
        </Typography>
      </SwipeableDrawer>
      </div>
    </section>
  );
};

export default Ecovilla;
