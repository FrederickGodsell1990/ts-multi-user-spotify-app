import { useNavigate } from "react-router-dom";
import {logout } from './accessTokenManagement.js'

export const Homepage = () => {


    const navigate = useNavigate();

    const navigateToTestPage = () => {
        navigate("/test_page");
      };
  

    return (
    
      <>
      <div>Homepage</div>
      <button onClick={navigateToTestPage}> To test page</button>
      <button onClick={logout} > Logout</button>
      </>
    )
    
    }
    