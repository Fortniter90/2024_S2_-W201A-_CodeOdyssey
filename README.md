


<h2 style="border-top: 3px solid #555;"</h2>
## Features
---
- Coding lessons covering various programming languages. 
- Real-time code editor with compile and output functionality. 
- Progress tracking to monitor your learning journey. 
- Tests to apply what you've learned. 
- User authentication and profiles to save your progress.
- Create your own courses, lessons and tests with the developer dashboard.
<h2 style="border-top: 3px solid #555;"</h2>
## Prerequisites 
---
Before installing and running Code Odyssey, ensure you have the following:
- A [Firebase](https://firebase.google.com/) account.
- A [RapidAPI](https://rapidapi.com/)  account.
- A [Judge0](https://judge0.com/) API server this can be self hosted but we are going to be hosting it with a service called [RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce) .
- A machine with the following tools installed:
	- [Node.js](https://nodejs.org/) (latest version).
	- [npm](https://www.npmjs.com/) (latest version).
- A modern web browser (Chrome, Firefox, etc.).
### Firebase Console Setup
1. Create a Firebase project in [Firebase Console](https://console.firebase.google.com/).
2. In Firebase Console enable the Firestore, and Storage services for data management as well as the Authentication service and select email and password to allow users to signup/login.
3. Go to project project settings then service accounts and generate Firebase Admin SDK private-key file.
<h2 style="border-top: 3px solid #555;"</h2>
## Installation
---
### 1. Clone The Repository
Clone the project to your local machine:
```
git clone https://github.com/Fortniter90/2024_S2_-W201A-_CodeOdyssey
```
### 2. Configure Front-end
#### Go To Front-end Directory
Enter the front-end directory using:
```
cd my-app/
```
#### Install Dependencies
Install the required dependencies using:
```
npm install
```
#### Configure Firebase
To connect the project to your Firebase project, follow these steps:
1. Go to the Firebase Console, select your project, and navigate to Project Settings.
2. Under the General tab, find the Firebase SDK configuration object.
3. Create a `.env` file in the `my-app/` directory of the project with the following environment variables:
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```
4. Replace place holders with the actual values from your Firebase project settings.
#### Configure Back-end Connection
In the `.env` file in the `my-app/` directory of the project enter the following environment variable:
```
BACKEND_URL=your-backend-url
```
### 3. Configure Back-end
#### Go To Front-end Directory
Enter the front-end directory using:
```
cd backend/
```
#### Install Dependencies
Install the required dependencies using:
```
npm install
```
#### Configure Firebase Admin
1. Move the Firebase Admin SDK private-key file to the `backend/src/` directory.
2. Create a `.env` file in the `backend/` directory of the project with the following environment variables:
```
SERVICE_ACCOUNT_KEY_PATH=name-of-your-private-key-file
DATABASE_URL=your-firebase-project-url
```
#### Configure Judge0 API (Assuming RapidAPI is being used)
1. Find the Judge-API on the RapidAPI and subscribe to it from there you can find your API key.
2. In the `.env` file in the `backend/` directory of the project enter the following environment variable:
```
RAPID_API_KEY=your-rapid-api-key
```

### 4. Run Application
To run the application first execute the following command in the `backend/src` directory:
```
node Server.js
```

Next  execute the following command in the `my-app/` directory:
```
npm start
```

Finally visit `http://localhost:3000` in your browser to access the application.
<h2 style="border-top: 3px solid #555;"</h2>
## Usage
---


<h2 style="border-top: 3px solid #555;"</h2>
## Technologies Used
---

<h2 style="border-top: 3px solid #555;"</h2>
## Collaboration
---

<h2 style="border-top: 3px solid #555;"</h2>
## License 
---

This project is licensed under the MIT License. See the LICENSE file for details.
<h2 style="border-top: 3px solid #555;"</h2>
## Contact
---
