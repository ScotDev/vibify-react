// import { Noto_Sans_KR } from "next/font/google";

import { PropTypes } from "prop-types";

import { Link } from "react-router-dom";

import { GiRunningShoe, GiPartyPopper, GiBasketballBall } from "react-icons/gi";

import { BsHeadphones, BsQuestion } from "react-icons/bs";
// import Link from "next/link";

// const noto_sans_kr = Noto_Sans_KR({ weight: "500", subsets: ["latin"] });

const icon = (title) => {
  switch (title) {
    case "running":
      return <GiRunningShoe className="card-icon" />;

    case "party":
      return <GiPartyPopper className="card-icon" />;

    case "k-pop":
      return (
        <h3
          className={`font-medium text-3xl sm:text-4xl leading-none text-center `}
        >
          케이팝
        </h3>
      );

    case "hip-hop":
      return <GiBasketballBall className="card-icon" />;

    case "focus":
      return <BsHeadphones className="card-icon" />;

    case "custom":
      return (
        <h3 className="font-medium text-6xl sm:text-8xl text-center">+</h3>
      );

    default:
      return (
        <BsQuestion className="text-neutral-900 justify-self-center aspect-square text-6xl md:text-[96px] " />
      );
  }
};

export default function VibeCard({ title }) {
  return (
    <Link to={`/step-2?preset=${title}`}>
      <div
        // className="bg-neutral-400 w-[250px] aspect-square p-6 grid cursor-pointer transition-all hover:translate-x-2 hover:-translate-y-2 card"
        className="card"
      >
        <h2 className="font-medium capitalize">{title}</h2>

        <div className="mx-auto">{icon(title)}</div>
      </div>
    </Link>
  );
}

VibeCard.propTypes = {
  title: PropTypes.string.isRequired,
};
