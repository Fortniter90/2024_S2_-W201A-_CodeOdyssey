import './App.css';
import { AuthProvider } from './context/AuthContext';
import LoginComponent from './components/Login';

function App() {
  return (
    <div className="container">
      <div className="image-half" style={{
        backgroundImage: `url(${'loginBackground.png'})`
      }}></div >
      <div className="right-half"></div>
      <div className="login-half">
        <AuthProvider>
          <LoginComponent />
        </AuthProvider>
      </div>
    </div>
  );
}

export default App;

