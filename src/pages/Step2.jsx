import { Slider } from "@/components/ui/slider";
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
      <form>
        <fieldset className="flex flex-col sm:flex-row gap-8 py-8">
          <div className="w-full flex flex-col gap-4">
            <label htmlFor="BPM">BPM</label>
            <Slider defaultValue={[85]} max={200} step={5} name="BPM" />
          </div>
          <div className="w-full flex flex-col gap-4">
            <label htmlFor="qty">Number of tracks</label>
            <Slider defaultValue={[10]} max={100} step={1} name="qty" />
          </div>
          <div className="w-full flex flex-col gap-4">
            <label htmlFor="Popularity">Popularity</label>
            <Slider defaultValue={[90]} max={100} step={5} name="Popularity" />
          </div>
        </fieldset>
      </form>
    </div>
  );
}
