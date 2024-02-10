import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { accessToken, getClientID, getURI } from "../accessTokenManagement.js";
import { useSelector, shallowEqual } from "react-redux";

const token = accessToken;

// Axios call fetch release radar full track list from Spotify
const callReleaseRadarFuction = async (releaseRadarCode) => {
  try {
    const releaseRadarAPICall = await axios.get(
      `https://api.spotify.com/v1/playlists/${releaseRadarCode}`, // hardcoded release rader playlist - can make dynamic
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // returns all track as an array
    return releaseRadarAPICall.data.tracks.items;
  } catch (error) {
    console.log(error);
  }
};

// formats data from release radar API request into an object
const formatNewTracksAsObjectFunction = (releaseRadarTracks) => {
  return releaseRadarTracks.map((item) => {
    let artist2;
    // if track cites only one artist
    if (item.track.artists.length === 1) {
      artist2 = item.track.artists[0]?.name;
    } else {
      // if track cites more than one artist, return a string with all of them
      const oneString = item.track.artists.map((e) => {
        let moreThanOneArist = [];
        moreThanOneArist.push(e.name);
        const artistsAsOneString = moreThanOneArist.join(",");

        return artistsAsOneString;
      });

      artist2 = oneString.join(",");
    }

    const artist = artist2;
    const trackID = item.track?.id;
    const trackName = item.track?.name;
    const dateAdded = item.added_at;
    const album = item.track?.album?.name;
    const albumReleaseDate = item.track?.album?.release_date;
    const albumImage = item.track?.album?.images[0]?.url;

    const simpleRadarObject = {
      artist: artist,
      trackName: trackName,
      trackSpotifyID: trackID,
      dateAdded: dateAdded,
      album: album,
      albumReleaseDate: albumReleaseDate,
      albumImage: albumImage,
    };

    return simpleRadarObject;
  });
};

const sendRadarTracksToBackEndFunction = async (
  releaseRadarTracksAsSimpleObject
) => {
 

  const body = {
    ID: getClientID,
    objectFromFrontEnd: releaseRadarTracksAsSimpleObject,
  };

  console.log('body on frontend',body)

  try {
    const axiosPost = await axios.post(
      `${getURI}/post_release_radar_tracks`,
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("axiosPost.data.arrayOfUniqueTracks", axiosPost.data.arrayOfUniqueTracks);
  
    const arrayOfUniqueTracksFromBackendEnpointResponse = axiosPost.data.arrayOfUniqueTracks
  
    return arrayOfUniqueTracksFromBackendEnpointResponse
  } catch (err) {
    console.log(err);
  }


};

// returns spotify release radar playlist data
const ReleaseRaderAPICallFunction = ({mongoCode}) => {

const [arrayOfUniqueTracksAsState, setArrayOfUniqueTracksAsState ] = useState([]);
const [stillLoading, setStillLoading ] = useState(true);

  useEffect(() => {
    (async () => {
      const APICall = await callReleaseRadarFuction(
        mongoCode
      );

      const returningSimpleRadarObject = await formatNewTracksAsObjectFunction(
        APICall
      );

      const sendSimpleObjectToBackEnd = await sendRadarTracksToBackEndFunction(
        returningSimpleRadarObject
      );

      console.log('sendSimpleObjectToBackEnd',sendSimpleObjectToBackEnd)
      setArrayOfUniqueTracksAsState(sendSimpleObjectToBackEnd)
      setStillLoading(false);
    
    })();
  }, []);


  
if (stillLoading === true) {
  return <div>still loading</div>
}

else if (stillLoading === false && arrayOfUniqueTracksAsState.length > 0){
 return arrayOfUniqueTracksAsState.map((trackObject) => (
    <div key={trackObject.trackSpotifyID}>
      {trackObject.artist}
    </div>
  ))
}

else if (stillLoading === false && arrayOfUniqueTracksAsState.length === 0) {
  return <div> No new tracks </div>
}
 
};

export default ReleaseRaderAPICallFunction;
