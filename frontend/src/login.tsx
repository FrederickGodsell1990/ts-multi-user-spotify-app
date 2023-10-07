import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [Client_ID, setClientID] = useState("");
  const [Redirect_URI, setRedirectURI] = useState("");
  const [Release_Radar_code, setReleaseRadarCode] = useState("");

  const handleSubmit = async (event) => {
    // verifies all form inputs are present
    if (Client_ID && Redirect_URI && Release_Radar_code) {
      // Input details as object to send via axios
      const signUpDetailsObject = {
        Client_ID,
        Redirect_URI,
        Release_Radar_code,
      };

      try {
        const response = await axios.post(
          "http://localhost:3333/sign_up",
          signUpDetailsObject,
          {
            headers: {
              "Content-Type": "application/json", 
            },
          }
        );

        // Handle the successful response here
        console.log("Axios response:", response);
        // You can perform further actions based on the response if needed
      } catch (error) {
        // Handle errors here
        console.error("Axios error:", error);
      }
    } else {
      // Not all fields are completed, show an error message or take appropriate action
      alert("Please complete all fields.");
      event.preventDefault(); // Prevent form submission when fields are not complete
    }
  };

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
            onChange={(e) => setClientID(e.target.value)}
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
          <button type="submit">Sign up - Submit login details</button>
        </form>
      </div>
    </>
  );
}

export default Login;
