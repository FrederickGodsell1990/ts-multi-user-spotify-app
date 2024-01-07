// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import {logout } from './accessTokenManagement.js'
// import FavouriteArtistSearch from './FavouriteArtistSearch.js'


// export const Homepage = () => {

 

//     const navigate = useNavigate();

//     const navigateToTestPage = () => {
//         navigate("/test_page");
//       };


//     return (
    
//       <>
//       <div>Homepage</div>
//       <button onClick={navigateToTestPage}> To test page</button>
//       <button onClick={logout} > Logout</button>
//       <FavouriteArtistSearch/>
//       </>
//     )
    
//     }
    

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout, accessToken } from "./accessTokenManagement.js";
import FavouriteArtistSearch from "./FavouriteArtistSearch.js";
import axios from "axios";


export const Homepage = () => {
 const navigate = useNavigate();


 const navigateToTestPage = () => {
   navigate("/test_page");
 };


 const [userImage, setUserImage] = useState("");
 const [userName, setUserName] = useState("");
 const [allPlaylists, setAllPlaylists] = useState([]);


 useEffect(() => {
   getUserDetails();
   fetchAllPlaylists();
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


     console.log("fetchAllPlaylists indiv", req.data.items);
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
       <a class="navbar-brand" href="#">
         <img src={userImage} width="30" height="30" alt="" />
         {userName}'s Release Rader Playlist App
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
                   <>
                     <a class="dropdown-item" href="#">
                       {x.name}
                     </a>
                     <div class="dropdown-divider"></div>
                   </>
                 ))}
             </div>
           </li>
         
         </ul>
   
       </div>
     </nav>


   


     <div>Homepage</div>
     <button onClick={navigateToTestPage}> To test page</button>
     <button onClick={logout}> Logout</button>
     <FavouriteArtistSearch />


 
   </>
 );
};



