import NavigationBarHome from "../components/NavigationBarHome";
import NavigationBarUser from "../components/NavigationBarUser";
import { useAuth } from "../context/AuthContext";
import JavaCharacter from "../components/JavaCharacter";


const ResourcesPage = () => {
  
  const { isAuthenticated } = useAuth();

    return (
      <div className="navbar-left">
        {isAuthenticated ? <NavigationBarUser /> : <NavigationBarHome />}
        <h1>Resources Page</h1>
        <p>Here are some helpful resources that we recommend for you! </p>
        <div style={{ marginTop: '250px' }}></div>
        <JavaCharacter />
      </div>
    );
  };
  
  export default ResourcesPage;
  