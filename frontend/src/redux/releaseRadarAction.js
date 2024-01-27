import { ADD_RELEASE_RADAR_DETAILS, REMOVE_RELEASE_RADAR_DETAILS } from "./actionTypes";

const addReleaseRadarDetails = (releaseRadarDetails) => {

    return {
      type: ADD_RELEASE_RADAR_DETAILS,
      payload : releaseRadarDetails
    };
  };
  
  const removeReleaseRadarDetails = () => {
    return {
      type: REMOVE_RELEASE_RADAR_DETAILS,
    };
  };
  
  export { addReleaseRadarDetails, removeReleaseRadarDetails };

