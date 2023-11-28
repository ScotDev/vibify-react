import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import Code from "../components/Code";
import MediaItem from "../components/MediaItem";
import SignOutButton from "../components/SignOutButton";

import { getUserTopItems } from "../utils/Spotify";

export default function Profile() {
  const { profileData } = useLoaderData();

  const [userTopItems, setUserTopItems] = useState([]);

  // TODO: Add a loading state + move this to loader function?
  useEffect(() => {
    const fetchUserTopItems = async () => {
      const data = await getUserTopItems();
      setUserTopItems(data);
    };

    fetchUserTopItems();
  }, []);

  return (
    <div className="flex flex-col py-12 gap-6">
      <h1>Profile</h1>
      <div className="flex flex-col pt-6 gap-2 max-w-96 py-2">
        <p className="text-xs">Display name</p>
        <h3>{profileData.display_name}</h3>
      </div>
      <div className="flex flex-col gap-2 max-w-96 py-2">
        <p className="text-xs">Email address</p>
        <h4>{profileData.email}</h4>
      </div>

      <div className="flex flex-col gap-2 max-w-96 py-2">
        <p className="text-xs">Profile URL</p>
        <div className="flex gap-2">
          <Code href={profileData.external_urls.spotify}>
            {profileData.external_urls.spotify}
          </Code>
          {/* <ClipboardButton
            title="Copy"
            value={userData?.external_urls?.spotify}
          /> */}
        </div>
      </div>

      <div className="flex flex-col gap-2 max-w-96 py-2">
        <p className="text-xs">Subscription type</p>
        <p className="capitalize">{profileData.product}</p>
      </div>
      <div className="flex flex-col gap-2 max-w-96 py-2">
        <p className="text-xs">User country</p>
        <p className="capitalize">{profileData.country}</p>
      </div>

      <p className="text-xl">Top tracks last 4 weeks</p>

      <div className="md:flex md:flex-wrap grid grid-cols-2 gap-6 md:gap-16 mb-24">
        {userTopItems?.items?.map((item) => {
          return <MediaItem key={item.name} data={item} />;
        })}
      </div>
      <SignOutButton />
    </div>
  );
}
