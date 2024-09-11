import './App.css';
import { AuthProvider } from './context/AuthContext';
import SignOutComponent from './components/SignOut';
import AuthStatus from './components/AuthStatus'
import LoginComponent from './components/Login';
import SignUpComponent from './components/SignUp';

function App() {
  return (
    <AuthProvider>
      Login
      <LoginComponent />
      SignUp
      <SignUpComponent />
      SignOut <br />
      <SignOutComponent /><br />
      Status
      <AuthStatus />
    </AuthProvider>
  );
}

export default App;
