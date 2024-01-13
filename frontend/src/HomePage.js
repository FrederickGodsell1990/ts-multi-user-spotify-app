import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout, accessToken } from "./accessTokenManagement.js";
import FavouriteArtistSearch from "./FavouriteArtistSearch.js";
import axios from "axios";
import { ReleaseRaderAPICallFunction } from "./components/ReleaseRadarComponent.js";
import { useSelector, useDispatch } from "react-redux";
import Cart from "./redux/cart";
import {addUsername, removeUsername} from './redux/userNameAction';

// // can delete this and the file it comes from - just checking it was needed
// ReleaseRaderAPICallFunction()


export const Homepage = () => {
  const navigate = useNavigate();

  const navigateToTestPage = () => {
    navigate("/test_page");
  };

  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");
  const [allPlaylists, setAllPlaylists] = useState([]);


  // for playlists + user details
  useEffect(() => {
    getUserDetails();
    fetchAllPlaylists();
  }, []);

  // redux for user details
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
 // peices of state from redux store
 const userNameFromStore = state.username.storeUsername;


  useEffect(() => {
    (async () => {
      const userNameFromAPICall = await getUserDetails();
      const display_name = userNameFromAPICall?.display_name
      
      dispatch(addUsername(display_name)) 
      console.log('entire state', state)

      
    })();

  }, []);



  const getUserDetails = async () => {
    try {
      const req = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(req.data);
      console.log("user spotify image", req.data.images?.[0].url);
      const spotifyUserImageResponse = req.data.images?.[0].url;
      const spotifyUserNameResponse = req.data.display_name;
      setUserImage(spotifyUserImageResponse);
      setUserName(spotifyUserNameResponse);
      return req.data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllPlaylists = async () => {
    try {
      const req = await axios.get("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      //  console.log("fetchAllPlaylists indiv", req.data.items);
      console.log("fetchAllPlaylists", req.data);
      const allPlaylistResponse = req.data.items;

      setAllPlaylists(allPlaylistResponse);
    } catch (error) {
      console.error(error);
    }
  };

  // console.error('allPlaylists', allPlaylists);

  return (
    <>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand " href="#">
          <img src={userImage} width="30" height="30" alt="" />
          {userName}'s Release Rader Playlist App
        </a>
        <h5>Username from redux {userNameFromStore}</h5>
        {/* <button
         class="navbar-toggler"
        
         type="button"
         data-toggle="collapse"
         data-target="#navbarSupportedContent"
         aria-controls="navbarSupportedContent"
         aria-expanded="false"
         aria-label="Toggle navigation"
       >
         <span class="navbar-toggler-icon"></span>
       </button> */}

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link" href="#">
                Home <span class="sr-only">(current)</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" onClick={navigateToTestPage}>
                Test Page
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">
                Link
              </a>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Playlists
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
               {allPlaylists &&
                 allPlaylists.map((x) => (
                   <div key={x.name} >
                     <a class="dropdown-item" href="#" >
                       {x.name}
                     </a>
                     <div class="dropdown-divider"></div>
                    
                   </div>
                 ))}
             </div>
            </li>
          </ul>
        </div>
      </nav>

      <div className="global-text-color">Homepage</div>
      <button onClick={navigateToTestPage}> To test page</button>
      {/* <button onClick={logout}> Logout</button> */}
      <button onClick={() => {logout(); dispatch(removeUsername()); }  }> Logout</button>
      <FavouriteArtistSearch />
      <Cart />
      <div>
        NEXT STEP ADD CART.JS FILE/COMPONENT FOR USERNAME - OR JUST DO THE EQUIV
        IN USEFEECT OF THIS FILE
      </div>
    </>
  );
};
