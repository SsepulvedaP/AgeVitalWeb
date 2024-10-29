import React from 'react'
import { NavLink } from 'react-router-dom';

//Styles
import styles from './Navbar.module.css'

//Icons
import HomeIcon from '@mui/icons-material/Home';
import Person2Icon from '@mui/icons-material/Person2';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import PlaceIcon from '@mui/icons-material/Place';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';


const Navbar = () => {
  return (
    <header className={styles.Wrapper}>
        <nav className={styles.Nav}>
        <NavLink to={'/'} >
        <HomeIcon className={styles.Icon} />
        </NavLink>
        <Person2Icon className={styles.Icon} />
        <NavLink to={'/admin'} >
        <QueryStatsIcon className={styles.Icon} />
        </NavLink>
        <NavLink to={'/mapa'}>
        <PlaceIcon className={styles.Icon} />
        </NavLink>
        <ViewInArIcon className={styles.Icon} />
        <ExitToAppIcon className={styles.Exit} />
        </nav>
    </header>
  )
}

export default Navbar