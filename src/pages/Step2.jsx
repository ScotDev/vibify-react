import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import SearchableInput from "@/components/SearchableInput";
import Tag from "../components/Tag";

import { handlePreset } from "../utils/Presets";

import { useAddToItems, useItems, useRemoveAllItems } from "../state/store";

export default function Step2() {
  let params = new URLSearchParams(document.location.search);
  const preset = params.get("preset");
  const [qty, setQty] = useState(10);
  const [tempo, setTempo] = useState(85);
  const [popularity, setPopularity] = useState(100);
  // const [inspiration, setInspiration] = useState([]);
  const navigate = useNavigate();

  // const store = useInspirationStore((state) => state);
  // const store = useStore((state) => state);
  const items = useItems();
  const addToItems = useAddToItems();
  const removeAllItems = useRemoveAllItems();
  const vibe = handlePreset(preset);
  useEffect(() => {
    setQty(vibe.qty);
    setTempo(vibe.tempo);
    setPopularity(vibe.popularity);
    // For now just use vibe.genres from preset
    // setInspiration(vibe.genres);
  }, []);

  useEffect(() => {
    vibe.genres.forEach((genre) => {
      // const hasItem = (genre) =>
      //   items.filter((item) => item.name === genre.name).length === 0;
      // console.log(hasItem(genre));
      if (items.length < 3) {
        console.log("adding genre", genre);
        addToItems(genre);
      }
    });
    // console.log(vibe.genres);
  }, []);

  const handleQtyChange = (value) => {
    setQty(value);
  };
  const handleTempoChange = (value) => {
    setTempo(value);
  };
  const handlePopularityChange = (value) => {
    setPopularity(value);
  };

  const genres = [];
  const artists = [];
  const tracks = [];
  const handleSubmit = (e) => {
    e.preventDefault();
    let params = {};
    params["limit"] = qty;
    params["tempo"] = tempo;
    params["popularity"] = popularity;

    // Loop over inspiration array and add to params.
    // Need to loop over and separate out by type, but grouped togther in the params, separated by commas.
    // Doesn't need to be formatted for spotify API yet, I can do this in the loader function for the route for step-3.

    items.forEach((item) => {
      if (item.type === "track") {
        tracks.push(item.id);
      }
      if (item.type === "artist") {
        artists.push(item.id);
      }
      if (item.type === "genre") {
        genres.push(item.name);
      }
    });

    navigate(
      `/step-3?${new URLSearchParams(
        params
      ).toString()}&seed_genres=${genres.join(",")}&seed_artists=${artists.join(
        ","
      )}&seed_tracks=${tracks.join(",")}`
    );
  };

  return (
    <div className="content">
      <h1>Adjust the vibe</h1>
      <h2 className="text-xl py-6">
        The chosen vibe is
        <span className="font-bold capitalize text-indigo-800"> {preset}</span>
      </h2>
      <form className="flex flex-col gap-7 relative" onSubmit={handleSubmit}>
        <div
          id="inspiration"
          className="shadow-md h-72 rounded-lg pt-8 pb-24 px-6 bg-neutral-50 z-50"
        >
          <h3 className="text-xl font-medium">Set the tone</h3>
          <p className="text-sm py-4 text-muted-foreground">
            Add tracks, artists and genres to inspire the playlist
          </p>

          <div className="flex flex-col h-full gap-6 relative w-full md:w-2/5">
            <div className="w-full z-50">
              <SearchableInput />
            </div>

            <div className="flex absolute bottom-14  overflow-x-hidden w-full">
              {items.map((item) => {
                return <Tag key={item.name} value={item} />;
              })}
            </div>
            <div className="absolute bottom-4 sm:bottom-2 left-0 flex w-full justify-between items-center">
              <div>
                <button
                  type="button"
                  onClick={removeAllItems}
                  className="underline text-xs text-neutral-700 "
                >
                  Remove all
                </button>
              </div>
              <div>
                {items.length === 3 && (
                  <p className="text-xs  text-neutral-700 ">
                    {items.length} of 3 selected
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          id="finer-details"
          className="shadow-md rounded-lg py-8 px-6 bg-neutral-50"
        >
          <h3 className="text-xl">Finer details</h3>
          <fieldset className="flex flex-col sm:flex-row gap-8 py-8">
            <div className="w-full flex flex-col gap-4">
              <label htmlFor="qty">Number of tracks</label>
              <Slider
                defaultValue={[qty]}
                value={[qty]}
                onValueChange={handleQtyChange}
                min={5}
                max={100}
                step={5}
                name="qty"
              />
              <span>{qty}</span>
            </div>
            <div className="w-full flex flex-col gap-4">
              <label htmlFor="BPM">BPM</label>
              <Slider
                defaultValue={[tempo]}
                value={[tempo]}
                onValueChange={handleTempoChange}
                min={20}
                max={200}
                step={5}
                name="BPM"
              />
              <span>{tempo}</span>
            </div>
            <div className="w-full flex flex-col gap-4">
              <label htmlFor="Popularity">Popularity</label>
              <Slider
                defaultValue={[popularity]}
                value={[popularity]}
                onValueChange={handlePopularityChange}
                min={5}
                max={100}
                step={5}
                name="Popularity"
              />
              <span>{popularity}</span>
            </div>
          </fieldset>
        </div>
        <div className="py-4">
          <button type="submit" className="button-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
