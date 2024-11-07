import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

// Styles
import styles from './Navbar.module.css';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import PlaceIcon from '@mui/icons-material/Place';
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SensorOccupiedRoundedIcon from '@mui/icons-material/SensorOccupiedRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import { TokenRounded } from '@mui/icons-material';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verifica si el token está en localStorage
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(token !== null); // Establece si el usuario está logueado
  }, []);

  if (!isAuthenticated) return null;

  // Si estamos en la página de login, no mostrar el navbar
  if (location.pathname === '/login') return null;

  // Función para cerrar sesión
  const handleLogout = () => {
    // Eliminar el token del almacenamiento local
    localStorage.removeItem('access_token');
    

    // Redirigir al usuario a la página de login
    navigate('/');
    window.location.reload();
  };

  return (
    <header className={styles.Wrapper}>
      <nav className={styles.Nav}>
        <NavLink to={'/'}>
          <HomeIcon className={styles.Icon} />
        </NavLink>
        <NavLink to={'/admin'}>
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
        <NavLink to={'/dashboard'}>
          <DashboardRoundedIcon className={styles.Icon} />
        </NavLink>

        <ExitToAppIcon className={styles.Exit} onClick={handleLogout} />
      </nav>
    </header>
  );
};

export default Navbar;
