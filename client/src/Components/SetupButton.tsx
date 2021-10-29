import { FC } from "react";
import { Link } from "react-router-dom";
import { ISetupButton } from "../Helper/Interface";

const SetupButton: FC<ISetupButton> = ({ text, routeTo }) => {
  return (
    <Link to={routeTo}>
      <button>{text}</button>
    </Link>
  );
};

export default SetupButton;
