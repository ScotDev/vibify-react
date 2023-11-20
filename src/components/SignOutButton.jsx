import { supabase } from "../supabase/client";

export default function SignOutButton() {
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        type="button"
        className="bg-red-200 px-4 py-2 cursor-pointer"
        onClick={() => supabase.auth.signOut()}
      >
        Sign out
      </button>
    </>
  );
}
