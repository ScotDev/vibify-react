import { Outlet } from "react-router-dom";
import { getProfileData } from "../utils/Spotify";
// import Navbar from "../components/Navbar";

export async function loader() {
  const profileData = await getProfileData();
  return { profileData };
}

export default function ProfileRoute() {
  //   const { session } = useAuth();
  //   const { profileData } = useLoaderData();
  return (
    <>
      {/* <Navbar /> */}
      {/* <div className="min-w-screen min-h-screen absolute top-0 left-0 px-32 lg:px-48 sm:px-12"> */}
      {/* <div className="min-w-screen min-h-screen absolute top-0 left-0"> */}
      {/* <div className="container"> */}
      <Outlet />
      {/* </div> */}
      {/* </div> */}
    </>
  );
}
