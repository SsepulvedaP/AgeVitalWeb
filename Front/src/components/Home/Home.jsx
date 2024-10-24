import React from 'react';
import './Home.css'; // Asegúrate de que este archivo exista y tenga los estilos.
import homeImage from './home1.png';
import homeImage2 from './image2.png';
import corazon from './corazon.png';
import estrella from './estrella.png';
import reloj from './reloj.png';

const Home = () => {
  return (
    <div className="home-container">
      {/* Sección 1 */}
      <section className="section1">
        <h1 className="title">Monitoreo Inteligente para un<br /> Envejecimiento Saludable</h1>
        <p className="description">AgeVital+ utiliza tecnología IoT para monitorear<br /> tu salud física y mental en tiempo real.</p>
        <button className="enter-button">Ingresar</button>
        <img src={homeImage} alt="Imagen1" className="section1-image" />
      </section>

      {/* Sección 2 */}
      <section className="section2">
        <div className="benefits">
          <h1 className="subtitle">Beneficios <br />Clave</h1>
          <p className="text">AgeVital+ conecta sensores no invasivos en el hogar para recopilar datos sobre la salud física y el ambiente. Estos datos son analizados en tiempo real para detectar cualquier anomalía, permitiendo que los usuarios y cuidadores tomen decisiones informadas.</p>
        </div>
        <div className="icons-section">
          <div className="icon-item">
            <img src={reloj} alt="Icono 1" />
            <div className="icon-text">
              <h3>Monitoreo en Tiempo Real</h3>
              <p>Supervisión continua de tu salud.</p>
            </div>
          </div>
          <div className="icon-item">
            <img src={corazon} alt="Icono 2" />
            <div className="icon-text">
              <h3>Detección Temprana</h3>
              <p>Identificación de riesgos cardiovasculares.</p>
            </div>
          </div>
          <div className="icon-item">
            <img src={estrella} alt="Icono 3" />
            <div className="icon-text">
              <h3>Fácil de Usar</h3>
              <p>Accesible para personas mayores y cuidadores.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de imágenes */}
      <section className="images-section">
        <img src={homeImage2} alt="Imagen 1" />
        {/*  
        <img src="/assets/img2.png" alt="Imagen 2" />
        <img src="/assets/img3.png" alt="Imagen 3" />
        <img src="/assets/img4.png" alt="Imagen 4" />
        */}
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 AgeVital+</p>
        <nav>
          <a href="#terms">Terms of Service</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#cookies">Cookies</a>
        </nav>
      </footer>
    </div>
  );
};

export default Home;
