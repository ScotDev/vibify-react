import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function RootRoute() {
  return (
    <>
      <Navbar />
      {/* <div className="bg-red-200  "> */}
      <main id="detail" className="container">
        <Outlet />
      </main>
      {/* <div className="flex justify-between items-center">
          <div className="pt-24 pb-6 flex gap-2 items-center">
            <p className="text-xs">Made with data from</p>
            Spotify
          </div>
          <p className="text-xs text-neutral-400 pl-4">Beta build</p>
        </div> */}
      {/* </div> */}
    </>
  );
}
