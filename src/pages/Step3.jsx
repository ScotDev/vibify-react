import { useLoaderData, Link } from "react-router-dom";

import { msToMinSec } from "../utils/Calc";

export default function Step3() {
  const { recommendationsData } = useLoaderData();
  const totalDuration = recommendationsData?.reduce(
    (a, b) => a + b.duration_ms,
    0
  );

  return (
    <div className="flex flex-col gap-12 py-12">
      <h1>Your recommendations</h1>
      <div className="flex gap-12 text-center">
        <div>
          <p>Total duration</p>
          <span>{msToMinSec(totalDuration)}</span>
        </div>
        <div>
          <p>Average BPM</p>
          <span>112</span>
        </div>
        <div>
          <p>Total tracks</p>
          <span>{recommendationsData.length}</span>
        </div>
      </div>
      <div className="flex flex-col gap-6 overflow-x-hidden">
        {recommendationsData.map((recommendation) => (
          <div key={recommendation.id} className="flex gap-8 w-full">
            <img
              src={recommendation.album.images[2].url}
              alt={recommendation.name}
              className="object-cover object-center aspect-square rounded-xl shadow-md hover:shadow-xl transition duration-300 ease-in-out w-20 h-20 cursor-pointer"
            />
            <div className="flex flex-col gap-2">
              <h2 className="font-medium text-neutral-800 truncate ">
                <Link
                  target="_blank"
                  to={recommendation.external_urls.spotify}
                  className="cursor-pointer "
                >
                  {recommendation.name}
                </Link>
              </h2>
              <span className="flex max-w-prose text-neutral-700 text-sm truncate">
                {recommendation.artists.map((artist, index) => {
                  // TODO: Add link to artist page
                  if (index === recommendation.artists.length - 1) {
                    return (
                      <span key={artist.id}>
                        <Link
                          target="_blank"
                          to={artist.external_urls.spotify}
                          className="underline cursor-pointer pr-1"
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
                          className="underline cursor-pointer pr-1"
                        >
                          {artist.name},
                        </Link>
                      </span>
                    );
                  }
                })}
              </span>
              <span className="flex max-w-prose truncate">
                <Link
                  target="_blank"
                  href={recommendation.album.external_urls.spotify}
                >
                  <h5 className="text-sm text-neutral-700 truncate">
                    {recommendation.album.name}
                  </h5>
                </Link>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
