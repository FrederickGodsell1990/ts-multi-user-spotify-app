import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./styles.css";

let LOGIN_URI : any;
let SIGN_UP_URI : any;

if (process.env.NODE_ENV === "development") {
  LOGIN_URI = "http://localhost:3333/log_in";
  SIGN_UP_URI = "http://localhost:3333/sign_up";
}
if (process.env.NODE_ENV === "production") {
  console.log("i am staproductionging ===", process.env.REACT_APP_ENV);
  LOGIN_URI =
    `${process.env.FRONTEND_URI}/log_in`;
  SIGN_UP_URI =
    `${process.env.FRONTEND_URI}/sign_up`;
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

  const handleClientID = (event : any) => {
    setClientID(event.target.value);
  };

  const handleReleaseRadarCode = (event : any) => {
    setReleaseRadarCode(event.target.value);
  };

  const handleUsername = (event : any) => {
    setUsername(event.target.value);
  };

  const handleClientSecret = (event : any) => {
    setClientSecret(event.target.value );
  };

  const handleSignUp = (event : any) => {
    setClientSecret(event.target.value);
  };

  const handleFormSubmit = (event : any) => {
    event.preventDefault(); // Prevent form submission
    // Advance to the next slide if the form on the current slide is submitted
    setCurrentSlide(currentSlide + 1);
  };

  const toggleSignUpCarousel = () => {
    console.log("showSignUpCarousel", showSignUpCarousel);
    setShowSignUpCarousel(!showSignUpCarousel);
  };

  const ProgressBar = ({ progress } : any) => {
    console.log(progress);

    return (
      <div className="progress default-container-spacing ">
        <div
          className="progress-bar bg-secondary"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={220}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  const BackToLoginComponent = () => {
    return (
      <button className="btn lighter-btn shadow" onClick={toggleSignUpCarousel}>
        Back to login
      </button>
    );
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="default-container-flexbox" style={{ minHeight: "100vh" }}>
      {showSignUpCarousel ? (
        <>
          <div>
            <div className="RegisterAccount default-container-colour rounded shadow default-container-flexbox">
              <div className="container default-container-flexbox default-container-spacing">
                <h6 className="subheading default-container-spacing">
                  Welcome to the Spotify Release Radar Capture App
                </h6>{" "}
                <div style={{ textAlign: 'center' }}>
                <p className="standard-text default-container-spacing">
                 If you have an existing Spotify Release Radar Capture App account, you can log in below and start discovering new music. 
                 These account credentials are specific to this app and seperate from your normal Spotify login details.
                </p>
                </div>
                <form method="POST" action={LOGIN_URI}>
                  <input
                    className="default-container-spacing rounded"
                    type="text"
                    placeholder="Username"
                    name="Username"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                  <input
                    className="rounded"
                    type="text"
                    placeholder="Client_ID"
                    name="Client_ID"
                    onChange={(e) => {
                      setClientSecret(e.target.value);
                    }}
                  />

                  <button
                    className="btn btn-secondary default-container-spacing  shadow"
                    type="submit"
                  >
                    Login
                  </button>
                </form>
                <div className="text-muted standard-text default-container-spacing">
                  <p>
                    If you do not have an existing account, please sign up
                    below. You will need your Spotify desktop app open.{" "}
                  </p>

                
                </div>
                <button
                  className="btn lighter-btn default-container-spacing  shadow"
                  onClick={toggleSignUpCarousel}
                >
                  {" "}
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="default-container-colour default-container-flexbox default-container-spacing shadow rounded">
            <div
              id="carouselExampleFade"
              className="carousel slide carousel-fade"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner default-container-spacing">
                <div
                  className={`carousel-item ${
                    currentSlide === 0 ? "active" : ""
                  } `}
                >
                  <form onSubmit={handleFormSubmit}>
                    <h4 className="subheading ">Username</h4>
                    <hr />
                    <div className="text-muted standard-text">
                      <p>
                        Go to your desktop Spotify app and click on the icon in
                        the top right corner, then on the 'Account' option.
                      </p>

                      <p>
                        In the window that pops up, scroll down to the bottom
                        and click the 'Developers' option under the
                        'Communities' subheading. Now click the 'Log in' option
                        in the top right hand corner.
                      </p>

                      <p>
                        Once logged in, click on the icon containing your
                        username in the top right corner and choose the
                        'Dashboard' option. Now click on the 'Create app' to the
                        right of the page.
                      </p>
                      <p>
                        Now at the top right of the page should see an icon
                        containing your Spotify username. Please copy and paste
                        it in to the box below, then click submit.
                      </p>
                    </div>

                    <hr />
                    <input
                      className="default-container-spacing rounded"
                      type="text"
                      onChange={handleUsername}
                      placeholder="Enter Username"
                      style={{ width: "400px" }}
                    />
                    <button
                      type="submit"
                      className="btn btn-secondary default-container-spacing shadow"
                    >
                      Submit
                    </button>
                  </form>
                  <ProgressBar progress={10} />
                  <div className="default-container-flexbox">
                    <BackToLoginComponent />
                  </div>
                </div>

                <div
                  className={`carousel-item ${
                    currentSlide === 1 ? "active" : ""
                  }`}
                >
                  <h4 className="subheading ">App set up</h4>
                  <hr />
                  <div className="text-muted standard-text">
                    <p>
                      Back in the Developer Dashboard, in the 'App name' field,
                      paste your Spotify username and then 'Release Radar App',
                      for example 'Frederick's Release Radar App', then copy and
                      paste that same text in to the 'App description' field.
                      You can leave the 'Website' field blank.
                    </p>

                    <p>
                      Now right click on{" "}
                      <a
                        href="https://multi-user-spotify-app-staging-8f4f927e5f00.herokuapp.com/spotify_login_callback"
                        data-bs-toggle="tooltip"
                        title="https://multi-user-spotify-app-staging-8f4f927e5f00.herokuapp.com/spotify_login_callback"
                      >
                        this link
                      </a>{" "}
                      then click 'Copy link address' and paste the URL into the
                      'Redirect URI' field. Check the 'Web API' box in the
                      'Which API/SDKs are you planning to use?' section, then
                      agree to terms and conditions and click 'Save'. You've now
                      created your Spotify app!
                    </p>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-secondary default-container-spacing shadow"
                      onClick={handleFormSubmit}
                    >
                      Next
                    </button>
                  </div>
                  <ProgressBar progress={20} />
                  <div className="default-container-flexbox">
                    <BackToLoginComponent />
                  </div>
                </div>
                <div
                  className={`carousel-item ${
                    currentSlide === 2 ? "active" : ""
                  }`}
                >
                  <h4 className="subheading ">Client ID</h4>
                  <hr />
                  <div className="text-muted standard-text">
                    <p>
                      Now click the 'Settings' option near the top right of the
                      page. You can now copy your 'Client ID'. Make sure you
                      make a note of this. It will serve as your password for
                      the app. Please now paste it in to the box below.{" "}
                    </p>
                  </div>
                  <hr />
                  <form onSubmit={handleFormSubmit}>
                    <input
                      className="default-container-spacing rounded"
                      type="text"
                      value={Client_ID}
                      onChange={handleClientID}
                      placeholder="Enter Client ID"
                      style={{ width: "400px" }}
                    />
                    <button
                      type="submit"
                      className="btn btn-secondary default-container-spacing shadow"
                    >
                      Submit
                    </button>
                  </form>
                  <ProgressBar progress={40} />
                  <div className="default-container-flexbox">
                    <BackToLoginComponent />
                  </div>
                </div>

                <div
                  className={`carousel-item ${
                    currentSlide === 3 ? "active" : ""
                  }`}
                >
                  <h4 className="subheading">Client Secret</h4>
                  <hr />
                  <div className="text-muted standard-text">
                    <p>
                      On the same page click the 'View client secret' option. It
                      will reveal your client secret. Please copy and paste it
                      in to the box.{" "}
                    </p>
                  </div>
                  <hr />
                  <form onSubmit={handleFormSubmit}>
                    <input
                      className="default-container-spacing rounded"
                      type="text"
                      onChange={handleClientSecret}
                      placeholder="Enter Client Secret"
                      style={{ width: "400px" }}
                    />
                    <button
                      type="submit"
                      className="btn btn-secondary default-container-spacing shadow"
                    >
                      Submit
                    </button>
                  </form>
                  <ProgressBar progress={60} />
                  <div className="default-container-flexbox">
                    <BackToLoginComponent />
                  </div>
                </div>
                <div
                  className={`carousel-item ${
                    currentSlide === 4 ? "active" : ""
                  }`}
                >
                  <h4 className="subheading">Release Radar Code</h4>
                  <hr />
                  <div className="text-muted standard-text">
                    <p>
                      In your Spotify desktop app - where you initially found
                      your Spotify username - type in 'Release Radar' in to the
                      search function, then click on the thumbnail. Now click on
                      the three horizontal dots. In the dropdow options, click
                      'Share' and then click 'Copy link to playlist'. You should
                      see URL.
                    </p>
                    <p>
                      Now copy the serial code between the forward slash and the
                      question mark and paste it in to the box below. It should
                      be a combination of numbers and letters, something similar
                      to '37i9dQZEVXbftpojYxNDUm'
                    </p>
                  </div>
                  <hr />
                  <form onSubmit={handleFormSubmit}>
                    <input
                      className="default-container-spacing rounded"
                      type="text"
                      onChange={handleReleaseRadarCode} // Call 'handleInputChange' function when input value changes
                      placeholder="Enter Release Radar Code"
                      style={{ width: "400px" }}
                    />
                    <button
                      type="submit"
                      className="btn btn-secondary default-container-spacing shadow"
                    >
                      Submit
                    </button>
                  </form>
                  <ProgressBar progress={80} />
                  <div className="default-container-flexbox">
                    <BackToLoginComponent />
                  </div>
                </div>

                <div
                  className={`carousel-item ${
                    currentSlide === 5 ? "active" : ""
                  }
                  `}
                >
                  {Client_ID &&
                  Release_Radar_code &&
                  Username &&
                  Client_Secret ? (
                    <>
                      <div className="d-flex">
                        <form method="POST" action={SIGN_UP_URI}>
                          <form onSubmit={handleFormSubmit}>
                            <div className="subheading">
                              Verify details and sign up
                            </div>
                            <hr />
                            <div className="standard-text text-muted">
                              <div className="font-weight-bolder">
                                Username : {Username}
                              </div>
                              &nbsp;
                              <div className="font-weight-bolder ">
                                Client_ID : {Client_ID}
                              </div>
                              &nbsp;
                              <div className="font-weight-bolder">
                                Client_Secret : {Client_Secret}
                              </div>
                              &nbsp;
                              <div className="font-weight-bolder">
                                Release_Radar_code : {Release_Radar_code}
                              </div>
                            </div>
                            <hr />
                          </form>

                          <input
                            type="hidden"
                            name="Client_ID"
                            value={Client_ID}
                          />
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
                          <input
                            type="hidden"
                            name="Username"
                            value={Username}
                          />
                          <input
                            type="hidden"
                            name="Client_Secret"
                            value={Client_Secret}
                          />
                          <input type="hidden" name="signup" value={signup} />
                          <div className="default-container-flexbox">
                            <button
                              className="btn btn-secondary default-container-spacing shadow"
                              type="submit"
                            >
                              Sign up
                            </button>
                            <div className="">
                            <BackToLoginComponent />
                            </div>
                          </div>
                        </form>
                        
                      </div>
                    </>
                  ) : (
                    <button
                      className="btn btn-secondary default-container-spacing shadow"
                      onClick={refreshPage}
                    >
                      One of more fields are missing - go back to login
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Login;
