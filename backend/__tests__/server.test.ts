import request from "supertest";
import { app, port } from "../server";
import http from "http";
import { MongoClient } from "mongodb";

describe("Express Server", () => {
  let connection: any;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(
      "mongodb+srv://frederickgodsell:Fs6pIF2Evt64PUs1@multiuserspotifyapp.fxm38gv.mongodb.net/?retryWrites=true&w=majority"
    );
    db = await connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('responds with "Hello, Express server with TypeScript!" when making a GET request to /', async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, Express server with TypeScript!");
  });


  it("/post_spotify_login_details mock is correct", async () => {
    const mockedData = {
      inputValue: {
        Client_ID: "aaa",
        Redirect_URI: "bbb",
        Release_Radar_code: "ccc",
      },
    };

    const response = await request(app)
      .post("/post_spotify_login_details")
      .send(mockedData)
      .set("Accept", "application/json");

    expect(response.status).toBe(302);

  });
});
