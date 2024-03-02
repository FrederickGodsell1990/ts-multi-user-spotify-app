import axios from "axios";
import React, { useEffect, useState } from "react";
import  {accessToken} from './accessTokenManagement';

const FavouriteArtistSearch = () => {
  const [favouriteArtistsID, setFavouriteArtistsID] = useState([]);
  
  const [clientID, setClientID] = useState('')

  

  const { spotify_access_token, spotify_client_id } = window.localStorage;


  const favouriteArtistParams = {
    time_range: "medium_term",
    limit: 10,
  };

useEffect(() => {
    
},[accessToken])


const getUserDetails = async () => {
  try {
    const req = await axios.get(
      "https://api.spotify.com/v1/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }
    );

   
    console.log(req.data);
  } catch (error) {
    console.error(error);
  }
};


  

    const fetchTopArtists = async () => {
      try {
        const req = await axios.get(
          "https://api.spotify.com/v1/me/top/artists",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: favouriteArtistParams,
          }
        );

       
        console.log(req.data);
      } catch (error) {
        console.error(error);
      }
    };
  

  return (
    <div>
      <h2>Favourite Artists</h2>
      <ul>
        {favouriteArtistsID.map((artist) => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
      <button onClick={fetchTopArtists}>fetchTopArtists</button>
      <button onClick={getUserDetails}>getUserDetails</button>
    </div>
  );
};

export default FavouriteArtistSearch;
