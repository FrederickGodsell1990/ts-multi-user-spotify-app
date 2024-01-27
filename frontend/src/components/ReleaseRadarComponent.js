import React, { useStat, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { accessToken } from "../accessTokenManagement.js";
import { useSelector, shallowEqual } from "react-redux";
import {fetchReleaseRadarData} from "../redux/slices/releaseRadarSlice"

const token = accessToken;

// returns spotify release radar playlist data
export const ReleaseRaderAPICallFunction =  () => {

  const state = useSelector((state) => state.releaseRadar);
  const { releaseRadarDetails } = state;


  useEffect(() =>{
   
    // console.log("releaseRadarDetails", releaseRadarDetails);  
  },[])

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
      // console.log("releaseRadarAPICall", releaseRadarAPICall);
      return releaseRadarAPICall;
    } catch (error) {
      console.log(error);
    }
  };

  return <button onClick={() => callReleaseRadarFuction(releaseRadarDetails)} ></button>

};



