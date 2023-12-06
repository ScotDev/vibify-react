import VibeCard from "../components/VibeCard";

export default function Step1() {
  const vibes = [
    { title: "custom" },
    { title: "running" },
    { title: "party" },
    { title: "focus" },
    { title: "hip-hop" },
    { title: "k-pop" },
    { title: "reggaeton" },
  ];
  return (
    <div>
      <h1 className="pt-12">Choose a vibe</h1>
      <div className="pt-12 card-grid">
        {vibes.map((vibe) => {
          return <VibeCard key={vibe.title} title={vibe.title} />;
        })}
      </div>
    </div>
  );
}
