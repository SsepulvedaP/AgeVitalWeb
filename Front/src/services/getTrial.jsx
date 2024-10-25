export async function getTrial() {
  return await fetch("http://127.0.0.1:5000/trial", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data);
}
