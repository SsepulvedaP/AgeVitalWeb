export const getUsers = async () => {
    try {
      const response = await fetch('http://10.38.32.137:5000/auth/users');
      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.statusText}`);
      }
      const usersData = await response.json();
      return usersData;
    } catch (error) {
        console.error("Error en getTrialData:", error);
    }
  };