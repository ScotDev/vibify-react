import { createContext, useContext, useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import { supabase } from "../supabase/client";
import { setItem, removeAllItems } from "../utils/Storage";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const oneYear = 24 * 60 * 60 * 1000 * 365;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(session);
      setUser(session?.user);
      setLoading(false);
      console.log(session);

      if (session.provider_token) {
        setItem("spotify_access_token", session.provider_token);
      }
      if (session.provider_refresh_token) {
        setItem(
          "spotify_refresh_token",
          session.provider_refresh_token,
          oneYear
        );
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user);
        setLoading(false);
      }
    );

    setData();

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Original AuthProvider
// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [session, setSession] = useState(null);

//   useEffect(() => {
//     const { data } = supabase.auth.onAuthStateChange((event, session) => {
//       console.log(event);

//       if (event === "INITIAL_SESSION") {
//         console.log("Setting tokens in local storage", session.provider_token);
//         setItem("spotify_access_token", session.provider_token);

//         setItem(
//           "spotify_refresh_token",
//           session.provider_refresh_token,
//           oneYear
//         );
//       }
//       if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
//         setUser(session.user);
//         setSession(session);
//       }
//       if (event === "SIGNED_OUT") {
//         removeAllItems();
//       }
//     });
//     return () => {
//       data.subscription.unsubscribe();
//     };
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, session }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.node,
};
