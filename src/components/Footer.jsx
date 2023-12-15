import spotifyLogo from "../assets/Spotify_Logo_RGB_Green.png";

export default function Footer() {
  return (
    <div className="container py-12 flex gap-2">
      <p className="text-muted-foreground text-sm">Built with data from</p>
      <img src={spotifyLogo} alt="Spotify" className="h-4" />
    </div>
  );
}
