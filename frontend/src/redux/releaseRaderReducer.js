import {
  ADD_RELEASE_RADAR_DETAILS,
  REMOVE_RELEASE_RADAR_DETAILS,
} from "./actionTypes";

const initialState = {
  releaseRadarDetails: "",
};

const releaseRadarReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_RELEASE_RADAR_DETAILS:
      return {
        releaseRadarDetails: action.payload,
      };

    case REMOVE_RELEASE_RADAR_DETAILS:
      return {
        releaseRadarDetails: "",
      };

    default:
      return state;
  }
};

export default releaseRadarReducer;
