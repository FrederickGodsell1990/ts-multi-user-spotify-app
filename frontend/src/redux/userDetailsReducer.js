import { ADD_USERDETAILS, REMOVE_USERDETAILS } from "./actionTypes";

const initialState = {
  storeUserDetails : 'Nothing yet'
};

const userDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USERDETAILS:
      return {
    
        storeUserDetails: action.payload,
      };

    case REMOVE_USERDETAILS:
      return {
    
        storeUserDetails: '',
      };
    default:
      return state;
  }
};

export default userDetailsReducer;