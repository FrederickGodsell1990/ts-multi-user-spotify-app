import request from "supertest";
import { app, server, port } from "../server";
import SpotifySignUpSchema from "../mongoDBModels/spotifySignUpSchema";

describe("/mongo_user_details endpoint tests", () => {
  const fredericoDataFromMongoDB = {
    id: "6525ba0febc0673d33303f74",
    Client_ID: "93df828bbcc848da91f1fcf931fd40a4",
    Redirect_URI: "http://localhost:3333/spotify_login_callback",
    Release_Radar_code: "37i9dQZEVXbpTERBYDw7WM",
    Username: "Frederico",
    Client_Secret: "772b452f59204c60818f4a089ae06fcc",
    __v: 0,
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("/mongo_user_details called with valid getClientID value successfully calls mongoDB", async () => {
    const findOneSpy = jest
      // <any, string> is needed here otherwise the TS file will error - solution found on stackoverflow
      .spyOn<any, string>(SpotifySignUpSchema, "findOne")
      .mockReturnValue(Promise.resolve(fredericoDataFromMongoDB));

    // weirdly, even though 'response' is greyed out, you still need it the test to make the call
    const response = await request(app)
      .post("/mongo_user_details")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send("getClientID=93df828bbcc848da91f1fcf931fd40a4");

    expect(findOneSpy).toHaveBeenCalledWith({
      Client_ID: "93df828bbcc848da91f1fcf931fd40a4",
    });
  });

  it("/mongo_user_details returns the correct res.send when given valid client ID - positive test", async () => {
    const expectedValue = "37i9dQZEVXbpTERBYDw7WM";

    // Call your route with supertest
    const response = await request(app)
      .post("/mongo_user_details")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send("getClientID=93df828bbcc848da91f1fcf931fd40a4");

    // Assert the response body
    expect(response.text).toEqual(expectedValue);
  });

  it("/mongo_user_details returns the correct res.send when given valid client ID, though different ID to previous test - positive test", async () => {
    const expectedValue = "37i9dQZEVXbftpojYxNDUm";

    // Call your route with supertest
    const response = await request(app)
      .post("/mongo_user_details")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send("getClientID=a3d31807124d40248f802fbbdaca4476");

    // Assert the response body
    expect(response.text).toEqual(expectedValue);
  });

  it("/mongo_user_details returns 'No account exists' when given invalid client ID - negative test", async () => {
    

    // Call your route with supertest
    const response = await request(app)
      .post("/mongo_user_details")
      .set("Content-Type", "application/x-www-form-urlencoded")
      // invalid ID here
      .send("getClientID=a3d31807124d40248f802fbbdaca4477");

    // Assert the response body
    console.log('response.tex', response.text)
    expect(response.text).toEqual('No account exists');
  });


});
