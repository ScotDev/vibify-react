import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";

// const Mono = DM_Mono({ subsets: ["latin"], weight: ["400"] });

export default function Code({ children, href }) {
  return (
    <div className="px-4 py-2 bg-neutral-800 border-2 border-neutral-700 truncate xs:w-full w-fit overflow-hidden text-sm">
      {href ? (
        <Link to={href} target="_blank">
          <p className={`truncate text-neutral-300 hover:underline`}>
            {children}
          </p>
        </Link>
      ) : (
        <p className={`truncate text-neutral-300 `}>{children}</p>
      )}
    </div>
  );
}

Code.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};
