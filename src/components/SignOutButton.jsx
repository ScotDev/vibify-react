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
        className="bg-indigo-100 w-fit text-neutral-900 font-medium px-4 py-2 rounded-lg cursor-pointer"
        onClick={handleSignOut}
      >
        Sign out
      </button>
    </>
  );
}
