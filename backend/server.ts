import "dotenv/config.js";

import express, { Request, Response, Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import testDataSchema from "./mongoDBModels/testSchema";
import SpotifySignUpSchema from "./mongoDBModels/spotifySignUpSchema";
import querystring from "querystring";
import axios, { AxiosResponse } from "axios";
import { createProxyMiddleware } from "http-proxy-middleware";

const FRONTEND_URI = process.env.FRONTEND_URI;
const REDIRECT_URI = process.env.REDIRECT_URI;

export const app = express();

export const port =
  process.env.NODE_ENV === "test" ? getRandomPort() : process.env.PORT || 3333;
// export const port = process.env.NODE_ENV === "test" ? getRandomPort() : 3333;



import * as path from 'path';






function getRandomPort() {
  return Math.floor(Math.random() * (5000 - 3000) + 3000);
}

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
// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello, Express server with TypeScript!");
// });

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

app.post("/sign_up", async (req: Request, res: Response) => {
  const {
    Client_ID,
    Redirect_URI,
    Release_Radar_code,
    Username,
    signup,
    Client_Secret,
  } = await req.body;
  // indicates that the post request is a first time sign up

  if (
    Username &&
    Client_ID &&
    Redirect_URI &&
    Release_Radar_code &&
    signup &&
    Client_Secret
  ) {
    (async function checkForDuplicateAccount() {
      const checkForExistingAccounts = await SpotifySignUpSchema.findOne({
        Client_ID: Client_ID,
      });

      if (checkForExistingAccounts) {
        res.redirect(`${FRONTEND_URI}/account_already_exists`);
        // // below works locally
        // res.redirect("http://localhost:3000/account_already_exists");
      } else if (!checkForExistingAccounts) {
        try {
          const saveSpotifySignUpDetailToDatabase = new SpotifySignUpSchema({
            Client_ID: req.body?.Client_ID,
            Redirect_URI: req.body?.Redirect_URI,
            Release_Radar_code: req.body?.Release_Radar_code,
            Username: req.body?.Username,
            Client_Secret: req.body?.Client_Secret,
          });

          const postDetailsToDatabase =
            await saveSpotifySignUpDetailToDatabase.save();

          postDetailsToDatabase;

          res.redirect(`${FRONTEND_URI}/account_creation_successful`);
          // // below works locally
          // res.redirect("http://localhost:3000/account_creation_successful");
        } catch (error) {
          console.log(error);
        }
      }
    })();
  } else {
    // Handle the case where one of the required variables is missing
    res.status(400).send("One or more required fields are missing");
  }
});

// client ID global here to be accessed by other route handlers
export let GlobalClientID: String;

export const logInRoute = app.post(
  "/log_in",
  async (req: Request, res: Response) => {
    const { Client_ID, Username } = await req?.body;

    // assigning GlobalClientID an actual value here. It will only be changed if a different person signs in
    GlobalClientID = Client_ID;

    const userAcccountDetails = await SpotifySignUpSchema.findOne({
      Client_ID: Client_ID,
    });

    if (userAcccountDetails && userAcccountDetails.Username !== Username) {
      res.send("Usernames do not match");
    } else if (
      userAcccountDetails &&
      userAcccountDetails.Username === Username
    ) {
      //// to next 4 slashes it copied from /post_spotify_login_details

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

      // REMEBER TO CHANGE THE REDIRECT URI WHEN YOU PUSH TO PRODUCTION
      const queryParams = {
        client_id: Client_ID as string,
        response_type: "code",
        redirect_uri: REDIRECT_URI,
        state,
        scope,
      };

      const queryParamsString: string = querystring.stringify(queryParams);

      const authorizationUrl: string = `https://accounts.spotify.com/authorize?${queryParamsString}`;

      res.redirect(authorizationUrl);
    } else if (!userAcccountDetails) {
      res.redirect(`${FRONTEND_URI}/no_existing_account`);
      // // below works locally
      // res.redirect("http://localhost:3000/no_existing_account");
    }
  }
);

// function to authorise Spotify seperate for testing
export const spotifyAuthAxiosPostRequst = async (
  Client_ID: string,
  Client_Secret: string,
  Redirect_URI: string,
  code: string
) => {
  const authVariable: string = `Basic ${Buffer.from(
    `${Client_ID}:${Client_Secret}`
  ).toString("base64")}`;

  try {
    const responseWhole = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: authVariable,
      },
    });

    // returning the entire response to be destructured upon return
    return responseWhole;
  } catch (error) {
    console.log(error);
  }
};

app.get("/spotify_login_callback", async (req: Request, res: Response) => {
  let userAccountDetails = await SpotifySignUpSchema.findOne({
    Client_ID: GlobalClientID,
  });

  if (userAccountDetails) {
    // Destructure the properties using the SpotifySignUpDocument type
    const {
      Redirect_URI,
      Client_ID,
      Release_Radar_code,
      Username,
      Client_Secret,
    } = userAccountDetails;

    const code = (req.query.code as string) || "";

    // calling the function to return access token here
    const responseFromAxiosSpotifyAtuhorisation:
      | AxiosResponse<any>
      | undefined = await spotifyAuthAxiosPostRequst(
      Client_ID,
      Client_Secret,
      Redirect_URI,
      code
    );

    if (responseFromAxiosSpotifyAtuhorisation) {
      const { access_token, token_type, refresh_token, expires_in } =
        await responseFromAxiosSpotifyAtuhorisation?.data;

      const queryParams = querystring.stringify({
        access_token,
        refresh_token,
        expires_in,
        Client_ID,
      });

      // add on heroku deploy

      res.redirect(`${FRONTEND_URI}?${queryParams}`);
      // // below works locally
      // res.redirect(`http://localhost:3000/?${queryParams}`);
    } else {
      res.redirect(`/?${querystring.stringify({ error: "invalid_token" })}`);
    }
  }
});

app.get("/refresh_token", async (req, res) => {
  // spotify blocks app in 'developer mode' from connecting to different user dashboard from the same app
  // it gives the error - "User not registered in the Developer Dashboard" - why it does this, and the solution,
  // is explained in the link below. They do not allow hobby projects the extension
  // https://community.spotify.com/t5/Spotify-for-Developers/User-not-registered-in-the-Developer-Dashboard-on-get-profile/td-p/5260021

  const { refresh_token, client_id } = req.query as {
    refresh_token: string;
    client_id: string;
  };

  const userAcccountDetails = await SpotifySignUpSchema.findOne({
    Client_ID: client_id,
  });

  if (userAcccountDetails && userAcccountDetails.Client_Secret) {
    axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${client_id}:${userAcccountDetails.Client_Secret}`
        ).toString("base64")}`,
      },
    })
      .then((response) => {
        res.send(response.data);
      })
      .catch((error) => {
        res.send(error);
      });
  }
});

app.use(express.static(path.resolve(__dirname, '../../../frontend/build')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
});



export const server = mongoose
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

mongoose;
