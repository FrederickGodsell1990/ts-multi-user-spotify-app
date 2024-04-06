import { NavBar } from "./navBar"
import "./styles.css";

export const AboutPage = () => {
  return (
    <>
    <NavBar />
    <div className="default-container-flexbox">
      <div
        className="default-container-flexbox"
        style={{ minHeight: "90vh", width: "70vh" }}
      >
        <div className="default-container-flexbox default-container-colour rounded ">
          <h4 className="subheading default-container-spacing"> About </h4>
          
          <div className="default-container-spacing text-muted standard-text text-justify">
            <p>
              The app was built around Spotify's Release Radar playlist feature.
              It is a unqiue playlist containing only new releases that updates
              every Thursday at midnight. Tracks on the playlist are curated
              specifically to your taste as informed by the artists you follow
              and listen to, as well other artists from the same genres you may
              not have heard of yet.
            </p>
            <p>
              The playlist's length stays an around 30-40 tracks, meaning that
              every time the playlist refreshes, the oldest tracks are removed
              to make space for the new ones to be added. This causes new
              releases to be overlooked, and potentially lost in the Spotify
              ether forever, before you have had an opportunity to listen to them.
            </p>

            <p>
              This app was created to solve this by capturing each new track and
              storing it in a dedicated playlist for the given month. They will
              appear in your Spotify account with the month and year contained
              in the title, for example 'Release Radar Capture playlist April
              2024'. It will capture only unqiue tracks, without adding the same
              track twice. Now you won't miss out on any of your favourite
              releases!
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
