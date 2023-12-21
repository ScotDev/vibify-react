import { useEffect, useState } from "react";

import {
  Command,
  // CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import { getGenres, getArtists, getTracks } from "../utils/Spotify";
import useSpotifyAuth from "../hooks/useSpotifyAuth";
import { useAddToItems, useItems } from "../state/store";
import { formatFollowerCount } from "../utils/Calc";

export default function SearchableInput() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  // const [selectedGenres, setSelectedGenres] = useState([]);
  // const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [genreResults, setGenreResults] = useState([]);
  const [artistResults, setArtistResults] = useState([]);
  const [trackResults, setTrackResults] = useState([]);

  const MAX_ITEMS_LENGTH = 5;

  const items = useItems();
  const addToItems = useAddToItems();

  const accessToken = useSpotifyAuth();

  const addInspirationObject = (object) => {
    if (items.length < MAX_ITEMS_LENGTH) {
      console.log("adding object", items.length, MAX_ITEMS_LENGTH);
      addToItems(object);
    }
  };

  // useEffect(() => {
  //   const down = (e) => {
  //     if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
  //       e.preventDefault();
  //       setOpen((open) => !open);
  //     }
  //   };
  //   document.addEventListener("keydown", down);
  //   return () => document.removeEventListener("keydown", down);
  // }, []);

  useEffect(() => {
    if (search.trim().length === 0) {
      setGenreResults([]);
      setArtistResults([]);
      setTrackResults([]);
      setOpen(false);
      return;
    }
    if (search.trim().length > 2) {
      setLoading(true);
      setOpen(true);
    }
  }, [search]);

  useEffect(() => {
    // const controller = new AbortController();
    const delayDebounceFn = setTimeout(async () => {
      if (search.trim().length === 0) return;
      const genres = await getGenres(accessToken, search.trim());
      setGenreResults(genres);
      const artists = await getArtists(accessToken, search.trim());
      console.log("artists", artists);

      setArtistResults(artists);

      const tracks = await getTracks(accessToken, search.trim());
      console.log("tracks", tracks);
      setTrackResults(tracks);

      setLoading(false);
    }, 1500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    // shouldFilter={false} - this is crucial, otherwise the component will hide the list of tracks and non-exact matches
    // https://github.com/pacocoursey/cmdk#parts-and-styling
    <Command className="rounded-lg border shadow-md " loop shouldFilter={false}>
      <CommandInput
        placeholder="Type a genre, artist or track..."
        value={search}
        onValueChange={setSearch}
        onFocus={() => setOpen(true)}
      />
      {open && (
        <CommandList>
          {loading && <p className="text-sm px-3 py-2">Fetching results...</p>}
          {/* {loading && <CommandEmpty>No results found</CommandEmpty>} */}
          {genreResults.length > 0 && (
            <CommandGroup heading="Genres">
              {genreResults.map((genre) => (
                <CommandItem
                  key={genre}
                  value={genre}
                  className="cursor-pointer"
                  onSelect={(currentValue) => {
                    addInspirationObject({
                      id: Math.floor(Math.random() * 100),
                      name: currentValue,
                      type: "genre",
                    });

                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <span className="capitalize font-medium text-neutral-700">
                    {genre === "edm"
                      ? "EDM"
                      : genre === "drum-and-bass"
                      ? "Drum & Bass"
                      : genre}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandSeparator />
          {artistResults.length > 0 && (
            <CommandGroup heading="Artists">
              {artistResults.map((artist) => {
                return (
                  <CommandItem
                    key={artist.id}
                    value={artist.name}
                    onSelect={() => {
                      // this component formats currentvalue as lowercase,
                      // so just using artist.name to preserve case
                      addInspirationObject({
                        id: artist.id,
                        name: artist.name,
                        type: "artist",
                      });

                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    <div className="flex h-12 items-center justify-between w-full cursor-pointer">
                      <div className="flex flex-col gap-1 w-4/5 pr-1">
                        <span className="font-medium text-neutral-700">
                          {artist.name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {/* {artist.followers.total >= 100000
                            ? Number(
                                String(artist.followers.total).slice(0, 3)
                              ) + "k"
                            : artist.followers.total}{" "}
                          followers */}
                          {formatFollowerCount(artist.followers.total)}{" "}
                          followers
                        </span>
                      </div>
                      {artist.images.length > 2 ? (
                        <img
                          src={artist.images[2]?.url}
                          alt="artist"
                          className="aspect-square rounded-lg w-12"
                        />
                      ) : (
                        <div className="aspect-square rounded-lg bg-neutral-200 grid items-center text-center text-neutral-800 font-medium w-12">
                          {artist.name[0]}
                        </div>
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
          <CommandSeparator />
          {trackResults.length > 0 && (
            <CommandGroup heading="Tracks">
              {trackResults.map((track) => {
                return (
                  <CommandItem
                    key={track.id}
                    value={track.name}
                    onSelect={() => {
                      // this component formats currentvalue as lowercase,
                      // so just using track.name to preserve case
                      addInspirationObject({
                        id: track.id,
                        name: track.name,
                        artists: track.artists,
                        external_urls: track.external_urls,
                        duration_ms: track.duration_ms,
                        type: "track",
                        album: {
                          name: track.album.name,
                          images: track.album.images,
                          external_urls: track.album.external_urls,
                        },
                        uri: track.uri,
                      });
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    <div className="flex h-12 items-center justify-between w-full cursor-pointer">
                      <div className="flex flex-col gap-1 w-4/5 pr-1">
                        <span className="capitalize font-medium truncate">
                          {track.name}
                        </span>
                        <span className="flex truncate">
                          {track.artists.map((artist, index) => {
                            if (index === track.artists.length - 1) {
                              return (
                                <p
                                  className="capitalize text-xs text-muted-foreground"
                                  key={artist.id}
                                >
                                  {artist.name}
                                </p>
                              );
                            } else {
                              return (
                                <p
                                  className="capitalize text-xs text-muted-foreground"
                                  key={artist.id}
                                >
                                  {artist.name},&nbsp;
                                </p>
                              );
                            }
                          })}
                        </span>
                      </div>

                      {track.album.images.length > 2 ? (
                        <img
                          src={track.album.images[2]?.url}
                          alt="track"
                          className="aspect-square rounded-lg w-12"
                        />
                      ) : (
                        <div className="aspect-square rounded-lg bg-neutral-200 grid items-center text-center text-neutral-800 font-medium w-12">
                          {track.name[0]}
                        </div>
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  );
}
