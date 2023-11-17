import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import { supabase } from "../supabase/client";

export default function Login() {
  return (
    <div className="mt-12 p-6 mx-auto max-w-[24rem] flex flex-col items-center justify-between text-center bg-neutral-200 rounded-md shadow-lg">
      <h1 className="py-4">Vibify</h1>
      <h2 className="py-2">Sign in to start</h2>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={["spotify"]}
        onlyThirdPartyProviders
        providerScopes={{
          spotify: "user-read-email user-read-private user-top-read",
        }}
        theme="dark"
      />
    </div>
  );
}
