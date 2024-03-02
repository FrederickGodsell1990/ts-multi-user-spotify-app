import axios from "axios";
import { accessToken, getClientID, getURI } from "../accessTokenManagement.js";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const createPlaylistInSpotify = async (spotifyUserID) => {
    const today = new Date();
    const options = { month: "long" };
    const monthName = today.toLocaleString("default", options); // returns the name of the month
    const year = today.getFullYear(); // gets the current year
  
    // if this fucntion is not working, it's likely that the access token has expired
    const getNewTrackPlayLists = async () => {
      try {
        // this creates a new playlist in spotify your spotify account. It's hardcoded with my account ID
        const createPlayListTest = await axios.post(
          `https://api.spotify.com/v1/users/${spotifyUserID}/playlists`,
          {
            name: `Release Radar Capture Playlist ${monthName} ${year}`,
            description: `${monthName} ${year}`,
            public: true,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const {
          data: { name, id, description },
        } = createPlayListTest;
  
        sendPlaylistDetailsToBackEnd(name, id, description);
        console.log("createPlayListTest", createPlayListTest);
        return id;
      } catch (error) {
        console.log(error);
      }
    };
  
    return await getNewTrackPlayLists();
  };
  
  
  
  const sendPlaylistDetailsToBackEnd = async (name, id, description) => {
    const body = {
      playlistData: {
        monthAndYearCreated: description,
        playlistSpotifyID: id,
        playlistName: name,
      },
      clientID: getClientID,
    };
  
    console.log("body on sendPlaylistDetailsToBackEnd", body);
  
    try {
      const { data } = await axios.post(
        `${getURI}/post_new_playlist_to_database`,
        body,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  export const SecondStageNewPlaylistComponet = () => {

    const id = useSelector((state) => state.userDetails.storeUserDetails.id);

    const [newPlaylistID , setNewPlaylistID] = useState('');

    useEffect(() =>{
      (async () => {
        const playlistID = await createPlaylistInSpotify(id)
       console.log('playlistID in SecondStageNewPlaylistComponet', playlistID)
       setNewPlaylistID(playlistID)
      })()
      
    },[id])

    return <div>SecondStageNewPlaylistComponet with new playlist ID = {newPlaylistID} </div>

  }