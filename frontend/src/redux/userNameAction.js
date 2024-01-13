import { ADD_USERNAME, REMOVE_USERNAME } from "./actionTypes";

const addUsername = (userName) => {
  console.log('userName from action',userName)
    return {
      type: ADD_USERNAME,
      payload : userName
    };
  };
  
  const removeUsername = () => {
    return {
      type: REMOVE_USERNAME,
    };
  };
  
  export { addUsername, removeUsername };