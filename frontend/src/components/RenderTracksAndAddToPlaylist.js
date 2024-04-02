import React, { useState, useEffect } from "react";
import { accessToken } from "../accessTokenManagement.js";
import axios from "axios";
import "../styles.css";

// input = single track array item - called via map method. Output = retuns a react fragment
const RenderTrackFunction = ({ trackObject, index }) => {
  // const artist = trackObject.artist
  //   .split("|")
  //   .map((name) => name.replace(/,/g, " & "));

  const trackSpotifyID = trackObject.trackSpotifyID;

  return (
    <React.Fragment key={index}>
      <iframe
        className="default-container-spacing shadow"
        style={{
          borderRadius: "12px",
          backgroundColor: "rgb(173,216,230)",
        }}
        title={trackSpotifyID}
        src={`https://open.spotify.com/embed/track/${trackSpotifyID}?utm_source=generator`}
        width="52%"
        height="200"
        frameBorder="0"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </React.Fragment>
  );
};

// component to render more info on each trackj
const TrackRenderMoreInfo = ({ trackID, album, albumReleaseDate }) => {
  const [clicked, setClicked] = useState(false);

  if (clicked === false) {
    return (
      <>
        <button
          className="btn btn-secondary default-container-spacing shadow"
          onClick={() => setClicked(true)}
        >
          More info
        </button>
      </>
    );
  } else if (clicked === true) {
    return (
      <>
        <div className="default-container-flexbox default-container-colour rounded  shadow">
          <p className="default-container-spacing">Track ID : {trackID}</p>
          <p className="default-container-spacing">Album : {album}</p>
          <p className="default-container-spacing">
            Album release date : {albumReleaseDate}
          </p>
          <button
            className="btn btn-secondary default-container-spacing  shadow"
            onClick={() => setClicked(false)}
          >
            Close
          </button>
        </div>
      </>
    );
  }
};

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
    return (
      <div
        className="default-container-flexbox default-container-spacing"
        style={{ minHeight: "80vh" }}
      >
        <div className="default-container-flexbox default-container-colour default-container-spacing rounded shadow">
          {" "}
          <h4 className="default-container-spacing subheading">
            No more new tracks
          </h4>
          <p className="text-muted standard-text default-container-spacing">
            Your Release Radar refreshes every Thursday at midnight.
          </p>
          <p className="text-muted standard-text">
            Come back after then to see what's new.
          </p>
        </div>
      </div>
    );
  }
  if (addedToPlaylist) {
    return (
      <div
        className="default-container-flexbox default-container-spacing"
        style={{ minHeight: "80vh" }}
      >
        <div className="default-container-flexbox default-container-colour rounded">
          <h4 className="default-container-spacing subheading">
            New tracks sucessfully added!{" "}
          </h4>
          <p className="default-container-spacing text-muted standard-text">
            {" "}
            All of this week's new tracks from your Release Radar are now
          </p>
          <p className="text-muted standard-text">
            added to a dedicated playlist on your Spotify account
          </p>
        </div>
      </div>
    );
  }
  if (renderList && reRenderState.length !== 0) {
    return (
      <div>
        <React.Fragment>
          <div className="default-container-flexbox default-container-spacing">
            <h4 className="subheading default-container-spacing">
              Check out all your new releases below{" "}
            </h4>
            <p className="text-muted standard-text" >
              The list of tracks below are those from your Release Radar
              playlist, which is a playlist curated by Spotify and informed by
              the tracks and artists your listen to, like and follow. The
              playlist is updated every week, a process where new tracks replace
              older tracks. This app allows you capture each track in a
              dedicated playlist so you don't overlook any new releases. Just
              hit the button below the app will store them in your Spotify
              account, catagorised by the month they were added.
            </p>
            <button
              className="btn lighter-btn default-container-spacing shadow"
              style={{ width: "400px" }}
              onClick={() => {
                addTracksToSpotifyPlaylist(playlistID, renderList);
                setAddedToPlaylist(true);
              }}
            >
              Add all tracks to playlist
            </button>
          </div>{" "}
          <div
            style={{
              height: "700px",
              overflow: "auto",
            }}
          >
            {renderList.map((trackObject, index) => {
              const trackSpotifyID = trackObject.trackSpotifyID;
              const albumReleaseDate = trackObject.albumReleaseDate;
              const album = trackObject.album;

              return (
                <React.Fragment key={trackObject.trackSpotifyID}>
                  <div className="d-flex flex-row  justify-content-center">
                    <RenderTrackFunction
                      trackObject={trackObject}
                      index={index}
                    />
                    <div className="d-flex flex-column align-items-center justify-content-center">
                      <TrackRenderMoreInfo
                        trackID={trackSpotifyID}
                        album={album}
                        albumReleaseDate={albumReleaseDate}
                      />
                      <button
                        className="btn lighter-btn default-container-spacing  shadow"
                        onClick={() =>
                          callRemoveTrackFromRenderList(
                            renderList,
                            trackObject.trackSpotifyID
                          )
                        }
                      >
                        Remove track
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          &nbsp;
        </React.Fragment>
      </div>
    );
  }
};
