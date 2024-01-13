import { createStore, combineReducers } from "redux";
import { configureStore } from '@reduxjs/toolkit';


import  cartReducer  from "./cartReducer";
import usernameReducer from "./userNameReducer"

// const store = createStore(cartReducer);

// export default store;

////////

const store = configureStore({
    reducer: {
        cart: cartReducer,
        username: usernameReducer,
        // Add more reducers as needed
      }
  });
  


  export default store;