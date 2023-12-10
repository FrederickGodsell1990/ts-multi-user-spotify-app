import { useNavigate } from "react-router-dom";


export const Testpage = () => {


    const navigate = useNavigate();

    const navigateToTestHomepage = () => {
        navigate("/");
      };
  

    return (
    
      <>
      <div>Test Page</div>
      <button onClick={navigateToTestHomepage}> To Home page</button>
      </>
    )
    
    }