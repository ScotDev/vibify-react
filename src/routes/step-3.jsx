import { Outlet } from "react-router-dom";
import { getRecommendations } from "../utils/Spotify";

export async function loader({ request }) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const fnParamsArr = [];
  params.forEach((value, key) => {
    fnParamsArr.push({ [key]: value });
  });

  // console.log("fnParams", fnParamsArr);
  const recommendationsData = await getRecommendations(fnParamsArr);
  return { recommendationsData };
}

// This componenent is a bit pointless now, keeping it for now
// In case I decide to go back to the react router loader pattern

export default function Step3Route() {
  return (
    <>
      <Outlet />
    </>
  );
}
