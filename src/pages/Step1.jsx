import VibeCard from "../components/VibeCard";

export default function Step1() {
  return (
    <div>
      <h1 className="pt-12">Choose a vibe</h1>
      <div className="pt-12 card-grid">
        <VibeCard title="running" />
        <VibeCard title="party" />
        <VibeCard title="focus" />
        <VibeCard title="hip hop" />
        <VibeCard title="k-pop" />
        <VibeCard title="reggaeton" />
        <VibeCard title="custom" />
      </div>
    </div>
  );
}
