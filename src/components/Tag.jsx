/* eslint-disable react/prop-types */

export default function Tag({ value, handleClick }) {
  const colour =
    value.type === "genre"
      ? "bg-emerald-100"
      : value.type === "artist"
      ? "bg-blue-100"
      : "bg-orange-100";
  return (
    <div
      className={`${colour} flex rounded-full px-4 py-2 text-sm sm:text-xs max-w-[110px] sm:w-max font-semibold text-neutral-800 mr-2`}
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
        className="pl-1 text-muted-foreground font-medium cursor-pointer"
      >
        X
      </span>
    </div>
  );
}
