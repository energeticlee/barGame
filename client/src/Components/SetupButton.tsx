import { FC } from "react";
import { Link } from "react-router-dom";
import { ISetupButton } from "../Helper/Interface";
import { Button } from "@mui/material";

const SetupButton: FC<ISetupButton> = ({ text, routeTo }) => {
  return (
    <Link to={routeTo}>
      <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {text}{" "}
      </Button>
    </Link>
  );
};

export default SetupButton;
