import fetch from "node-fetch"; // Import the fetch API for making HTTP requests

const JUDGE_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true'; // URL for submitting code to the Judge0 API
const HEADERS = {
  'content-type': 'application/json', // Specifies that the request body will be in JSON format
  'X-RapidAPI-Key': 'ba772b0ad4msh188a9506ee4d7f7p1a42eejsnab54531d59dd', // Replace with your own RapidAPI key
  'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com' // Hostname for the Judge0 API
};

// Function to handle code submission from the client
export const handleCodeSubmission = async (data, socket) => {
  const { source_code, language_id } = data; // Destructure the incoming data (source code and language ID)

  // Prepare the submission data to send to Judge0 API
  const submissionData = {
    source_code: source_code, // The actual source code provided by the user
    language_id: language_id  // The programming language ID 
  };

  try {
    // Send the code to the Judge0 API using a POST request
    const response = await fetch(JUDGE_API_URL, {
      method: 'POST', // HTTP method for creating resources
      headers: HEADERS, // Include necessary headers (API key and content type)
      body: JSON.stringify(submissionData) // Convert the submission data to JSON
    });

    // Parse the JSON response returned by the API
    const result = await response.json();

    // Log the output and error to the server console
    console.log("codeResult", { output: result.stdout, error: result.stderr });

    // Send the result back to the client via the socket
    socket.emit("codeResult", { output: result.stdout, error: result.stderr });
  } catch (error) {
    // If an error occurs, send an error message to the client
    socket.emit("codeResult", { error: "Error occurred while submitting the code." });
  }
};

