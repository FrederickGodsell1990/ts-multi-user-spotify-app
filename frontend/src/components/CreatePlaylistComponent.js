import axios from "axios";
import { accessToken, getClientID, getURI } from "../accessTokenManagement.js";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { SecondStageNewPlaylistComponet } from "./SecondStageNewPlaylistComponet";
import { TrackRenderMoreInfo, TrackRender } from "./TrackRenderComponent";

// const createPlaylistInSpotify = async (spotifyUserID) => {
//   const today = new Date();
//   const options = { month: "long" };
//   const monthName = today.toLocaleString("default", options); // returns the name of the month
//   const year = today.getFullYear(); // gets the current year

//   // if this fucntion is not working, it's likely that the access token has expired
//   const getNewTrackPlayLists = async () => {
//     try {
//       // this creates a new playlist in spotify your spotify account. It's hardcoded with my account ID
//       const createPlayListTest = await axios.post(
//         `https://api.spotify.com/v1/users/${spotifyUserID}/playlists`,
//         {
//           name: `Release Radar Capture Playlist ${monthName} ${year}`,
//           description: `${monthName} ${year}`,
//           public: true,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       const {
//         data: { name, id, description },
//       } = createPlayListTest;

//       sendPlaylistDetailsToBackEnd(name, id, description);
//       console.log("createPlayListTest", createPlayListTest);
//       return createPlayListTest;
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return await getNewTrackPlayLists();
// };

// const sendPlaylistDetailsToBackEnd = async (name, id, description) => {
//   const body = {
//     playlistData: {
//       monthAndYearCreated: description,
//       playlistSpotifyID: id,
//       playlistName: name,
//     },
//     clientID: getClientID,
//   };

//   console.log("body on sendPlaylistDetailsToBackEnd", body);

//   try {
//     const { data } = await axios.post(
//       `${getURI}/post_new_playlist_to_database`,
//       body,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

const checkDateOfMostRecentTracks = (arrayOfUniqueTracksAsState) => {
  // console.log(
  //   "arrayOfUniqueTracksAsState in checkDateOfMostRecentTracks",
  //   arrayOfUniqueTracksAsState
  // );

  // variable for the date of the newly added tracks. They will always be the same as
  // new tracks come from 'release radar' playlist which resests each Friday
  const dateOfLatestTracks = arrayOfUniqueTracksAsState[0].dateAdded;

  // regex to extract month of newly added track
  const regex = /^(\d{4})-(\d{2})/;
  const match = regex.exec(dateOfLatestTracks);
  const monthOfNewestAddedTrack = Number(match[2] - 1);
  const yearOfNewestAddedTrack = Number(match[1] - 1);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[monthOfNewestAddedTrack];

  // monthAndYearOfNewTrack formatted in the way so it matches how it is stored in database,
  // this data is later compared conditionally
  const monthAndYearOfNewTrack = `${monthName} ${yearOfNewestAddedTrack + 1}`;

  // console.log("monthAndYearOfNewTrack", monthAndYearOfNewTrack);

  return monthAndYearOfNewTrack;
};

// const checkIfPlaylistsMatch =  (playlistData, arrayOfUniqueTracksAsState) => {

//  return playlistData.some(({ monthAndYearCreated, playlistSpotifyID }) => {
//   let playlistMatch;
//     if (
//       monthAndYearCreated ===
//       checkDateOfMostRecentTracks(arrayOfUniqueTracksAsState)
//     ) {
//       playlistMatch = playlistSpotifyID;
// console.log('checkIfPlaylistsMatch and playlist matched')
// console.log('playlistMatch value in checkIfPlaylistsMatch' , playlistMatch )
//       return playlistMatch;
//     } else if (monthAndYearCreated !==
//       checkDateOfMostRecentTracks(arrayOfUniqueTracksAsState)) {
//         playlistMatch = 'no match';
//         console.log('checkIfPlaylistsMatch and playlist = no match')
//         console.log('playlistMatch value in checkIfPlaylistsMatch' , playlistMatch )
//         return playlistMatch;
//       }
//   });

// }

// // this function creates in spotify and returns an object of the newly created playlist icluding the details that will be stored in the database
// export function CreatePlaylistComponent({
//   playlistData,
//   arrayOfUniqueTracksAsState,
// }) {
//   const id = useSelector((state) => state.userDetails.storeUserDetails.id);

//   useEffect(() => {

//   }, [arrayOfUniqueTracksAsState]);

//   // console.log("playlistData", playlistData);
//   const monthAndYearOfNewTrack = checkDateOfMostRecentTracks(
//     arrayOfUniqueTracksAsState
//   );
//   let playlistMatch;
//   // object deconstructs below two values, if playlist's current month/year is in database, set its playlistID
//   // value to the global scope var 'playlistID'
//   playlistData.some(({ monthAndYearCreated, playlistSpotifyID }) => {
//     if (
//       monthAndYearCreated ===
//       checkDateOfMostRecentTracks(arrayOfUniqueTracksAsState)
//     ) {
//       playlistMatch = playlistSpotifyID;

//       return true;
//     }
//   });

//   if (playlistMatch) {
//     console.log('playlistMatch was hit')
//     return (
//       <>
//         <div>Playlist matched! It is {playlistMatch}</div>
//         <div>
//          Call component to add tracks to existing playlist here
//         </div>
//         {/* <TrackRender arrayOfUniqueTracksAsState={arrayOfUniqueTracksAsState} /> */}

//       </>
//     );
//   } else if (!playlistMatch) {
// console.log('!playlistMatch was hit')
//     return (
//       <>
//         <div>Playlist did not match - Call component to add tracks to NEW playlist here</div>

//         {/* <SecondStageNewPlaylistComponet /> */}
//         {/* <TrackRender arrayOfUniqueTracksAsState={arrayOfUniqueTracksAsState} /> */}
//       </>
//     );
//   }
// }


export function CreatePlaylistComponent({
  playlistData,
  arrayOfUniqueTracksAsState,
}) {
  const id = useSelector((state) => state.userDetails.storeUserDetails.id);
  const [playlistMatch, setPlaylistMatch] = useState(null); // State to store playlistMatch
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Your logic to determine playlistMatch
    const match = playlistData.find(({ monthAndYearCreated }) => 
      monthAndYearCreated === checkDateOfMostRecentTracks(arrayOfUniqueTracksAsState)
    );
    setPlaylistMatch(match ? match.playlistSpotifyID : null);
    setIsLoading(false); // Set loading to false when finished processing
  }, [isLoading]);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading indicator while processing
  }

  else if (playlistMatch && isLoading === false ) {
    console.log('playlistMatch was hit');
    return (
      <>
        <div>Playlist matched! It is {playlistMatch}</div>
        <div>Call component to add tracks to existing playlist here</div>
        {/* <TrackRender arrayOfUniqueTracksAsState={arrayOfUniqueTracksAsState} /> */}
      </>
    );
  } else if (!playlistMatch && isLoading === false) {
    console.log('!playlistMatch was hit');
    return (
      <>
        <div>Playlist did not match - Call component to add tracks to NEW playlist here</div>
        <SecondStageNewPlaylistComponet />
        {/* <TrackRender arrayOfUniqueTracksAsState={arrayOfUniqueTracksAsState} /> */}
      </>
    );
  }
}