import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchableInput from "@/components/SearchableInput";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";

export default function Step2() {
  let params = new URLSearchParams(document.location.search);
  const preset = params.get("preset");
  const [qty, setQty] = useState(10);
  const [tempo, setTempo] = useState(85);
  const [popularity, setPopularity] = useState(90);

  const handleQtyChange = (value) => {
    setQty(value);
  };
  const handleTempoChange = (value) => {
    setTempo(value);
  };
  const handlePopularityChange = (value) => {
    setPopularity(value);
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
      <form className="flex flex-col gap-7 relative">
        <div
          id="inspiration"
          className="shadow-md rounded-lg pt-8 pb-24 px-6 bg-neutral-50"
        >
          <h3 className="text-xl">Set the tone</h3>
          <p className="text-sm py-4">
            Add tracks, artists and genres to inspire the playlist
          </p>
          {/* <fieldset className="flex flex-col sm:flex-row gap-8 pt-4 pb-8">
            <div className="w-1/2">
              <Label htmlFor="tracks">Search for anything</Label>
              <Input
                type="text"
                id="inspiration"
                name="inspiration"
                placeholder="In My Feelings, Efecto, House, Dance, Lil Nas X, Shakira"
              />
            </div>
          </fieldset> */}
          <div className="absolute w-full md:w-1/2 z-50">
            <SearchableInput />
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
                defaultValue={[10]}
                value={[qty]}
                onValueChange={handleQtyChange}
                min={5}
                max={100}
                step={1}
                name="qty"
              />
              <span>{qty}</span>
            </div>
            <div className="w-full flex flex-col gap-4">
              <label htmlFor="BPM">BPM</label>
              <Slider
                defaultValue={[85]}
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
                defaultValue={[90]}
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
