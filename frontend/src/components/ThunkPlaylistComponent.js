import axios from "axios";
import { accessToken, getClientID, getURI } from "../accessTokenManagement.js";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {RenderTracksAndAddToPlaylist} from './RenderTracksAndAddToPlaylist';

// input = array of tracks, output = year and date of most recent tranche of tracks in string form
const checkDateOfMostRecentTracks = (arrayOfUniqueTracksAsState) => {

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

// // input = existing playlists in mongo + date of most recent track formatted correctly
const existingPlaylistMatch = (
  initialStatePlaylistBody,
  DateOfMostRecentTracks
) => {
  const match = initialStatePlaylistBody.find(
    (item) => item.monthAndYearCreated === DateOfMostRecentTracks
  );
  // If match is found, return its playlistSpotifyID, otherwise return false
  return match ? match.playlistSpotifyID : false;
};

// input = spotify user ID, output = ID of newly created spotify playlist
const createPlaylistInSpotify = async (spotifyID) => {
  const today = new Date();
  const options = { month: "long" };
  const monthName = today.toLocaleString("default", options); // returns the name of the month
  const year = today.getFullYear(); // gets the current year

  // if this fucntion is not working, it's likely that the access token has expired
  const getNewTrackPlayLists = async () => {
    try {
      // this creates a new playlist in spotify your spotify account. It's hardcoded with my account ID
      const createPlayListTest = await axios.post(
        `https://api.spotify.com/v1/users/${spotifyID}/playlists`,
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

// input = name, id, description of newly created playlist, output = none
const sendPlaylistDetailsToBackEnd = async (name, id, description) => {
  const body = {
    playlistData: {
      monthAndYearCreated: description,
      playlistSpotifyID: id,
      playlistName: name,
    },
    clientID: getClientID,
  };

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

export const ThunkPlaylistComponent = ({ arrayOfUniqueTracksAsState }) => {

  const [playlistData, setPlaylistData] = useState([]);
  const [stillLoading, setStillLoading] = useState(true);
  const [newPlaylistID, setNewPlaylistID] = useState(false);

  const { initialStatePlaylistBody } = useSelector(
    (store) => store.playlistThunk
  );

  const id = useSelector((state) => state.userDetails.storeUserDetails.id);

  useEffect(() => {
    const DateOfMostRecentTracks = checkDateOfMostRecentTracks(
      arrayOfUniqueTracksAsState
    );

    // returns playlistID if matched and false if no match
    const match = existingPlaylistMatch(
      initialStatePlaylistBody,
      DateOfMostRecentTracks
    );

    console.log("match", match);

    if (match) {
      setPlaylistData(match);
      setStillLoading(false);
    } else if (!match) {
      setPlaylistData(false);
      setStillLoading(false);

      (async () => {
        const createdPlaylist = await createPlaylistInSpotify(id);
        console.log("newly created playlist ID", createdPlaylist);
        setNewPlaylistID(createdPlaylist);
      })();
    }
  }, []);

  if (stillLoading) {
    return <div>Still loading</div>;
  } else if (!stillLoading && playlistData) {
    return (
      <>

        {/* <div>ThunkPlaylistComponent called - playlist ID is {playlistData}</div> */}
        <RenderTracksAndAddToPlaylist arrayOfUniqueTracksAsState={arrayOfUniqueTracksAsState} playlistID={playlistData} />
      </>
    );
  } else if (!stillLoading && !playlistData) {
    return (
      <>
        {/* <div>
          ThunkPlaylistComponent called - new playlist created, it's {newPlaylistID}
        </div> */}
        <RenderTracksAndAddToPlaylist arrayOfUniqueTracksAsState={arrayOfUniqueTracksAsState} playlistID={newPlaylistID} />
      </>
    );
  }
};
