import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";

export default function MediaItem({ data }) {
  //   console.log(data);
  return (
    <div className="media-item">
      <Link target="_blank" to={data.external_urls.spotify}>
        <img
          src={data.album.images[0].url}
          alt="Media item cover art"
          className="object-cover object-center aspect-square rounded-xl shadow-md hover:shadow-xl transition duration-300 ease-in-out cursor-pointer"
        />
      </Link>
      <div className="flex flex-col h-full gap-4">
        <Link target="_blank" to={data.external_urls.spotify}>
          <h3 className="font-medium pt-2">{data.name}</h3>
        </Link>
        <h4 className="text-sm text-neutral-400 flex flex-wrap gap-1">
          {data.artists.map((artist, index) => {
            if (index === data.artists.length - 1) {
              return (
                <Link
                  target="_blank"
                  key={artist.name}
                  to={artist.external_urls.spotify}
                  className="underline cursor-pointer"
                >
                  {artist.name}
                </Link>
              );
            } else {
              return (
                <span key={artist.name}>
                  <Link
                    target="_blank"
                    to={artist.external_urls.spotify}
                    className="underline cursor-pointer"
                  >
                    {artist.name},
                  </Link>
                </span>
              );
            }
          })}
        </h4>
        <Link target="_blank" to={data.album.external_urls.spotify}>
          <h5 className="text-sm text-neutral-400">{data.album.name}</h5>
        </Link>
      </div>
    </div>
  );
}

MediaItem.propTypes = {
  data: PropTypes.object.isRequired,
};
