import React from 'react'
import { NavLink, useLocation } from 'react-router-dom';

//Styles
import styles from './Navbar.module.css'

//Icons
import HomeIcon from '@mui/icons-material/Home';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import PlaceIcon from '@mui/icons-material/Place';
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SensorOccupiedRoundedIcon from '@mui/icons-material/SensorOccupiedRounded';

const Navbar = () => {
  const location = useLocation();

  if (location.pathname === '/login') return null;

  return (
    <header className={styles.Wrapper}>
        <nav className={styles.Nav}>
        <NavLink to={'/'} >
        <HomeIcon className={styles.Icon} />
        </NavLink>
        <NavLink to={'/admin'} >
        <QueryStatsIcon className={styles.Icon} />
        </NavLink>
        <NavLink to={'/mapa'}>
        <PlaceIcon className={styles.Icon} />
        </NavLink>
        <NavLink to={'/tresd'}>
        <ViewInArRoundedIcon className={styles.Icon} />
        </NavLink>
        <NavLink to={'/usuarios'}>
        <SensorOccupiedRoundedIcon className={styles.Icon} />
        </NavLink>
        <ExitToAppIcon className={styles.Exit} />
        </nav>
    </header>
  )
}

export default Navbar;
