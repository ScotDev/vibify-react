import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import SearchableInput from "@/components/SearchableInput";

import { handlePreset } from "../utils/Presets";

import { useStore } from "../state/store";

export default function Step2() {
  let params = new URLSearchParams(document.location.search);
  const preset = params.get("preset");
  const [qty, setQty] = useState(10);
  const [tempo, setTempo] = useState(85);
  const [popularity, setPopularity] = useState(100);
  const [inspiration, setInspiration] = useState([]); // [track, artist, genre]
  const navigate = useNavigate();

  // const store = useInspirationStore((state) => state);
  const store = useStore((state) => state);

  useEffect(() => {
    const vibe = handlePreset(preset);
    setQty(vibe.qty);
    setTempo(vibe.tempo);
    setPopularity(vibe.popularity);
    // For now just use vibe.genres from preset
    setInspiration(vibe.genres);
  }, []);

  useEffect(() => {
    console.log(store.items);
  }, [store.items]);

  const handleQtyChange = (value) => {
    setQty(value);
  };
  const handleTempoChange = (value) => {
    setTempo(value);
  };
  const handlePopularityChange = (value) => {
    setPopularity(value);
  };

  const handleInspiration = (value) => {
    console.log("Value from handleInspiration", value);
    console.log("Inspiration from handleInspiration", inspiration);
    const difference = inspiration.length - value.flat().length;

    // Need to tell searchableInput component how many new values it can accept.
    // This could be a good use case for zustand or jotai
    console.log("Difference", difference);
    if (inspiration.length <= 3) {
      setInspiration(value.flat());
    }
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

    inspiration.forEach((item) => {
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
    <div>
      <h1>Adjust the vibe</h1>
      <h2 className="text-xl py-6">
        The chosen vibe is
        <span className="font-bold capitalize text-indigo-800"> {preset}</span>
      </h2>
      {/* Take preset and set form inputs + tags  */}
      {/* Section 1 has searchable tags */}
      {/* Section 2 has slider */}
      {/* Submit button */}
      <form className="flex flex-col gap-7 relative" onSubmit={handleSubmit}>
        <div
          id="inspiration"
          className="shadow-md h-64 rounded-lg pt-8 pb-24 px-6 bg-neutral-50 z-50"
        >
          <h3 className="text-xl">Set the tone</h3>
          <p className="text-sm py-4">
            Add tracks, artists and genres to inspire the playlist
          </p>

          <div className="flex flex-col h-full gap-6 relative w-full md:w-1/2">
            <div className="w-full z-50">
              <SearchableInput handleInspiration={handleInspiration} />
            </div>

            <div className="flex absolute bottom-8 overflow-x-hidden w-full">
              {store.items.map((item) => {
                console.log("Item from store", item[0]);
                if (item.type === "track") {
                  return (
                    <span
                      key={item.name}
                      className="bg-indigo-100 capitalize rounded-full px-4 py-2 text-sm truncate w-[100px] sm:w-fit font-semibold text-indigo-800 mr-2"
                    >
                      {item.name}
                    </span>
                  );
                }
                if (item.type === "artist") {
                  return (
                    <span
                      key={item.name}
                      className="bg-emerald-100 capitalize rounded-full px-4 py-2 text-xs truncate w-[100px] sm:w-fit font-semibold text-emerald-800 mr-2"
                    >
                      {item.name}
                    </span>
                  );
                }
                if (item.type === "genre") {
                  return (
                    <span
                      key={item.name}
                      className="bg-orange-100 capitalize rounded-full px-4 py-2 text-sm truncate w-[100px] sm:w-fit font-semibold text-orange-800 mr-2"
                    >
                      {item.name}
                    </span>
                  );
                }
              })}
            </div>
            <div className="absolute -bottom-1 left-0 flex w-full md:w-1/2 justify-between items-center">
              <div>
                <button
                  type="button"
                  onClick={() => store.removeAllItems()}
                  className="underline text-xs text-neutral-700 "
                >
                  Remove all
                </button>
              </div>
              <div>
                {store.items.length === 3 && (
                  <p className="text-sm  text-neutral-700 ">
                    {store.items.length} of 3 selected
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
        <div className="py-8">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
