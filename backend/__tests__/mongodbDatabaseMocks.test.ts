import request from "supertest";
import { app, server, port } from "../server";
import SpotifySignUpSchema from "../mongoDBModels/spotifySignUpSchema";



const expectedData = {
  _id: "MockIDEllen",
  Client_ID: "a3d31807124d40248f802fbbdaca4476",
  Redirect_URI: "http://localhost:3333/spotify_login_callback",
  Release_Radar_code: "37i9dQZEVXbftpojYxNDUm",
  // Username: "Ellen",
  Username: "Smellen",
  Client_Secret: "8ca53ce8351b434ab79b2a9a26e6212f",
  __v: 0,
};

describe("Express Server", () => {
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("logInRoute Tests", () => {
    it("correct details redirect to spotify authorisation URL", async () => {
      jest
        .spyOn<any, string>(SpotifySignUpSchema, "findOne")
        .mockReturnValue(Promise.resolve(expectedData));

      const response = await request(app)
        .post("/log_in")
        .set("Content-Type", "application/x-www-form-urlencoded")
        // .send("Client_ID=a3d31807124d40248f802fbbdaca4476&Username=Ellen")
        .send("Client_ID=a3d31807124d40248f802fbbdaca4476&Username=Smellen");

    
      expect(response.header.location).toMatch(
        /https:\/\/accounts\.spotify\.com\/authorize\?.*state=.+&scope=.+/
      );
    });

    it("existing Client ID but incorrect username returns `Usernames do not match` ", async () => {
      const response = await request(app)
        .post("/log_in")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send("Client_ID=a3d31807124d40248f802fbbdaca4476&Username=Smellen");

      expect(response.text).toBe("Usernames do not match");
    });

    it("Client_ID does not match any in the database redirects to no_existing_account", async () => {
      const response = await request(app)
        .post("/log_in")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send("Client_ID=b4d31807124d40248f802fbbdaca4476&Username=Ellen");

      expect(response.header.location).toMatch(
        "http://localhost:3000/no_existing_account"
      );
    });

    it("Using CLient ID and username that exist in the production database but not in the mocked data", async () => {
      const findOneSpy = jest
        // <any, string> is needed here otherwise the TS file will error - solution found on stackoverflow
        .spyOn<any, string>(SpotifySignUpSchema, "findOne")
        .mockReturnValue(Promise.resolve(expectedData));

      console.log("findOneSpy is", findOneSpy);

      // weirdly, even though 'response' is greyed out, you still need it the test to make the call
      const response = await request(app)
        .post("/log_in")
        .set("Content-Type", "application/x-www-form-urlencoded")
        .send("Client_ID=93df828bbcc848da91f1fcf931fd40a4&Username=Frederico");

      expect(findOneSpy).toHaveBeenCalledWith({
        Client_ID: "93df828bbcc848da91f1fcf931fd40a4",
      });
    });
  });
});
