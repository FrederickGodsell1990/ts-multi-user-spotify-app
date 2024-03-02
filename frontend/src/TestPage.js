import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FavouriteArtistSearch from "./FavouriteArtistSearch.js";

export const Testpage = () => {

  // const state = useSelector((state) => state);

    const navigate = useNavigate();

    const navigateToTestHomepage = () => {
        navigate("/");
      };
  

    return (
    
      <>
      <div>Test Page</div>
      <button onClick={navigateToTestHomepage}> To Home page</button>
      <FavouriteArtistSearch />
      
      </>
    )
    
    }