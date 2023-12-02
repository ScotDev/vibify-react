import { Outlet } from "react-router-dom";
import { getProfileData } from "../utils/Spotify";
// import useSpotifyAuth from "../hooks/useSpotifyAuth";
export async function loader() {
  // const accessToken = useSpotifyAuth();
  const profileData = await getProfileData();
  return { profileData };
}

export default function ProfileRoute() {
  return (
    <>
      <Outlet />
    </>
  );
}
