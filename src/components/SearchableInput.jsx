import { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import { getGenres, getArtists, getTracks } from "../utils/Spotify";

export default function SearchableInput() {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [genreResults, setGenreResults] = useState([]);
  const [artistResults, setArtistResults] = useState([]);
  const [trackResults, setTrackResults] = useState([]);

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
    const delayDebounceFn = setTimeout(async () => {
      if (search.trim().length === 0) {
        setGenreResults([]);
        return;
      }
      if (search.trim().length === 0) {
        setArtistResults([]);
        return;
      }
      if (search.trim().length === 0) {
        setTrackResults([]);
        return;
      }

      setLoading(true);
      const genres = await getGenres(search.trim());
      setGenreResults(genres);
      const artists = await getArtists(search.trim());
      setArtistResults(artists);
      const tracks = await getTracks(search.trim());
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
          {!loading && <CommandEmpty>No results found</CommandEmpty>}
          {genreResults.length > 0 && (
            <CommandGroup heading="Genres">
              {genreResults.map((genre) => (
                <CommandItem
                  key={genre}
                  value={genre}
                  onSelect={(currentValue) => {
                    setSelectedGenre(
                      currentValue === selectedGenre ? "" : currentValue
                    );
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <span className="capitalize">{genre}</span>
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
                  onSelect={(currentValue) => {
                    // Check if the artist is already selected
                    // On select, filter artist and add artist.ID to selectedItems
                    artistResults.map((artist) => {
                      if (artist.name.toLowerCase() === currentValue) {
                        // Check if artist id already exists in selectedItems
                        if (!selectedItems.includes(artist.id)) {
                          setSelectedItems([
                            ...selectedItems,
                            {
                              id: artist.id,
                              name: artist.name,
                              type: "artist",
                            },
                          ]);
                        }
                      }
                    });
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <div className="flex h-12 items-center justify-between w-full cursor-pointer">
                    <span className="capitalize">{artist.name}</span>
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
                    trackResults.map((track) => {
                      if (track.name.toLowerCase() === currentValue) {
                        // Check if track id already exists in selectedItems
                        if (!selectedItems.includes(track.id)) {
                          setSelectedItems([
                            ...selectedItems,
                            {
                              id: track.id,
                              name: track.name,
                              type: "track",
                            },
                          ]);
                        }
                      }
                    });
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <div className="flex h-12 items-center justify-between w-full cursor-pointer">
                    <span className="capitalize">{track.name}</span>
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
