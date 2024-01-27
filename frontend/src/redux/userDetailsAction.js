import { ADD_USERDETAILS, REMOVE_USERDETAILS } from "./actionTypes";



const addUserDetails = (userDetails) => {

    return {
      type: ADD_USERDETAILS,
      payload : userDetails
    };
  };
  
  const removeUserDetails = () => {
    return {
      type: REMOVE_USERDETAILS,
    };
  };
  
  export { addUserDetails, removeUserDetails };

