import request from "supertest";
import { app, server, port } from "../server";
import SpotifySignUpSchema from "../mongoDBModels/spotifySignUpSchema";



const mockedUserData = {
  id: "6533c98d0e12fb0e3ec616ff",
  Client_ID: "test",
  Redirect_URI: "test",
  Release_Radar_code: "test",
  Username: "test",
  Client_Secret: "test",
  __v: 0,
};


// this all works now - leave as is
describe("Express Server", () => {
  beforeAll( () => {
    
    jest.spyOn(SpotifySignUpSchema.prototype, "save").mockImplementation(() => {
      return Promise.resolve(mockedUserData);
      
    });
  });

  it("sign_up redirects to account_creation_successful if no existing records have the same client ID and all fields are present", async () => {
    const response = await request(app)
      .post("/sign_up")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send(
        "Username=test&Client_ID=test&Client_Secret=test&Redirect_URI=test&Release_Radar_code=test&signup=signup"
      );

    expect(response.header.location).toMatch(
      "http://localhost:3000/account_creation_successful"
    );
  });

  it("sign_up redirects to account_already_exists if Client_ID matches one in database ", async () => {
    const response = await request(app)
      .post("/sign_up")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send(
        "Client_ID=93df828bbcc848da91f1fcf931fd40a4&Redirect_URI=http://localhost:3333/spotify_login_callback&Release_Radar_code=37i9dQZEVXbpTERBYDw7WM&Username=Frederico&Client_Secret=772b452f59204c60818f4a089ae06fcc&signup=signup"
      );

    expect(response.header.location).toMatch(
      "http://localhost:3000/account_already_exists"
    );
  });

  it("sign_up returns One or more required fields are missing if any fields are missing", async () => {
    const response = await request(app)
      .post("/sign_up")
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send(
        "Redirect_URI=http://localhost:3333/spotify_login_callback&Release_Radar_code=37i9dQZEVXbpTERBYDw7WM&Username=Frederico&Client_Secret=772b452f59204c60818f4a089ae06fcc&signup=signup"
      );

      expect(response.text).toBe("One or more required fields are missing")
      
    
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
