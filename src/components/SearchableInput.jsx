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

export default function SearchableInput() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  // const [selectedGenres, setSelectedGenres] = useState([]);
  // const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [genreResults, setGenreResults] = useState([]);
  const [artistResults, setArtistResults] = useState([]);
  const [trackResults, setTrackResults] = useState([]);

  const items = useItems();
  const addToItems = useAddToItems();

  const accessToken = useSpotifyAuth();

  const addInspirationObject = (object) => {
    console.log("object", object);
    if (items.length < 3) {
      console.log("adding object");
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
    const delayDebounceFn = setTimeout(async () => {
      const genres = await getGenres(accessToken, search.trim());
      setGenreResults(genres);
      const artists = await getArtists(accessToken, search.trim());
      setArtistResults(artists);
      const tracks = await getTracks(accessToken, search.trim());
      setTrackResults(tracks);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <Command className="rounded-lg border shadow-md" loop>
      <CommandInput
        placeholder="Type a genre, artist or track"
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
              {artistResults.map((artist) => (
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
                    <span className="font-medium text-neutral-700">
                      {artist.name}
                    </span>
                    {artist.images.length > 2 ? (
                      <img
                        src={artist.images[2]?.url}
                        alt="artist"
                        className="h-full aspect-square rounded-lg"
                      />
                    ) : (
                      <div className="h-full aspect-square rounded-lg bg-neutral-200 grid items-center text-center text-neutral-800 font-medium">
                        {artist.name[0]}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandSeparator />
          {trackResults.length > 0 && (
            <CommandGroup heading="Tracks">
              {trackResults.map((track) => (
                <CommandItem
                  key={track.id}
                  value={track.name}
                  onSelect={(currentValue) => {
                    // trackResults.map((track) => {
                    //   if (track.name.toLowerCase() === currentValue) {
                    //     // Check if track id already exists in selectedItems
                    //     if (!selectedItems.includes(track.id)) {
                    //       setSelectedItems([
                    //         ...selectedItems,
                    //         {
                    //           id: track.id,
                    //           name: track.name,
                    //           type: "track",
                    //         },
                    //       ]);
                    //     }
                    //   }
                    // });
                    addInspirationObject({
                      id: track.id,
                      name: currentValue,
                      type: "track",
                    });
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <div className="flex h-12 items-center justify-between w-full cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <span className="capitalize font-medium text-neutral-00">
                        {track.name}
                      </span>
                      <span className="flex">
                        {track.artists.map((artist, index) => {
                          if (index === track.artists.length - 1) {
                            return (
                              <p
                                className="capitalize text-xs text-neutral-600"
                                key={artist.id}
                              >
                                {artist.name}
                              </p>
                            );
                          } else {
                            return (
                              <p
                                className="capitalize text-xs text-neutral-600"
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
                        className="h-full aspect-square rounded-lg"
                      />
                    ) : (
                      <div className="h-full aspect-square rounded-lg bg-neutral-200 grid items-center text-center text-neutral-800 font-medium">
                        {track.name[0]}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  );
}
