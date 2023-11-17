import "./global.css";
// import "@radix-ui/themes/styles.css";

// import { Flex, Text, Button, Container } from "@radix-ui/themes";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

// import { useState, useEffect } from "react";
// import { createClient } from "@supabase/supabase-js";
// import { Auth } from "@supabase/auth-ui-react";
// import { ThemeSupa } from "@supabase/auth-ui-shared";

// const supabase = createClient(
//   "https://dxtnuhmyejmqfkzorgxp.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dG51aG15ZWptcWZrem9yZ3hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI1Njk0NjEsImV4cCI6MjAwODE0NTQ2MX0.EqrfuoG7SrEBiT4g3nG8hBOWlvP1h-r5ETDVxQoQMxU"
// );

export default function App() {
  // const [session, setSession] = useState(null);

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session);
  //   });

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);

  // if (!session) {
  //   return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  // } else {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
  // }
}
