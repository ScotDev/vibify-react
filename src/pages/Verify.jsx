import { useEffect } from "react";

import { supabase } from "../supabase/client";

export default function Verify() {
  const params = new URLSearchParams(document.location.search);
  const tokenHash = params.get("token");
  console.log(tokenHash);
  useEffect(() => {
    const verifyUser = async () => {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "email",
      });
      console.log(data);
      if (error) {
        console.log(error);
      }
    };

    verifyUser();
  }, []);

  return <div>Verify</div>;
}
