import express, { Request, Response, Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import testDataSchema from "./mongoDBModels/testSchema";
import spotifyLoginSchema from "./mongoDBModels/spotifyLoginSchema";
import SpotifySignUpSchema from "./mongoDBModels/spotifySignUpSchema";
import querystring from "querystring";
import axios from "axios";
import { createProxyMiddleware } from "http-proxy-middleware";

export const app = express();
export const port = 3333;

// bodyParser with extended : false needed to receive form data
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Headers", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin; consider limiting this to your actual frontend URL
  res.setHeader("Access-Control-Allow-Credentials", "true"); // If your frontend includes credentials in the request, set this to 'true'
  next();
});

app.use(cors());

// Sample route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express server with TypeScript!");
});

app.post("/frontend_data_to_server", async (req: Request, res: Response) => {
  console.log("req.body is;", req.body);

  const testDataSchemaOnBackEnd = new testDataSchema({
    testData: req.body?.testData,
  });

  try {
    const saveToBackEnd = await testDataSchemaOnBackEnd.save();

    res.send(saveToBackEnd);
  } catch (error) {
    console.log(error);
  }
});

app.post("/post_spotify_login_details", async (req: Request, res: Response) => {
  const generateRandomString = (length: number) => {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const state: string = generateRandomString(16);

  const scope: string =
    "user-read-private user-read-email user-follow-modify user-follow-read user-top-read playlist-modify-public playlist-modify-private";

  const stateKey: string = "spotify_auth_state";
  res.cookie(stateKey, state);

  const queryParams = {
    client_id: req.body?.Client_ID as string,
    response_type: "code",
    redirect_uri: req.body?.Redirect_URI as string,
    state,
    scope,
  };

  const queryParamsString: string = querystring.stringify(queryParams);

  const authorizationUrl: string = `https://accounts.spotify.com/authorize?${queryParamsString}`;

  console.log("authorizationUrl is", authorizationUrl);

  res.redirect(authorizationUrl);
});

app.post("/sign_up", async (req: Request, res: Response) => {

  const {Client_ID, Redirect_URI,Release_Radar_code } = await req.body;

  console.log('Client_ID is', Client_ID, 'Redirect_URI', Redirect_URI, 'Release_Radar_code', Release_Radar_code )

  try{
 const saveSpotifySignUpDetailToDatabase = new SpotifySignUpSchema({
  Client_ID: req.body?.Client_ID,
  Redirect_URI: req.body?.Redirect_URI,
  Release_Radar_code: req.body?.Release_Radar_code 
 })
 
 const postDetailsToDatabase = await saveSpotifySignUpDetailToDatabase.save()


  res.status(201).json({
    message: "Account created sucessfully",
    postDetailsToDatabase: postDetailsToDatabase,
  });
}
catch(error){
  console.log(error)
}



});

app.get("/spotify_login_callback", async (req: Request, res: Response) => {
  console.log("spotify_login_callback HIT UUPP");
  res.end();
});

mongoose
  .connect(
    "mongodb+srv://frederickgodsell:Fs6pIF2Evt64PUs1@multiuserspotifyapp.fxm38gv.mongodb.net/?retryWrites=true&w=majority",
    {}
  )
  .then((result) => {
    app.listen(port);
    console.log("Mongo listening");
    console.log(`Server is running on http://localhost:${port}`);
  })
  .catch((err) => console.log("err", err));
