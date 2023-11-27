const handlePreset = (preset) => {
  let vibe = {
    name: preset,
    description: "Default",
    tracks: [],
    genres: [],
    tempo: 85,
    popularity: 90,
    qty: 20,
  };
  switch (preset) {
    case "running":
      vibe = {
        ...vibe,
        description: "Running",
        tracks: [],
        genres: [
          { name: "drum-and-bass", type: "genre" },
          { name: "edm", type: "genre" },
        ],
        tempo: 140,
        popularity: 100,
        qty: 30,
      };
      break;
    case "party":
      vibe = {
        ...vibe,
        description: "Party time",
        tracks: [],
        genres: [
          { name: "party", type: "genre" },
          { name: "dance", type: "genre" },
        ],
        tempo: 100,
        popularity: 100,
        qty: 40,
      };
      break;
    case "focus":
      vibe = {
        ...vibe,
        description: "Time to focus up",
        tracks: [],
        genres: [
          { name: "electronic", type: "genre" },
          { name: "progressive-house", type: "genre" },
        ],
        tempo: 95,
        popularity: 90,
        qty: 40,
      };
      break;
    case "hip-hop":
      vibe = {
        ...vibe,
        description: "Let's chill",
        tracks: [],
        genres: [
          { name: "hip-hop", type: "genre" },
          { name: "r-n-b", type: "genre" },
        ],
        tempo: 85,
        popularity: 90,
        qty: 30,
      };
      break;
    case "k-pop":
      vibe = {
        ...vibe,
        description: "Let's chill",
        tracks: [],
        genres: [{ name: "k-pop", type: "genre" }],
        tempo: 110,
        popularity: 100,
        qty: 30,
      };
      break;
    case "reggaeton":
      vibe = {
        ...vibe,
        description: "Vamos",
        tracks: [],
        genres: [{ name: "reggaeton", type: "genre" }],
        tempo: 95,
        popularity: 100,
        qty: 30,
      };
      break;

    default:
      break;
  }

  return vibe;
};
export { handlePreset };
