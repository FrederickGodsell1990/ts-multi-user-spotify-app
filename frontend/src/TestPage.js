import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const Testpage = () => {

  const state = useSelector((state) => state);

    const navigate = useNavigate();

    const navigateToTestHomepage = () => {
        navigate("/");
      };
  

    return (
    
      <>
      <div>Test Page</div>
      <button onClick={navigateToTestHomepage}> To Home page</button>
      <h2>Number of items in Cart: {state.numOfItems}</h2>
      </>
    )
    
    }