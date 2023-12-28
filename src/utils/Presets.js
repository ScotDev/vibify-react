const handlePreset = (preset) => {
  let vibe = {
    name: preset,
    description: "Default",
    tracks: [],
    genres: [],
    tempo: 85,
    popularity: 100,
    qty: 20,
  };
  switch (preset) {
    case "running":
      vibe = {
        ...vibe,
        description: "Let's go",
        tracks: [],
        genres: [
          { id: 1, name: "drum-and-bass", type: "genre" },
          { id: 2, name: "dance", type: "genre" },
        ],
        tempo: 150,
        popularity: 100,
        energy: 1,
        qty: 30,
      };
      break;
    case "party":
      vibe = {
        ...vibe,
        description: "Party time",
        tracks: [],
        genres: [
          { id: 3, name: "party", type: "genre" },
          { id: 4, name: "dance", type: "genre" },
        ],
        tempo: 100,
        popularity: 100,
        danceability: 1,
        energy: 0.8,
        qty: 40,
      };
      break;
    case "focus":
      vibe = {
        ...vibe,
        description: "Time to focus up",
        tracks: [],
        genres: [
          // { id: 5, name: "electronic", type: "genre" },
          // { id: 6, name: "progressive-house", type: "genre" },
          // { id: 5, name: "chill", type: "genre" },
          { id: 6, name: "ambient", type: "genre" },
        ],
        tempo: 75,
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
          { id: 7, name: "hip-hop", type: "genre" },
          { id: 8, name: "r-n-b", type: "genre" },
        ],
        tempo: 90,
        popularity: 100,
        energy: 0.9,
        qty: 30,
      };
      break;
    case "pop":
      vibe = {
        ...vibe,
        description: "Let's chill",
        tracks: [],
        genres: [
          { id: 9, name: "pop", type: "genre" },
          // { id: 8, name: "r-n-b", type: "genre" },
        ],
        tempo: 110,
        popularity: 100,
        danceability: 1,
        energy: 1,
        qty: 30,
      };
      break;
    case "k-pop":
      vibe = {
        ...vibe,
        description: "Let's chill",
        tracks: [],
        genres: [{ id: 10, name: "k-pop", type: "genre" }],
        tempo: 110,
        popularity: 100,
        energy: 1,
        qty: 20,
      };
      break;
    case "reggaeton":
      vibe = {
        ...vibe,
        description: "Vamos",
        tracks: [],
        genres: [{ id: 11, name: "reggaeton", type: "genre" }],
        tempo: 95,
        popularity: 100,
        danceability: 1,
        energy: 1,
        qty: 30,
      };
      break;

    default:
      break;
  }

  return vibe;
};
export { handlePreset };
