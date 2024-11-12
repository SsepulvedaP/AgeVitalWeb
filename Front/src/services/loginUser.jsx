export const loginUser = async (email, password) => {
  try {
      const response = await fetch('http://10.38.32.137:5000/auth/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email,
              password,
          }),
      });

      if (!response.ok) {
          throw new Error(`Error al hacer login: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Asegúrate de que el token venga correctamente
      if (data.access_token) {
          return data.access_token;  // Asumiendo que el token viene en la propiedad 'token'
      } else {
          throw new Error("Token no recibido.");
      }

  } catch (error) {
      console.error("Error en loginUser:", error);
      return null; // Devolvemos null si hubo un error
  }
};
