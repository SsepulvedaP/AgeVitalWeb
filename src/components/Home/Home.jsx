import React from 'react';
import './Home.css'; // Asegúrate de que este archivo exista y tenga los estilos.
import homeImage from './home1.png';
import homeImage2 from './image2.png';

const Home = () => {
  return (
    <div className="home-container">
      {/* Sección 1 */}
      <section className="section1">
        <h1 className="title">Monitoreo Inteligente para un Envejecimiento Saludable</h1>
        <p className="description">AgeVital+ utiliza tecnología IoT para monitorear tu salud física y mental en tiempo real.</p>
        <button className="enter-button">Iniciar Sesión</button>
        <img src={homeImage} alt="Imagen1" className="section1-image" />
      </section>

      {/* Sección 2 */}
      <section className="section2">
        <div className="benefits">
          <h2>Beneficios Clave</h2>
          <p>AgeVital+ conecta sensores no invasivos en el hogar para recopilar datos sobre la salud física y el ambiente. Estos datos son analizados en tiempo real para detectar cualquier anomalía, permitiendo que los usuarios y cuidadores tomen decisiones informadas.</p>
        </div>
        <div className="icons-section">
          <div className="icon-item">
            <img src="/assets/icon1.png" alt="Icono 1" />
            <h3>Monitoreo en Tiempo Real</h3>
            <p>Supervisión continua de tu salud.</p>
          </div>
          <div className="icon-item">
            <img src="/assets/icon2.png" alt="Icono 2" />
            <h3>Detección Temprana</h3>
            <p>Identificación de riesgos cardiovasculares.</p>
          </div>
          <div className="icon-item">
            <img src="/assets/icon3.png" alt="Icono 3" />
            <h3>Fácil de Usar</h3>
            <p>Accesible para personas mayores y cuidadores.</p>
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
      
      {/* Sección 3: Cómo Funciona */}
      <section className="section3">
        <h2>Cómo Funciona AgeVital+</h2>
        <div className="features">
          <div className="feature-item">
            <h3>Captura de Datos</h3>
            <p>Sensores monitorean la salud física y el ambiente en tiempo real.</p>
          </div>
          <div className="feature-item">
            <h3>Análisis Inteligente</h3>
            <p>La plataforma procesa los datos y detecta riesgos de salud.</p>
          </div>
          <div className="feature-item">
            <h3>Toma de Decisiones</h3>
            <p>Si se detecta un riesgo, se envían alertas y recomendaciones.</p>
          </div>
        </div>
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
