import express, { Request, Response, Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import testDataSchema from "./mongoDBModels/testSchema";
import SpotifySignUpSchema from "./mongoDBModels/spotifySignUpSchema";
import querystring from "querystring";
import axios from "axios";
import { createProxyMiddleware } from "http-proxy-middleware";



export const app = express();


export const port = process.env.NODE_ENV === "test" ? getRandomPort() : 3333;

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
        res.redirect("http://localhost:3000/account_already_exists");
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

          res.redirect("http://localhost:3000/account_creation_successful");
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

export const logInRoute = app.post(
  "/log_in",
  async (req: Request, res: Response) => {


//     const reqBody = await req?.body;
// console.log('reqbdy in server ', reqBody)

    const { Client_ID, Username } = await req?.body;

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
        // redirect_uri: req.body?.Redirect_URI as string,
        redirect_uri: "http://localhost:3333/spotify_login_callback",
        state,
        scope,
      };

      const queryParamsString: string = querystring.stringify(queryParams);

      const authorizationUrl: string = `https://accounts.spotify.com/authorize?${queryParamsString}`;

      res.redirect(authorizationUrl);
    } else if (!userAcccountDetails) {
      res.redirect("http://localhost:3000/no_existing_account");
    }
  }
);

app.get("/spotify_login_callback", async (req: Request, res: Response) => {
  console.log("spotify_login_callback HIT UUPP");
  res.end();
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


 
