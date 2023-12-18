/* eslint-disable react/prop-types */

export default function Tag({ value, handleClick }) {
  const colour =
    value.type === "genre"
      ? "bg-emerald-100"
      : value.type === "artist"
      ? "bg-blue-100"
      : "bg-orange-100";
  const cancelBgColour =
    value.type === "genre"
      ? "bg-emerald-50"
      : value.type === "artist"
      ? "bg-blue-50"
      : "bg-orange-50";
  return (
    <div
      className={`${colour} flex items-center rounded-full px-4 py-2 text-sm sm:text-xs max-w-[110px] sm:w-max font-semibold text-neutral-800 mr-2 h-8`}
    >
      <span
        className={`${
          value.type === "genre" ? "capitalize" : ""
        } truncate w-full`}
      >
        {value.name === "edm"
          ? "EDM"
          : value.name === "drum-and-bass"
          ? "Drum & Bass"
          : value.name}
      </span>
      <span
        onClick={() => handleClick(value.id)}
        className={`px-1 ml-1 text-muted-foreground font-semibold cursor-pointer ${cancelBgColour} rounded-full hover:bg-neutral-200`}
      >
        X
      </span>
    </div>
  );
}
