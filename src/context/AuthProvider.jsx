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

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        setUser(session.user);
        setSession(session);

        setItem("spotify_access_token", session.provider_token, 3600);

        setItem(
          "spotify_refresh_token",
          session.provider_refresh_token,
          oneYear
        );
        if (event === "SIGNED_OUT") {
          removeAllItems();
        }
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.node,
};
