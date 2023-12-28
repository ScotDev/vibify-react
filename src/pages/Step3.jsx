import { useState, useEffect } from "react";

import { useLoaderData, Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

import { msToMinSec } from "../utils/Calc";
import { SaveDialog } from "../components/SaveDialog";

import { useItems } from "../state/store";

import { getRecommendations } from "../utils/Spotify";

import useSpotifyAuth from "../hooks/useSpotifyAuth";

export default function Step3() {
  // Hooks
  const accessToken = useSpotifyAuth();

  // Local state
  const [loading, setLoading] = useState(true);
  const [extendedLoading, setExtendedLoading] = useState(false);
  // const { recommendationsData } = useLoaderData();
  const [recommendationsData, setRecommendationsData] = useState([]);
  const [maxedRecommendations, setMaxedRecommendations] = useState(false);

  // Global state store
  const items = useItems();

  useEffect(() => {
    if (!accessToken) return;
    const fetchRecommendations = async () => {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      const fnParamsArr = [];
      params.forEach((value, key) => {
        fnParamsArr.push({ [key]: value });
      });
      const data = await getRecommendations(accessToken, fnParamsArr);

      const filteredTracks = items.filter(
        (track) => track.id !== data.id && track.type === "track"
      );

      const mergedData = [...filteredTracks, ...data];
      const difference = filteredTracks.length;
      // Remove the last n items from the array so the total number of tracks matches what the user selected
      if (difference > 0) {
        mergedData.splice(-difference);
      }

      setRecommendationsData(mergedData);
    };
    fetchRecommendations();
    // setLoading(false);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [accessToken]);

  const totalDuration = recommendationsData?.reduce(
    (a, b) => a + b.duration_ms,
    0
  );

  const handleLoadMore = async () => {
    setExtendedLoading(true);

    // Fetch more recommendations and add them to the mergedData array
    // Also check for duplicates

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const fnParamsArr = [];
    params.forEach((value, key) => {
      if (key === "limit") {
        fnParamsArr.push({ [key]: 10 });
      }
      fnParamsArr.push({ [key]: value });
    });

    // console.log("fnParams", fnParamsArr);
    const data = await getRecommendations(accessToken, fnParamsArr);

    // Need to filter out duplicates

    const filteredTracks = data.filter(
      (track) => !recommendationsData.some((rec) => rec.id === track.id)
    );
    console.log("filteredTracks", filteredTracks);

    // Need to find a way to communicate to the user that there are no more recommendations
    if (filteredTracks.length === 0) {
      setMaxedRecommendations(true);
      return setExtendedLoading(false);
    }

    setRecommendationsData([...recommendationsData, ...filteredTracks]);

    setTimeout(() => {
      setExtendedLoading(false);
    }, 1000);
  };

  return (
    <>
      <div className="flex flex-col gap-12 content">
        <h1>Your recommendations</h1>
        <div className="flex flex-col gap-8 ">
          <div className="flex gap-12 text-center">
            <div className="flex flex-col gap-2 items-center">
              <p className="font-medium">Total duration</p>
              {loading ? (
                <Skeleton className="h-4 w-20 rounded-xl" />
              ) : (
                <span>{msToMinSec(totalDuration)}</span>
              )}
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="font-medium">Average BPM</p>
              {loading ? (
                <Skeleton className="h-4 w-20 rounded-xl" />
              ) : (
                <span>---</span>
              )}
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className="font-medium">Total tracks</p>
              {loading ? (
                <Skeleton className="h-4 w-20 rounded-xl" />
              ) : (
                <span>{recommendationsData.length}</span>
              )}
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-10 w-16 rounded-xl" />
          ) : (
            <SaveDialog tracks={recommendationsData} />
          )}
        </div>

        <div className="flex flex-col gap-6 overflow-x-hidden">
          {recommendationsData.length === 0 && !loading && (
            <div className="flex flex-col gap-6">
              <h2 className="text-center text-lg">No recommendations found</h2>
              <p className="text-center italic text-sm">
                Try changing some knobs and dials
              </p>
              <Link
                to="/step-2?preset=custom"
                className="text-center underline"
              >
                Go back to previous step
              </Link>
            </div>
          )}

          {loading &&
            Array(recommendationsData.length)
              .fill()
              .map((_, index) => {
                return (
                  <div key={index} className="flex gap-8 w-full">
                    <Skeleton className="w-20 h-20 rounded-xl" />
                    <div className="flex flex-col justify-between gap-2">
                      <Skeleton className="w-full h-6 rounded-xl" />
                      <Skeleton className="w-52 h-4 rounded-xl" />
                      <Skeleton className="w-52 h-4 rounded-xl" />{" "}
                    </div>
                  </div>
                );
              })}
          {!loading &&
            recommendationsData.map((recommendation) => (
              <div
                key={recommendation.id}
                className="flex gap-6 w-full truncate"
              >
                <Link
                  target="_blank"
                  to={recommendation.external_urls.spotify}
                  className="cursor-pointer "
                >
                  <img
                    src={recommendation.album.images[1].url}
                    alt={recommendation.name}
                    className="object-cover object-center aspect-square rounded-xl shadow-md hover:shadow-xl transition duration-300 ease-in-out min-w-max w-20 h-20"
                  />
                </Link>
                <div className="flex flex-col justify-between gap-2 truncate w-64 sm:w-1/3">
                  <h2 className="font-medium text-sm sm:text-base text-neutral-800 truncate ">
                    <Link
                      target="_blank"
                      to={recommendation.external_urls.spotify}
                      className="cursor-pointer hover:underline"
                    >
                      {recommendation.name}
                    </Link>
                  </h2>
                  <span className="flex text-neutral-700 gap-1 text-xs sm:text-sm w-full truncate">
                    {recommendation.artists.map((artist, index) => {
                      if (index === recommendation.artists.length - 1) {
                        return (
                          <span key={artist.id}>
                            <Link
                              target="_blank"
                              to={artist.external_urls.spotify}
                              className="underline cursor-pointer truncate"
                            >
                              {artist.name}
                            </Link>
                          </span>
                        );
                      } else {
                        return (
                          <span key={artist.id}>
                            <Link
                              target="_blank"
                              to={artist.external_urls.spotify}
                              className="underline cursor-pointer truncate"
                            >
                              {artist.name},
                            </Link>
                          </span>
                        );
                      }
                    })}
                  </span>
                  <span className="truncate text-xs sm:text-sm">
                    <Link
                      target="_blank"
                      href={recommendation.album.external_urls.spotify}
                    >
                      <h5 className=" text-neutral-700 truncate hover:underline">
                        {recommendation.album.name}
                      </h5>
                    </Link>
                  </span>
                </div>
                <p className="hidden sm:block text-sm w-full flex-1 ">
                  {msToMinSec(recommendation.duration_ms)}
                </p>
              </div>
            ))}
        </div>
        {extendedLoading &&
          Array(10)
            .fill()
            .map((_, index) => {
              return (
                <div key={index} className="flex gap-8 w-full">
                  <Skeleton className="w-20 h-20 rounded-xl" />
                  <div className="flex flex-col justify-between gap-2">
                    <Skeleton className="w-full h-6 rounded-xl" />
                    <Skeleton className="w-52 h-4 rounded-xl" />
                    <Skeleton className="w-52 h-4 rounded-xl" />{" "}
                  </div>
                </div>
              );
            })}
        <div className="flex flex-col gap-6">
          {recommendationsData.length > 0 && (
            <button
              className="button-secondary w-fit"
              onClick={handleLoadMore}
              disabled={extendedLoading || maxedRecommendations}
            >
              {extendedLoading ? "Loading..." : "Add tracks"}
            </button>
          )}
          {maxedRecommendations && (
            <p className="error-msg sm:text-sm">
              No more recommendations available
            </p>
          )}
        </div>
      </div>
    </>
  );
}
