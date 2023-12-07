import { createContext, useContext, useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import { supabase } from "../supabase/client";
import { setItem, removeAllItems } from "../utils/Storage";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// const oneHour = 3600 * 1000;
const oneYear = 31556926 * 1000;
const fifteenMinutes = 900 * 1000;

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

      if (session.provider_token) {
        // console.log(session.provider_token);
        try {
          localStorage.setItem(
            "vibify_spotify_user_id",
            JSON.stringify({
              value: session.user.identities[0].id,
              expires: Date.now() + oneYear,
            })
          );
          // Temporarily disabled as spotify seems to reject all stored access tokens
          // sessionStorage.setItem(
          //   "vibify_spotify_access_token",
          //   JSON.stringify({
          //     value: session.provider_token,
          //     expires: Date.now() + fifteenMinutes,
          //   })
          // );
        } catch (error) {
          console.log(error);
        }
        // setItem("spotify_user_id", session.user.identities[0].id, oneYear);
        // setItem("spotify_access_token", session.provider_token, fifteenMinutes);
      }
      if (session.provider_refresh_token) {
        // console.log(session.provider_refresh_token);

        localStorage.setItem(
          "vibify_spotify_refresh_token",
          JSON.stringify({
            value: session.provider_refresh_token,
            expires: Date.now() + oneYear,
          })
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

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    removeAllItems();
    window.location.reload();
  };

  const value = {
    session,
    user,
    signOut: async () => await signOut(),
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
