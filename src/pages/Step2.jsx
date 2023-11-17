import { Slider } from "@/components/ui/slider";

export default function Step2() {
  let params = new URLSearchParams(document.location.search);
  const preset = params.get("preset");
  console.log(preset);
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
      <fieldset>
        <Slider defaultValue={[85]} max={200} step={5} />
      </fieldset>
    </div>
  );
}
