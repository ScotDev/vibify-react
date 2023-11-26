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

import { getGenres, getArtists } from "../utils/Spotify";

export default function SearchableInput() {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [genreResults, setGenreResults] = useState([]);
  const [artistResults, setArtistResults] = useState([]);

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
    console.log(search);

    const delayDebounceFn = setTimeout(async () => {
      if (search.trim().length === 0) {
        setGenreResults([]);
        return;
      }
      if (search.trim().length === 0) {
        setArtistResults([]);
        return;
      }

      setLoading(true);
      const genres = await getGenres(search.trim());
      setGenreResults(genres);
      const artists = await getArtists(search.trim());
      setArtistResults(artists);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <Command className="rounded-lg border shadow-md" loop>
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
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
                    setSelectedItems([...selectedItems, currentValue]);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <div className="flex h-12 items-center justify-between w-full">
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
        </CommandList>
      )}
    </Command>
  );
}
