import { Link } from "react-router-dom";
import CustomAvatar from "./Avatar";

import { useAuth } from "../context/AuthProvider";

export default function Navbar() {
  const { user } = useAuth();
  return (
    <>
      {/* Padding must be the same as /routes/root */}
      <div className="flex bg-transparent z-50 sticky justify-between items-center py-4 px-2 mx-auto w-10/12">
        <div className="flex w-full justify-between items-center">
          <Link to="/" className="font-medium text-gray-800 text-lg">
            vibify
          </Link>
          {user ? (
            <Link to="/profile">
              <CustomAvatar
                name={user.user_metadata.name}
                subtitle={user.user_metadata.email}
                image_URL={user.user_metadata.avatar_url}
              />
            </Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </>
  );
}
