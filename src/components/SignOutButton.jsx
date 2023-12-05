import { useAuth } from "../context/AuthProvider";

export default function SignOutButton() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    console.log("Signing out...");
    await signOut();
  };

  return (
    <>
      <button
        type="button"
        className="button-secondary w-max"
        onClick={handleSignOut}
      >
        Sign out
      </button>
    </>
  );
}
