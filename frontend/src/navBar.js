import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout, accessToken } from "./accessTokenManagement.js";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addUsername, removeUsername } from "./redux/userNameAction";
import { addUserDetails, removeUserDetails } from "./redux/userDetailsAction";

// // can delete this and the file it comes from - just checking it was needed
// ReleaseRaderAPICallFunction()

export const NavBar = () => {
  const navigate = useNavigate();

  const navigateToTestPage = () => {
    navigate("/test_page");
  };

  const [allPlaylists, setAllPlaylists] = useState([]);

  const logOutToRest = "Log out to reset";

  // for playlists + user details
  useEffect(() => {
    fetchAllPlaylists();
  }, []);

  // redux for user details
  const dispatch = useDispatch();
  // if you has (state) => state i.e you call all state the browser gives a warning 
  const state = useSelector((state) => state.userDetails);
  // peices of state from redux store

  const userDetailsObjectFromStore =
    state.storeUserDetails?.country ?? logOutToRest;
  const displayNameFromStore =
    state.storeUserDetails?.display_name ?? logOutToRest;
  const userImageFromStore =
    state.storeUserDetails?.images?.[0]?.url ?? logOutToRest;

  useEffect(() => {
    (async () => {
      const APICall = await getUserDetails();

      const userDetailsFromAPICall = APICall;

      dispatch(addUserDetails(userDetailsFromAPICall));
     
    })();
  }, [userDetailsObjectFromStore]);

  const getUserDetails = async () => {
    try {
      const req = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

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
   
      const allPlaylistResponse = req.data.items;

      setAllPlaylists(allPlaylistResponse);
    } catch (error) {
      console.error(error);
    }
  };

  // console.error('allPlaylists', allPlaylists);

  return userDetailsObjectFromStore !== logOutToRest ? (
    <>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand " href="#">
          <img src={userImageFromStore} width="30" height="30" alt="" />
          {displayNameFromStore} image and name from redux
        </a>

        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

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
                    <div key={x.name}>
                      <a class="dropdown-item" href="#">
                        {x.name}
                      </a>
                      <div class="dropdown-divider"></div>
                    </div>
                  ))}
              </div>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                href="#"
                onClick={() => {
                  logout();
                  dispatch(removeUsername());
                }}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  ) : (
    // this conditional rendering exists to handle session times out
    <button onClick={logout}>
      Your session has expired - please logout and log back in
    </button>
  );
};
