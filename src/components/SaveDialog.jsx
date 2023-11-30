import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { PropTypes } from "prop-types";

import { createPlaylist } from "../utils/Spotify";

// TODO: Add form validation via recommended shadcn zod config
// https://ui.shadcn.com/docs/components/textarea#form
export const SaveDialog = ({ tracks }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    public: true,
  });
  const handleCheckboxChange = () => {
    setFormData({ ...formData, public: !formData.public });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(e.target.value);
    await createPlaylist(formData);
    setLoading(false);
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="py-2 px-4 rounded-lg bg-neutral-200 font-medium w-max">
        Save
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save playlist to Spotify</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
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
              onCheckedChange={handleCheckboxChange}
            />
            <label
              htmlFor="public"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Public
            </label>
          </div>
          <button
            className="py-2 px-4 rounded-lg bg-neutral-200 font-medium w-max disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            Save
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
SaveDialog.propTypes = {
  tracks: PropTypes.array.isRequired,
};
