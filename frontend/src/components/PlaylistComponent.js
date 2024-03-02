import axios from "axios";
import { accessToken, getClientID, getURI } from "../accessTokenManagement.js";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CreatePlaylistComponent } from "./CreatePlaylistComponent";
import {SecondStageNewPlaylistComponet} from './SecondStageNewPlaylistComponet';

// // this function just gets playlists that are logged in the database and returns them as an object
// async function returnPlayListsInDatabase() {
//   try {
//     const getPlaylistsResponse = await axios.get("/playlists_from_database");
//     const tracksAsObject = getPlaylistsResponse.data.playlists;
//     return tracksAsObject;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function testPlayListsToDatabase() {
//   const body = {
//     ID: getClientID,
//     playlistData: {
//       monthAndYearCreated: "January 2024",
//       playlistSpotifyID: "January 2024",
//       playlistName: "January 2024",
//     },
//   };

//   const getPlaylistsResponse = await axios.post(
//     `${getURI}/test_paylists_to_database`,
//     body,
//     {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     }
//   );

//   console.log("getPlaylistsResponse", getPlaylistsResponse);
// }

////////////////

export async function getPlaylistsFromDatabase() {
  const body = {
    ID: getClientID,
  };

  try {
    const { data } = await axios.post(
      `${getURI}/get_playlists_from_database`,
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const arrayOfPlaylists = data.fullArrayOfPlaylistsFromMongo.playlistData;

    if (arrayOfPlaylists.length === 0) {
      return [];
    } else if (arrayOfPlaylists.length !== 0) {
      console.log('arrayOfPlaylists', arrayOfPlaylists)
      return arrayOfPlaylists;
    }
  } catch (error) {
    console.log(error);
  }
}



export const AddToOrCreatePlaylistFunction = ({
  arrayOfUniqueTracksAsState,
}) => {
  const [playlistEmpty, setPlaylistEmpty] = useState(false);
  const [playlistData, setPlaylistData] = useState([]);

  useEffect(() => {
    const callFunction = async () => {
      try {
        const anyPlaylistsInDatabase = await getPlaylistsFromDatabase();

        

        if (anyPlaylistsInDatabase.length === 0) {
          console.log("no playlists in database");
          setPlaylistEmpty(true);
        } 
        else if (anyPlaylistsInDatabase.length !== 0) {
          console.log("playlists in database");
          setPlaylistData(anyPlaylistsInDatabase);
          setPlaylistEmpty(false);
        }
      } catch (error) {
        console.log(error);
        return;
      }
    };
    callFunction();
  }, []);

  if (playlistEmpty === true) {
    console.log('playlistEmpty === true');
    return (
      <>
        <div>playlistEmpty === true</div>
        <div>No playlists at all - create new playlist</div>
       
       
      </>
    );
  } else if (playlistEmpty === false) {
    console.log('playlistEmpty === false');
    return (
      <>
        <div>playlistEmpty === false</div>
      <div>Some playlists exist - enter component than can handle them</div>
      <CreatePlaylistComponent playlistData={playlistData} arrayOfUniqueTracksAsState={arrayOfUniqueTracksAsState}/> 
      </>
    );
  }
};
