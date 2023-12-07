import { useState, useEffect } from "react";
// import { useLoaderData } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import Code from "../components/Code";
import MediaItem from "../components/MediaItem";
import SignOutButton from "../components/SignOutButton";

import { getProfileData, getUserTopItems } from "../utils/Spotify";
import useSpotifyAuth from "../hooks/useSpotifyAuth";

export default function Profile() {
  const accessToken = useSpotifyAuth();

  // Potentially change to normally useEffect data fetching
  // in order to access useSpotifyAuth() hook
  // const { profileData } = useLoaderData();

  const [userTopItems, setUserTopItems] = useState([]);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  // TODO: Add a loading state + move this to loader function?
  useEffect(() => {
    if (!accessToken) return;
    const fetchUserTopItems = async () => {
      const data = await getUserTopItems(accessToken);
      setUserTopItems(data);
    };

    // console.log(accessToken);
    fetchUserTopItems();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    const fetchProfileData = async () => {
      const data = await getProfileData(accessToken);
      setUserData(data);
    };

    fetchProfileData();
  }, [accessToken]);

  return (
    <div className="flex flex-col content gap-6">
      <h1>Profile</h1>
      <div className="flex flex-col pt-6 gap-2 max-w-96 py-2">
        <p className="text-xs">Display name</p>
        {loading ? (
          <Skeleton className="w-full sm:w-52 h-5 mt-1 rounded-xl" />
        ) : (
          <h3>{userData.display_name}</h3>
        )}
      </div>
      <div className="flex flex-col gap-2 max-w-96 py-2">
        <p className="text-xs">Email address</p>
        {loading ? (
          <Skeleton className="w-full sm:w-52 h-5 mt-1 rounded-xl" />
        ) : (
          <h4>{userData.email}</h4>
        )}
      </div>

      <div className="flex flex-col gap-2 max-w-96 py-2">
        <p className="text-xs">Profile URL</p>
        <div className="flex gap-2">
          {loading ? (
            <Skeleton className="w-full sm:w-72 h-10 mt-1 rounded-xl" />
          ) : (
            <Code href={userData.external_urls?.spotify}>
              {userData.external_urls?.spotify}
            </Code>
          )}

          {/* <ClipboardButton
            title="Copy"
            value={userData?.external_urls?.spotify}
          /> */}
        </div>
      </div>

      <div className="flex flex-col gap-2 max-w-96 py-2">
        <p className="text-xs">Subscription type</p>
        {loading ? (
          <Skeleton className="w-24 h-5 mt-1 rounded-xl" />
        ) : (
          <p className="capitalize">{userData.product}</p>
        )}
      </div>
      <div className="flex flex-col gap-2 max-w-96 py-2">
        <p className="text-xs">User country</p>
        {loading ? (
          <Skeleton className="w-20 h-5 mt-1 rounded-xl" />
        ) : (
          <p className="capitalize">{userData.country}</p>
        )}
      </div>

      <p className="text-xl">Top tracks last 4 weeks</p>

      <div className="md:flex md:flex-wrap grid grid-cols-2 gap-6 md:gap-16">
        {loading
          ? Array(6)
              .fill()
              .map((_, index) => {
                return (
                  <div key={index} className="flex flex-col gap-4">
                    <Skeleton className="w-full aspect-square sm:w-52 max-h-52 rounded-xl" />
                    <Skeleton className="w-full sm:w-52 h-6 rounded-xl" />
                    <Skeleton className="w-full sm:w-52 h-6 rounded-xl" />
                    <Skeleton className="w-full sm:w-52 h-6 rounded-xl" />
                  </div>
                );
              })
          : userTopItems?.items?.map((item) => {
              return <MediaItem key={item.name} data={item} />;
            })}
      </div>
      <div className="pt-8 pb-4 sm:pt-16">
        <SignOutButton />
      </div>
    </div>
  );
}
