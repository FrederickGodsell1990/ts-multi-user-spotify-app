import { REMOVE_USERNAME, ADD_USERNAME } from "./actionTypes";


const initialState = {
  storeUsername : 'Nobody'
};

const usernameReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USERNAME:
      return {
    
        storeUsername: action.payload,
      };

    case REMOVE_USERNAME:
      return {
    
        storeUsername: 'Nobody',
      };
    default:
      return state;
  }
};

export default usernameReducer;