// lib/data-access.ts

export async function fetchRoutesFromAPI() {
  try {

    const response = await fetch('https://verde-corsa-f441de12f401.herokuapp.com/solve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Ensure the server knows we are sending JSON
      },
    });

    // Check if the response is successful (status 200-299)
    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }

    const data = await response.json(); // Parse the JSON data from the response
    return data; // Return the data from the API
  } catch (error) {
    console.error("Error ffetching routes:", error);
    throw new Error("Failed to fetch routes. Please try again later.");
  }
}
