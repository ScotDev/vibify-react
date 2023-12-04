import { PropTypes } from "prop-types";
import { getItem, removeAllItems, setItem } from "../utils/Storage";
import { Buffer } from "buffer";
import { supabase } from "../supabase/client";

// All functions here need to check token validity and request a new one if possible.

const oneHour = 3600 * 1000;
const oneYear = 31556926 * 1000;

const handleToken = async () => {
  const localAccessToken = localStorage.getItem("vibify_spotify_access_token");
  const localRefreshToken = localStorage.getItem(
    "vibify_spotify_refresh_token"
  );

  if (localAccessToken) {
    const { value, expires } = JSON.parse(localAccessToken);
    if (value && expires > Date.now()) {
      console.log("Access token retrieved from cache");
      return value;
    }
  } else {
    console.log("No access token found in cache");
    const { value, expires } = JSON.parse(localRefreshToken);
    if (value && expires > Date.now()) {
      // 5. If it exists AND is valid, use it to get a new access token
      console.log("Refresh token retrieved from cache");
      console.log("Using refresh token to get new access token");

      const newAccessToken = await refreshSpotifyToken(value);
      if (newAccessToken) {
        localStorage.setItem(
          "vibify_spotify_access_token",
          JSON.stringify({
            value: newAccessToken,
            expires: Date.now() + oneHour,
          })
        );
        return newAccessToken;
      } else {
        console.log("Error getting new access token Spotify");
        return null;
      }
    } else {
      console.log("No refresh token found in cache");
      removeAllItems();

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
        console.log(error);
        return null;
      } else {
        console.log(data);

        localStorage.setItem(
          "vibify_spotify_access_token",
          JSON.stringify({
            value: data.session.provider_token,
            expires: Date.now() + oneHour,
          })
        );
        localStorage.setItem(
          "vibify_spotify_refresh_token",
          JSON.stringify({
            value: data.session.provider_refresh_token,
            expires: Date.now() + oneYear,
          })
        );

        localStorage.setItem(
          "vibify_spotify_user_id",
          JSON.stringify({
            value: data.session.user.identities[0].id,
            expires: Date.now() + oneYear,
          })
        );
        return data.session.provider_token;
      }
    }
  }
};

const getProfileData = async (access_token) => {
  // const access_token = await handleToken();
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

const getUserTopItems = async (access_token) => {
  // TODO: Add error handling here
  // const access_token = await handleToken();
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
    "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=6",
    options
  );

  return await res.json();
};

const getGenres = async (access_token, searchTerm) => {
  // https://api.spotify.com/v1/recommendations/available-genre-seeds
  // Requires auth bearer header
  // returns {
  //   "genres": ["alternative", "samba"]
  // }
  // Sort genres A-Z + filter out by search term, returning max of 5

  // const access_token = await handleToken();

  const request = new Request(
    "https://api.spotify.com/v1/recommendations/available-genre-seeds",
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

  const genres = await fetch(request);

  const result = await genres.json();
  // console.log(result);
  // Filter results by search term
  const filteredResults = result.genres.filter((genre) =>
    genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // console.log(filteredResults);
  if (!result.genres) {
    return [];
  }
  // Return max of 5 results
  if (filteredResults.length > 5) {
    return filteredResults.slice(0, 5);
  }
  return filteredResults;
};

const getArtists = async (access_token, searchTerm) => {
  // https://api.spotify.com/v1/search?q=${searchTerm}&type=artist&limit=5&offset=0'
  // Requires auth bearer header

  // const access_token = await handleToken();
  // Return max of 5 results
  const request = new Request(
    `https://api.spotify.com/v1/search?q=${searchTerm}&type=artist&limit=5&offset=0`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

  const artists = await fetch(request);
  const result = await artists.json();
  if (!result.artists) {
    return [];
  }

  const uniqueArray = result.artists.items.reduce((acc, current) => {
    const x = acc.find((item) => item.name === current.name);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  // console.log(uniqueArray);

  return uniqueArray;
};

const getTracks = async (access_token, searchTerm) => {
  // 'https://api.spotify.com/v1/search?q=${searchTerm}&type=track&limit=5&offset=0'
  // Requires auth bearer header

  // const access_token = await handleToken();
  // Return max of 5 results
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
  return result.tracks.items;
};

const getRecommendations = async (params) => {
  // https://api.spotify.com/v1/recommendations
  const access_token = await handleToken();

  // Need to parse params and build out query string/
  // const queryString = params.map((param) => {
  //   const paramKey = Object.keys(param)[0];
  //   console.log(paramKey, param[paramKey]);
  //   const tempoAsNumber = parseInt(param["tempo"]);
  //   return `&min_tempo=${tempoAsNumber - 10}&max_tempo=${tempoAsNumber + 10}`;
  // });
  // if (!access_token) {
  //   return [];
  // }
  const queryString = await params
    .map((param) => {
      const paramKey = Object.keys(param)[0];
      // if (paramKey === "genres") {
      //   return encodeURIComponent(param[paramKey] = param[paramKey].split(","));
      // }
      if (paramKey === "tempo") {
        const tempoAsNumber = parseInt(param["tempo"]);
        return `min_tempo=${tempoAsNumber - 10}&max_tempo=${
          tempoAsNumber + 10
        }`;
      }
      const paramValue = encodeURIComponent(param[paramKey]);
      return `${paramKey}=${paramValue}`;
    })
    .join("&");

  // console.log(queryString);

  const request = new Request(
    `https://api.spotify.com/v1/recommendations?${queryString}`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );
  const tracks = await fetch(request);
  const result = await tracks.json();
  if (!result.tracks) {
    return [];
  }
  return result.tracks;
};

const createPlaylist = async (access_token, formData) => {
  // Need to get user ID - not currently stored but is available
  //  - can either be stored in local storage, a cookie or I could bring in
  //  zustand/jotai and take from state. Can also just pass into here as a param
  // POST https://api.spotify.com/v1/users/{user_id}/playlists
  //   {
  //     "name": "New Playlist",
  //     "description": "New playlist description",
  //     "public": false
  // }
  // Should return playlist ID or null if error

  // const access_token = await handleToken();

  const { name, description, isPublic } = formData;

  const user_id = getItem("spotify_user_id").value;
  console.log("User ID from local storage", user_id);
  const data = {
    name: name,
    description: description,
    public: isPublic,
  };

  const request = new Request(
    `https://api.spotify.com/v1/users/${user_id}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const playlist = await fetch(request);
  const result = await playlist.json();
  if (!result.id) {
    return null;
  }
  console.log(result.id);
  return result.id;
};
const addTracksToPlaylist = async (access_token, playlistId, trackUris) => {
  // https://api.spotify.com/v1/playlists/{playlist_id}/tracks
  // const access_token = await handleToken();
  const uris = await trackUris.map((track) => track.uri);
  console.log(uris);
  const data = {
    uris: [...uris],
  };

  const request = new Request(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const playlist = await fetch(request);
  const result = await playlist.json();

  if (!result.snapshot_id) {
    return null;
  }
  return result.snapshot_id;
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
  // console.log("New token", token.access_token);
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
  getRecommendations,
  createPlaylist,
  addTracksToPlaylist,
};
