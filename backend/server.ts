import "dotenv/config.js";

import express, { Request, Response, Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import testDataSchema from "./mongoDBModels/testSchema";
import SpotifySignUpSchema from "./mongoDBModels/spotifySignUpSchema";
import ReleaseRadarModel from "./mongoDBModels/releaseRadarSchema";
import querystring from "querystring";
import axios, { AxiosResponse } from "axios";
import { createProxyMiddleware } from "http-proxy-middleware";
const path = require("path");

const FRONTEND_URI = process.env.FRONTEND_URI;
const REDIRECT_URI = process.env.REDIRECT_URI;

export const app = express();

export const port =
  process.env.NODE_ENV === "test" ? getRandomPort() : process.env.PORT || 3333;

function getRandomPort() {
  return Math.floor(Math.random() * (5000 - 3000) + 3000);
}

// bodyParser with extended : false needed to receive form data
app.use(bodyParser.urlencoded({ extended: true }));

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

console.log('body',Client_ID,
  Redirect_URI,
  Release_Radar_code,
  Username,
  signup,
  Client_Secret)

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
      // res.send("Usernames do not match");
      res.redirect(`${FRONTEND_URI}/wrong_username`);
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

// endpoint to send release radar code tom client
app.post("/mongo_user_details", async (req, res) => {
  const { getClientID } = req?.body;

  const userAcccountDetails = await SpotifySignUpSchema.findOne({
    Client_ID: getClientID,
  });

  if (userAcccountDetails && userAcccountDetails.Release_Radar_code) {
    res.send(userAcccountDetails.Release_Radar_code);
  } else if (!userAcccountDetails) {
    res.send("No account exists");
  }
});

// _id
// 6525b4f33809eecf17acc425
// Client_ID
// "a3d31807124d40248f802fbbdaca4476"
// Redirect_URI
// "http://localhost:3333/spotify_login_callback"
// Release_Radar_code
// "37i9dQZEVXbftpojYxNDUm"
// Username
// "Ellen"
// Client_Secret
// "8ca53ce8351b434ab79b2a9a26e6212f"
// __v
// 0

// _id
// 6525ba0febc0673d33303f74
// Client_ID
// "93df828bbcc848da91f1fcf931fd40a4"
// Redirect_URI
// "http://localhost:3333/spotify_login_callback"
// Release_Radar_code
// "37i9dQZEVXbpTERBYDw7WM"
// Username
// "Frederico"
// Client_Secret
// "772b452f59204c60818f4a089ae06fcc"
// __v
// 0

// interface to determine type for object parameter of postReleaseRadarTracksToMongo function below
interface KeyValueObject {
  [key: string]: string;
}

export const postReleaseRadarTracksToMongo = async (
  objectFromFrontEnd: KeyValueObject[],
  ID: any
) => {
  // blank array to eventually return
  const arrayOfUniqueTracks: any[] = [];

  const lengthOfArray = objectFromFrontEnd.length;

  // for...of used in favour of map as the former waits iteration to complete before moving to the next one, it maintains the order of elements
  for (const [index, trackObject] of objectFromFrontEnd.entries()) {
    const trackSpotifyIDPresent = await SpotifySignUpSchema.find({
      $and: [
        { Client_ID: ID },
        {
          releaseRadarData: {
            $elemMatch: { trackSpotifyID: trackObject.trackSpotifyID },
          },
        },
      ],
    });

    // condition for every iteration other than the last
    if (index <= lengthOfArray - 2) {
      // if track is not present on database, push it to the arrayOfUniqueTracks array
      if (trackSpotifyIDPresent.length === 0) {
        arrayOfUniqueTracks.push(trackObject);
      }
    }
    // condition for the last item of the array
    if (index === lengthOfArray - 1) {
      // if track is not present on database, push it to the arrayOfUniqueTracks array
      if (trackSpotifyIDPresent.length === 0) {
        arrayOfUniqueTracks.push(trackObject);
      }
    }
  }

  return arrayOfUniqueTracks;
};

// route to receive list of tracks from release radar, cross reference when agaoinst the list of tracks user already has + return only unique tracks
app.post("/post_release_radar_tracks", async (req, res) => {
  const releaseRadarTracksInObjectForm = await req.body;

  const { objectFromFrontEnd, ID } = releaseRadarTracksInObjectForm;

  // variable that calls function that checks each track against the existing tracks on the user's database record
  const arrayOfUniqueTracks = await postReleaseRadarTracksToMongo(
    objectFromFrontEnd,
    ID
  );

  try {
    // mongo query checks client ID + updates that record with array of tracks not yet present in it
    const updateMongo = await SpotifySignUpSchema.findOneAndUpdate(
      { Client_ID: releaseRadarTracksInObjectForm.ID }, // Query to find the document by its ID
      {
        $push: {
          releaseRadarData: arrayOfUniqueTracks,
        },
      }, // Push the new data to the releaseRadarData array
      { new: true } // Option to return the updated document
    );

    // return array of tracks added to mongo. If empty, array will be empty
    res.status(201).json({
      message:
        "post_release_radar_tracks hit and mongo updated with new tracks",
      arrayOfUniqueTracks,
    });
  } catch (error) {
    console.log(error);
  }
});

// app.post("/test_paylists_to_database", async (req, res) => {
//   const { playlistData, ID } = await req.body;

//   console.log("playlistData", playlistData, "ID", ID);

//   try {
//     const updateMongo = await SpotifySignUpSchema.findOneAndUpdate(
//       { Client_ID: ID }, // Query to find the document by its ID
//       {
//         $push: {
//           playlistData: playlistData,
//         },
//       }, // Push the new data to the releaseRadarData array
//       { new: true } // Option to return the updated document
//     );
//   } catch (error) {
//     console.log(error)
//   }
// });

// gets all app-generated playlists from database - returns either full list or empty array
app.post("/get_playlists_from_database", async (req, res) => {
  const { ID } = req.body;

  try {
    const fullArrayOfPlaylistsFromMongo = await SpotifySignUpSchema.findOne({
      Client_ID: ID,
    }).select("playlistData");

    res.status(201).json({
      message: "/get_playlists_from_database hit",
      fullArrayOfPlaylistsFromMongo,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/post_new_playlist_to_database", async (req, res) => {
 console.log('post_new_playlist_to_database', req.body)

 const {playlistData, clientID} = req.body;

 try {
  const updateMongo = await SpotifySignUpSchema.findOneAndUpdate(
    { Client_ID: clientID }, // Query to find the document by its ID
    {
      $push: {
        playlistData: playlistData,
      },
    }, // Push the new data to the playlistData array
    { new: true } // Option to return the updated document
  );
  res.status(201).json({
    message: "/post_new_playlist_to_database hit",
    updateMongo,
  });

} catch (error) {
  console.log(error)
}

})

app.use(express.static(path.resolve(__dirname, "../../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../frontend/build", "index.html"));
});

export const server = mongoose
  .connect(
    "mongodb+srv://frederickgodsell:6Ff0k0G9Vp8t42aJ@typescriptspotifyappsum.n41pcye.mongodb.net/?retryWrites=true&w=majority&appName=TypeScriptSpotifyAppSummer2024",
    {}
  )
  .then((result) => {
    app.listen(port);
    console.log("Mongo listening");
    console.log(`Server is running on http://localhost:${port}`);
  })
  .catch((err) => console.log("err", err));

mongoose;
