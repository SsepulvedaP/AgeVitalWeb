export const registerUser = async (username, email, password, role) => {
  try {
      const response = await fetch('http://10.38.32.137:5000/auth/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              username,
              email,
              password,
              role,
          }),
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al registrar el usuario: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log("----------------", data);
      return data;

  } catch (error) {
      console.error("Error en registerUser:", error);
  }
};
