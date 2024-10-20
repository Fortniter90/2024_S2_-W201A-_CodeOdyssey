# Code Odyssey

---
## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
  - [Firebase Console Setup](#firebase-console-setup)
- [Installation](#installation)
  - [Clone The Repository](#1-clone-the-repository)
  - [Configure Front-end](#2-configure-front-end)
  - [Configure Back-end](#3-configure-back-end)
  - [Run Application](#4-run-application)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Collaboration](#collaboration)
- [License](#license)
- [Contact](#contact)

---
## Features
- Coding lessons covering various programming languages. 
- Real-time code editor with compile and output functionality. 
- Progress tracking to monitor your learning journey. 
- Tests to apply what you've learned. 
- User authentication and profiles to save your progress.
- Create your own courses, lessons, and tests with the developer dashboard.

---
## Prerequisites 
Before installing and running Code Odyssey, ensure you have the following:
- A [Firebase](https://firebase.google.com/) account.
- A [RapidAPI](https://rapidapi.com/) account.
- A [Judge0](https://judge0.com/) API server this can be self-hosted, but we are going to be hosting it with a service called [RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce).
- A machine with the following tools installed:
  - [Node.js](https://nodejs.org/) (latest version).
  - [npm](https://www.npmjs.com/) (latest version).
- A modern web browser (Chrome, Firefox, etc.).

### Firebase Console Setup
1. Create a Firebase project in [Firebase Console](https://console.firebase.google.com/).
2. In Firebase Console, enable the Firestore and Storage services for data management, as well as the Authentication service, and select email and password to allow users to sign up/login.
3. Go to project settings, then service accounts, and generate a Firebase Admin SDK private-key file.

---
## Installation
### 1. Clone The Repository
Clone the project to your local machine:
```bash
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
```bash
npm install
```
#### Configure Firebase
To connect the project to your Firebase project, follow these steps:
1. Go to the Firebase Console, select your project, and navigate to Project Settings.
2. Under the General tab, find the Firebase SDK configuration object.
3. Create a `.env` file in the `my-app/` directory of the project with the following environment variables:
```bash
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
```bash
BACKEND_URL=your-backend-url
```
### 3. Configure Back-end
#### Go To Front-end Directory
Enter the front-end directory using:
```bash
cd backend/
```
#### Install Dependencies
Install the required dependencies using:
```bash
npm install
```
#### Configure Firebase Admin
1. Move the Firebase Admin SDK private-key file to the `backend/src/` directory.
2. Create a `.env` file in the `backend/` directory of the project with the following environment variables:
```bash
SERVICE_ACCOUNT_KEY_PATH=name-of-your-private-key-file
DATABASE_URL=your-firebase-project-url
```
#### Configure Judge0 API (Assuming RapidAPI is being used)
1. Find the Judge-API on the RapidAPI and subscribe to it from there you can find your API key.
2. In the `.env` file in the `backend/` directory of the project enter the following environment variable:
```bash
RAPID_API_KEY=your-rapid-api-key
```

### 4. Run Application
To run the application first execute the following command in the `backend/src` directory:
```bash
node Server.js
```

Next  execute the following command in the `my-app/` directory:
```bash
npm start
```
Finally visit `http://localhost:3000` in your browser to access the application.

---
## Usage
First signup / login to access the logged in home page. From there you can explore the website.

On the top right you can find your user profile which shows the users progress from the profile you can also find the user setting which allows the user to change their profile picture and username.

Hover over the courses tab in the navigation bar to see all the courses that are available from there you can choose a course and start the lessons within the course.

Once finished with lesson you can take tests which uses a website code editor to allow you to write and compile your code.

If you are a developer you can access what is called the developer dashboard this allows you to create, delete and update courses, lessons and tests. If you want to add another developer you can do this by going to the admin panel and selecting a account to become an admin.

---
## Technologies Used
- [Create React App](https://create-react-app.dev/)
- [Firebase](https://firebase.google.com/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Socket.io](https://socket.io/)
- [Judge0](https://judge0.com/)
- [GitHub](https://github.com/)

---
## Collaboration
Contributions to Code Odyssey are welcome! If you'd like to contribute, please follow these steps:
1. **Fork the Repository**: Create a copy of the repository in your GitHub account. 
2. **Create a Branch**: Create a new branch for your feature or bug fix. 
3. **Make Your Changes**: Implement your changes and ensure that everything works as expected.
4. **Commit Your Changes**: Save your changes with a descriptive message.
5. **Push Your Changes**: Upload your changes to your forked repository. 
6. **Create a Pull Request**: Submit your changes to the original repository by creating a pull request.

---
## License 

This project is licensed under the MIT License. See the [LICENSE](https://github.com/Fortniter90/2024_S2_-W201A-_CodeOdyssey/blob/main/LICENSE.adoc) file for details.

---
## Contact
For any inquiries, please contact us at [codeodyssey@gmail.com](https://www.youtube.com/watch?v=dQw4w9WgXcQ).

---

