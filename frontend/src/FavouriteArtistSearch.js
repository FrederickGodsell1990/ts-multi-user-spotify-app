import axios from "axios";
import React, { useEffect, useState } from "react";
import  {accessToken} from './accessTokenManagement';

const FavouriteArtistSearch = () => {
  const [favouriteArtistsID, setFavouriteArtistsID] = useState([]);
  
  const [clientID, setClientID] = useState('')

  const { spotify_access_token, spotify_client_id } = window.localStorage;

  console.log('spotify_access_token from local storage',spotify_access_token)
  console.log('accessToken from new access token generator',accessToken)

  const favouriteArtistParams = {
    time_range: "medium_term",
    limit: 10,
  };

  // useEffect(() => {

  //   setAccessToken(spotify_access_token)
  //   setClientID(spotify_client_id)

  //   const fetchTopArtists = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         "https://api.spotify.com/v1/me/top/artists",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${spotify_access_token}`,
  //           },
  //           params: favouriteArtistParams,
  //         }
  //       );

  //       const { items } = data;

  //       setFavouriteArtistsID(items);
  //       console.log(items);
  //       console.log(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

    

  //   fetchTopArtists();
  // }, [accessToken]);

useEffect(() => {
    
},[accessToken])




  

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
    </div>
  );
};

export default FavouriteArtistSearch;
