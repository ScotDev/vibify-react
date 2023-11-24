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

export default function SearchableInput() {
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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
          <CommandEmpty>No results found.</CommandEmpty>
          {/* <CommandGroup heading="Genres">
            <CommandItem>
              <span>Dance</span>
            </CommandItem>
            <CommandItem>
              <span>Hip hop</span>
            </CommandItem>
            <CommandItem>
              <span>House</span>
            </CommandItem>
          </CommandGroup> */}
          <CommandSeparator />
          {/* <CommandGroup heading="Artists">
            <CommandItem>
              <span>Bad Bunny</span>
            </CommandItem>
            <CommandItem>
              <span>Calvin Harris</span>
            </CommandItem>
            <CommandItem>
              <span>Dua Lipa</span>
            </CommandItem>
          </CommandGroup> */}
        </CommandList>
      )}
    </Command>
  );
}
