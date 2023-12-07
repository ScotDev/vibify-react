import { useState, useEffect } from "react";
import { refreshSpotifyToken } from "../utils/Spotify";
import { supabase } from "../supabase/client";

const oneHour = 3600 * 1000;
const oneYear = 31556926 * 1000;
const fifteenMinutes = 900 * 1000;

export default function useSpotifyAuth() {
  const [accessToken, setAccessToken] = useState(null);
  const handleSuccess = (token) => {
    console.log("Success");
    setAccessToken(token);
  };
  const handleError = (error) => {
    console.log(error);
    setAccessToken(null);
  };

  useEffect(() => {
    const authenticateWithSpotify = async () => {
      // 1. Check for access token in local storage
      const localAccessToken = sessionStorage.getItem(
        "vibify_spotify_access_token"
      );

      const localRefreshToken = localStorage.getItem(
        "vibify_spotify_refresh_token"
      );
      //   This is stored as an stringified object with the following properties:
      //   {
      //     accessToken: string,
      //   expiresIs: number
      // }
      // 2. If it exists, check it is still valid
      if (localAccessToken) {
        const { value, expires } = JSON.parse(localAccessToken);
        if (value && expires > Date.now()) {
          console.log("Access token retrieved from cache");
          // 3. If it's valid, set it as the access token
          handleSuccess(value);
        }
      } else {
        // 4. If it's not valid, check for a refresh token in local storage
        console.log("No usable access token found in cache");
        sessionStorage.removeItem("vibify_spotify_access_token");
        const { value, expires } = JSON.parse(localRefreshToken);

        if (value && expires > Date.now()) {
          // 5. If it exists AND is valid, use it to get a new access token
          console.log("Refresh token retrieved from cache");
          console.log("Using refresh token to get new access token");

          const newAccessToken = await refreshSpotifyToken(value);
          if (newAccessToken) {
            handleSuccess(newAccessToken);

            // sessionStorage.setItem(
            //   "vibify_spotify_access_token",
            //   JSON.stringify({
            //     value: newAccessToken,
            //     expires: Date.now() + fifteenMinutes,
            //   })
            // );
          } else {
            handleError("Error getting new access token Spotify");
          }

          //   refreshSpotifyToken(value)
          //     .then((data) => {
          //       if (data) {
          //         handleSuccess(data);

          //         // 6. If successful, store the new access token in local storage
          //         localStorage.setItem(
          //           "vibify_spotify_access_token",
          //           JSON.stringify({
          //             value: data,
          //             expires: Date.now() + oneHour,
          //           })
          //         );
          //       } else {
          //         throw new Error("Error getting new access token Spotify");
          //       }
          //     })
          //     .catch((error) => {
          //       handleError(error);
          //     });
        } else {
          // 7. If neither are usable, call supabase signout to clear the session then sign in again with
          //    spotify to get a new tokens
          console.log("No usable refresh token found in cache");
          localStorage.clear();
          sessionStorage.clear();
          //   await supabase.auth.signOut();
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "spotify",
            options: {
              scopes: [
                "user-read-email",
                "user-read-private",
                "user-top-read",
                "playlist-modify-public",
                "playlist-modify-private",
              ],
            },
          });
          if (error) {
            handleError(error);
          } else {
            console.log(data);
            handleSuccess(data.session.provider_token);

            // sessionStorage.setItem(
            //   "vibify_spotify_access_token",
            //   JSON.stringify({
            //     value: data.session.provider_token,
            //     expires: Date.now() + fifteenMinutes,
            //   })
            // );
            localStorage.setItem(
              "vibify_spotify_refresh_token",
              JSON.stringify({
                value: data.session.provider_refresh_token,
                expires: Date.now() + oneYear,
              })
            );
            //   7. Also handle settings/updating spotify user id
            localStorage.setItem(
              "vibify_spotify_user_id",
              JSON.stringify({
                value: data.session.user.identities[0].id,
                expires: Date.now() + oneYear,
              })
            );
          }
        }
      }
    };

    authenticateWithSpotify();
  }, []);

  return accessToken;
}
