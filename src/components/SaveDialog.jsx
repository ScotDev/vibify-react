import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { PropTypes } from "prop-types";

import {
  addTracksToPlaylist,
  createPlaylist,
  getUserPlaylists,
} from "../utils/Spotify";
import useSpotifyAuth from "../hooks/useSpotifyAuth";

// TODO: Add form validation via recommended shadcn zod config
// https://ui.shadcn.com/docs/components/textarea#form
export const SaveDialog = ({ tracks }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    public: true,
  });
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const accessToken = useSpotifyAuth();

  const handleCheckboxChange = () => {
    setFormData({ ...formData, public: !formData.public });
  };

  useEffect(() => {
    setFormData({ name: "", description: "", public: true });
    setSelectedPlaylist(null);
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (selectedPlaylist) {
      console.log("Adding to existing playlist", selectedPlaylist);
      const res = await addTracksToPlaylist(
        accessToken,
        selectedPlaylist,
        tracks
      );
      if (res === null) {
        setLoading(false);
        setError("Error adding tracks to playlist");
        return;
      }
      error && setError("");
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      setTimeout(() => {
        setOpen(false);
      }, 2000);
      return;
    }
    // if (formData.name === "") {
    //   // Handle with zod maybe
    //   console.log("Error: name is required");
    //   return;
    // }

    const playlistID = await createPlaylist(accessToken, formData);
    if (playlistID === null) {
      setLoading(false);
      setError("Error creating playlist, try again");
      return;
    }
    error && setError("");
    await addTracksToPlaylist(accessToken, playlistID, tracks);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  };

  const loadUserPlaylists = async () => {
    setPlaylistsLoading(true);
    const playlists = await getUserPlaylists(accessToken);
    // This should be cached

    if (playlists.length === 0) return;
    // Handle no playlists found
    setSelectOptions(playlists);
    setPlaylistsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-fit">
        <button disabled={tracks.length === 0} className="button-secondary">
          Save
        </button>
      </DialogTrigger>
      <DialogContent
        className="w-11/12 sm:w-full"
        // Necessary to prevent autofocus on input.
        // Normal autofocus={false} is ignored by shadcn/radix
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="pb-2">Save playlist to Spotify</DialogTitle>
          <DialogDescription>
            Create a new playlist or add to an existing one
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-6 pt-2"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name (required)</Label>
            <Input
              type="text"
              id="name"
              placeholder="Playlist name"
              value={formData.name}
              disabled={loading}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required={!selectedPlaylist}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              disabled={loading}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your playlist"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="public"
              checked={formData.public}
              disabled={loading}
              onCheckedChange={handleCheckboxChange}
            />
            <label
              htmlFor="public"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Public
            </label>
          </div>

          <Separator />
          <h2 className="font-medium">Add to an existing playlist</h2>
          <div className="space-y-2 ">
            <label
              htmlFor="existing-playlist"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Playlist
            </label>

            <Select
              id="existing-playlist"
              // disabled={true}
              name="existing-playlist"
              onValueChange={(value) => {
                setSelectedPlaylist(value);
              }}
              value={selectedPlaylist}
              disabled={playlistsLoading}
              // open={selectOptions.length > 0}
              onOpenChange={async () => {
                await loadUserPlaylists();
              }}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select a playlist" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Your playlists</SelectLabel>
                  {selectOptions.map((option) => {
                    return (
                      <SelectItem
                        key={option.id}
                        value={option.id}
                        className="cursor-pointer capitalize"
                      >
                        {option.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4 items-center">
            <button
              className="button-primary"
              type="submit"
              disabled={loading || tracks.length === 0}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <p className="error-msg">{error}</p>
            {/* <button
              className="py-2 px-4 rounded-lg bg-neutral-100 disabled:bg-neutral-50 text-neutral-700 font-medium w-max disabled:cursor-not-allowed disabled:opacity-70"
              type="reset"
              onClick={() => {
                setFormData({
                  name: "",
                  description: "",
                  public: true,
                });
                setSelectedPlaylist(null);
              }}
              disabled={loading || tracks.length === 0}
            >
              Reset
            </button> */}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
SaveDialog.propTypes = {
  tracks: PropTypes.array.isRequired,
};
