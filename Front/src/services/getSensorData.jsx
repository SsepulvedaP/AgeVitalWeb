export const getSensorData = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/sensores');
      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.statusText}`);
      }
      const sensorsData = await response.json();
      return sensorsData;
    } catch (error) {
        console.error("Error en getTrialData:", error);
    }
  };