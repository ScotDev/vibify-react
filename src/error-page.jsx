import { Link, useRouteError } from "react-router-dom";
import SignOutButton from "./components/SignOutButton";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div
      id="error-page"
      className="text-center grid gap-6 place-items-center w-screen h-screen"
    >
      <div>
        <h1>Oops!</h1>
        <p className="py-6">Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
        <Link className="hover:underline" to="/">
          Go back home
        </Link>
        <SignOutButton />
      </div>
    </div>
  );
}
