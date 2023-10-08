import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';


function Login() {
  const [Client_ID, setClientID] = useState("");
  const [Redirect_URI, setRedirectURI] = useState("");
  const [Release_Radar_code, setReleaseRadarCode] = useState("");
  const [Username, setUsername] = useState("");
  const [signUp, setSignUp] = useState(false);

  // const location = useLocation();
  // const message = new URLSearchParams(location.search).get('message');

  // useEffect(() => {
  //   if (message) {
  //     alert(message); // Display the message using an alert or other UI element
  //   }
  // }, [message]);

 
  return (
    <>
      <div>Login</div>
      <div className="frontend_data_to_server">
        <form method="POST" action="/frontend_data_to_server">
          <input
            type="text"
            placeholder="Enter Spotify details"
            name="testData"
          />
          <button type="submit">Search artist</button>
        </form>
      </div>

      <div className="SpotifyLoginDetailsForm">
        <form
          method="POST"
          action="http://localhost:3333/post_spotify_login_details"
        >
          <input type="text" placeholder="Client_ID" name="Client_ID" />
          <input type="text" placeholder="Redirect_URI" name="Redirect_URI" />
          <input
            type="text"
            placeholder="Release_Radar_code"
            name="Release_Radar_code"
          />
          <button type="submit">Form - Submit login details</button>
        </form>
      </div>

      <div className="RegisterAccount">
        Sign up
        <form
          method="POST"
          action="http://localhost:3333/sign_up"

          // onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Client_ID"
            name="Client_ID"
            onChange={(e) => {
              setClientID(e.target.value);
              setSignUp((signUp) => true);
            }}
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

          <button type="submit">Sign up - Submit login details</button>
        </form>
      </div>

      <div className="RegisterAccount">
        Sign up & log in
        <form
          method="POST"
          action="http://localhost:3333/log_in_and_sign_up"
        
        >
          <input
            type="text"
            placeholder="Username"
            name="Username"
            onChange={(e) => {
              setUsername(e.target.value)
            }}
          />
          <input
            type="text"
            placeholder="Client_ID"
            name="Client_ID"
            onChange={(e) => {
              setClientID(e.target.value)
            }}
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
    </>
  );
}

export default Login;
