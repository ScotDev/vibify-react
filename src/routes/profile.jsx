import { Outlet } from "react-router-dom";
import { getProfileData } from "../utils/Spotify";

export async function loader() {
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
