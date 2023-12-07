import { useState, useEffect } from "react";

import { useLoaderData, Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

import { msToMinSec } from "../utils/Calc";
import { SaveDialog } from "../components/SaveDialog";

export default function Step3() {
  const [loading, setLoading] = useState(true);
  const { recommendationsData } = useLoaderData();

  const totalDuration = recommendationsData?.reduce(
    (a, b) => a + b.duration_ms,
    0
  );
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const triggerToast = () => {
    console.log("toast");
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
            <SaveDialog
              triggerToast={triggerToast}
              tracks={recommendationsData}
            />
          )}
        </div>

        <div className="flex flex-col gap-6 overflow-x-hidden">
          {recommendationsData.length === 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-center text-lg">No recommendations found</h2>
              <p className="text-center italic text-sm">
                Try changing some dials and knobs
              </p>
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
                className="flex gap-8 w-full truncate"
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
                <div className="flex flex-col justify-between gap-2 truncate w-64 sm:w-full">
                  <h2 className="font-medium text-sm sm:text-base text-neutral-800 truncate ">
                    <Link
                      target="_blank"
                      to={recommendation.external_urls.spotify}
                      className="cursor-pointer "
                    >
                      {recommendation.name}
                    </Link>
                  </h2>
                  <span className="flex text-neutral-700 gap-1 text-xs sm:text-sm w-full truncate">
                    {recommendation.artists.map((artist, index) => {
                      // TODO: Add link to artist page
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
                      <h5 className=" text-neutral-700 truncate">
                        {recommendation.album.name}
                      </h5>
                    </Link>
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
