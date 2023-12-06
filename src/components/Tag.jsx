/* eslint-disable react/prop-types */

export default function Tag({ value }) {
  const colour =
    value.type === "genre"
      ? "bg-emerald-100"
      : value.type === "artist"
      ? "bg-blue-100"
      : "bg-orange-100";
  return (
    <span
      key={value.name}
      className={`${colour} capitalize rounded-full px-4 py-2 text-sm sm:text-xs truncate max-w-[100px] sm:w-max font-semibold text-neutral-800 mr-2`}
    >
      {value.name}
    </span>
  );
}
