import React, { useState } from "react";
import { useLocation } from "react-router-dom";

let LOGIN_URI;
let SIGN_UP_URI;

if (process.env.NODE_ENV === "development") {
  LOGIN_URI = "http://localhost:3333/log_in";
  SIGN_UP_URI = "http://localhost:3333/sign_up";
}
if (process.env.NODE_ENV === "production") {
  console.log("i am staproductionging ===", process.env.REACT_APP_ENV);
  LOGIN_URI =
    "https://multi-user-spotify-app-staging-8f4f927e5f00.herokuapp.com/log_in";
  SIGN_UP_URI =
    "https://multi-user-spotify-app-staging-8f4f927e5f00.herokuapp.com/sign_up";
}

function Login() {
  const [currentSlide, setCurrentSlide] = useState(0); // State to manage the current slide

  const [Client_ID, setClientID] = useState("");
  const Redirect_URI = "http://localhost:3333/spotify_login_callback";
  const [Release_Radar_code, setReleaseRadarCode] = useState("");
  const [Username, setUsername] = useState("");
  const [Client_Secret, setClientSecret] = useState("");
  const [signup, setSignUp] = useState("true");

  const [showSignUpCarousel, setShowSignUpCarousel] = useState(true);

  const handleClientID = (event) => {
    setClientID(event.target.value);
  };

  const handleReleaseRadarCode = (event) => {
    setReleaseRadarCode(event.target.value);
  };

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleClientSecret = (event) => {
    setClientSecret(event.target.value);
  };

  const handleSignUp = (event) => {
    setClientSecret(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent form submission
    // Advance to the next slide if the form on the current slide is submitted
    setCurrentSlide(currentSlide + 1);
  };

  const toggleSignUpCarousel = () => {
    console.log("showSignUpCarousel", showSignUpCarousel);
    setShowSignUpCarousel(!showSignUpCarousel);
  };

  return (
    <div>
      {showSignUpCarousel ? (
        <>
          <div className="RegisterAccount">
            Login New - CarouselWithForms
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
          <button onClick={toggleSignUpCarousel}>
            {" "}
            No account? Sign up here
          </button>
        </>
      ) : (
        <>
          <div
            id="carouselExampleFade"
            className="carousel slide carousel-fade"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div
                className={`carousel-item ${
                  currentSlide === 0 ? "active" : ""
                }`}
              >
                <div>
                  1, Go to your desktop Spotify app and hover over the icon the
                  top right corner. This will reveal your Spotify username.
                  Please make a note of this. You will need it to log in to your
                  app.
                </div>
                <form onSubmit={handleFormSubmit}>
                  <h2>Username</h2>
                  <input
                    type="text"
                    onChange={handleUsername}
                    placeholder="Enter Username"
                    style={{ width: "400px" }}
                  />
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
              <div
                className={`carousel-item ${
                  currentSlide === 1 ? "active" : ""
                }`}
              >
                <div>
                  Click on the icon in the top right corner, and then on
                  'Account' option. In the window that pops up, scroll down to
                  the bottom and click the 'Developers' option under the
                  'Communities' subheading. Now click the 'Log in' option in the
                  top right hand corner. Once logged in, you should see you
                  Spotify username in the top right corner. Click on it and
                  choose the 'Dashboard' option. Now click on the 'Create app'
                  to the right of the page. In the 'App name' field, type your
                  Spotify username and then 'Release Radar App', for example
                  'Frederick's Release Radar App', then copy and paste that same
                  text in to the 'App description' field. You can leave the
                  'Website' field blank. Now enter
                  'http://localhost:3333/spotify_login_callback' into the
                  'Redirect URI' fieldm making sure to not inlcude the inverted
                  commas. Check the 'Web API' box in the 'Which API/SDKs are you
                  planning to use?' section, then agree to terms and conditions
                  and click 'Save'. You've now created your Spotify app!
                </div>
                <div>
                  Now within your app, click 'Settings' at the top right of the
                  page, scroll to the bottom and click 'Edit'. Now paste
                  'https://multi-user-spotify-app-staging-8f4f927e5f00.herokuapp.com/spotify_login_callback'
                  in to the 'Redirect URIs' field, again not including the
                  inverted commas. Do not remove the existing URI. Now click
                  'Add' to the right of the bar, then scroll to the bottom and
                  click 'Save'. You can now copy your 'Client ID'. Make sure you
                  make a note of this. It will serve as your password for the
                  app. Please now paste it in to the box below{" "}
                </div>

                <form onSubmit={handleFormSubmit}>
                  <h2>Form 1</h2>

                  <input
                    type="text"
                    value={Client_ID}
                    onChange={handleClientID}
                    placeholder="Enter Client ID"
                    style={{ width: "400px" }}
                  />
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
              <div
                className={`carousel-item ${
                  currentSlide === 2 ? "active" : ""
                }`}
              >
                <div>
                  On the same page click the 'View client secret' option. It
                  will reveal your client secret. Please copy and paste it in to
                  the box below{" "}
                </div>
                <form onSubmit={handleFormSubmit}>
                  <h2>Form 3</h2>
                  <input
                    type="text"
                    onChange={handleClientSecret}
                    placeholder="Enter Client Secret"
                    style={{ width: "400px" }}
                  />
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
              <div
                className={`carousel-item ${
                  currentSlide === 3 ? "active" : ""
                }`}
              >
                <div>
                  In your Spotify desktop app - where you initially found your
                  Spotify username - type in 'Release Radar' in to the search
                  function, then click on the thumbnail. Now click on the three
                  horizontal dots. In the dropdow options, click 'Share' and
                  then click 'Copy link to playlist'. You should see a link
                  similar to
                  https://open.spotify.com/playlist/37i9dQZEVXbftpojYxNDUm?si=88ca37a6614f4c60.
                  Now copy the serial code between the forward slash and the
                  question mark and paste it in to the box below. In the given
                  example the serial code is '37i9dQZEVXbftpojYxNDUm'
                </div>
                <form onSubmit={handleFormSubmit}>
                  <h2>Form 4</h2>
                  <input
                    type="text"
                    onChange={handleReleaseRadarCode} // Call 'handleInputChange' function when input value changes
                    placeholder="Enter Release Radar Code"
                    style={{ width: "400px" }}
                  />
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>

              <div
                className={`carousel-item ${
                  currentSlide === 4 ? "active" : ""
                }`}
              >
                {Client_ID &&
                Release_Radar_code &&
                Username &&
                Client_Secret ? (
                  <>
                    <div>
                      Please verify your details and if correct, click 'Sign up'
                    </div>
                    <form onSubmit={handleFormSubmit}>
                      <h2>Form 5</h2>
                      <div>Client_ID is {Client_ID}</div>
                      <div>Release_Radar_code is {Release_Radar_code}</div>
                      <div>Username is {Username}</div>
                      <div>Client_Secret is {Client_Secret}</div>
                    </form>

                    <form method="POST" action={SIGN_UP_URI}>
                      <input type="hidden" name="Client_ID" value={Client_ID} />
                      <input
                        type="hidden"
                        name="Redirect_URI"
                        value={Redirect_URI}
                      />
                      <input
                        type="hidden"
                        name="Release_Radar_code"
                        value={Release_Radar_code}
                      />
                      <input type="hidden" name="Username" value={Username} />
                      <input
                        type="hidden"
                        name="Client_Secret"
                        value={Client_Secret}
                      />
                      <input type="hidden" name="signup" value={signup} />
                      <button type="submit">Sign up</button>
                    </form>
                  </>
                ) : (
                  <div>A field is missing</div>
                )}
              </div>
            </div>
          </div>
          <button onClick={toggleSignUpCarousel}>Back to login</button>
        </>
      )}
    </div>
  );
}

export default Login;
