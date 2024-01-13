// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { accessToken } from "../accessTokenManagement.js";

// const token = accessToken;

// // returns spotify release radar playlist data
// export const ReleaseRaderAPICallFunction = async () => {
//     try {
//       const releaseRadarAPICall = await axios.get(
//         "https://api.spotify.com/v1/playlists/37i9dQZEVXbpTERBYDw7WM", // hardcoded release rader playlist - can make dynamic
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log('releaseRadarAPICall',releaseRadarAPICall)
//       return releaseRadarAPICall;
//     } catch (error) {
//       console.log(error);
//     }
//   };