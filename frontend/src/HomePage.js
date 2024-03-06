import { NavBar } from "./navBar";
import React, { useEffect} from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import ReleaseRaderAPICallFunction from "./components/ReleaseRadarComponent.js";
import { RadarCodeFromMongoSliceThunk, PlaylistsFfromMongoSliceThunk } from "./redux/thunks";
import { accessToken, getClientID, getURI } from "./accessTokenManagement.js";
import axios from "axios";
import './styles.css';




// const sendPlaylistDetailsToBackEnd = async () => {
//   const body = {
//     playlistData: {
//       monthAndYearCreated: 'March 2024',
//       playlistSpotifyID: '1qe1WB86Aqgiv932DV18km',
//       playlistName: 'Release Radar Capture Playlist March 2024',
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

export const Homepage = () => {
  const dispatch = useDispatch();

  const { status, mongoCode } = useSelector((store) => store.mongoDBThunk);

  useEffect(() => {
    (async () => {
      // call thunk to get release radar code for given user
      dispatch(RadarCodeFromMongoSliceThunk());
      // call playlist thunk
      dispatch(PlaylistsFfromMongoSliceThunk())
    })();
  }, []);

  return (
    <>
      <NavBar />

      <div className="main-header"> New tracks from Release Radar</div>
      {status === "succeeded" ? (
        <>
        <ReleaseRaderAPICallFunction mongoCode={mongoCode} />
       {/* <button onClick={sendPlaylistDetailsToBackEnd}>Test playlist</button> */}

        </>
      ) : null}
      
    </>
  );
};
