import { Outlet } from "react-router-dom";
// import { getProfileData } from "../utils/Spotify";
// export async function loader() {
//   const profileData = await getProfileData();
//   return { profileData };
// }

// This componenent is a bit pointless now, keeping it for now
// In case I decide to go back to the react router loader pattern

export default function ProfileRoute() {
  return (
    <>
      <Outlet />
    </>
  );
}
