import { useEffect } from "react";
import VibeCard from "../components/VibeCard";

import { useRemoveAllItems } from "../state/store";

export default function Step1() {
  const removeAllItems = useRemoveAllItems();
  useEffect(() => {
    removeAllItems();
  }, []);

  const vibes = [
    { title: "custom" },
    { title: "running" },
    { title: "party" },
    { title: "focus" },
    { title: "hip-hop" },
    { title: "pop" },
    { title: "k-pop" },
    { title: "reggaeton" },
  ];
  return (
    <div className="content">
      <h1>Choose a vibe</h1>
      <div className="pt-12 card-grid">
        {vibes.map((vibe) => {
          return <VibeCard key={vibe.title} title={vibe.title} />;
        })}
      </div>
    </div>
  );
}
