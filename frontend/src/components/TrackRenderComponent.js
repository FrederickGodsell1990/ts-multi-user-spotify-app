import React, { useState, useEffect } from "react";

export const TrackRenderMoreInfo = ({ trackID, album, albumReleaseDate }) => {
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

export const TrackRender = ({arrayOfUniqueTracksAsState}) => {
//  console.log('arrayOfUniqueTracksAsState', arrayOfUniqueTracksAsState)

  return arrayOfUniqueTracksAsState.map((trackObject, index) => {
    

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
   <TrackRenderMoreInfo trackID={trackSpotifyID} album={album} albumReleaseDate={albumReleaseDate}/>
      
      </React.Fragment>
    );
  });
}


