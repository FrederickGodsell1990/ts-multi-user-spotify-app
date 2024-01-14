import { createStore, combineReducers } from "redux";
import { configureStore } from '@reduxjs/toolkit';


import usernameReducer from "./userNameReducer"
import userDetailsReducer from "./userDetailsReducer";

// const store = createStore(cartReducer);

// export default store;

////////

const store = configureStore({
    reducer: {
        username: usernameReducer,
        userDetails : userDetailsReducer
        // Add more reducers as needed
      }
  });
  


  export default store;