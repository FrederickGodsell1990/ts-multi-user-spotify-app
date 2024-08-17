import React from "react";
import { accessToken } from "../accessTokenManagement.js";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import {
  RenderTrackFunction,
  TrackRenderMoreInfo,
  addTracksToSpotifyPlaylist,
} from "../components/RenderTracksAndAddToPlaylist";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

describe("RenderTrackFunction Component", () => {
  test("renders an iframe with the correct attributes", () => {
    const mockTrackObject = {
      trackSpotifyID: "mockSpotifyID123",
    };

    const mockProps = {
      trackObject: mockTrackObject,
      index: 1,
    };

    render(<RenderTrackFunction {...mockProps} />);

    const iframeElement = screen.getByTitle("mockSpotifyID123");
    expect(iframeElement).toBeInTheDocument();
    expect(iframeElement).toHaveAttribute(
      "src",
      "https://open.spotify.com/embed/track/mockSpotifyID123?utm_source=generator"
    );
    expect(iframeElement).toHaveAttribute("width", "52%");
    expect(iframeElement).toHaveAttribute("height", "200");
    expect(iframeElement).toHaveAttribute("frameBorder", "0");
    expect(iframeElement).toHaveAttribute("allowFullScreen");
    expect(iframeElement).toHaveAttribute(
      "allow",
      "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    );
    expect(iframeElement).toHaveAttribute("loading", "lazy");
  });
});

describe("TrackRenderMoreInfo component", () => {
  const mockProps = {
    trackID: "mockTrackID",
    album: "mockAlbum",
    albumReleaseDate: "mockAlbumReleaseDate",
  };
  const renderTrackRenderMoreInfo = () =>
    render(<TrackRenderMoreInfo {...mockProps} />);

  test("More info button renders", () => {
    renderTrackRenderMoreInfo();

    const moreInfoButton = screen.getByText("More info");

    expect(moreInfoButton).toBeInTheDocument();
  });

  test("More info component renders with mock data when button clicked", () => {
    const { getByText } = renderTrackRenderMoreInfo();

    const button = getByText("More info");

    fireEvent.click(button);

    const moreInfoComponentTrackID = screen.getByText("Track ID : mockTrackID");
    const moreInfoComponentAlbumReleaseDate = screen.getByText(
      "Album release date : mockAlbumReleaseDate"
    );
    const moreInfoComponentmockAlbum = screen.getByText("Album : mockAlbum");

    expect(moreInfoComponentTrackID).toBeInTheDocument();
    expect(moreInfoComponentmockAlbum).toBeInTheDocument();
    expect(moreInfoComponentAlbumReleaseDate).toBeInTheDocument();

    const closeButton = screen.getByText("Close");

    expect(closeButton).toBeInTheDocument();
  });

  test("More info component stops showing rendered info when state changes back to false, and vice versa", () => {
    const { getByText, queryByText } = renderTrackRenderMoreInfo();

    const moreInfoButton = getByText("More info");

    expect(moreInfoButton).toBeInTheDocument();

    fireEvent.click(moreInfoButton);

    const closeButton = getByText("Close");

    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);

    expect(closeButton).not.toBeInTheDocument();
    expect(queryByText("Track ID : mockTrackID")).not.toBeInTheDocument();
    expect(queryByText("Album : mockAlbum")).not.toBeInTheDocument();
    expect(
      queryByText("Album release date : mockAlbumReleaseDate")
    ).not.toBeInTheDocument();
  });

  //   test('Renders with empty string with empty string as props', ()=> {

  // const emptyProps = {
  //   trackID : ' ',
  //   album : ' ',
  //   albumReleaseDate : ' ',
  // }
  //    const {getByText, queryByText} = render(<TrackRenderMoreInfo{...emptyProps}/>);

  // const trackIDEmpty = screen.queryByText("Track ID : ");

  //    expect(trackIDEmpty).toBeInTheDocument();

  //   })
});

describe("addTracksToSpotifyPlaylist function tests", () => {

  test("addTracksToSpotifyPlaylist function works as expected", async () => {
    const playlistID = "abcMock";

    const renderList = [
      {
        album: "Way Of The Dragon",
        albumImage:
          "https://i.scdn.co/image/ab67616d0000b2734d1399e3eb4f49b6e1014043",
        albumReleaseDate: "2024-06-09",
        artist: "DJ Flipcyide,Chris Rivers",
        dateAdded: "2024-06-13T23:00:00Z",
        trackName: "Way Of The Dragon",
        trackSpotifyID: "0bAbsP54RLONV9aTw75zMk",
      },
    ];

    // declare instance of axios-mock-adapter
    var mock = new MockAdapter(axios);

    mock
      .onPost(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`)
      .reply(200, {
        snapshot_id: "AAAAAthWg+iJ7zzTbfuTYUQOEuiISzgK", // return value when above URL is hit
      });

    await addTracksToSpotifyPlaylist(playlistID, renderList);

    // accesses history of requests made by the test - 0 being first one, then so on. it's on onject so can aceess
    //headers, url etc
    const requestData = mock.history.post[0];

    expect(JSON.parse(requestData.data).uris).toEqual([
      "spotify:track:0bAbsP54RLONV9aTw75zMk",
    ]);

  });
});
