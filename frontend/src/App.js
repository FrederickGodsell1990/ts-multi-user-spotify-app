import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import React, { useState } from "react";

function App() {
  return (
    <>
      <div className="frontend_data_to_server">
        <form
          method="POST"
          action="/frontend_data_to_server"
        >
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
    </>
  );
}
export default App;
