import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function SignOutButton() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    console.log("Signing out...");
    await signOut();
    navigate("/");
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
