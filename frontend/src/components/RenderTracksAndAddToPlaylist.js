import React, { useState, useEffect } from "react";
import { accessToken } from "../accessTokenManagement.js";
import axios from "axios";

// input = single track array item - called via map method. Output = retuns a react fragment
const renderTrackFunction = (trackObject, index) => {
  const artist = trackObject.artist
    .split("|")
    .map((name) => name.replace(/,/g, " & "));
  const trackName = trackObject.trackName;
  const trackSpotifyID = trackObject.trackSpotifyID;
  const dateAdded = trackObject.dateAdded;
  const album = trackObject.album;
  const albumReleaseDate = trackObject.albumReleaseDate;

  return (
    <React.Fragment key={index}>
      <iframe
        style={{
          borderRadius: "12px",
          backgroundColor: "rgb(119, 119, 119)",
        }}
        title={trackSpotifyID}
        src={`https://open.spotify.com/embed/track/${trackSpotifyID}?utm_source=generator`}
        width="80%"
        height="250"
        frameBorder="0"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
      <TrackRenderMoreInfo
        trackID={trackSpotifyID}
        album={album}
        albumReleaseDate={albumReleaseDate}
      />
    </React.Fragment>
  );
};

// component to render more info on each trackj
const TrackRenderMoreInfo = ({ trackID, album, albumReleaseDate }) => {
  const [clicked, setClicked] = useState(false);

  if (clicked === false) {
    return (
      <>
        <button onClick={() => setClicked(true)}>More info?</button>
      </>
    );
  } else if (clicked === true) {
    return (
      <>
        <div>Track ID is {trackID}</div>
        <div>Album {album}</div>
        <div>Album release date {albumReleaseDate}</div>
        <button onClick={() => setClicked(false)}>Close</button>
      </>
    );
  }
};

// CHANGE THIS SO THAT IT RETURNS A SUCCESS SIGNAL, WHICH CHANGES STATE, THEN RENDERS SAYING IT'S DONE!
// input = playlist ID and list of tracks to add. Output = none but adds tracks to playlist - 
async function addTracksToSpotifyPlaylist(playlistID, renderList) {
  const arrayOfTrackIDsFormattedForAdding = renderList.map(
    ({ trackSpotifyID }) => {
      const spotifyFormatting = `spotify:track:${trackSpotifyID}`;
      return spotifyFormatting;
    }
  );

  try {
    const addToPlaylistAxiosPostRequest = await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
      {
        uris: arrayOfTrackIDsFormattedForAdding,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // log here to confirm that tracks have been successfully added to spotify playlist
    console.log(
      "Added to playlist, here is snapshot ID;",
      addToPlaylistAxiosPostRequest.data.snapshot_id
    );
  } catch (error) {
    console.log(error);
  }
}

export const RenderTracksAndAddToPlaylist = ({
  arrayOfUniqueTracksAsState,
  playlistID,
}) => {
  //   console.log(" arrayOfUniqueTracksAsState", arrayOfUniqueTracksAsState);
  //   console.log(" playlistID", playlistID);

  const [renderList, setRenderList] = useState([]);
  const [reRenderState, setReRenderState] = useState(0);
  const [addedToPlaylist, setAddedToPlaylist] = useState(false);

  useEffect(() => {
    setRenderList(arrayOfUniqueTracksAsState);
    console.log(
      "arrayOfUniqueTracksAsState.length",
      arrayOfUniqueTracksAsState.length
    );
    setReRenderState(arrayOfUniqueTracksAsState.length);
  }, []);

  // useEffect(() => {}, [reRenderState]);

  // useEffect(() => {}, [playlistID]);

  // input = playlist currently being rendered + trackID of track being removed. Not output but sets the renderList variable
  // as the exact same renderList array less the track being removed. function inside functional component so setState can be used
  const callRemoveTrackFromRenderList = (renderList, trackID) => {
    setReRenderState(reRenderState - 1);
    const modifiedRenderList = renderList.filter((item) => {
      return item.trackSpotifyID !== trackID;
    });
    setRenderList(modifiedRenderList);
  };

  if (reRenderState === 0) {
    return <div> No new tracks! </div>;
  }
  if (addedToPlaylist) {
    return <div>New tracks added to playlist {playlistID}</div>;
  }
  if (renderList && reRenderState.length !== 0) {
    return (
      <React.Fragment>
        {" "}
        {renderList.map((trackObject, index) => {
          const renderedTrack = renderTrackFunction(trackObject, index);

          return (
            <React.Fragment key={trackObject.trackSpotifyID}>
              <div>{renderedTrack}</div>
              <button
                onClick={() =>
                  callRemoveTrackFromRenderList(
                    renderList,
                    trackObject.trackSpotifyID
                  )
                }
              >
                Remove track
              </button>
            </React.Fragment>
          );
        })}
        &nbsp;
        <button
          onClick={() => {
            addTracksToSpotifyPlaylist(playlistID, renderList);
            setAddedToPlaylist(true);
          }}
        >
          Add to playlist
        </button>
        <div>value of addedToPlaylist = {addedToPlaylist} </div>
      </React.Fragment>
    );
  }
};
