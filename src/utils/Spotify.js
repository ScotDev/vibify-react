import { PropTypes } from "prop-types";
import { getItem, setItem } from "../utils/Storage";
import { Buffer } from "buffer";

// All functions here need to check token validity and request a new one if possible.

const handleToken = async () => {
  try {
    const access_token = await getItem("spotify_access_token");

    // If valid access token found then return it for use in other functions
    // Check if access_token.expires is less than current time
    if (access_token) {
      console.log("Access token found", access_token.expires);
      if (access_token.expires < Date.now()) {
        console.log("Access token expired");
        // If access token expired then check for refresh token
        const refresh_token = await getItem("spotify_refresh_token");
        if (refresh_token) {
          // If refresh token found then use to retrieve new access token
          const new_access_token = await refreshSpotifyToken(
            refresh_token.value
          );
          if (!new_access_token) {
            console.log("No new access token could be retrieved");
          }
          console.log("New access token retrieved", new_access_token);
          setItem("spotify_access_token", new_access_token, 3600);
          return new_access_token;
        }
      }
      return access_token.value;
    }

    // // If no valid access token found then check for refresh token
    // const refresh_token = await getItem("spotify_refresh_token");
    // if (refresh_token) {
    //   // If refresh token found then use to retrieve new access token
    //   const new_access_token = await refreshSpotifyToken(refresh_token.value);
    //   if (!new_access_token) {
    //     console.log("No new access token could be retrieved");
    //   }
    //   console.log("New access token retrieved", new_access_token);
    //   setItem("spotify_access_token", new_access_token, 3600);
    //   return new_access_token;
    // }

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

// I need to fetch genres, artists and tracks from a search term.
// Returning each as they return from spotify.

const getGenres = async (searchTerm) => {
  // https://api.spotify.com/v1/recommendations/available-genre-seeds
  // Requires auth bearer header
  // returns {
  //   "genres": ["alternative", "samba"]
  // }
  // Sort genres A-Z + filter out by search term, returning max of 5

  const access_token = await handleToken();

  const request = new Request(
    "https://api.spotify.com/v1/recommendations/available-genre-seeds",
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

  const genres = await fetch(request);

  const result = await genres.json();
  console.log(result);
  // Filter results by search term
  const filteredResults = result.genres.filter((genre) =>
    genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(filteredResults);
  if (!result.genres) {
    return [];
  }
  // Return max of 5 results
  if (filteredResults.length > 5) {
    return filteredResults.slice(0, 5);
  }
  return filteredResults;
};

const getArtists = async (searchTerm) => {
  // https://api.spotify.com/v1/search?q=${searchTerm}&type=artist&limit=5&offset=0'
  // Requires auth bearer header

  const access_token = await handleToken();

  const request = new Request(
    `https://api.spotify.com/v1/search?q=${searchTerm}&type=artist&limit=5&offset=0`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

  const artists = await fetch(request);
  const result = await artists.json();
  if (!result.artists) {
    return [];
  }
  // Return max of 5 results
  if (result.artists.items.length > 5) {
    return result.artists.items.slice(0, 5);
  }
  return result.artists.items;
};

const getTracks = async (searchTerm) => {
  // 'https://api.spotify.com/v1/search?q=${searchTerm}&type=track&limit=5&offset=0'
  // Requires auth bearer header

  const access_token = await handleToken();

  const request = new Request(
    `https://api.spotify.com/v1/search?q=${searchTerm}&type=track&limit=5&offset=0`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

  const tracks = await fetch(request);
  const result = await tracks.json();
  console.log(result);
  if (!result.tracks) {
    return [];
  }
  if (result.tracks.items.length > 5) {
    return result.tracks.items.slice(0, 5);
  }
  return result.tracks.items;
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
    console.log("No new access token could be retrieved");
    return null;
  }
  console.log("New token", token.access_token);
  return token.access_token;
};

getProfileData.propTypes = {
  access_token: PropTypes.string.isRequired,
};
getGenres.propTypes = {
  searchTerm: PropTypes.string.isRequired,
};
getUserTopItems.propTypes = {
  access_token: PropTypes.string.isRequired,
};
export {
  getProfileData,
  refreshSpotifyToken,
  getUserTopItems,
  getGenres,
  getArtists,
  getTracks,
};
