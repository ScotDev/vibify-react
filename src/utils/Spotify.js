import { PropTypes } from "prop-types";
import { getItem, setItem } from "../utils/Storage";
import { Buffer } from "buffer";

// All functions here need to check token validity and request a new one if possible.

const handleToken = async () => {
  try {
    const access_token = await getItem("spotify_access_token");

    // If valid access token found then return it for use in other functions
    if (access_token) {
      return access_token.value;
    }

    // If no valid access token found then check for refresh token
    const refresh_token = await getItem("spotify_refresh_token");
    if (refresh_token) {
      // If refresh token found then use to retrieve new access token
      const new_access_token = await refreshSpotifyToken(refresh_token.value);
      if (!new_access_token) {
        throw new Error("No new access token could be retrieved");
      }
      setItem("spotify_access_token", new_access_token, 3600);
      return new_access_token;
    }

    // Else return error
  } catch (error) {
    console.log(error);
  }
};

const getProfileData = async () => {
  const access_token = await handleToken();
  // TODO: Add error handling here
  const options = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  };

  const res = await fetch("https://api.spotify.com/v1/me", options);
  return await res.json();
};

const getUserTopItems = async () => {
  // TODO: Add error handling here
  const access_token = await handleToken();
  const options = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
    // next: {
    //   revalidate: 0,
    // },
    // time_range: "short_term",
  };

  const res = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5",
    options
  );

  return await res.json();
};

const refreshSpotifyToken = async (refresh_token) => {
  const authData = Buffer.from(
    import.meta.env.VITE_SPOTIFY_CLIENTID +
      ":" +
      import.meta.env.VITE_SPOTIFY_CLIENTSECRET
  ).toString("base64");

  const formData = {
    grant_type: "refresh_token",
    refresh_token: refresh_token,
  };

  const options = {
    method: "POST",
    headers: {
      Authorization: "Basic " + authData,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(formData),
    json: true,
  };

  const newAccessToken = await fetch(
    "https://accounts.spotify.com/api/token",
    options
  );

  const token = await newAccessToken.json();

  if (!token.access_token) {
    return null;
  }
  console.log(token.access_token);
  return token.access_token;
};

getProfileData.propTypes = {
  access_token: PropTypes.string.isRequired,
};
getUserTopItems.propTypes = {
  access_token: PropTypes.string.isRequired,
};
export { getProfileData, refreshSpotifyToken, getUserTopItems };
