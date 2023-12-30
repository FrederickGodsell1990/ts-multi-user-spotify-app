import React, { useState } from "react";

import { useLocation } from "react-router-dom";

function Login() {
  const [Client_ID, setClientID] = useState("");
  const [Redirect_URI, setRedirectURI] = useState("");
  const [Release_Radar_code, setReleaseRadarCode] = useState("");
  const [Username, setUsername] = useState("");
  const [Client_Secret, setClientSecret] = useState("");
  const [signUp, setSignUp] = useState(false);


  let LOGIN_URI;
  let SIGN_UP_URI;

  if (process.env.NODE_ENV === 'development') {
    LOGIN_URI =  'http://localhost:3333/log_in';
    SIGN_UP_URI = 'http://localhost:3333/sign_up';

  }
  if (process.env.REACT_APP_ENV === 'production') {
    console.log('i am staproductionging ===', process.env.REACT_APP_ENV); 
    LOGIN_URI =  'https://multi-user-spotify-app-staging-8f4f927e5f00.herokuapp.com/log_in';
    SIGN_UP_URI = 'https://multi-user-spotify-app-staging-8f4f927e5f00.herokuapp.com/sign_up';
  }
 

  return (
    <>
      <div className="RegisterAccount">
        Sign up & log in


        {/* <form method="POST" action="http://localhost:3333/sign_up"> */}
        <form method="POST" action={SIGN_UP_URI}>
         
          <input
            type="text"
            placeholder="Username"
            name="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Client_ID"
            name="Client_ID"
            onChange={(e) => {
              setClientID(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Client_Secret"
            name="Client_Secret"
            onChange={(e) => setReleaseRadarCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Redirect_URI"
            name="Redirect_URI"
            onChange={(e) => setRedirectURI(e.target.value)}
          />

          <input
            type="text"
            placeholder="Release_Radar_code"
            name="Release_Radar_code"
            onChange={(e) => setReleaseRadarCode(e.target.value)}
          />

          <input type="hidden" name="signup" value="signup" />

          <button type="submit">Log in & sign up - Submit login details</button>
        </form>
      </div>

      <div className="RegisterAccount">
        Login New
        {/* <form method="POST" action="http://localhost:3333/log_in"> */}
        <form method="POST" action={LOGIN_URI}>
          <input
            type="text"
            placeholder="Username"
            name="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Client_ID"
            name="Client_ID"
            onChange={(e) => {
              setClientSecret(e.target.value);
            }}
          />

          <button type="submit">Login in new</button>
        </form>
      </div>
    </>
  );
}

export default Login;
