import fetch from "node-fetch"; // Import the fetch API for making HTTP requests

const JUDGE_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true'; // URL for submitting code to the Judge0 API
const HEADERS = {
  'content-type': 'application/json', // Specifies that the request body will be in JSON format
  'X-RapidAPI-Key': '432fab4407mshad7d0186a4c56f4p16926fjsn94c6fadfe608', // RapidAPI key
  'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com' // Hostname for the Judge0 API
};

// Available languages and their selection IDs
const languages = [
  { name: "python", id: 71 },
  { name: "java", id: 62 },
  { name: "c", id: 50 },
  { name: "c++", id: 54 },
  { name: "javascript", id: 63 },
  { name: "c#", id: 51 },
  { name: "go", id: 60 },
  { name: "rust", id: 73 },
  { name: "bash", id: 46 }
];

// Function to handle code submission from the client
export const handleCodeSubmission = async (data, socket) => {
  const { source_code, language } = data; // Destructure the incoming data (source code and language ID)

  console.log(language);
  const languageObject = languages.find(supportedLangauage => supportedLangauage.name === language.toLowerCase());

  const language_id = languageObject ? languageObject.id : null;

  console.log(language_id);

  // send submission data to Judge0 API
  const submissionData = {
    source_code: source_code, // source code sent by user
    language_id: language_id,
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

    console.log("codeResult", { output: result.stdout, error: result.compile_output });

    // Send the result back to the client via the socket
    socket.emit("codeResult", { output: result.stdout, error: result.compile_output });
  } catch (error) {
    // If an error occurs, send an error message to the client
    socket.emit("codeResult", { error: "Error occurred while submitting the code." });
  }
};
