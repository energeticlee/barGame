import { FC } from "react";
import { Link } from "react-router-dom";
import { IRouteButton } from "../Helper/Interface";

const RouteButton: FC<IRouteButton> = ({ text, routeTo }) => {
  return (
    <Link to={routeTo}>
      <button>{text}</button>
    </Link>
  );
};

export default RouteButton;
