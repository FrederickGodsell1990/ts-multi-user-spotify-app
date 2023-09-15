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

  it("frontend_data_to_server POST mock test works", async () => {
    const mockedFrontEndPostData = { inputValue: "Another test" };

    const response = await request(app)
      .post("/frontend_data_to_server")
      .send(mockedFrontEndPostData)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
  });

  it("/frontend_data_to_server input text is not empty", async () => {
    const mockedData = { inputValue: "Another test" };

    const response = await request(app)
      .post("/frontend_data_to_server")
      .send(mockedData)
      .set("Accept", "application/json");

      expect(response.body).toBeTruthy()

  });
});
