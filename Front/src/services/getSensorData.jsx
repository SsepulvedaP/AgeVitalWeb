export const getSensorData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sensores');
      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.statusText}`);
      }
      const sensorsData = await response.json();
      return sensorsData;
    } catch (error) {
        console.error("Error en getTrialData:", error);
    }
  };


// Función para actualizar un sensor
export const updateSensor = async (nombreId,id_sensor, latitud, longitud, estado, imagenurl) => {
  try {
    const response = await fetch(`http://localhost:5000/api/sensores/${id_sensor}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombreId,
        id_sensor,
        latitud,
        longitud,
        estado,
        imagenurl,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar el sensor: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error en updateSensor:", error);
    throw error;
  }
};